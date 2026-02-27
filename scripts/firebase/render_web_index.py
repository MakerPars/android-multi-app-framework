#!/usr/bin/env python3
"""Render firebase web index from template by injecting FIREBASE_WEB_API_KEY."""
from __future__ import annotations

import argparse
import os
from pathlib import Path

PLACEHOLDER = "__FIREBASE_WEB_API_KEY__"


def main() -> int:
    parser = argparse.ArgumentParser(description="Render Firebase mobil_web index.html from template")
    parser.add_argument(
        "--template",
        default="side-projects/firebase/mobil_web/public/index.template.html",
        help="Template HTML path",
    )
    parser.add_argument(
        "--output",
        default="side-projects/firebase/mobil_web/public/index.html",
        help="Rendered output path",
    )
    parser.add_argument(
        "--api-key",
        default=os.getenv("FIREBASE_WEB_API_KEY", ""),
        help="Firebase web API key (defaults to FIREBASE_WEB_API_KEY env var)",
    )
    parser.add_argument(
        "--allow-placeholder",
        action="store_true",
        help="Allow writing placeholder when key is empty",
    )
    args = parser.parse_args()

    template_path = Path(args.template)
    output_path = Path(args.output)

    if not template_path.exists():
        raise SystemExit(f"Template not found: {template_path}")

    content = template_path.read_text(encoding="utf-8")

    if PLACEHOLDER not in content:
        raise SystemExit(f"Placeholder '{PLACEHOLDER}' not found in template: {template_path}")

    api_key = (args.api_key or "").strip()
    if not api_key and not args.allow_placeholder:
        raise SystemExit(
            "FIREBASE_WEB_API_KEY is empty. Set env var or use --api-key. "
            "Use --allow-placeholder only when you intentionally keep analytics disabled."
        )

    rendered = content.replace(PLACEHOLDER, api_key or PLACEHOLDER)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(rendered, encoding="utf-8")
    print(f"Rendered {output_path} from {template_path}")
    if api_key:
        print("Firebase web API key injected.")
    else:
        print("No API key injected (placeholder kept).")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
