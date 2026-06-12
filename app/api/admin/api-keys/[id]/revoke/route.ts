import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "unauth" }, { status: 401 });

  const { id } = await params;
  await prisma.apiKey.update({ where: { id }, data: { revoked: true } });
  return NextResponse.redirect(new URL("/admin/api-keys", process.env.APP_URL ?? "http://localhost:3000"));
}
