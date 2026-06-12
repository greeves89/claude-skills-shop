# claude-skills-shop

SaaS für [claudeskills.shop](https://claudeskills.shop) — Landing Page, Admin-Dashboard, Stripe-Checkout, permanente Download-Links und Skill-Upload-API für Agents.

## Stack
- Next.js 15 (App Router, Standalone Output)
- Postgres + Prisma
- Stripe Checkout + Webhooks
- bcryptjs + jose (JWT-Cookies) für Admin-Sessions + API-Key-Hashing
- Resend für Transaktions-E-Mails (Fallback: Console-Log in Dev)
- Local Volume für Skill-ZIPs (kann später auf S3/R2)

## Features

### Public
- `/` — Landing Page (€99 Lifetime All-Access)
- `/lost-link` — Re-Send des permanenten Download-Links
- `/downloads/[token]` — Customer Vault (permanent erreichbar)
- `/success` — Post-Checkout
- `/impressum`, `/datenschutz`

### Admin (Login required)
- `/admin` — Übersicht (Käufer, Umsatz, Skills)
- `/admin/customers` — Käuferliste, Aktivieren/Sperren
- `/admin/skills` — Skill-Übersicht, Sichtbarkeit toggeln
- `/admin/api-keys` — API-Keys für Agent-Uploads (Hash gespeichert, Plain nur einmal sichtbar)

### Agent Upload (Bearer-Auth)
- `POST /api/admin/skills/upload` — multipart/form-data

```
curl -X POST https://claudeskills.shop/api/admin/skills/upload \
  -H "Authorization: Bearer cs_..." \
  -F file=@./skill.zip \
  -F slug=my-skill \
  -F name="My Skill" \
  -F version=1.0.0 \
  -F category=productivity \
  -F "description=Was es macht"
```

## Lokal entwickeln

```bash
cp .env.example .env.local
# DATABASE_URL anpassen
npm install --legacy-peer-deps
npx prisma db push
npm run dev
```

## Produktion (Docker)

```bash
cp .env.example .env
# alle Variablen ausfüllen, insb.:
#   APP_URL=https://claudeskills.shop
#   DATABASE_URL=postgresql://postgres:STARK@db:5432/claudeskills
#   POSTGRES_PASSWORD=STARK
#   STRIPE_SECRET_KEY=sk_live_...
#   STRIPE_WEBHOOK_SECRET=whsec_... (nach Webhook-Erstellung)
#   SESSION_SECRET= openssl rand -hex 32
#   ADMIN_EMAIL + ADMIN_PASSWORD (für ersten Login)

docker compose build
docker compose up -d
docker compose logs -f app
```

App läuft auf `127.0.0.1:3002` → nginx davorhängen.

## nginx-Schnipsel

```nginx
server {
    listen 443 ssl http2;
    server_name claudeskills.shop www.claudeskills.shop;

    client_max_body_size 100M;  # für Skill-Uploads

    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Stripe Webhook — Raw Body wichtig!
    location /api/stripe/webhook {
        proxy_pass http://127.0.0.1:3002;
        proxy_set_header Host $host;
        proxy_request_buffering off;
    }
}
```

## Stripe-Setup

1. Dashboard → Webhooks → Endpoint hinzufügen: `https://claudeskills.shop/api/stripe/webhook`
2. Event: `checkout.session.completed`
3. Signing-Secret kopieren → `STRIPE_WEBHOOK_SECRET` in `.env`
4. Container neu starten: `docker compose restart app`

## Erster Login

Beim ersten Login mit `ADMIN_EMAIL` + `ADMIN_PASSWORD` aus `.env` wird ein Admin-User in der DB erstellt — danach kann das Passwort in der DB rotiert werden.

## Skill-Upload aus Agents

Im Admin → API-Keys einen Key erzeugen, einmal kopieren, in den Agent-Env als `CLAUDESKILLS_API_KEY` einsetzen. Dann curl-Upload wie oben.

## Roadmap (post-MVP)
- [ ] Auto-Build des Bundle-ZIPs nach jedem Skill-Upload
- [ ] Stripe-Refunds direkt aus Admin auslösen
- [ ] Webhook für `customer.refunded` → Status auf "refunded"
- [ ] Mail-Versand für Update-Notifications bei neuen Skills
- [ ] S3/R2 statt lokales Volume
- [ ] Multi-Tier-Pricing (Free, Pro, Bundle)
