import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { invoiceHtml } from "@/lib/invoice";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string; id: string }> }
) {
  const { token, id } = await params;
  const customer = await prisma.customer.findUnique({ where: { token } });
  if (!customer) return new Response("Not found", { status: 404 });

  const purchase = await prisma.purchase.findUnique({ where: { id } });
  if (!purchase || purchase.customerId !== customer.id) {
    return new Response("Not found", { status: 404 });
  }

  const html = invoiceHtml({
    invoiceNumber: purchase.invoiceNumber ?? purchase.id,
    date: purchase.invoiceIssuedAt ?? purchase.createdAt,
    customer: { email: customer.email, name: customer.name },
    amountCents: purchase.amountCents,
    currency: purchase.currency,
    product: "Claude Skills — All-Access Bundle (Lifetime)",
  });

  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
