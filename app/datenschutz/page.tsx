export default function Datenschutz() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16 text-white/80">
      <h1 className="text-3xl font-bold text-white mb-6">Datenschutzerklärung</h1>
      <p>
        Wir verarbeiten personenbezogene Daten ausschließlich, um den Kauf abzuwickeln und dir
        deinen permanenten Download-Link zur Verfügung zu stellen.
      </p>
      <h2 className="text-xl font-semibold text-white mt-6 mb-2">Was wir speichern</h2>
      <ul className="list-disc ml-6 space-y-1">
        <li>E-Mail-Adresse + Name (für Download-Link und Rechnung)</li>
        <li>Zahlungsinformationen — verarbeitet von Stripe (PCI-DSS), wir sehen keine Kreditkarten-Daten</li>
        <li>Rechnungsnummer und Kaufbetrag (gesetzliche Aufbewahrung 10 Jahre)</li>
      </ul>
      <h2 className="text-xl font-semibold text-white mt-6 mb-2">Was wir NICHT machen</h2>
      <ul className="list-disc ml-6 space-y-1">
        <li>Kein Tracking, keine Cookies (außer Admin-Session)</li>
        <li>Keine Werbe-Mails außer Update-Notifications für Käufer</li>
        <li>Keine Weitergabe an Dritte außer dem Zahlungsdienstleister</li>
      </ul>
      <h2 className="text-xl font-semibold text-white mt-6 mb-2">Deine Rechte</h2>
      <p>Auskunft, Löschung, Korrektur — schreib an hi@claudeskills.shop und du bekommst innerhalb von 7 Tagen Antwort.</p>
      <a href="/" className="mt-8 inline-block text-accent-500 hover:underline">← Zurück</a>
    </main>
  );
}
