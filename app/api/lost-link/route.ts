import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendEmail, downloadLinkEmail } from "@/lib/email";

const Body = z.object({ email: z.string().email() });

// einfache In-Memory Rate-Limit (Best-Effort, pro Instanz)
const recent = new Map<string, number>();
const WINDOW_MS = 60_000;
const MAX = 3;

export async function POST(req: NextRequest) {
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });
  const email = parsed.data.email.toLowerCase().trim();

  // rate limit
  const now = Date.now();
  const key = email;
  const hits = [...(recent.get(key) ? [recent.get(key)!] : [])].filter((t) => now - t < WINDOW_MS);
  if (hits.length >= MAX) {
    return NextResponse.json({ ok: true }); // silently OK, don't leak rate-limit info
  }
  recent.set(key, now);

  // Antwort ist immer 200 — kein Account-Enumeration
  const customer = await prisma.customer.findUnique({ where: { email } });
  if (customer && customer.status === "active") {
    const appUrl = process.env.APP_URL ?? "http://localhost:3000";
    const link = `${appUrl}/downloads/${customer.token}`;
    const { subject, html } = downloadLinkEmail(customer.name, link);
    try {
      await sendEmail({ to: customer.email, subject, html, text: `Dein Download-Link: ${link}` });
    } catch (e) {
      console.error("[lost-link] mail failed", e);
    }
  }

  return NextResponse.json({ ok: true });
}
