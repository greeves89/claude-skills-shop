import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { compare } from "bcryptjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Upload eines Skill-ZIP von einem Agent.
 *
 * Auth:  Header `Authorization: Bearer <api_key>`
 * Body:  multipart/form-data
 *        - file:        ZIP-Datei (binary)
 *        - slug:        z.B. "podcast"
 *        - name:        z.B. "Multi-Host Podcast"
 *        - description: optional
 *        - version:     z.B. "1.0.0"
 *        - category:    productivity | trading | video | engineering | sales
 */
export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "missing bearer" }, { status: 401 });
  }
  const key = auth.slice(7).trim();

  // alle aktiven Keys laden und vergleichen
  const keys = await prisma.apiKey.findMany({ where: { revoked: false } });
  let matched = null;
  for (const k of keys) {
    if (await compare(key, k.keyHash)) {
      matched = k;
      break;
    }
  }
  if (!matched) return NextResponse.json({ error: "invalid key" }, { status: 401 });
  if (!matched.scope.includes("skill:upload")) {
    return NextResponse.json({ error: "insufficient scope" }, { status: 403 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const slug = String(form.get("slug") ?? "").trim();
  const name = String(form.get("name") ?? "").trim();
  const version = String(form.get("version") ?? "1.0.0").trim();
  const description = String(form.get("description") ?? "").trim() || null;
  const category = String(form.get("category") ?? "").trim() || null;

  if (!(file instanceof File) || !slug || !name) {
    return NextResponse.json({ error: "missing file/slug/name" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const sha = createHash("sha256").update(bytes).digest("hex");

  const base = process.env.STORAGE_DIR ?? "/var/data/claude-skills";
  await mkdir(join(base, "skills"), { recursive: true });
  const relPath = `skills/${slug}-v${version}.zip`;
  await writeFile(join(base, relPath), bytes);

  const saved = await prisma.skillFile.upsert({
    where: { slug },
    create: {
      slug,
      name,
      version,
      description,
      category,
      filePath: relPath,
      fileSize: bytes.length,
      sha256: sha,
      uploadedBy: matched.label,
    },
    update: {
      name,
      version,
      description,
      category,
      filePath: relPath,
      fileSize: bytes.length,
      sha256: sha,
      uploadedBy: matched.label,
    },
  });

  await prisma.apiKey.update({
    where: { id: matched.id },
    data: { lastUsedAt: new Date() },
  });

  return NextResponse.json({
    ok: true,
    skill: { id: saved.id, slug: saved.slug, version: saved.version, fileSize: saved.fileSize, sha256: saved.sha256 },
  });
}
