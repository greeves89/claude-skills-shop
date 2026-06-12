"use client";
import { useState } from "react";

export default function LostLinkPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    const r = await fetch("/api/lost-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setState(r.ok ? "done" : "error");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 grid-bg">
      <div className="max-w-md w-full">
        <a href="/" className="text-accent-500 text-sm hover:underline">← Zurück</a>
        <h1 className="mt-6 text-3xl md:text-4xl font-bold text-white">Download-Link verloren?</h1>
        <p className="mt-3 text-white/70">
          Gib die E-Mail an, mit der du den Kauf abgeschlossen hast — wir schicken dir den Link erneut.
        </p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <input
            type="email"
            required
            placeholder="du@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-accent-500"
          />
          <button
            type="submit"
            disabled={state === "sending"}
            className="w-full rounded-xl bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-white font-medium px-6 py-3 transition"
          >
            {state === "sending" ? "Wird gesendet…" : "Link zuschicken"}
          </button>
        </form>
        {state === "done" && (
          <p className="mt-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-sm text-emerald-200">
            Wenn deine E-Mail in unserem System ist, hast du den Link in wenigen Minuten in deinem Postfach.
          </p>
        )}
        {state === "error" && (
          <p className="mt-6 rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-200">
            Da ist was schiefgegangen. Versuch es nochmal oder schreib an support@claudeskills.shop.
          </p>
        )}
      </div>
    </main>
  );
}
