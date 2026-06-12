import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ApiKeysPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const keys = await prisma.apiKey.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <h1 className="text-3xl font-bold text-white mb-2">API-Keys</h1>
      <p className="text-white/60 mb-8">Keys für Agent-Uploads — der echte Key wird nur einmal beim Erstellen angezeigt.</p>

      <form action="/api/admin/api-keys" method="POST" className="mb-8 flex gap-3">
        <input
          name="label"
          required
          placeholder="z.B. Monty Agent"
          className="rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 focus:outline-none focus:border-accent-500"
        />
        <button className="rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-medium px-5 py-2">Neuen Key erzeugen</button>
      </form>

      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr className="text-left text-white/60">
              <th className="px-4 py-3 font-medium">Label</th>
              <th className="px-4 py-3 font-medium">Erstellt</th>
              <th className="px-4 py-3 font-medium">Zuletzt genutzt</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Aktion</th>
            </tr>
          </thead>
          <tbody className="text-white/80">
            {keys.map((k) => (
              <tr key={k.id} className="border-t border-white/10">
                <td className="px-4 py-3">{k.label}</td>
                <td className="px-4 py-3 text-white/50 text-xs">{new Date(k.createdAt).toLocaleString("de-DE")}</td>
                <td className="px-4 py-3 text-white/50 text-xs">{k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleString("de-DE") : "—"}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded ${!k.revoked ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}`}>
                    {k.revoked ? "revoked" : "active"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {!k.revoked && (
                    <form action={`/api/admin/api-keys/${k.id}/revoke`} method="POST">
                      <button className="text-xs underline text-white/60 hover:text-white">Widerrufen</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
            {keys.length === 0 && (
              <tr><td className="px-4 py-8 text-white/40 italic text-center" colSpan={5}>Noch keine Keys.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
