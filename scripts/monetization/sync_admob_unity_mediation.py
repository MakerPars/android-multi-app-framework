#!/usr/bin/env python3
"""
Plan or sync AdMob Unity Ads bidding mappings from local catalog data.

This script joins:
- .ci/apps.json
- config/unity-apps.json

and prepares AdMob API resources for:
- ad unit mappings
- mediation groups

Safety model:
- default mode is dry-run
- `--apply` enables live AdMob mutations
- mediation groups are created DISABLED by default unless `--enable-groups` is set
"""

from __future__ import annotations

import argparse
import json
import os
import pathlib
import sys
from typing import Any

import requests


DEFAULT_APPS_CATALOG = ".ci/apps.json"
DEFAULT_UNITY_CATALOG = "config/unity-apps.json"
DEFAULT_REPORT = "TEMP_OUT/admob_unity_mediation_report.json"
DEFAULT_MEDIATION_GROUP_STATE = "DISABLED"
DEFAULT_TOKEN_FILE = "SECRET/ADMOB_KOTNROL/token.json"

ADMOB_SCOPES = [
    "https://www.googleapis.com/auth/admob.readonly",
    "https://www.googleapis.com/auth/admob.monetization",
]

UNITY_BIDDING_AD_SOURCE_ID = "7069338991535737586"

UNITY_BIDDING_ADAPTERS = {
    "banner": {
        "adapter_id": "590",
        "format": "BANNER",
        "game_id_meta": "717",
        "placement_meta": "718",
        "placement_key": "banner",
    },
    "interstitial": {
        "adapter_id": "592",
        "format": "INTERSTITIAL",
        "game_id_meta": "721",
        "placement_meta": "722",
        "placement_key": "interstitial",
    },
    "rewarded": {
        "adapter_id": "594",
        "format": "REWARDED",
        "game_id_meta": "725",
        "placement_meta": "726",
        "placement_key": "rewarded",
    },
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Plan or sync AdMob Unity mediation resources")
    parser.add_argument("--apps-catalog", default=DEFAULT_APPS_CATALOG)
    parser.add_argument("--unity-catalog", default=DEFAULT_UNITY_CATALOG)
    parser.add_argument("--flavors", default="", help="Comma-separated flavor filter")
    parser.add_argument("--apply", action="store_true", help="Create missing AdMob resources")
    parser.add_argument("--token-file", default=DEFAULT_TOKEN_FILE, help="Authorized AdMob OAuth token JSON")
    parser.add_argument(
        "--enable-groups",
        action="store_true",
        help="Create mediation groups enabled. Default is disabled for safety.",
    )
    parser.add_argument("--out-json", default=DEFAULT_REPORT)
    return parser.parse_args()


def repo_root() -> pathlib.Path:
    return pathlib.Path(__file__).resolve().parents[2]


def load_dotenv_map(env_path: pathlib.Path) -> dict[str, str]:
    result: dict[str, str] = {}
    if not env_path.exists():
        return result
    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip()
        if len(value) >= 2 and value[0] == '"' and value[-1] == '"':
            value = value[1:-1]
        result[key] = value
    return result


def get_setting(name: str, dotenv: dict[str, str], default: str = "") -> str:
    env_value = os.environ.get(name)
    if env_value is not None and env_value.strip():
        return env_value.strip()
    return dotenv.get(name, default).strip()


def ensure_parent(path: pathlib.Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def mask(value: str) -> str:
    if len(value) <= 6:
        return "*" * len(value)
    return f"{value[:3]}...{value[-3:]}"


def load_json_array(path: pathlib.Path) -> list[dict[str, Any]]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, list):
        raise RuntimeError(f"Expected JSON array: {path}")
    return payload


def selected_flavors(csv_value: str) -> set[str]:
    return {item.strip() for item in csv_value.split(",") if item.strip()}


def filter_catalog(items: list[dict[str, Any]], wanted: set[str]) -> list[dict[str, Any]]:
    if not wanted:
        return items
    return [item for item in items if str(item.get("flavor") or "").strip() in wanted]


def refresh_access_token(client_id: str, client_secret: str, refresh_token: str) -> str:
    response = requests.post(
        "https://oauth2.googleapis.com/token",
        data={
            "client_id": client_id,
            "client_secret": client_secret,
            "refresh_token": refresh_token,
            "grant_type": "refresh_token",
        },
        timeout=30,
    )
    response.raise_for_status()
    payload = response.json()
    token = str(payload.get("access_token") or "").strip()
    if not token:
        raise RuntimeError("Google OAuth token refresh returned empty access_token")
    return token


def normalize_account_name(value: str) -> str:
    raw = value.strip()
    if raw.startswith("accounts/"):
        return raw
    if raw.startswith("pub-"):
        return f"accounts/{raw}"
    raise RuntimeError("ADMOB_PUBLISHER_ID must be pub-xxxxxxxxxxxxxxxx or accounts/pub-xxxxxxxxxxxxxxxx")


def load_token_file(path: pathlib.Path) -> dict[str, str]:
    if not path.exists():
        return {}
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        return {}
    result: dict[str, str] = {}
    for key in ("client_id", "client_secret", "refresh_token", "token"):
        value = str(payload.get(key) or "").strip()
        if value:
            result[key] = value
    scopes = payload.get("scopes")
    if isinstance(scopes, list):
        result["scopes_json"] = json.dumps(scopes)
    return result


def parse_token_scopes(token_info: dict[str, str]) -> list[str]:
    raw = token_info.get("scopes_json", "").strip()
    if not raw:
        return []
    try:
        payload = json.loads(raw)
    except json.JSONDecodeError:
        return []
    if not isinstance(payload, list):
        return []
    return [str(item).strip() for item in payload if str(item).strip()]


def http_json(
    method: str,
    url: str,
    token: str,
    body: dict[str, Any] | None = None,
    allow_not_found_empty: bool = False,
) -> Any:
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
    }
    response = requests.request(
        method=method,
        url=url,
        headers=headers,
        json=body,
        timeout=60,
    )
    if allow_not_found_empty and response.status_code == 404:
        return []
    if response.status_code >= 400:
        raise RuntimeError(f"HTTP {response.status_code}: {response.text}")
    if not response.text.strip():
        return None
    return response.json()


def is_permission_denied(error: Exception) -> bool:
    return "HTTP 403" in str(error) and "PERMISSION_DENIED" in str(error)


def ad_unit_fragment(full_ad_unit_id: str) -> str:
    if "/" not in full_ad_unit_id:
        raise RuntimeError(f"Invalid AdMob ad unit ID: {full_ad_unit_id}")
    return full_ad_unit_id.rsplit("/", 1)[-1]


def list_account_ad_units(account_name: str, token: str) -> list[dict[str, Any]]:
    url = f"https://admob.googleapis.com/v1/{account_name}/adUnits?pageSize=500"
    payload = http_json("GET", url, token)
    if isinstance(payload, dict):
        return list(payload.get("adUnits", []))
    return []


def list_accounts(token: str) -> list[dict[str, Any]]:
    url = "https://admob.googleapis.com/v1/accounts?pageSize=100"
    payload = http_json("GET", url, token)
    if isinstance(payload, dict):
        return list(payload.get("account", []))
    return []


def list_ad_sources(account_name: str, token: str) -> list[dict[str, Any]]:
    url = f"https://admob.googleapis.com/v1beta/{account_name}/adSources?pageSize=500"
    payload = http_json("GET", url, token)
    if isinstance(payload, dict):
        return list(payload.get("adSources", []))
    return []


def list_adapters(account_name: str, ad_source_id: str, token: str) -> list[dict[str, Any]]:
    url = f"https://admob.googleapis.com/v1beta/{account_name}/adSources/{ad_source_id}/adapters?pageSize=500"
    payload = http_json("GET", url, token)
    if isinstance(payload, dict):
        return list(payload.get("adapters", []))
    return []


def list_mediation_groups(account_name: str, token: str) -> list[dict[str, Any]]:
    url = f"https://admob.googleapis.com/v1beta/{account_name}/mediationGroups?pageSize=500"
    payload = http_json("GET", url, token)
    if isinstance(payload, dict):
        return list(payload.get("mediationGroups", []))
    return []


def list_ad_unit_mappings(account_name: str, ad_unit_id: str, token: str) -> list[dict[str, Any]]:
    fragment = ad_unit_fragment(ad_unit_id)
    url = f"https://admob.googleapis.com/v1beta/{account_name}/adUnits/{fragment}/adUnitMappings?pageSize=500"
    payload = http_json("GET", url, token, allow_not_found_empty=True)
    if isinstance(payload, dict):
        return list(payload.get("adUnitMappings", []))
    if isinstance(payload, list):
        return payload
    return []


def create_ad_unit_mapping(
    account_name: str,
    ad_unit_id: str,
    token: str,
    adapter_id: str,
    game_meta_id: str,
    placement_meta_id: str,
    game_id: str,
    placement_id: str,
    display_name: str,
) -> dict[str, Any]:
    fragment = ad_unit_fragment(ad_unit_id)
    url = f"https://admob.googleapis.com/v1beta/{account_name}/adUnits/{fragment}/adUnitMappings"
    body = {
        "displayName": display_name,
        "adapterId": adapter_id,
        "adUnitConfigurations": {
            game_meta_id: game_id,
            placement_meta_id: placement_id,
        },
    }
    payload = http_json("POST", url, token, body=body)
    if not isinstance(payload, dict):
        raise RuntimeError("Unexpected ad unit mapping create response")
    return payload


def create_mediation_group(
    account_name: str,
    token: str,
    display_name: str,
    ad_unit_id: str,
    format_name: str,
    mapping_resource_name: str,
    enabled: bool,
) -> dict[str, Any]:
    url = f"https://admob.googleapis.com/v1beta/{account_name}/mediationGroups"
    state = "ENABLED" if enabled else "DISABLED"
    body = {
        "displayName": display_name,
        "state": state,
        "targeting": {
            "platform": "ANDROID",
            "format": format_name,
            "adUnitIds": [ad_unit_id],
        },
        "mediationGroupLines": {
            "-1": {
                "displayName": "Unity Ads Bidding",
                "adSourceId": UNITY_BIDDING_AD_SOURCE_ID,
                "cpmMode": "LIVE",
                "state": state,
                "adUnitMappings": {
                    ad_unit_id: mapping_resource_name,
                },
            }
        },
    }
    payload = http_json("POST", url, token, body=body)
    if not isinstance(payload, dict):
        raise RuntimeError("Unexpected mediation group create response")
    return payload


def existing_mapping_name(
    mappings: list[dict[str, Any]],
    adapter_id: str,
    game_meta_id: str,
    placement_meta_id: str,
    game_id: str,
    placement_id: str,
) -> str:
    for mapping in mappings:
        if str(mapping.get("adapterId") or "").strip() != adapter_id:
            continue
        config = mapping.get("adUnitConfigurations") or {}
        if str(config.get(game_meta_id) or "").strip() != game_id:
            continue
        if str(config.get(placement_meta_id) or "").strip() != placement_id:
            continue
        return str(mapping.get("name") or "").strip()
    return ""


def main() -> int:
    args = parse_args()
    root = repo_root()
    dotenv = load_dotenv_map(root / ".env")
    token_file = root / args.token_file
    token_info = load_token_file(token_file)
    token_scopes = parse_token_scopes(token_info)

    client_id = get_setting("ADMOB_CLIENT_ID", dotenv) or token_info.get("client_id", "")
    client_secret = get_setting("ADMOB_CLIENT_SECRET", dotenv) or token_info.get("client_secret", "")
    refresh_token = get_setting("ADMOB_REFRESH_TOKEN", dotenv) or token_info.get("refresh_token", "")
    publisher_id = get_setting("ADMOB_PUBLISHER_ID", dotenv)

    if not client_id or not client_secret or not refresh_token:
        print("ERROR: missing AdMob OAuth settings (ADMOB_CLIENT_ID/SECRET/REFRESH_TOKEN or token file)")
        return 1
    if token_scopes and "https://www.googleapis.com/auth/admob.monetization" not in token_scopes:
        print("ERROR: current AdMob OAuth token is missing monetization scope.")
        print("required_scope=https://www.googleapis.com/auth/admob.monetization")
        print(f"token_file={token_file}")
        print(f"token_scopes={token_scopes}")
        print(
            "Re-auth with:\n"
            "  python scripts/monetization/reauth_admob_monetization_token.py"
        )
        return 1

    apps_catalog_path = root / args.apps_catalog
    unity_catalog_path = root / args.unity_catalog
    if not apps_catalog_path.exists():
        print(f"ERROR: apps catalog not found: {apps_catalog_path}")
        return 1
    if not unity_catalog_path.exists():
        print(f"ERROR: unity catalog not found: {unity_catalog_path}")
        return 1

    wanted = selected_flavors(args.flavors)
    apps_catalog = filter_catalog(load_json_array(apps_catalog_path), wanted)
    unity_catalog = filter_catalog(load_json_array(unity_catalog_path), wanted)
    unity_by_flavor = {str(item.get("flavor") or "").strip(): item for item in unity_catalog}

    access_token = refresh_access_token(client_id, client_secret, refresh_token)
    accounts = list_accounts(access_token)
    if publisher_id:
        account_name = normalize_account_name(publisher_id)
    else:
        if not accounts:
            print("ERROR: AdMob API returned no accessible accounts and ADMOB_PUBLISHER_ID is not set")
            return 1
        account_name = str(accounts[0].get("name") or "").strip()
        if not account_name:
            print("ERROR: Failed to infer AdMob account name from account list")
            return 1

    ad_sources = list_ad_sources(account_name, access_token)
    unity_ad_source_exists = any(
        str(item.get("adSourceId") or "").strip() == UNITY_BIDDING_AD_SOURCE_ID
        or str(item.get("name") or "").endswith(f"/{UNITY_BIDDING_AD_SOURCE_ID}")
        for item in ad_sources
    )
    adapters = list_adapters(account_name, UNITY_BIDDING_AD_SOURCE_ID, access_token)
    account_ad_units = list_account_ad_units(account_name, access_token)
    try:
        mediation_groups = list_mediation_groups(account_name, access_token)
    except Exception as exc:  # noqa: BLE001
        if is_permission_denied(exc):
            print("ERROR: AdMob mediation management API is not enabled for this account.")
            print(f"account={account_name}")
            print("reachable_endpoints=accounts, adUnits, adSources")
            print("blocked_endpoint=mediationGroups")
            print("reason=AdMob v1beta mediationGroups/adUnitMappings endpoints are limited access")
            print("action=Ask Google AdMob support/account manager to enable mediation management API access")
            print("note=OAuth scope is correct; this is server-side account gating, not a token problem")
            return 1
        raise

    ad_unit_name_set = {
        str(item.get("adUnitId") or "").strip()
        for item in account_ad_units
        if str(item.get("adUnitId") or "").strip()
    }
    mediation_group_names = {
        str(item.get("displayName") or "").strip()
        for item in mediation_groups
        if str(item.get("displayName") or "").strip()
    }
    adapter_ids_available = {
        str(item.get("adapterId") or "").strip()
        for item in adapters
        if str(item.get("adapterId") or "").strip()
    }

    report: dict[str, Any] = {
        "mode": "apply" if args.apply else "dry-run",
        "account": account_name,
        "unity_bidding_ad_source_id": UNITY_BIDDING_AD_SOURCE_ID,
        "unity_bidding_ad_source_exists": unity_ad_source_exists,
        "adapter_ids_available": sorted(adapter_ids_available),
        "credentials": {
            "admob_client_id_masked": mask(client_id),
            "admob_refresh_token_masked": mask(refresh_token),
        },
        "token_scopes": token_scopes,
        "accounts_visible": [str(item.get("name") or "").strip() for item in accounts if str(item.get("name") or "").strip()],
        "apps": [],
        "result": {
            "mapping_created": 0,
            "mapping_existing": 0,
            "group_created": 0,
            "group_existing": 0,
            "errors": 0,
        },
    }

    for app in apps_catalog:
        flavor = str(app.get("flavor") or "").strip()
        package_name = str(app.get("package") or "").strip()
        unity_item = unity_by_flavor.get(flavor)
        app_entry: dict[str, Any] = {
            "flavor": flavor,
            "package": package_name,
            "name": str(app.get("name") or "").strip(),
            "admob_app_id": str(app.get("admob_app_id") or "").strip(),
            "unity_app_key": unity_item.get("unity_app_key") if unity_item else None,
            "formats": [],
        }

        if not unity_item or not str(unity_item.get("unity_app_key") or "").strip():
            app_entry["error"] = "Missing unity_app_key in unity catalog"
            report["result"]["errors"] += 1
            report["apps"].append(app_entry)
            continue

        game_id = str(unity_item.get("unity_app_key") or "").strip()
        unity_placements = unity_item.get("unity_placements") or {}
        app_ad_units = app.get("ad_units") or {}

        for format_key, adapter_meta in UNITY_BIDDING_ADAPTERS.items():
            ad_unit_id = str(app_ad_units.get(format_key) or "").strip()
            placement_id = str(unity_placements.get(adapter_meta["placement_key"]) or "").strip()
            format_entry: dict[str, Any] = {
                "format": format_key,
                "admob_ad_unit_id": ad_unit_id,
                "unity_placement": placement_id,
                "adapter_id": adapter_meta["adapter_id"],
            }

            if not ad_unit_id or not placement_id:
                format_entry["status"] = "skipped_missing_config"
                app_entry["formats"].append(format_entry)
                continue
            if ad_unit_id not in ad_unit_name_set:
                format_entry["status"] = "error_missing_admob_ad_unit"
                report["result"]["errors"] += 1
                app_entry["formats"].append(format_entry)
                continue
            if adapter_meta["adapter_id"] not in adapter_ids_available:
                format_entry["status"] = "error_missing_adapter"
                report["result"]["errors"] += 1
                app_entry["formats"].append(format_entry)
                continue

            existing_mappings = list_ad_unit_mappings(account_name, ad_unit_id, access_token)
            mapping_name = existing_mapping_name(
                mappings=existing_mappings,
                adapter_id=adapter_meta["adapter_id"],
                game_meta_id=adapter_meta["game_id_meta"],
                placement_meta_id=adapter_meta["placement_meta"],
                game_id=game_id,
                placement_id=placement_id,
            )

            if mapping_name:
                format_entry["mapping_status"] = "exists"
                format_entry["mapping_name"] = mapping_name
                report["result"]["mapping_existing"] += 1
            else:
                format_entry["mapping_status"] = "would_create"
                if args.apply:
                    try:
                        created_mapping = create_ad_unit_mapping(
                            account_name=account_name,
                            ad_unit_id=ad_unit_id,
                            token=access_token,
                            adapter_id=adapter_meta["adapter_id"],
                            game_meta_id=adapter_meta["game_id_meta"],
                            placement_meta_id=adapter_meta["placement_meta"],
                            game_id=game_id,
                            placement_id=placement_id,
                            display_name=f"Unity Ads Bidding {format_key.title()}",
                        )
                        mapping_name = str(created_mapping.get("name") or "").strip()
                        format_entry["mapping_status"] = "created"
                        format_entry["mapping_name"] = mapping_name
                        report["result"]["mapping_created"] += 1
                    except Exception as exc:  # noqa: BLE001
                        format_entry["mapping_status"] = "error"
                        format_entry["error"] = str(exc)
                        report["result"]["errors"] += 1
                        app_entry["formats"].append(format_entry)
                        continue

            group_name = f"Unity Bidding Android {adapter_meta['format']} - {flavor}"
            format_entry["group_display_name"] = group_name
            if group_name in mediation_group_names:
                format_entry["group_status"] = "exists"
                report["result"]["group_existing"] += 1
            else:
                format_entry["group_status"] = "would_create"
                if args.apply:
                    try:
                        create_mediation_group(
                            account_name=account_name,
                            token=access_token,
                            display_name=group_name,
                            ad_unit_id=ad_unit_id,
                            format_name=adapter_meta["format"],
                            mapping_resource_name=mapping_name,
                            enabled=args.enable_groups,
                        )
                        format_entry["group_status"] = "created"
                        report["result"]["group_created"] += 1
                    except Exception as exc:  # noqa: BLE001
                        format_entry["group_status"] = "error"
                        format_entry["error"] = str(exc)
                        report["result"]["errors"] += 1

            app_entry["formats"].append(format_entry)

        report["apps"].append(app_entry)

    out_path = root / args.out_json
    ensure_parent(out_path)
    out_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"mode={report['mode']}")
    print(f"account={account_name}")
    print(f"unity_bidding_ad_source_exists={unity_ad_source_exists}")
    print(
        "result="
        f"mapping_created:{report['result']['mapping_created']} "
        f"mapping_existing:{report['result']['mapping_existing']} "
        f"group_created:{report['result']['group_created']} "
        f"group_existing:{report['result']['group_existing']} "
        f"errors:{report['result']['errors']}"
    )
    print(f"report={out_path}")

    return 1 if report["result"]["errors"] else 0


if __name__ == "__main__":
    sys.exit(main())
