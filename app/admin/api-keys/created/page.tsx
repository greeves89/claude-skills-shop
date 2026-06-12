import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CreatedKey({ searchParams }: { searchParams: Promise<{ key?: string }> }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  const { key } = await searchParams;
  return (
    <>
      <h1 className="text-3xl font-bold text-white mb-4">Dein neuer API-Key</h1>
      <p className="text-white/60 mb-6">Speichere ihn jetzt — er wird <b>nie wieder</b> angezeigt.</p>

      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/5 p-6 mb-6">
        <pre className="font-mono text-sm text-amber-200 break-all whitespace-pre-wrap">{key ?? "(missing)"}</pre>
      </div>

      <h2 className="text-lg font-semibold text-white mb-2">Upload-Beispiel</h2>
      <pre className="rounded-2xl border border-white/10 bg-white/5 p-6 text-xs font-mono text-white/80 overflow-x-auto whitespace-pre-wrap">{`curl -X POST https://claudeskills.shop/api/admin/skills/upload \\
  -H "Authorization: Bearer ${key}" \\
  -F file=@./my-skill.zip \\
  -F slug=my-skill \\
  -F name="My Skill" \\
  -F version=1.0.0 \\
  -F category=productivity \\
  -F "description=Was dieser Skill macht"`}</pre>

      <Link href="/admin/api-keys" className="mt-6 inline-block text-accent-500 hover:underline">← Zurück</Link>
    </>
  );
}
