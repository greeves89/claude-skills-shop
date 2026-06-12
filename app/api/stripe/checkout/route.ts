import { NextResponse } from "next/server";
import { stripe, PRICE_EUR } from "@/lib/stripe";

export async function POST() {
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: PRICE_EUR,
          product_data: {
            name: "Claude Skills — All-Access Bundle",
            description: "Lifetime-Zugang zu allen aktuellen und künftigen Skills",
          },
          tax_behavior: "inclusive",
        },
        quantity: 1,
      },
    ],
    customer_creation: "always",
    invoice_creation: { enabled: true },
    automatic_tax: { enabled: false },
    success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/?cancelled=1`,
    allow_promotion_codes: true,
  });

  if (!session.url) {
    return NextResponse.json({ error: "no session url" }, { status: 500 });
  }
  return NextResponse.redirect(session.url, 303);
}
