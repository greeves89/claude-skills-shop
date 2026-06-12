#!/bin/sh
set -e

echo "→ prisma db push…"
node /app/node_modules/prisma/build/index.js db push --skip-generate

echo "→ starting next…"
exec node server.js
