type SendArgs = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail({ to, subject, html, text }: SendArgs) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "hi@claudeskills.shop";

  if (!apiKey || apiKey.startsWith("re_REPLACE")) {
    // Dev fallback — log to console, real emails noop
    console.log(`[email:dev] to=${to} subject=${subject}\n${text ?? html}`);
    return { id: "dev-noop" };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html, text }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend ${res.status}: ${err}`);
  }
  return res.json();
}

export function downloadLinkEmail(customerName: string | null, link: string) {
  const greeting = customerName ? `Hallo ${customerName},` : "Hi,";
  const html = `
    <div style="font-family:Inter,sans-serif;max-width:560px;margin:auto;color:#0F1220">
      <h1 style="font-size:24px;font-weight:700;margin-bottom:8px">Willkommen bei Claude Skills</h1>
      <p>${greeting}</p>
      <p>Vielen Dank für deinen Kauf. Hier ist dein <b>persönlicher Download-Link</b> — bookmark ihn, er funktioniert dauerhaft:</p>
      <p style="margin:24px 0">
        <a href="${link}" style="background:#7C5CFF;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Skills herunterladen</a>
      </p>
      <p style="font-family:monospace;background:#F1F5F9;padding:12px;border-radius:6px;word-break:break-all">${link}</p>
      <p style="color:#64748B;font-size:13px;margin-top:32px">Link verloren? Geh auf claudeskills.shop/lost-link und gib deine E-Mail ein — wir schicken ihn dir erneut.</p>
      <p style="color:#64748B;font-size:13px">Bei Fragen einfach auf diese Mail antworten.</p>
    </div>
  `;
  return { subject: "🎉 Deine Claude Skills sind bereit", html };
}
