import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  // do not throw at import time — runtime errors are easier to debug per route
  console.warn("[stripe] STRIPE_SECRET_KEY missing");
}

export const stripe = new Stripe(key ?? "sk_test_placeholder", {
  apiVersion: "2025-02-24.acacia",
});

export const PRICE_EUR = Number(process.env.PRICE_EUR ?? 9900);
