# claude-skills-shop

Landing Page für [claudeskills.shop](https://claudeskills.shop) — Verkauf des Claude Skills All-Access Bundle (€99 Lifetime).

## Stack

- Static HTML mit Tailwind via CDN
- Stripe Payment Link für Checkout
- Hosting: GitHub Pages, Netlify, oder Cloudflare Pages — alles statisch

## Setup

### 1. Stripe Payment Link einrichten
1. https://dashboard.stripe.com/payment-links → "Neuen Payment Link"
2. Produkt: "Claude Skills All-Access Bundle" — €99 one-time
3. Erfolgs-Redirect: `https://claudeskills.shop/success.html?session={CHECKOUT_SESSION_ID}`
4. Payment Link kopieren

### 2. Link in `index.html` einsetzen
```js
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/DEIN_ECHTER_LINK";
```

### 3. Webhook für Download-Fulfillment
Stripe Webhook `checkout.session.completed` → kleiner Worker (Cloudflare Worker oder Vercel Function) signiert eine S3/R2-URL für das ZIP und schickt sie per E-Mail.

Beispiel-Stack:
- Cloudflare Worker für Webhook-Handler
- Cloudflare R2 für ZIP-Storage
- Resend.com oder Postmark für E-Mail-Versand

### 4. Deploy
```bash
# Cloudflare Pages (empfohlen)
git push  # automatisch deployed

# Oder GitHub Pages
# Settings → Pages → Branch: main → Save
```

## Domain

- Vorschlag: `claudeskills.shop` (~€20/Jahr, Cloudflare/Namecheap)
- Alternativen: `claude-skills.dev`, `skillpack.dev`, `agentskills.io`

## Roadmap

- [ ] Stripe Payment Link einrichten
- [ ] Domain registrieren
- [ ] DNS auf Cloudflare Pages zeigen
- [ ] Webhook + Fulfillment-Worker bauen
- [ ] E-Mail-Template für Download
- [ ] Impressum + Datenschutz (kein Tracking, keine Cookies = einfach)
- [ ] success.html — Bestätigungsseite nach Checkout
- [ ] Analytics? Plausible.io self-hosted oder Cloudflare Web Analytics

## Vorschau lokal

```bash
python3 -m http.server 8000
# http://localhost:8000
```
