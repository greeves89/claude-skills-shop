import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Public: /admin/login
  // wir prüfen client-seitig via Headers nicht möglich → layout sieht alle /admin/*.
  // Login page rendert auch unter Layout, daher hier nur Redirect für nicht-eingeloggte
  // wenn nicht auf /admin/login. Wir leiten ungeladene Sessions hart auf /admin/login.
  const session = await getAdminSession();
  // simple trick: kein Session + nicht-Login-page → redirect handled in pages selbst
  return (
    <div className="min-h-screen grid-bg">
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-white font-semibold">
              <span className="inline-block w-7 h-7 rounded-md bg-gradient-to-br from-accent-500 to-pink-400" />
              <span>Admin · Claude Skills</span>
            </div>
            {session && (
              <nav className="flex gap-5 text-sm text-white/70">
                <Link href="/admin" className="hover:text-white">Übersicht</Link>
                <Link href="/admin/customers" className="hover:text-white">Käufer</Link>
                <Link href="/admin/skills" className="hover:text-white">Skills</Link>
                <Link href="/admin/api-keys" className="hover:text-white">API-Keys</Link>
              </nav>
            )}
          </div>
          {session && (
            <form action="/api/admin/logout" method="POST">
              <button className="text-white/60 hover:text-white text-sm">Logout</button>
            </form>
          )}
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-6 py-10">{children}</div>
    </div>
  );
}
