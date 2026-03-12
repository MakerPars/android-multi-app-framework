#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

if [[ -z "${DOPPLER_TOKEN:-}" ]]; then
  echo "::error::Missing DOPPLER_TOKEN (required for env contract verification)."
  exit 1
fi

export DOPPLER_PROJECT="${DOPPLER_PROJECT:-android-multi-app-framework}"
export DOPPLER_CONFIG="${DOPPLER_CONFIG:-prod}"

echo "::notice::Verifying env contract against Doppler project=${DOPPLER_PROJECT} config=${DOPPLER_CONFIG}"
node ./scripts/sync-env-contract-from-doppler.mjs

if ! git diff --quiet -- .env.template side-projects/admin-notifications/.env.example; then
  echo "::error::Env contract drift detected. Run 'node scripts/sync-env-contract-from-doppler.mjs' and commit updated templates."
  git --no-pager diff -- .env.template side-projects/admin-notifications/.env.example
  exit 1
fi

echo "::notice::Env contract is in sync with Doppler."
