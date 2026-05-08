#!/bin/sh
set -eu

# Initialize persistent SQLite database on first start.
mkdir -p /data

if [ ! -f /data/dev.db ]; then
  cp /app/dev.db /data/dev.db
fi

# Default to persistent SQLite path if not explicitly set.
export DATABASE_URL="${DATABASE_URL:-file:/data/dev.db}"

exec node server.js
