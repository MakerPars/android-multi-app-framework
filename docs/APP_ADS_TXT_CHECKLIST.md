# app-ads.txt Checklist

## RELEASE-BLOCKER
The app-ads.txt chain is operational, not code-only. Treat a broken setup as a release blocker for monetized flavors.

## Required Checks
- The public domain serving `app-ads.txt` is live and reachable.
- The Play Store listing domain matches the hosted `app-ads.txt` domain.
- The seller entry for AdMob is present and correct.

## Verification Steps
1. Open the hosted `app-ads.txt` URL directly.
2. Validate the file contents against the current AdMob account and current seller list.
3. Confirm Play Console lists the same domain.
4. Re-check after DNS, hosting, or seller changes.

## OPS-CRITICAL Notes
- Domain or hosting migrations can silently break monetization eligibility.
- Keep this checklist in the release process, not only in documentation.
