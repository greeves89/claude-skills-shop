#!/bin/sh
set -e

echo "→ prisma db push…"
./node_modules/.bin/prisma db push --skip-generate

echo "→ starting next…"
exec node server.js
