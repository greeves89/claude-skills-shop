import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const [customers, purchases, skills, revenueAgg] = await Promise.all([
    prisma.customer.count({ where: { status: "active" } }),
    prisma.purchase.count(),
    prisma.skillFile.count(),
    prisma.purchase.aggregate({
      _sum: { amountCents: true },
      where: { status: "paid" },
    }),
  ]);

  const recent = await prisma.purchase.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: { customer: true },
  });

  const stats = [
    { label: "Aktive Käufer", value: customers },
    { label: "Verkäufe gesamt", value: purchases },
    { label: "Umsatz (€)", value: ((revenueAgg._sum.amountCents ?? 0) / 100).toFixed(2) },
    { label: "Skills im Vault", value: skills },
  ];

  return (
    <>
      <h1 className="text-3xl font-bold text-white mb-8">Übersicht</h1>
      <div className="grid md:grid-cols-4 gap-4 mb-12">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-white/50 text-sm">{s.label}</div>
            <div className="text-3xl font-bold text-white mt-1">{s.value}</div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-white mb-4">Letzte Käufe</h2>
      {recent.length === 0 ? (
        <p className="text-white/50 italic">Noch keine Käufe.</p>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr className="text-left text-white/60">
                <th className="px-4 py-3 font-medium">Datum</th>
                <th className="px-4 py-3 font-medium">Käufer</th>
                <th className="px-4 py-3 font-medium">Rechnung</th>
                <th className="px-4 py-3 font-medium text-right">Betrag</th>
              </tr>
            </thead>
            <tbody className="text-white/80">
              {recent.map((p) => (
                <tr key={p.id} className="border-t border-white/10">
                  <td className="px-4 py-3">{new Date(p.createdAt).toLocaleString("de-DE")}</td>
                  <td className="px-4 py-3">{p.customer.email}</td>
                  <td className="px-4 py-3 font-mono text-white/60">{p.invoiceNumber ?? "—"}</td>
                  <td className="px-4 py-3 text-right">{(p.amountCents / 100).toFixed(2)} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
