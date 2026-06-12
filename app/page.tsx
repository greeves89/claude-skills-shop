import Link from "next/link";

export default function HomePage() {
  return (
    <main className="grid-bg min-h-screen">
      {/* NAV */}
      <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-semibold">
          <span className="inline-block w-7 h-7 rounded-md bg-gradient-to-br from-accent-500 to-pink-400" />
          <span>Claude Skills</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <a href="#whats-inside" className="hover:text-white">Was ist drin</a>
          <a href="#how-it-works" className="hover:text-white">So funktioniert&apos;s</a>
          <a href="#faq" className="hover:text-white">FAQ</a>
          <Link href="/lost-link" className="hover:text-white">Link verloren?</Link>
        </div>
        <form action="/api/stripe/checkout" method="POST">
          <button className="rounded-full bg-accent-500 hover:bg-accent-600 text-white text-sm font-medium px-5 py-2 transition">
            €99 holen
          </button>
        </form>
      </nav>

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-white/80 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Limited Launch · Lifetime-Zugang sichern
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.05]">
          Skills, die deinen<br />
          <span className="grad-text">Agent zur Maschine machen.</span>
        </h1>
        <p className="mt-8 text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
          Über 30 kuratierte Skill-Pakete für Claude Code, Anthropic Skills und beliebige AI-Agents.
          Aus echten Workflows. Production-ready. Einmal €99 — für immer.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <form action="/api/stripe/checkout" method="POST">
            <button className="rounded-full bg-accent-500 hover:bg-accent-600 text-white font-medium px-8 py-4 text-base ring-glow transition">
              All-Access für €99 holen
            </button>
          </form>
          <a href="#whats-inside" className="text-white/80 hover:text-white font-medium px-4 py-4 text-base">
            Was ist drin? →
          </a>
        </div>
        <p className="mt-6 text-xs text-white/40">Einmalzahlung · Instant Download · Lifetime-Updates · Permanenter Link</p>
      </section>

      {/* LOGOS */}
      <section className="border-y border-white/10 bg-black/20 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-white/40 text-sm font-mono">
          {["Claude Code", "Anthropic Skills", "Cursor", "Aider", "OpenCode", "VS Code"].map((n, i, arr) => (
            <span key={n} className="flex items-center gap-12">
              {n}{i < arr.length - 1 ? <span>·</span> : null}
            </span>
          ))}
        </div>
      </section>

      {/* WHATS INSIDE */}
      <section id="whats-inside" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-accent-500 font-mono text-sm uppercase tracking-widest mb-3">Was du bekommst</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">30+ Skills. Sofort einsetzbar.</h2>
          <p className="mt-4 text-white/60 max-w-2xl mx-auto">
            Jeder Skill wurde aus echten Workflows extrahiert — getestet, dokumentiert, mit Beispielen.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { emoji: "🎙️", title: "Productivity & Daily Routines", items: ["podcast — Multi-Host-Podcast", "morning-briefing — News-Aggregator", "trends-scout — GitHub-Trends", "daily-standup-report", "skill-creator"] },
            { emoji: "📈", title: "Trading & Crypto", items: ["trading-market-scanner — Polymarket", "trading-odds-analyzer — Kelly + Edge", "trading-morning-routine", "trading-market-report"] },
            { emoji: "🎬", title: "Video & Marketing", items: ["hyperframes — HTML→MP4", "gsap — Animations-Referenz", "website-to-hyperframes", "page-cro"] },
            { emoji: "🛠️", title: "Engineering", items: ["code-review — PR-Reviews", "security-review — OWASP-Audit", "simplify — Refactor", "init — CLAUDE.md"] },
            { emoji: "💼", title: "Sales & Marketing", items: ["sales-enablement", "prospecting", "cold-email", "community-marketing", "copywriting"] },
            { emoji: "⚙️", title: "Plus monatlich neue Skills", items: ["Lifetime heißt Lifetime. Jeder neue Skill ist für dich kostenlos."] },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition">
              <div className="text-3xl mb-4">{c.emoji}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{c.title}</h3>
              <ul className="text-sm text-white/60 space-y-1.5">
                {c.items.map((i) => <li key={i}>· {i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-accent-500 font-mono text-sm uppercase tracking-widest mb-3">So funktioniert&apos;s</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">In 60 Sekunden produktiv.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { n: "01", t: "Kaufen", d: "Einmalig €99 via Stripe. Sofortiger Download-Link per E-Mail." },
            { n: "02", t: "Entpacken", d: "unzip claude-skills.zip\ncp -r skills/* ~/.claude/skills/" },
            { n: "03", t: "Nutzen", d: "/podcast Mach mir eine Folge zu AG-UI" },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <div className="text-accent-500 font-mono text-sm mb-3">{s.n}</div>
              <h3 className="text-white text-xl font-semibold mb-3">{s.t}</h3>
              <pre className="text-white/60 text-sm font-mono whitespace-pre-wrap leading-relaxed">{s.d}</pre>
            </div>
          ))}
        </div>
      </section>

      {/* BUY */}
      <section id="buy" className="max-w-3xl mx-auto px-6 py-24">
        <div className="rounded-3xl border border-accent-500/40 bg-gradient-to-br from-accent-500/10 via-pink-500/5 to-transparent p-10 md:p-12 ring-glow text-center">
          <p className="text-accent-500 font-mono text-sm uppercase tracking-widest mb-4">Launch-Preis</p>
          <h2 className="text-5xl md:text-6xl font-bold text-white">€99</h2>
          <p className="mt-3 text-white/60">einmalig · Lifetime · alle Skills</p>

          <ul className="mt-8 space-y-3 text-left max-w-md mx-auto text-white/80 text-sm">
            {[
              "30+ Skills sofort verfügbar",
              "Alle zukünftigen Skills inklusive",
              "Permanenter Download-Link (verfällt nie)",
              "Update-Notifications per E-Mail",
              "Funktioniert in Claude Code, Cursor, Aider",
              "Kommerzielle Nutzung erlaubt",
              "14 Tage Rückgaberecht",
            ].map((f) => (
              <li key={f} className="flex gap-3"><span className="text-emerald-400">✓</span> {f}</li>
            ))}
          </ul>

          <form action="/api/stripe/checkout" method="POST">
            <button className="mt-10 inline-block rounded-full bg-accent-500 hover:bg-accent-600 text-white font-medium px-10 py-4 text-base transition">
              Jetzt für €99 holen
            </button>
          </form>
          <p className="mt-4 text-xs text-white/40">Sichere Zahlung via Stripe · 19% MwSt. inklusive</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <p className="text-accent-500 font-mono text-sm uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">Häufige Fragen</h2>
        </div>
        <div className="space-y-3">
          {[
            { q: "Was bekomme ich für €99?", a: "Lifetime-Zugang zu allen aktuellen Skills (30+) und allen zukünftigen. Einmalzahlung, keine Subscription." },
            { q: "Wie kommen die Skills zu mir?", a: "Sofort nach dem Kauf bekommst du eine E-Mail mit einem permanenten Download-Link. Bookmark ihn — der funktioniert für immer." },
            { q: "Was wenn ich den Link verliere?", a: "Geh auf /lost-link, gib deine Kauf-E-Mail ein, du bekommst den Link erneut zugeschickt." },
            { q: "Funktioniert das ohne Claude Code?", a: "Ja. SKILL.md-Dateien sind framework-agnostisch — nutze sie in Cursor, Aider, OpenCode, oder per Anthropic-API." },
            { q: "Darf ich die Skills kommerziell nutzen?", a: "Ja, voll. Nicht erlaubt ist nur Weiterverkauf oder Veröffentlichung in einem konkurrierenden Marketplace." },
            { q: "Geld-zurück-Garantie?", a: "14 Tage volle Erstattung — frag einfach per E-Mail." },
          ].map((f) => (
            <details key={f.q} className="rounded-2xl border border-white/10 bg-white/5 p-6 group">
              <summary className="cursor-pointer font-semibold text-white flex justify-between items-center">
                {f.q}
                <span className="text-white/40 group-open:rotate-45 transition">+</span>
              </summary>
              <p className="mt-4 text-white/60 text-sm leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
          <div>© 2026 Daniel Alisch · Claude Skills</div>
          <div className="flex gap-6">
            <a href="https://github.com/greeves89/claude-skills" className="hover:text-white/70">GitHub</a>
            <Link href="/lost-link" className="hover:text-white/70">Link verloren?</Link>
            <Link href="/impressum" className="hover:text-white/70">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-white/70">Datenschutz</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
