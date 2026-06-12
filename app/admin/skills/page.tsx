import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SkillsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const skills = await prisma.skillFile.findMany({ orderBy: { uploadedAt: "desc" } });

  return (
    <>
      <h1 className="text-3xl font-bold text-white mb-2">Skills</h1>
      <p className="text-white/60 mb-8">
        Upload via Agent: <code className="font-mono bg-white/10 px-1.5 py-0.5 rounded">POST /api/admin/skills/upload</code> mit{" "}
        <code className="font-mono bg-white/10 px-1.5 py-0.5 rounded">Authorization: Bearer &lt;api-key&gt;</code>.
      </p>

      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr className="text-left text-white/60">
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Version</th>
              <th className="px-4 py-3 font-medium">Größe</th>
              <th className="px-4 py-3 font-medium">Hochgeladen</th>
              <th className="px-4 py-3 font-medium">Sichtbar</th>
            </tr>
          </thead>
          <tbody className="text-white/80">
            {skills.map((s) => (
              <tr key={s.id} className="border-t border-white/10">
                <td className="px-4 py-3 font-mono text-xs">{s.slug}</td>
                <td className="px-4 py-3">{s.name}</td>
                <td className="px-4 py-3 font-mono text-xs">v{s.version}</td>
                <td className="px-4 py-3">{(s.fileSize / 1024).toFixed(0)} KB</td>
                <td className="px-4 py-3 text-white/50 text-xs">{new Date(s.uploadedAt).toLocaleString("de-DE")}</td>
                <td className="px-4 py-3">
                  <form action={`/api/admin/skills/${s.id}/toggle-visible`} method="POST">
                    <button className="text-xs underline text-white/60 hover:text-white">
                      {s.visible ? "Verstecken" : "Anzeigen"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {skills.length === 0 && (
              <tr><td className="px-4 py-8 text-white/40 italic text-center" colSpan={6}>
                Noch keine Skills hochgeladen. Nutze die Upload-API mit einem API-Key.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
