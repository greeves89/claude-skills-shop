export default function Impressum() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16 text-white/80">
      <h1 className="text-3xl font-bold text-white mb-6">Impressum</h1>
      <p>Angaben gemäß § 5 TMG:</p>
      <p className="mt-4">
        Daniel Alisch<br />
        [Straße + Hausnummer]<br />
        [PLZ + Ort]<br />
        Deutschland
      </p>
      <p className="mt-4">
        Kontakt: hi@claudeskills.shop
      </p>
      <p className="mt-4 text-sm text-white/50">
        Bitte vor Launch durch die echten Daten ersetzen.
      </p>
      <a href="/" className="mt-8 inline-block text-accent-500 hover:underline">← Zurück</a>
    </main>
  );
}
