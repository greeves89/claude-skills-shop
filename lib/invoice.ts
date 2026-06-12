// Einfache Rechnungs-Nummern: YYYY-NNNN
import { prisma } from "./db";

export async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.purchase.count({
    where: {
      invoiceNumber: { startsWith: `${year}-` },
    },
  });
  const seq = String(count + 1).padStart(4, "0");
  return `${year}-${seq}`;
}

// Minimal HTML-Rechnung (für Print-PDF im Browser)
export function invoiceHtml(args: {
  invoiceNumber: string;
  date: Date;
  customer: { email: string; name?: string | null };
  amountCents: number;
  currency: string;
  product: string;
  vatRate?: number; // default 19% DE
}) {
  const vatRate = args.vatRate ?? 19;
  const gross = args.amountCents / 100;
  const net = +(gross / (1 + vatRate / 100)).toFixed(2);
  const vat = +(gross - net).toFixed(2);

  return `
<!doctype html><html><head><meta charset="utf-8">
<title>Rechnung ${args.invoiceNumber}</title>
<style>
  body { font-family: -apple-system, Segoe UI, Roboto, sans-serif; color: #111; padding: 48px; max-width: 720px; margin: auto; }
  h1 { font-size: 28px; margin: 0 0 24px; }
  table { width: 100%; border-collapse: collapse; margin-top: 24px; }
  th, td { text-align: left; padding: 10px 8px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
  .totals td { font-weight: 600; border: none; }
  .right { text-align: right; }
  .meta { color: #64748b; font-size: 13px; }
  @media print { body { padding: 24px; } .no-print { display: none } }
</style></head><body>
<h1>Rechnung</h1>
<div class="meta">
  <div>Rechnungsnummer: <b>${args.invoiceNumber}</b></div>
  <div>Datum: ${args.date.toLocaleDateString("de-DE")}</div>
</div>
<div style="margin-top:32px">
  <b>An:</b><br>
  ${args.customer.name ?? ""}<br>
  ${args.customer.email}
</div>
<table>
  <thead><tr><th>Position</th><th class="right">Betrag</th></tr></thead>
  <tbody>
    <tr><td>${args.product}</td><td class="right">${net.toFixed(2)} €</td></tr>
  </tbody>
</table>
<table class="totals">
  <tr><td>Netto</td><td class="right">${net.toFixed(2)} €</td></tr>
  <tr><td>USt. ${vatRate}%</td><td class="right">${vat.toFixed(2)} €</td></tr>
  <tr><td><b>Gesamt</b></td><td class="right"><b>${gross.toFixed(2)} ${args.currency.toUpperCase()}</b></td></tr>
</table>
<p class="meta" style="margin-top:48px">
  Daniel Alisch · Claude Skills · claudeskills.shop<br>
  USt-ID: noch eintragen
</p>
<div class="no-print" style="margin-top:32px">
  <button onclick="window.print()" style="background:#7C5CFF;color:white;border:0;padding:10px 18px;border-radius:6px;cursor:pointer">Als PDF drucken</button>
</div>
</body></html>`;
}
