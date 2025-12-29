#!/bin/sh
set -e

echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h postgres -p 5432 -U "${POSTGRES_USER:-postgres}" > /dev/null 2>&1; do
  echo "PostgreSQL not ready, waiting..."
  sleep 2
done

echo "PostgreSQL is ready!"

echo "Running database migrations..."
npm run db:push

echo "Starting application..."
exec node dist/index.cjs
