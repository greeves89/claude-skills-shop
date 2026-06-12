import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: { purchases: true },
  });

  return (
    <>
      <h1 className="text-3xl font-bold text-white mb-8">Käufer</h1>
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr className="text-left text-white/60">
              <th className="px-4 py-3 font-medium">E-Mail</th>
              <th className="px-4 py-3 font-medium">Käufe</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Link</th>
              <th className="px-4 py-3 font-medium">Aktionen</th>
            </tr>
          </thead>
          <tbody className="text-white/80">
            {customers.map((c) => {
              const status = c.status;
              return (
                <tr key={c.id} className="border-t border-white/10">
                  <td className="px-4 py-3">
                    <div>{c.email}</div>
                    {c.name && <div className="text-white/40 text-xs">{c.name}</div>}
                  </td>
                  <td className="px-4 py-3">{c.purchases.length}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${status === "active" ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}`}>
                      {status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    <a href={`/downloads/${c.token}`} className="text-accent-500 hover:underline">
                      …{c.token.slice(-8)}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <form action={`/api/admin/customers/${c.id}/toggle`} method="POST">
                      <button className="text-white/60 hover:text-white text-xs underline">
                        {status === "active" ? "Sperren" : "Reaktivieren"}
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
            {customers.length === 0 && (
              <tr><td className="px-4 py-8 text-white/40 italic text-center" colSpan={5}>Noch keine Käufer.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
