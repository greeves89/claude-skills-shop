"use client";
import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (r.ok) {
      window.location.href = "/admin";
    } else {
      const j = await r.json().catch(() => ({}));
      setError(j.error ?? "Login fehlgeschlagen");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 grid-bg">
      <form onSubmit={submit} className="max-w-sm w-full space-y-4">
        <h1 className="text-3xl font-bold text-white">Admin-Login</h1>
        <input
          type="email"
          placeholder="E-Mail"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-accent-500"
        />
        <input
          type="password"
          placeholder="Passwort"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-accent-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-medium px-6 py-3 disabled:opacity-50"
        >
          {loading ? "…" : "Einloggen"}
        </button>
        {error && <p className="text-red-300 text-sm">{error}</p>}
      </form>
    </main>
  );
}
