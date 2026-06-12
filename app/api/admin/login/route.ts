import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { compare, hash } from "bcryptjs";

const Body = z.object({ email: z.string().email(), password: z.string().min(4) });

export async function POST(req: NextRequest) {
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "invalid input" }, { status: 400 });

  const { email, password } = parsed.data;

  // Bootstrap: erster Login mit ADMIN_EMAIL + ADMIN_PASSWORD legt User an
  const envEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const envPassword = process.env.ADMIN_PASSWORD;

  if (envEmail && envPassword && email.toLowerCase() === envEmail) {
    const existing = await prisma.adminUser.findUnique({ where: { email } });
    if (!existing) {
      // Bootstrap nur wenn DB leer
      const count = await prisma.adminUser.count();
      if (count === 0 && password === envPassword) {
        const passwordHash = await hash(password, 10);
        await prisma.adminUser.create({ data: { email, passwordHash } });
        await createAdminSession(email);
        return NextResponse.json({ ok: true, bootstrap: true });
      }
    }
  }

  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "Falsche Zugangsdaten" }, { status: 401 });

  const ok = await compare(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Falsche Zugangsdaten" }, { status: 401 });

  await createAdminSession(email);
  return NextResponse.json({ ok: true });
}
