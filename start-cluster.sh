#!/bin/bash

set -e

# Formats
NO_FORMAT="\033[0m"
F_BOLD="\033[1m"
F_UNDERLINED="\033[4m"
C_AQUA="\033[38;5;14m"
TAG="${F_BOLD}${F_UNDERLINED}${C_AQUA}[TiDB.AI Integration Test]${NO_FORMAT}"

# Cleanups
function clean_up {
  ARG=$?
  echo "[TiDB.AI Integration Test] Cleaning up..."
  docker compose down frontend background backend tidb redis
  exit $ARG
}

trap clean_up EXIT

echo -e "$TAG Starting TiDB"
docker compose up -d tidb

echo -e "$TAG Wait 15 seconds for TiDB starting up"
sleep 15

echo -e "$TAG Execute migrations"
docker compose run backend /bin/sh -c "alembic upgrade head" > migration.stdout 2> migration.stderr

echo -e "$TAG Execute bootstrap"
docker compose run backend /bin/sh -c "python bootstrap.py" > bootstrap.stdout 2> bootstrap.stderr

echo -e "$TAG Extract initial username and password"
cat bootstrap.stdout | grep IMPORTANT | sed 's/^.*email: \(.*\) and password: \(.*\),.*$/USERNAME=\1\nPASSWORD=\2/' > .credentials
cat .credentials

echo -e "$TAG Start components"
docker compose up -d redis frontend backend background

echo -e "$TAG Press Enter to exit..."
read junk
