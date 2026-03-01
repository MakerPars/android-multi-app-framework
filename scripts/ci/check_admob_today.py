#!/usr/bin/env python3
"""
Fetch AdMob "today until now" performance summary via AdMob Reporting API.

Defaults:
- token file: SECRET/admob_token.json
- date range: today -> today (UI equivalent of "today so far")
- dimension: APP

The script intentionally computes totals from row data because API footer totals can
occasionally be zero in streamed responses for some accounts.
"""

from __future__ import annotations

import argparse
import json
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
        description="AdMob today-to-now report (totals + top apps + low show/match diagnostics)"
    )
    parser.add_argument(
        "--token-file",
        default="SECRET/admob_token.json",
        help="Path to OAuth token JSON (default: SECRET/admob_token.json)",
    )
    parser.add_argument(
        "--top",
        type=int,
        default=5,
        help="Top N apps by estimated earnings to print (default: 5)",
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
        default="TEMP_OUT/admob_today_report.json",
        help="Output JSON path (default: TEMP_OUT/admob_today_report.json)",
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
    account_name = accounts[0]["name"]

    report_body = {
        "reportSpec": {
            "dateRange": {
                "startDate": {"year": now.year, "month": now.month, "day": now.day},
                "endDate": {"year": now.year, "month": now.month, "day": now.day},
            },
            "dimensions": ["APP"],
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

    # API returns a JSON array [header,row,row,...,footer]
    payload = report_resp.json()
    rows: list[dict[str, Any]] = []
    footer_metrics: dict[str, Any] = {}
    currency = "TRY"

    for item in payload:
        if "header" in item:
            currency = item["header"].get("localizationSettings", {}).get("currencyCode", currency)
        if "row" in item:
            rows.append(item["row"])
        if "footer" in item:
            footer_metrics = item["footer"].get("metricValues", {}) or {}

    apps: list[dict[str, Any]] = []
    for row in rows:
        dim = row.get("dimensionValues", {})
        metrics = row.get("metricValues", {})
        apps.append(
            {
                "app": dim.get("APP", {}).get("displayLabel")
                or dim.get("APP", {}).get("value")
                or "unknown",
                "ad_requests": int_metric(metrics, "AD_REQUESTS"),
                "impressions": int_metric(metrics, "IMPRESSIONS"),
                "clicks": int_metric(metrics, "CLICKS"),
                "estimated_earnings": micros_metric(metrics, "ESTIMATED_EARNINGS") / 1_000_000,
                "match_rate": float_metric(metrics, "MATCH_RATE"),
                "show_rate": float_metric(metrics, "SHOW_RATE"),
            }
        )

    apps.sort(key=lambda x: x["estimated_earnings"], reverse=True)

    total_requests = sum(a["ad_requests"] for a in apps)
    total_impressions = sum(a["impressions"] for a in apps)
    total_clicks = sum(a["clicks"] for a in apps)
    total_earnings = sum(a["estimated_earnings"] for a in apps)
    weighted_match = (
        sum(a["ad_requests"] * a["match_rate"] for a in apps) / total_requests if total_requests else 0.0
    )
    weighted_show = (
        sum(a["ad_requests"] * a["show_rate"] for a in apps) / total_requests if total_requests else 0.0
    )

    low_performing = [
        a
        for a in apps
        if a["ad_requests"] >= args.min_requests
        and (a["show_rate"] < args.show_rate_threshold or a["match_rate"] < args.match_rate_threshold)
    ]
    zero_impressions = [a for a in apps if a["ad_requests"] > 0 and a["impressions"] == 0]

    result = {
        "account": account_name,
        "generated_at_local": now.isoformat(),
        "date_range": {"start": str(now.date()), "end": str(now.date()), "mode": "today-to-now"},
        "currency": currency,
        "totals_from_rows": {
            "ad_requests": total_requests,
            "impressions": total_impressions,
            "clicks": total_clicks,
            "estimated_earnings": round(total_earnings, 6),
            "weighted_match_rate": round(weighted_match, 6),
            "weighted_show_rate": round(weighted_show, 6),
        },
        "footer_raw": {
            "ad_requests": int_metric(footer_metrics, "AD_REQUESTS"),
            "impressions": int_metric(footer_metrics, "IMPRESSIONS"),
            "clicks": int_metric(footer_metrics, "CLICKS"),
            "estimated_earnings": round(micros_metric(footer_metrics, "ESTIMATED_EARNINGS") / 1_000_000, 6),
            "match_rate": float_metric(footer_metrics, "MATCH_RATE"),
            "show_rate": float_metric(footer_metrics, "SHOW_RATE"),
        },
        "top_apps": apps[: max(0, args.top)],
        "low_performing_apps": low_performing,
        "zero_impressions_apps": zero_impressions,
        "all_apps_count": len(apps),
    }

    out_path = Path(args.out_json)
    ensure_parent(out_path)
    out_path.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"account={account_name}")
    print(f"range={now.date()}..{now.date()} (today-to-now)")
    print(f"currency={currency}")
    print("totals_from_rows:", json.dumps(result["totals_from_rows"], ensure_ascii=False))
    print(f"top_apps={len(result['top_apps'])} low_performing={len(low_performing)} zero_impressions={len(zero_impressions)}")
    print(f"wrote={out_path}")


if __name__ == "__main__":
    main()
