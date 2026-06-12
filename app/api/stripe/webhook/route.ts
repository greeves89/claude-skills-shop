import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { sendEmail, downloadLinkEmail } from "@/lib/email";
import { generateInvoiceNumber } from "@/lib/invoice";
import type Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "webhook secret not configured" }, { status: 500 });
  }
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "no signature" }, { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err: any) {
    return NextResponse.json({ error: `bad signature: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email ?? session.customer_email;
    if (!email) return NextResponse.json({ ok: true, note: "no email on session" });

    // upsert customer (permanenter Token)
    const customer = await prisma.customer.upsert({
      where: { email },
      create: {
        email,
        name: session.customer_details?.name ?? null,
        stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
      },
      update: {
        name: session.customer_details?.name ?? undefined,
        stripeCustomerId: typeof session.customer === "string" ? session.customer : undefined,
        status: "active",
      },
    });

    // dedupe by stripeSessionId
    const exists = await prisma.purchase.findUnique({ where: { stripeSessionId: session.id } });
    if (!exists) {
      const invoiceNumber = await generateInvoiceNumber();
      await prisma.purchase.create({
        data: {
          customerId: customer.id,
          stripeSessionId: session.id,
          stripePaymentIntent: typeof session.payment_intent === "string" ? session.payment_intent : null,
          amountCents: session.amount_total ?? 9900,
          currency: session.currency ?? "eur",
          status: "paid",
          invoiceNumber,
          invoiceIssuedAt: new Date(),
        },
      });

      // Mail mit Download-Link
      const appUrl = process.env.APP_URL ?? "http://localhost:3000";
      const link = `${appUrl}/downloads/${customer.token}`;
      const { subject, html } = downloadLinkEmail(customer.name, link);
      try {
        await sendEmail({ to: customer.email, subject, html, text: `Dein Download-Link: ${link}` });
      } catch (e) {
        console.error("[webhook] email failed", e);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
