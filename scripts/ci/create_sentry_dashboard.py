#!/usr/bin/env python3
"""
Create or update a Sentry dashboard for Android app free-plan observability.

Requirements:
- SENTRY_AUTH_TOKEN in environment or .env
- token scopes: org:read, project:read, project:write (or equivalent for dashboards)

Usage:
  python scripts/ci/create_sentry_dashboard.py \
    --org oaslananka \
    --project android-multi-app-framework
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

DEFAULT_BASE_URL = "https://sentry.io"
DEFAULT_TITLE = "Android Multi App Framework - Free Metrics"


@dataclass(frozen=True)
class Config:
    base_url: str
    org: str
    projects: list[str]
    environment: str
    title: str
    dry_run: bool


def load_dotenv(dotenv_path: Path) -> None:
    if not dotenv_path.exists():
        return
    for raw in dotenv_path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"')
        if key and key not in os.environ:
            os.environ[key] = value


def sentry_request(
    *,
    base_url: str,
    token: str,
    method: str,
    path: str,
    params: dict[str, Any] | None = None,
    payload: dict[str, Any] | None = None,
) -> Any:
    url = f"{base_url.rstrip('/')}{path}"
    if params:
        url = f"{url}?{urlencode(params, doseq=True)}"

    body = None
    if payload is not None:
        body = json.dumps(payload).encode("utf-8")

    req = Request(url, data=body, method=method)
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Accept", "application/json")
    if payload is not None:
        req.add_header("Content-Type", "application/json")

    try:
        with urlopen(req) as response:
            raw = response.read().decode("utf-8")
            return json.loads(raw) if raw else None
    except HTTPError as exc:
        detail = exc.read().decode("utf-8", "ignore")
        raise RuntimeError(f"HTTP {exc.code} {method} {path}: {detail}") from exc
    except URLError as exc:
        raise RuntimeError(f"Network error {method} {path}: {exc.reason}") from exc


def resolve_project_ids(base_url: str, token: str, org: str, project_slugs: list[str]) -> list[int]:
    ids: list[int] = []
    for slug in project_slugs:
        data = sentry_request(
            base_url=base_url,
            token=token,
            method="GET",
            path=f"/api/0/projects/{org}/{slug}/",
        )
        try:
            ids.append(int(data["id"]))
        except (KeyError, ValueError, TypeError) as exc:
            raise RuntimeError(f"Could not resolve project id for '{slug}'") from exc
    return ids


def build_widgets() -> list[dict[str, Any]]:
    def w(
        *,
        title: str,
        x: int,
        y: int,
        display: str,
        fields: list[str],
        orderby: str | None = None,
        interval: str = "5m",
    ) -> dict[str, Any]:
        query = {
            "name": "",
            "fields": fields,
            "conditions": "",
            "orderby": orderby or (f"-{fields[0]}" if fields else ""),
        }
        return {
            "title": title,
            "displayType": display,
            "widgetType": "metrics",
            "interval": interval,
            "layout": {"x": x, "y": y, "w": 6, "h": 2, "minH": 2, "minW": 2},
            "queries": [query],
        }

    return [
        w(
            title="App Start p95 (ms)",
            x=0,
            y=0,
            display="line",
            fields=["p95(app.on_create.duration)"],
        ),
        w(
            title="App Start avg (ms)",
            x=6,
            y=0,
            display="line",
            fields=["avg(app.on_create.duration)"],
        ),
        w(
            title="Sentry Init Success",
            x=12,
            y=0,
            display="big_number",
            fields=["sum(app.sentry.init.success)"],
        ),
        w(
            title="Screen Views",
            x=18,
            y=0,
            display="big_number",
            fields=["sum(navigation.screen_view)"],
        ),
        w(
            title="Push Subscribe Failures",
            x=0,
            y=2,
            display="line",
            fields=["sum(push.topics.subscribe.failure)"],
        ),
        w(
            title="Interstitial Funnel",
            x=6,
            y=2,
            display="line",
            fields=[
                "sum(ads.interstitial.show.attempt)",
                "sum(ads.interstitial.dismissed)",
            ],
            orderby="-sum(ads.interstitial.show.attempt)",
        ),
        w(
            title="Rewarded Interstitial Funnel",
            x=12,
            y=2,
            display="line",
            fields=[
                "sum(ads.rewarded_interstitial.show.attempt)",
                "sum(ads.rewarded_interstitial.reward_earned)",
                "sum(ads.rewarded_interstitial.dismissed)",
            ],
            orderby="-sum(ads.rewarded_interstitial.show.attempt)",
        ),
        w(
            title="Reward Free Window (min)",
            x=18,
            y=2,
            display="line",
            fields=["avg(ads.reward_free_window.minutes)"],
        ),
        w(
            title="Ad Load Requests",
            x=0,
            y=4,
            display="line",
            fields=[
                "sum(ads.load.requested.app_open)",
                "sum(ads.load.requested.interstitial)",
                "sum(ads.load.requested.native)",
                "sum(ads.load.requested.rewarded)",
                "sum(ads.load.requested.rewarded_interstitial)",
            ],
            orderby="-sum(ads.load.requested.app_open)",
        ),
        w(
            title="AppOpen Attempts vs Gated",
            x=12,
            y=4,
            display="line",
            fields=[
                "sum(ads.app_open.show.attempt)",
                "sum(ads.app_open.show.skipped.gated)",
                "sum(ads.app_open.dismissed)",
            ],
            orderby="-sum(ads.app_open.show.attempt)",
        ),
    ]


def find_dashboard_by_title(base_url: str, token: str, org: str, title: str) -> dict[str, Any] | None:
    dashboards = sentry_request(
        base_url=base_url,
        token=token,
        method="GET",
        path=f"/api/0/organizations/{org}/dashboards/",
    )
    for item in dashboards:
        if (item.get("title") or "").strip().lower() == title.strip().lower():
            return item
    return None


def create_or_update_dashboard(config: Config, token: str) -> tuple[str, int]:
    project_ids = resolve_project_ids(config.base_url, token, config.org, config.projects)
    widgets = build_widgets()

    payload = {
        "title": config.title,
        "projects": project_ids,
        "environment": [config.environment],
        "widgets": widgets,
    }

    existing = find_dashboard_by_title(config.base_url, token, config.org, config.title)

    if config.dry_run:
        action = "dry-run-update" if existing else "dry-run-create"
        print(json.dumps({"action": action, "title": config.title, "projects": project_ids}, indent=2))
        return (action, int(existing["id"]) if existing else -1)

    if existing:
        dashboard_id = int(existing["id"])
        sentry_request(
            base_url=config.base_url,
            token=token,
            method="PUT",
            path=f"/api/0/organizations/{config.org}/dashboards/{dashboard_id}/",
            payload=payload,
        )
        return ("updated", dashboard_id)

    created = sentry_request(
        base_url=config.base_url,
        token=token,
        method="POST",
        path=f"/api/0/organizations/{config.org}/dashboards/",
        payload=payload,
    )
    return ("created", int(created["id"]))


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Create/update Sentry dashboard for project metrics")
    parser.add_argument("--base-url", default=os.environ.get("SENTRY_BASE_URL", DEFAULT_BASE_URL))
    parser.add_argument("--org", default=os.environ.get("SENTRY_ORG", ""))
    parser.add_argument(
        "--project",
        action="append",
        dest="projects",
        help="Project slug (repeatable). Defaults to SENTRY_PROJECT.",
    )
    parser.add_argument("--environment", default=os.environ.get("SENTRY_ENVIRONMENT", "production"))
    parser.add_argument("--title", default=DEFAULT_TITLE)
    parser.add_argument("--dry-run", action="store_true")
    return parser.parse_args()


def main() -> int:
    repo_root = Path(__file__).resolve().parents[2]
    load_dotenv(repo_root / ".env")

    args = parse_args()
    token = os.environ.get("SENTRY_AUTH_TOKEN")
    if not token:
        print("Error: missing SENTRY_AUTH_TOKEN", file=sys.stderr)
        return 1
    if not args.org:
        print("Error: missing --org or SENTRY_ORG", file=sys.stderr)
        return 1

    projects = args.projects or [os.environ.get("SENTRY_PROJECT", "")]
    projects = [p for p in projects if p]
    if not projects:
        print("Error: missing --project or SENTRY_PROJECT", file=sys.stderr)
        return 1

    cfg = Config(
        base_url=args.base_url,
        org=args.org,
        projects=projects,
        environment=args.environment,
        title=args.title,
        dry_run=args.dry_run,
    )

    try:
        action, dashboard_id = create_or_update_dashboard(cfg, token)
    except RuntimeError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    print(f"{action.upper()}: dashboard_id={dashboard_id}")
    if dashboard_id > 0 and not cfg.dry_run:
        print(f"URL: {cfg.base_url.rstrip('/')}/organizations/{cfg.org}/dashboards/{dashboard_id}/")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

