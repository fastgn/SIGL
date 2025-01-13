#!/usr/bin/env bash

# Définir les variables d'environnement
export DATABASE_URL=postgresql://postgres:postgres@localhost:54321/postgres_db
POSTGRES_HOST=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres_db

DIR="$(cd "$(dirname "$0")" && pwd)"


docker-compose up -d
echo '🟡 - Waiting for database to be ready...'
$DIR/wait-until.sh "docker-compose exec -T -e PGPASSWORD=${POSTGRES_PASSWORD} postgres psql -h ${POSTGRES_HOST} -U ${POSTGRES_USER} -d ${POSTGRES_DB}  -c 'select 1'"
echo '🟢 - Database is ready'


pnpm dlx prisma db push --force-reset

vitest -c ./vitest.integration.config.ts --run --coverage

docker-compose down -v

read -p "Press enter to continue"