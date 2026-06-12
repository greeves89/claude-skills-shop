#!/bin/sh
set -e

echo "→ prisma migrate / db push…"
npx prisma db push --skip-generate

echo "→ starting next…"
exec node server.js
