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

tracked_contract_files=(
  ".env.template"
  "side-projects/admin-notifications/.env.example"
)

echo "::notice::Checking tracked env contract files:"
for file in "${tracked_contract_files[@]}"; do
  echo "  - ${file}"
done

if ! git diff --quiet -- "${tracked_contract_files[@]}"; then
  echo "::error::Env contract drift detected in tracked files:"
  git --no-pager diff --name-only -- "${tracked_contract_files[@]}" | sed 's/^/  - /'
  echo "::error::Env contract drift detected. Run 'node scripts/sync-env-contract-from-doppler.mjs' and commit updated templates."
  git --no-pager diff -- "${tracked_contract_files[@]}"
  exit 1
fi

echo "::notice::Env contract is in sync with Doppler for ${#tracked_contract_files[@]} tracked files."
