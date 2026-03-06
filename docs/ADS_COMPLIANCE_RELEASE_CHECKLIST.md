# Ad Compliance Release Checklist

## COMPLIANCE-CRITICAL
- Verify `Consent` flow blocks every ad request until the runtime privacy state is `CanRequestAds`.
- Verify `Privacy Options` is reachable from settings and works after first consent.
- Verify `Rewarded Interstitial` always shows the intro dialog first.
- Verify `Skip` on rewarded interstitial does not show an ad and does not grant a reward.
- Verify `Rewarded Interstitial` reward is granted only from the rewarded callback.
- Verify premium users do not load or show app open, interstitial, rewarded interstitial, banner, or native ads.
- Verify rewarded ad-free users do not receive blocked formats.
- Verify `UNDER_13`, `AGE_13_TO_15`, and `AGE_16_OR_OVER` paths are mapped correctly in the app and the privacy flow.

## OPS-CRITICAL
- Run a release build smoke test and confirm no Google test ad units are resolved.
- Run a debug build smoke test and confirm only Google test ad units are resolved.
- Run `python scripts/ci/validate_admob_inventory.py --mode strict --target-flavors all` before release publishes.
- Verify every release flavor has:
  - `admob_app_id`
  - `ad_unit_banner`
  - `ad_unit_interstitial`
  - `ad_unit_native`
  - `ad_unit_rewarded`
  - `ad_unit_open_app`
  - `ad_unit_rewarded_interstitial`
- Verify rewarded interstitial unit is present or intentionally falls back to rewarded.
- Verify Remote Config defaults are published for all new ad policy keys.

## UX-CRITICAL
- Verify app open is not shown on short app switches.
- Verify app open is blocked on active content routes.
- Verify removed interstitial triggers stay removed:
  - content mode switch
  - audio stop / pause
  - prayer detail mode switch

## REVENUE-CRITICAL
- Verify request, loaded, suppressed, dismissed, impression, click, and paid events are visible in analytics/debug logs.
- Verify `suppressed_reason` is populated for blocked app open, interstitial, and rewarded interstitial decisions.
- Verify `ad_after_engagement` is still emitted after app open/interstitial/rewarded interstitial impressions.
