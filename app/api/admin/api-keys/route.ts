import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { hash } from "bcryptjs";
import { randomBytes } from "node:crypto";

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "unauth" }, { status: 401 });

  const form = await req.formData();
  const label = String(form.get("label") ?? "").trim();
  if (!label) return NextResponse.json({ error: "label required" }, { status: 400 });

  // Generate key + store only hash
  const raw = `cs_${randomBytes(24).toString("hex")}`;
  const keyHash = await hash(raw, 10);
  await prisma.apiKey.create({ data: { label, keyHash } });

  // Cookie mit One-Shot-View
  const res = NextResponse.redirect(new URL("/admin/api-keys/created?key=" + raw, process.env.APP_URL ?? "http://localhost:3000"));
  return res;
}
