import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "unauth" }, { status: 401 });

  const { id } = await params;
  const c = await prisma.customer.findUnique({ where: { id } });
  if (!c) return NextResponse.json({ error: "not found" }, { status: 404 });

  await prisma.customer.update({
    where: { id },
    data: { status: c.status === "active" ? "revoked" : "active" },
  });

  return NextResponse.redirect(new URL("/admin/customers", process.env.APP_URL ?? "http://localhost:3000"));
}
