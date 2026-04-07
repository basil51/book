#!/usr/bin/env bash
# Recreate PostgreSQL role + database from backend/.env (destructive).
#
# Usage (native PostgreSQL on Linux):
#   bash backend/scripts/reset-db-from-env.sh
#
# Usage (Docker — set container name to your Postgres service):
#   POSTGRES_CONTAINER=book-postgres bash backend/scripts/reset-db-from-env.sh
#
# Or with superuser password (no sudo):
#   export PGUSER=postgres PGPASSWORD=your_superuser_password
#   bash backend/scripts/reset-db-from-env.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$BACKEND_DIR/.env"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE"
  exit 1
fi

set -a
# shellcheck source=/dev/null
source "$ENV_FILE"
set +a

: "${DATABASE_NAME:?DATABASE_NAME missing in .env}"
: "${DATABASE_USER:?DATABASE_USER missing in .env}"
: "${DATABASE_PASSWORD:?DATABASE_PASSWORD missing in .env}"

escape_sql_literal() {
  printf '%s' "$1" | sed "s/'/''/g"
}

PW_ESC="$(escape_sql_literal "$DATABASE_PASSWORD")"

SQL=$(cat <<EOF
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = '$DATABASE_NAME'
  AND pid <> pg_backend_pid();

DROP DATABASE IF EXISTS "$DATABASE_NAME";
DROP ROLE IF EXISTS "$DATABASE_USER" CASCADE;
CREATE ROLE "$DATABASE_USER" WITH LOGIN PASSWORD '$PW_ESC';
CREATE DATABASE "$DATABASE_NAME" OWNER "$DATABASE_USER";
GRANT ALL PRIVILEGES ON DATABASE "$DATABASE_NAME" TO "$DATABASE_USER";
EOF
)

REPO_ROOT="$(cd "$BACKEND_DIR/.." && pwd)"

run_via_docker_exec() {
  local cid="$1"
  echo "Using Docker container: $cid"
  echo "$SQL" | docker exec -i "$cid" psql -U postgres -v ON_ERROR_STOP=1
}

try_auto_docker_postgres() {
  command -v docker >/dev/null 2>&1 || return 1

  local cid=""
  if [[ -f "$REPO_ROOT/docker-compose.yml" ]]; then
    cid=$(cd "$REPO_ROOT" && docker compose ps -q postgres 2>/dev/null | head -1)
  fi
  if [[ -z "$cid" ]] && [[ -f "$REPO_ROOT/docker-compose.local.yml" ]]; then
    cid=$(cd "$REPO_ROOT" && docker compose -f docker-compose.local.yml ps -q postgres 2>/dev/null | head -1)
  fi
  if [[ -z "$cid" ]]; then
    cid=$(docker ps --format '{{.ID}} {{.Image}}' 2>/dev/null | grep -i postgres | head -1 | awk '{print $1}')
  fi
  if [[ -n "$cid" ]]; then
    run_via_docker_exec "$cid"
    return 0
  fi
  return 1
}

if [[ -n "${POSTGRES_CONTAINER:-}" ]]; then
  run_via_docker_exec "$POSTGRES_CONTAINER"
elif [[ -n "${PGUSER:-}" ]] && [[ -n "${PGPASSWORD:-}" ]]; then
  echo "$SQL" | psql -h "${DATABASE_HOST:-localhost}" -p "${DATABASE_PORT:-5432}" -U "$PGUSER" -v ON_ERROR_STOP=1
elif command -v sudo >/dev/null 2>&1 && id postgres &>/dev/null; then
  echo "$SQL" | sudo -u postgres psql -v ON_ERROR_STOP=1
elif try_auto_docker_postgres; then
  :
else
  echo "Could not run psql. Do one of the following:"
  echo "  1) Start Postgres in Docker, then re-run this script (it auto-detects compose service 'postgres'):"
  echo "       cd $REPO_ROOT && docker compose up -d postgres"
  echo "     or: docker compose -f docker-compose.local.yml up -d postgres"
  echo "  2) Set a container name explicitly:"
  echo "       POSTGRES_CONTAINER=book-postgres bash $0"
  echo "  3) Native PostgreSQL: install it and use sudo -u postgres, or:"
  echo "       export PGUSER=postgres PGPASSWORD=... && bash $0"
  exit 1
fi

echo ""
echo "Done. Database '$DATABASE_NAME' is owned by '$DATABASE_USER'."
echo "Next: cd backend && pnpm seed"
