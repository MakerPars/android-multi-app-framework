#!/usr/bin/env python3
"""
Sync Android app catalog into Unity Ads / ironSource Application API.

Important auth note:
- The Unity/ironSource Application API requires Bearer auth generated from
  "My Account" -> Secret Key + Refresh Token.
- LevelPlay service-account keys from "API Management" are not sufficient for
  this specific API.

Defaults:
- source catalog: .ci/apps.json
- auth: Unity Grow account secret key + refresh token from env / .env
- mode: dry-run (reports what would be created)

Usage:
  python scripts/monetization/sync_unity_apps.py
  python scripts/monetization/sync_unity_apps.py --apply
  python scripts/monetization/sync_unity_apps.py --flavors amenerrasulu,yasinsuresi --apply
"""

from __future__ import annotations

import argparse
import json
import os
import pathlib
import sys
import urllib.error
import urllib.parse
import urllib.request
from typing import Any


DEFAULT_BASE_URL = "https://platform.ironsrc.com/partners/publisher/applications/v6"
DEFAULT_PLACEMENTS_URL = "https://platform.ironsrc.com/partners/publisher/placements/v1/"
DEFAULT_CATALOG = ".ci/apps.json"
DEFAULT_REPORT = "TEMP_OUT/unity_apps_sync_report.json"
DEFAULT_TAXONOMY = "Books & Reference"
INVALID_APP_NAME_CHARS = {"'", '"', "<", ">", ";", "\\"}
DEFAULT_PLACEMENT_REPORT = "TEMP_OUT/unity_placements_sync_report.json"
DEFAULT_EXPORT_CONFIG = "config/unity-apps.json"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Sync Android flavor apps into Unity Ads Application API"
    )
    parser.add_argument(
        "--catalog",
        default=DEFAULT_CATALOG,
        help=f"Path to app catalog JSON (default: {DEFAULT_CATALOG})",
    )
    parser.add_argument(
        "--taxonomy",
        default=DEFAULT_TAXONOMY,
        help=f"Unity taxonomy/sub-genre for live app creation (default: {DEFAULT_TAXONOMY})",
    )
    parser.add_argument(
        "--coppa",
        type=int,
        choices=(0, 1),
        default=0,
        help="COPPA flag for created apps: 0=false, 1=true (default: 0)",
    )
    parser.add_argument(
        "--ccpa",
        type=int,
        choices=(0, 1),
        default=0,
        help="CCPA flag for created apps: 0=false, 1=true (default: 0)",
    )
    parser.add_argument(
        "--flavors",
        default="",
        help="Comma-separated flavor filter (default: all apps in catalog)",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=0,
        help="Limit number of catalog apps processed (default: all)",
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Actually create missing Unity apps. Without this flag the script is dry-run.",
    )
    parser.add_argument(
        "--out-json",
        default=DEFAULT_REPORT,
        help=f"Path to JSON report file (default: {DEFAULT_REPORT})",
    )
    parser.add_argument(
        "--sync-placements",
        action="store_true",
        help="After app sync, create missing default placements for each selected app.",
    )
    parser.add_argument(
        "--placements-out-json",
        default=DEFAULT_PLACEMENT_REPORT,
        help=f"Placement sync JSON report path (default: {DEFAULT_PLACEMENT_REPORT})",
    )
    parser.add_argument(
        "--cleanup-placement-duplicates",
        action="store_true",
        help="Archive duplicate placements per ad unit, keeping Unity default placements when possible.",
    )
    parser.add_argument(
        "--export-config",
        default="",
        help=(
            "Export normalized Unity app inventory JSON. "
            f"Suggested path: {DEFAULT_EXPORT_CONFIG}"
        ),
    )
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
    value = os.environ.get(name)
    if value is not None and value.strip():
        return value.strip()
    return dotenv.get(name, default).strip()


def get_first_setting(names: list[str], dotenv: dict[str, str], default: str = "") -> str:
    for name in names:
        value = get_setting(name, dotenv, "")
        if value:
            return value
    return default.strip()


def ensure_parent(path: pathlib.Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def mask_secret(value: str) -> str:
    if len(value) <= 6:
        return "*" * len(value)
    return f"{value[:3]}...{value[-3:]}"


def http_json(
    method: str,
    url: str,
    headers: dict[str, str],
    body: dict[str, Any] | None = None,
    allow_not_found_empty: bool = False,
) -> Any:
    data = None
    request_headers = dict(headers)
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        request_headers["Content-Type"] = "application/json"

    request = urllib.request.Request(url, data=data, headers=request_headers, method=method)
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            raw = response.read().decode("utf-8")
            return json.loads(raw) if raw else None
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace")
        if allow_not_found_empty and exc.code == 404:
            return []
        raise RuntimeError(f"HTTP {exc.code} {exc.reason}: {raw}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"Request failed: {exc.reason}") from exc


def fetch_bearer_token(secret_key: str, refresh_token: str) -> str:
    request = urllib.request.Request(
        "https://platform.ironsrc.com/partners/publisher/auth",
        headers={
            "secretkey": secret_key,
            "refreshToken": refresh_token,
            "Accept": "application/json",
        },
        method="GET",
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            raw = response.read().decode("utf-8").strip()
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"auth failed: HTTP {exc.code} {exc.reason}: {raw}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"auth failed: {exc.reason}") from exc

    token = raw.strip().strip('"')
    if not token:
        raise RuntimeError("auth failed: empty bearer token")
    return token


def load_catalog(path: pathlib.Path) -> list[dict[str, Any]]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, list):
        raise RuntimeError(f"Catalog must be a JSON array: {path}")
    return payload


def filter_catalog(
    apps: list[dict[str, Any]],
    flavors_csv: str,
    limit: int,
) -> list[dict[str, Any]]:
    selected = apps
    if flavors_csv.strip():
        wanted = {item.strip() for item in flavors_csv.split(",") if item.strip()}
        selected = [app for app in selected if str(app.get("flavor") or "").strip() in wanted]
    if limit > 0:
        selected = selected[:limit]
    return selected


def build_store_url(package_name: str) -> str:
    quoted_package = urllib.parse.quote(package_name, safe="")
    return f"https://play.google.com/store/apps/details?id={quoted_package}"


def sanitize_app_name(name: str) -> str:
    cleaned = "".join(ch for ch in name if ch not in INVALID_APP_NAME_CHARS)
    cleaned = " ".join(cleaned.split())
    return cleaned.strip()


def create_payload(app: dict[str, Any], taxonomy: str, coppa: int, ccpa: int) -> dict[str, Any]:
    package_name = str(app.get("package") or "").strip()
    display_name = str(app.get("name") or app.get("flavor") or package_name).strip()
    display_name = sanitize_app_name(display_name)
    if not package_name:
        raise RuntimeError(f"Catalog item missing package: {app}")
    if not display_name:
        raise RuntimeError(f"Catalog item missing name: {app}")

    return {
        "appName": display_name,
        "storeUrl": build_store_url(package_name),
        "taxonomy": taxonomy,
        "coppa": coppa,
        "ccpa": ccpa,
    }


def normalize_existing_apps(payload: Any) -> tuple[dict[str, dict[str, Any]], list[dict[str, Any]]]:
    if not isinstance(payload, list):
        raise RuntimeError(f"Unexpected GET payload shape: {type(payload).__name__}")

    by_bundle: dict[str, dict[str, Any]] = {}
    bundle_unknown: list[dict[str, Any]] = []
    for item in payload:
        if not isinstance(item, dict):
            continue
        bundle_id = str(item.get("bundleId") or "").strip()
        if bundle_id and bundle_id.lower() != "unknown":
            by_bundle[bundle_id] = item
        else:
            bundle_unknown.append(item)
    return by_bundle, bundle_unknown


def get_existing_placements(headers: dict[str, str], app_key: str) -> list[dict[str, Any]]:
    query = urllib.parse.urlencode({"appKey": app_key})
    payload = http_json(
        "GET",
        f"{DEFAULT_PLACEMENTS_URL}?{query}",
        headers,
        allow_not_found_empty=True,
    )
    if not isinstance(payload, list):
        raise RuntimeError(f"Unexpected placements payload for {app_key}: {type(payload).__name__}")
    return payload


def default_placements() -> list[dict[str, Any]]:
    return [
        {
            "adUnit": "banner",
            "name": "DefaultBanner",
            "adDelivery": 1,
        },
        {
            "adUnit": "interstitial",
            "name": "DefaultInterstitial",
            "adDelivery": 1,
        },
        {
            "adUnit": "rewardedVideo",
            "name": "DefaultRewardedVideo",
            "adDelivery": 1,
            "itemName": "Reward",
            "rewardAmount": 1,
        },
    ]


def sync_default_placements(
    headers: dict[str, str],
    app_entries: list[dict[str, Any]],
    root: pathlib.Path,
    out_json: str,
    apply: bool,
) -> tuple[int, int]:
    report = {
        "mode": "apply" if apply else "dry-run",
        "placements": [],
        "result": {
            "created": 0,
            "skipped_existing": 0,
            "errors": 0,
        },
    }

    created_count = 0
    skipped_count = 0
    error_count = 0

    for entry in app_entries:
        app_key = str(entry.get("appKey") or "").strip()
        package_name = str(entry.get("package") or "").strip()
        flavor = str(entry.get("flavor") or "").strip()
        if not app_key:
            continue

        placement_entry: dict[str, Any] = {
            "flavor": flavor,
            "package": package_name,
            "appKey": app_key,
        }

        try:
            existing = get_existing_placements(headers, app_key)
            existing_names = {str(item.get("name") or "").strip() for item in existing}
            existing_units = {str(item.get("adUnit") or "").strip() for item in existing}
            missing = [item for item in default_placements() if item["adUnit"] not in existing_units]
            placement_entry["existing"] = sorted(name for name in existing_names if name)
            placement_entry["missing"] = [item["name"] for item in missing]

            if not missing:
                placement_entry["status"] = "exists"
                skipped_count += 1
                report["placements"].append(placement_entry)
                continue

            if apply:
                payload = {
                    "appKey": app_key,
                    "placements": missing,
                }
                created = http_json("POST", DEFAULT_PLACEMENTS_URL, headers, body=payload)
                placement_entry["status"] = "created"
                placement_entry["created"] = created
                created_count += len(missing)
            else:
                placement_entry["status"] = "would_create"
        except Exception as exc:  # noqa: BLE001
            placement_entry["status"] = "failed"
            placement_entry["error"] = str(exc)
            error_count += 1

        report["placements"].append(placement_entry)

    report["result"] = {
        "created": created_count,
        "skipped_existing": skipped_count,
        "errors": error_count,
    }
    out_path = root / out_json
    ensure_parent(out_path)
    out_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(
        "placements_result="
        f"created:{created_count} skipped_existing:{skipped_count} errors:{error_count}"
    )
    print(f"placements_report={out_path}")
    return created_count, error_count


def delete_placement(headers: dict[str, str], app_key: str, ad_unit: str, placement_id: int) -> Any:
    payload = {
        "appKey": app_key,
        "adUnit": ad_unit,
        "id": placement_id,
    }
    return http_json("DELETE", DEFAULT_PLACEMENTS_URL, headers, body=payload)


def duplicate_cleanup_candidates(existing: list[dict[str, Any]]) -> list[dict[str, Any]]:
    by_unit: dict[str, list[dict[str, Any]]] = {}
    for item in existing:
        ad_unit = str(item.get("adUnit") or "").strip()
        if not ad_unit:
            continue
        by_unit.setdefault(ad_unit, []).append(item)

    victims: list[dict[str, Any]] = []
    preferred_default_names = {
        "banner": "DefaultBanner",
        "interstitial": "DefaultInterstitial",
        "rewardedVideo": "DefaultRewardedVideo",
        "nativeAd": "DefaultNative",
    }
    for ad_unit, placements in by_unit.items():
        if len(placements) <= 1:
            continue
        keep_name = preferred_default_names.get(ad_unit, "")
        keep = next((p for p in placements if str(p.get("name") or "").strip() == keep_name), None)
        if keep is None:
            keep = min(placements, key=lambda item: int(item.get("id") or 0))
        keep_id = int(keep.get("id") or 0)
        for placement in placements:
            placement_id = int(placement.get("id") or 0)
            if placement_id != keep_id:
                victims.append(placement)
    return victims


def cleanup_duplicate_placements(
    headers: dict[str, str],
    app_entries: list[dict[str, Any]],
    root: pathlib.Path,
    out_json: str,
    apply: bool,
) -> int:
    report = {
        "mode": "apply" if apply else "dry-run",
        "duplicates": [],
        "result": {
            "archived": 0,
            "skipped_clean": 0,
            "errors": 0,
        },
    }

    archived_count = 0
    clean_count = 0
    error_count = 0

    for entry in app_entries:
        app_key = str(entry.get("appKey") or "").strip()
        if not app_key:
            continue
        package_name = str(entry.get("package") or "").strip()
        flavor = str(entry.get("flavor") or "").strip()
        item_report = {
            "flavor": flavor,
            "package": package_name,
            "appKey": app_key,
        }
        try:
            existing = get_existing_placements(headers, app_key)
            victims = duplicate_cleanup_candidates(existing)
            item_report["victims"] = [
                {
                    "id": int(v.get("id") or 0),
                    "adUnit": str(v.get("adUnit") or ""),
                    "name": str(v.get("name") or ""),
                }
                for v in victims
            ]
            if not victims:
                item_report["status"] = "clean"
                clean_count += 1
                report["duplicates"].append(item_report)
                continue

            if apply:
                for victim in victims:
                    delete_placement(
                        headers=headers,
                        app_key=app_key,
                        ad_unit=str(victim.get("adUnit") or "").strip(),
                        placement_id=int(victim.get("id") or 0),
                    )
                item_report["status"] = "archived"
                archived_count += len(victims)
            else:
                item_report["status"] = "would_archive"
            report["duplicates"].append(item_report)
        except Exception as exc:  # noqa: BLE001
            item_report["status"] = "failed"
            item_report["error"] = str(exc)
            error_count += 1
            report["duplicates"].append(item_report)

    report["result"] = {
        "archived": archived_count,
        "skipped_clean": clean_count,
        "errors": error_count,
    }
    cleanup_path = root / out_json.replace(".json", "_cleanup.json")
    ensure_parent(cleanup_path)
    cleanup_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(
        "placements_cleanup_result="
        f"archived:{archived_count} skipped_clean:{clean_count} errors:{error_count}"
    )
    print(f"placements_cleanup_report={cleanup_path}")
    return error_count


def export_unity_inventory(
    headers: dict[str, str],
    apps_by_bundle: dict[str, dict[str, Any]],
    catalog: list[dict[str, Any]],
    root: pathlib.Path,
    export_path: str,
) -> pathlib.Path:
    exported: list[dict[str, Any]] = []
    for item in catalog:
        package_name = str(item.get("package") or "").strip()
        unity_app = apps_by_bundle.get(package_name, {})
        app_key = str(unity_app.get("appKey") or "").strip()
        placement_names: dict[str, str] = {}
        if app_key:
            try:
                placements = get_existing_placements(headers, app_key)
            except Exception:  # noqa: BLE001
                placements = []
            for placement in placements:
                ad_unit = str(placement.get("adUnit") or "").strip()
                name = str(placement.get("name") or "").strip()
                if ad_unit and name and ad_unit not in placement_names:
                    placement_names[ad_unit] = name

        exported.append(
            {
                "flavor": str(item.get("flavor") or "").strip(),
                "package": package_name,
                "name": str(item.get("name") or "").strip(),
                "unity_app_key": app_key or None,
                "unity_platform": unity_app.get("platform"),
                "unity_placements": {
                    "banner": placement_names.get("banner"),
                    "interstitial": placement_names.get("interstitial"),
                    "rewarded": placement_names.get("rewardedVideo"),
                    "native": placement_names.get("nativeAd"),
                },
            }
        )

    out_path = root / export_path
    ensure_parent(out_path)
    out_path.write_text(json.dumps(exported, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"exported_config={out_path}")
    return out_path


def main() -> int:
    args = parse_args()
    root = repo_root()
    dotenv = load_dotenv_map(root / ".env")

    secret_key = get_first_setting(
        ["UNITY_ADS_SECRET_KEY", "UNITY_IRONSRC_SECRET_KEY"],
        dotenv,
    )
    refresh_token = get_first_setting(
        ["UNITY_ADS_REFRESH_TOKEN", "UNITY_IRONSRC_REFRESH_TOKEN"],
        dotenv,
    )
    organization_id = get_first_setting(
        ["UNITY_ADS_ORGANIZATION_ID", "UNITY_IRONSRC_PUBLISHER_ID"],
        dotenv,
    )
    base_url = (
        get_first_setting(
            ["UNITY_ADS_APPLICATIONS_API_URL", "UNITY_IRONSRC_APPLICATIONS_API_URL"],
            dotenv,
            DEFAULT_BASE_URL,
        )
        or DEFAULT_BASE_URL
    )

    if not secret_key or not refresh_token:
        print(
            "ERROR: missing Unity Ads Application API credentials. "
            "Expected UNITY_ADS_SECRET_KEY/UNITY_ADS_REFRESH_TOKEN or "
            "UNITY_IRONSRC_SECRET_KEY/UNITY_IRONSRC_REFRESH_TOKEN from "
            "Unity Ads / LevelPlay 'My Account'. Service-account API keys from "
            "'API Management' do not work for Application API."
        )
        return 1

    catalog_path = root / args.catalog
    if not catalog_path.exists():
        print(f"ERROR: catalog file not found: {catalog_path}")
        return 1

    try:
        catalog = filter_catalog(load_catalog(catalog_path), args.flavors, args.limit)
    except Exception as exc:  # noqa: BLE001
        print(f"ERROR: failed to load catalog: {exc}")
        return 1

    if not catalog:
        print("ERROR: no apps selected from catalog")
        return 1

    try:
        bearer_token = fetch_bearer_token(secret_key, refresh_token)
    except Exception as exc:  # noqa: BLE001
        print(f"ERROR: {exc}")
        return 1

    headers = {
        "Authorization": f"Bearer {bearer_token}",
        "Accept": "application/json",
    }

    try:
        existing_payload = http_json(
            "GET",
            base_url,
            headers,
            allow_not_found_empty=True,
        )
        existing_by_bundle, bundle_unknown = normalize_existing_apps(existing_payload)
    except Exception as exc:  # noqa: BLE001
        print(f"ERROR: failed to fetch existing Unity apps: {exc}")
        return 1

    summary = {
        "mode": "apply" if args.apply else "dry-run",
        "organization_id": organization_id or None,
        "catalog_path": str(catalog_path),
        "taxonomy": args.taxonomy,
        "coppa": args.coppa,
        "ccpa": args.ccpa,
        "selected_count": len(catalog),
        "existing_bundle_count": len(existing_by_bundle),
        "existing_unknown_bundle_count": len(bundle_unknown),
        "credentials": {
            "secret_key_masked": mask_secret(secret_key),
            "refresh_token_masked": mask_secret(refresh_token),
        },
        "apps": [],
    }

    created_count = 0
    skipped_count = 0
    error_count = 0

    for app in catalog:
        flavor = str(app.get("flavor") or "").strip()
        package_name = str(app.get("package") or "").strip()
        display_name = str(app.get("name") or flavor or package_name).strip()

        entry: dict[str, Any] = {
            "flavor": flavor,
            "package": package_name,
            "name": display_name,
        }

        existing = existing_by_bundle.get(package_name)
        if existing:
            entry["status"] = "exists"
            entry["appKey"] = existing.get("appKey")
            entry["platform"] = existing.get("platform")
            skipped_count += 1
            summary["apps"].append(entry)
            continue

        try:
            payload = create_payload(app, args.taxonomy, args.coppa, args.ccpa)
        except Exception as exc:  # noqa: BLE001
            entry["status"] = "invalid_catalog"
            entry["error"] = str(exc)
            error_count += 1
            summary["apps"].append(entry)
            continue

        entry["status"] = "would_create"
        entry["storeUrl"] = payload["storeUrl"]

        if args.apply:
            try:
                created = http_json("POST", base_url, headers, body=payload)
                entry["status"] = "created"
                if isinstance(created, dict):
                    entry["appKey"] = created.get("appKey")
                    entry["bundleId"] = created.get("bundleId")
                    entry["platform"] = created.get("platform")
                created_count += 1
            except Exception as exc:  # noqa: BLE001
                entry["status"] = "create_failed"
                entry["error"] = str(exc)
                error_count += 1
        summary["apps"].append(entry)

    summary["result"] = {
        "created": created_count,
        "skipped_existing": skipped_count,
        "errors": error_count,
    }

    out_path = root / args.out_json
    ensure_parent(out_path)
    out_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"mode={summary['mode']}")
    if organization_id:
        print(f"organization_id={organization_id}")
    print(f"selected={len(catalog)} existing={len(existing_by_bundle)} unknown_bundle={len(bundle_unknown)}")
    print(
        "result="
        f"created:{created_count} skipped_existing:{skipped_count} errors:{error_count}"
    )
    print(f"report={out_path}")

    placement_errors = 0
    if args.sync_placements:
        app_entries_for_placements = [
            app for app in summary["apps"]
            if app.get("status") in {"exists", "created"} and app.get("appKey")
        ]
        _, placement_errors = sync_default_placements(
            headers=headers,
            app_entries=app_entries_for_placements,
            root=root,
            out_json=args.placements_out_json,
            apply=args.apply,
        )
        if args.cleanup_placement_duplicates:
            placement_errors += cleanup_duplicate_placements(
                headers=headers,
                app_entries=app_entries_for_placements,
                root=root,
                out_json=args.placements_out_json,
                apply=args.apply,
            )

    if args.export_config:
        latest_payload = http_json(
            "GET",
            base_url,
            headers,
            allow_not_found_empty=True,
        )
        latest_by_bundle, _ = normalize_existing_apps(latest_payload)
        export_unity_inventory(
            headers=headers,
            apps_by_bundle=latest_by_bundle,
            catalog=catalog,
            root=root,
            export_path=args.export_config,
        )

    return 1 if (error_count or placement_errors) else 0


if __name__ == "__main__":
    sys.exit(main())
