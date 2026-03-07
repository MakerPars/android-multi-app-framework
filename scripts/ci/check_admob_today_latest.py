#!/usr/bin/env python3
"""
Fetch AdMob "today until now" performance summary filtered to latest app versions only.

Data source:
- AdMob networkReport with dimensions APP + APP_VERSION

Latest-version source of truth:
- .ci/apps.json (flavor <-> app display name)
- app-versions.properties (<flavor>.versionName)

This script intentionally excludes legacy app versions from totals and alerts.
"""

from __future__ import annotations

import argparse
import json
import re
import unicodedata
from datetime import datetime
from pathlib import Path
from typing import Any

import requests
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials


DEFAULT_SCOPES = [
    "https://www.googleapis.com/auth/admob.readonly",
    "https://www.googleapis.com/auth/admob.report",
]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="AdMob today-to-now report filtered to latest app versions only"
    )
    parser.add_argument(
        "--token-file",
        default="SECRET/token.json",
        help="Path to OAuth token JSON (default: SECRET/token.json)",
    )
    parser.add_argument(
        "--publisher",
        default="",
        help="Preferred AdMob publisher id/account (pub-xxx or accounts/pub-xxx). If empty, first accessible account is used.",
    )
    parser.add_argument(
        "--apps-catalog",
        default=".ci/apps.json",
        help="Apps catalog JSON path (default: .ci/apps.json)",
    )
    parser.add_argument(
        "--versions-file",
        default="app-versions.properties",
        help="app-versions.properties path (default: app-versions.properties)",
    )
    parser.add_argument(
        "--top",
        type=int,
        default=10,
        help="Top N apps by estimated earnings to print (default: 10)",
    )
    parser.add_argument(
        "--min-requests",
        type=int,
        default=20,
        help="Minimum ad requests for issue detection (default: 20)",
    )
    parser.add_argument(
        "--show-rate-threshold",
        type=float,
        default=0.25,
        help="Low show-rate threshold for issue detection (default: 0.25)",
    )
    parser.add_argument(
        "--match-rate-threshold",
        type=float,
        default=0.50,
        help="Low match-rate threshold for issue detection (default: 0.50)",
    )
    parser.add_argument(
        "--out-json",
        default="TEMP_OUT/admob_today_latest_report.json",
        help="Output JSON path (default: TEMP_OUT/admob_today_latest_report.json)",
    )
    parser.add_argument(
        "--fail-on-alert",
        action="store_true",
        help="Exit with non-zero code when low_performing_apps or zero_impressions_apps is not empty.",
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Fail if an AdMob app label cannot be mapped to catalog or has no latest version mapping.",
    )
    return parser.parse_args()


def int_metric(metrics: dict[str, Any], key: str) -> int:
    return int((metrics.get(key, {}) or {}).get("integerValue", "0"))


def float_metric(metrics: dict[str, Any], key: str) -> float:
    return float((metrics.get(key, {}) or {}).get("doubleValue", 0) or 0)


def micros_metric(metrics: dict[str, Any], key: str) -> int:
    return int((metrics.get(key, {}) or {}).get("microsValue", "0"))


def ensure_parent(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def normalize_account_name(value: str) -> str:
    value = (value or "").strip()
    if not value:
        return ""
    return value if value.startswith("accounts/") else f"accounts/{value}"


def normalize_label(value: str) -> str:
    lowered = unicodedata.normalize("NFKD", value or "").lower()
    ascii_only = "".join(ch for ch in lowered if not unicodedata.combining(ch))
    return re.sub(r"[^a-z0-9]+", "", ascii_only)


def parse_versions(path: Path) -> dict[str, str]:
    if not path.exists():
        raise SystemExit(f"versions file not found: {path}")
    mapping: dict[str, str] = {}
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip()
        if key.endswith(".versionName"):
            flavor = key[: -len(".versionName")]
            if flavor and value:
                mapping[flavor] = value
    return mapping


def parse_apps_catalog(path: Path) -> list[dict[str, str]]:
    if not path.exists():
        raise SystemExit(f"apps catalog not found: {path}")
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, list):
        raise SystemExit(f"apps catalog must be a JSON array: {path}")
    out: list[dict[str, str]] = []
    for item in payload:
        if not isinstance(item, dict):
            continue
        flavor = str(item.get("flavor") or "").strip()
        name = str(item.get("name") or "").strip()
        package_name = str(item.get("package") or "").strip()
        if flavor and name:
            out.append({"flavor": flavor, "name": name, "package": package_name})
    return out


def build_latest_map(apps: list[dict[str, str]], versions: dict[str, str]) -> dict[str, dict[str, str]]:
    latest_map: dict[str, dict[str, str]] = {}
    for app in apps:
        flavor = app["flavor"]
        latest_version = versions.get(flavor, "").strip()
        if not latest_version:
            continue
        key = normalize_label(app["name"])
        latest_map[key] = {
            "flavor": flavor,
            "name": app["name"],
            "package": app["package"],
            "latest_version": latest_version,
        }
    return latest_map


def main() -> None:
    args = parse_args()
    now = datetime.now()

    token_path = Path(args.token_file)
    if not token_path.exists():
        raise SystemExit(f"Token file not found: {token_path}")

    token_info = json.loads(token_path.read_text(encoding="utf-8"))
    scopes = token_info.get("scopes") or DEFAULT_SCOPES
    creds = Credentials.from_authorized_user_info(token_info, scopes=scopes)
    if not creds.valid:
        creds.refresh(Request())

    headers = {
        "Authorization": f"Bearer {creds.token}",
        "Content-Type": "application/json",
    }

    account_resp = requests.get("https://admob.googleapis.com/v1/accounts", headers=headers, timeout=30)
    account_resp.raise_for_status()
    accounts = account_resp.json().get("account", [])
    if not accounts:
        raise SystemExit("No AdMob account returned by API.")
    account_names = [item.get("name", "") for item in accounts if item.get("name")]
    requested_account = normalize_account_name(args.publisher)
    if requested_account:
        if requested_account not in account_names:
            raise SystemExit(
                f"Requested publisher/account is not accessible: {requested_account} "
                f"(accessible={account_names})"
            )
        account_name = requested_account
    else:
        account_name = account_names[0]

    versions = parse_versions(Path(args.versions_file))
    apps = parse_apps_catalog(Path(args.apps_catalog))
    latest_map = build_latest_map(apps, versions)
    if not latest_map:
        raise SystemExit("Latest app version map is empty (apps catalog / versions mismatch).")

    report_body = {
        "reportSpec": {
            "dateRange": {
                "startDate": {"year": now.year, "month": now.month, "day": now.day},
                "endDate": {"year": now.year, "month": now.month, "day": now.day},
            },
            "dimensions": ["APP", "APP_VERSION"],
            "metrics": [
                "AD_REQUESTS",
                "IMPRESSIONS",
                "CLICKS",
                "ESTIMATED_EARNINGS",
                "MATCH_RATE",
                "SHOW_RATE",
            ],
            "sortConditions": [{"metric": "ESTIMATED_EARNINGS", "order": "DESCENDING"}],
        }
    }

    report_resp = requests.post(
        f"https://admob.googleapis.com/v1/{account_name}/networkReport:generate",
        headers=headers,
        json=report_body,
        timeout=120,
    )
    report_resp.raise_for_status()
    payload = report_resp.json()
    if not isinstance(payload, list):
        raise SystemExit("Unexpected report payload (expected streamed JSON array).")

    rows: list[dict[str, Any]] = []
    currency = "TRY"
    for item in payload:
        if "header" in item:
            currency = item["header"].get("localizationSettings", {}).get("currencyCode", currency)
        if "row" in item:
            rows.append(item["row"])

    if not rows:
        raise SystemExit("No report rows returned for today.")

    aggregated: dict[str, dict[str, Any]] = {}
    unmapped_apps: dict[str, int] = {}
    latest_rows = 0
    legacy_rows = 0

    for row in rows:
        dim = row.get("dimensionValues", {})
        metrics = row.get("metricValues", {})

        app_dim = dim.get("APP", {}) or {}
        app_label = (
            app_dim.get("displayLabel")
            or app_dim.get("value")
            or "unknown"
        )
        app_key = normalize_label(str(app_label))
        app_meta = latest_map.get(app_key)
        if not app_meta:
            unmapped_apps[str(app_label)] = unmapped_apps.get(str(app_label), 0) + int_metric(metrics, "AD_REQUESTS")
            continue

        app_version_dim = dim.get("APP_VERSION", {}) or {}
        app_version = str(app_version_dim.get("displayLabel") or app_version_dim.get("value") or "").strip()
        latest_version = app_meta["latest_version"]

        if app_version != latest_version:
            legacy_rows += 1
            continue

        latest_rows += 1
        agg_key = app_meta["flavor"]
        current = aggregated.get(
            agg_key,
            {
                "flavor": app_meta["flavor"],
                "app": app_meta["name"],
                "package": app_meta["package"],
                "latest_version": latest_version,
                "ad_requests": 0,
                "impressions": 0,
                "clicks": 0,
                "estimated_earnings": 0.0,
                "weighted_match_numerator": 0.0,
                "weighted_show_numerator": 0.0,
            },
        )

        ad_requests = int_metric(metrics, "AD_REQUESTS")
        impressions = int_metric(metrics, "IMPRESSIONS")
        clicks = int_metric(metrics, "CLICKS")
        earnings = micros_metric(metrics, "ESTIMATED_EARNINGS") / 1_000_000
        match_rate = float_metric(metrics, "MATCH_RATE")
        show_rate = float_metric(metrics, "SHOW_RATE")

        current["ad_requests"] += ad_requests
        current["impressions"] += impressions
        current["clicks"] += clicks
        current["estimated_earnings"] += earnings
        current["weighted_match_numerator"] += ad_requests * match_rate
        current["weighted_show_numerator"] += ad_requests * show_rate
        aggregated[agg_key] = current

    if args.strict and unmapped_apps:
        raise SystemExit(f"Unmapped AdMob app labels found (cannot enforce latest-only): {list(unmapped_apps.keys())}")

    apps_out: list[dict[str, Any]] = []
    for _, item in aggregated.items():
        req = int(item["ad_requests"])
        weighted_match = (item["weighted_match_numerator"] / req) if req else 0.0
        weighted_show = (item["weighted_show_numerator"] / req) if req else 0.0
        apps_out.append(
            {
                "flavor": item["flavor"],
                "app": item["app"],
                "package": item["package"],
                "latest_version": item["latest_version"],
                "ad_requests": req,
                "impressions": int(item["impressions"]),
                "clicks": int(item["clicks"]),
                "estimated_earnings": round(float(item["estimated_earnings"]), 6),
                "match_rate": round(weighted_match, 6),
                "show_rate": round(weighted_show, 6),
            }
        )

    apps_out.sort(key=lambda x: x["estimated_earnings"], reverse=True)

    total_requests = sum(a["ad_requests"] for a in apps_out)
    total_impressions = sum(a["impressions"] for a in apps_out)
    total_clicks = sum(a["clicks"] for a in apps_out)
    total_earnings = sum(a["estimated_earnings"] for a in apps_out)
    weighted_match = (
        sum(a["ad_requests"] * a["match_rate"] for a in apps_out) / total_requests if total_requests else 0.0
    )
    weighted_show = (
        sum(a["ad_requests"] * a["show_rate"] for a in apps_out) / total_requests if total_requests else 0.0
    )

    low_performing = [
        a
        for a in apps_out
        if a["ad_requests"] >= args.min_requests
        and (a["show_rate"] < args.show_rate_threshold or a["match_rate"] < args.match_rate_threshold)
    ]
    zero_impressions = [a for a in apps_out if a["ad_requests"] > 0 and a["impressions"] == 0]

    result = {
        "account": account_name,
        "generated_at_local": now.isoformat(),
        "date_range": {"start": str(now.date()), "end": str(now.date()), "mode": "today-to-now"},
        "currency": currency,
        "latest_only": True,
        "filtering": {
            "latest_rows_included": latest_rows,
            "legacy_rows_excluded": legacy_rows,
            "unmapped_apps": unmapped_apps,
            "apps_with_latest_mapping": len(latest_map),
        },
        "totals_from_latest_rows": {
            "ad_requests": total_requests,
            "impressions": total_impressions,
            "clicks": total_clicks,
            "estimated_earnings": round(total_earnings, 6),
            "weighted_match_rate": round(weighted_match, 6),
            "weighted_show_rate": round(weighted_show, 6),
        },
        "top_apps": apps_out[: max(0, args.top)],
        "low_performing_apps": low_performing,
        "zero_impressions_apps": zero_impressions,
        "all_apps_count": len(apps_out),
    }

    out_path = Path(args.out_json)
    ensure_parent(out_path)
    out_path.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"account={account_name}")
    print(f"range={now.date()}..{now.date()} (today-to-now)")
    print("latest_only=true")
    print(f"included_rows={latest_rows} excluded_legacy_rows={legacy_rows} unmapped_apps={len(unmapped_apps)}")
    print("totals_from_latest_rows:", json.dumps(result["totals_from_latest_rows"], ensure_ascii=False))
    print(
        f"top_apps={len(result['top_apps'])} "
        f"low_performing={len(low_performing)} zero_impressions={len(zero_impressions)}"
    )
    print(f"wrote={out_path}")

    if args.fail_on_alert and (low_performing or zero_impressions):
        raise SystemExit(
            "AdMob latest-only health alerts detected "
            f"(low_performing={len(low_performing)}, zero_impressions={len(zero_impressions)})"
        )


if __name__ == "__main__":
    main()

