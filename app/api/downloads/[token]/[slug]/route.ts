import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createReadStream, statSync } from "node:fs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string; slug: string }> }
) {
  const { token, slug } = await params;
  const customer = await prisma.customer.findUnique({ where: { token } });
  if (!customer || customer.status !== "active") {
    return new Response("Not found", { status: 404 });
  }

  // Bundle-Download
  if (slug === "bundle.zip") {
    return await streamBundle();
  }

  const file = await prisma.skillFile.findUnique({ where: { slug } });
  if (!file || !file.visible) return new Response("Not found", { status: 404 });

  const base = process.env.STORAGE_DIR ?? "/var/data/claude-skills";
  const path = join(base, file.filePath);

  try {
    const buf = await readFile(path);
    return new Response(buf, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${file.slug}-v${file.version}.zip"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return new Response("File missing on disk", { status: 410 });
  }
}

async function streamBundle() {
  // Für MVP: einfache Variante — die "Bundle" ist eine vorgehaltene Datei
  // STORAGE_DIR/bundle.zip die der Admin baut. Auto-Build kommt später.
  const base = process.env.STORAGE_DIR ?? "/var/data/claude-skills";
  const path = join(base, "bundle.zip");
  try {
    const size = statSync(path).size;
    const stream = createReadStream(path);
    return new Response(stream as any, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Length": String(size),
        "Content-Disposition": `attachment; filename="claude-skills-bundle.zip"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return new Response("Bundle wird noch vorbereitet. Bitte später erneut versuchen.", { status: 425 });
  }
}
