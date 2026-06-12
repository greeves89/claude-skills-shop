import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "unauth" }, { status: 401 });

  const { id } = await params;
  const s = await prisma.skillFile.findUnique({ where: { id } });
  if (!s) return NextResponse.json({ error: "not found" }, { status: 404 });

  await prisma.skillFile.update({ where: { id }, data: { visible: !s.visible } });

  return NextResponse.redirect(new URL("/admin/skills", process.env.APP_URL ?? "http://localhost:3000"));
}
