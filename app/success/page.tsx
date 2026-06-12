export default function SuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 grid-bg">
      <div className="max-w-xl text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Willkommen an Bord!</h1>
        <p className="text-white/70 mb-8 text-lg">
          Dein Kauf wird gerade verarbeitet. In den nächsten 60 Sekunden bekommst du eine
          E-Mail mit deinem <b>permanenten Download-Link</b>.
        </p>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left text-sm text-white/80">
          <div className="font-mono text-xs text-white/40 mb-2">// Quick-Start</div>
          <pre className="font-mono text-xs leading-relaxed">{`unzip claude-skills.zip
cp -r skills/* ~/.claude/skills/
# In Claude Code:
/podcast Mach mir eine Folge zu X`}</pre>
        </div>
        <p className="text-xs text-white/40 mt-8">
          Keine E-Mail erhalten? Schau im Spam-Ordner oder besuche <a className="underline" href="/lost-link">/lost-link</a>.
        </p>
        <a href="/" className="mt-8 inline-block text-accent-500 hover:underline">← Zurück zur Startseite</a>
      </div>
    </main>
  );
}
