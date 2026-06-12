import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DownloadPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const customer = await prisma.customer.findUnique({ where: { token } });

  if (!customer || customer.status !== "active") notFound();

  const skills = await prisma.skillFile.findMany({
    where: { visible: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  const purchases = await prisma.purchase.findMany({
    where: { customerId: customer.id },
    orderBy: { createdAt: "desc" },
  });

  const byCategory = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    const k = s.category ?? "Other";
    (acc[k] ??= []).push(s);
    return acc;
  }, {});

  return (
    <main className="min-h-screen grid-bg">
      <header className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2 text-white font-semibold">
            <span className="inline-block w-7 h-7 rounded-md bg-gradient-to-br from-accent-500 to-pink-400" />
            <span>Claude Skills</span>
          </div>
          <div className="text-sm text-white/60">
            Eingeloggt als <b className="text-white">{customer.email}</b>
          </div>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Dein Skill-Vault</h1>
        <p className="mt-2 text-white/60">
          Permanenter Bereich — diesen Link kannst du jederzeit aufrufen. Bookmark ihn am besten.
        </p>

        <div className="mt-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-sm text-emerald-200">
          <b>Tipp:</b> Lade das komplette Bundle als ZIP herunter und entpacke es nach{" "}
          <code className="font-mono bg-black/30 px-1 rounded">~/.claude/skills/</code>.
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={`/api/downloads/${customer.token}/bundle.zip`}
            className="rounded-full bg-accent-500 hover:bg-accent-600 text-white font-medium px-6 py-3 transition"
          >
            ⬇ All-Access Bundle (.zip)
          </a>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold text-white mb-4">Einzelne Skills</h2>
          {skills.length === 0 ? (
            <p className="text-white/50 italic">Noch keine Skills hochgeladen — schau bald wieder vorbei.</p>
          ) : (
            <div className="space-y-8">
              {Object.entries(byCategory).map(([cat, items]) => (
                <div key={cat}>
                  <h3 className="text-sm font-mono uppercase tracking-widest text-accent-500 mb-3">{cat}</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {items.map((s) => (
                      <a
                        key={s.id}
                        href={`/api/downloads/${customer.token}/${s.slug}`}
                        className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition p-4 flex justify-between items-center"
                      >
                        <div>
                          <div className="text-white font-semibold">{s.name}</div>
                          <div className="text-white/50 text-sm">{s.description ?? s.slug}</div>
                          <div className="text-white/30 text-xs mt-1 font-mono">v{s.version} · {(s.fileSize / 1024).toFixed(0)} KB</div>
                        </div>
                        <span className="text-accent-500">⬇</span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {purchases.length > 0 && (
          <div className="mt-16 border-t border-white/10 pt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Rechnungen</h2>
            <ul className="space-y-2">
              {purchases.map((p) => (
                <li key={p.id} className="flex justify-between items-center rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
                  <div>
                    <div className="text-white font-mono">Rechnung {p.invoiceNumber ?? p.id}</div>
                    <div className="text-white/50">{(p.amountCents / 100).toFixed(2)} {p.currency.toUpperCase()} · {new Date(p.createdAt).toLocaleDateString("de-DE")}</div>
                  </div>
                  <a
                    href={`/api/downloads/${customer.token}/invoice/${p.id}`}
                    className="text-accent-500 hover:underline"
                  >
                    Rechnung anzeigen →
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </main>
  );
}
