# Desktop performance target — 2026-11-11

Target: Lighthouse desktop Performance strictly above 99 (100 on the displayed
integer scale). This requirement applies to desktop separately from mobile.

## Changes

- Replace the headline's unconditional animation frame loop with coalesced
  pointer/scroll/resize updates. No typography style writes occur while idle.
- Keep first-screen content revealed before enabling scroll entrance effects;
  hydration must not hide already painted hero text or stats.
- Remove the continuous variable-font breathing animation (layout work before
  hydration and on touch devices); make decorative accent shimmer hover-only.
- Pause the ticker while offscreen and start it only when it intersects.
- Split the manual production Lighthouse workflow into mobile/desktop reports.
  The desktop job fails at <=99 and retains its artifact on failure. This is a
  production audit after deployment, not a pre-merge assertion about localhost.

## Evidence and limits

Live desktop Lighthouse 13.6.0 on https://wajidali.dev measured 99 in this
session; the supplied PageSpeed screenshot measured 78. That discrepancy was
not reproduced here and should not be treated as a proven causal improvement.
The previous PR build measured 100 locally before these additional changes.

Final desktop repeat results are summarized in `lighthouse-desktop.json`.
Each run used a new headless system Chromium via Lighthouse's desktop preset,
simulated throttling, and the production localhost build with repository-seeded
PostgreSQL. Runs were sequential with no concurrent build/browser checks.

Lint, TypeScript, production build passed. A Chromium regression check confirmed
all hero reveal targets marked revealed, zero idle headline style writes,
pointer-responsive headline updates that settle after movement, and zero page
errors. Existing lazy-loading and viewport-rendering behavior is preserved.

Google's PageSpeed Insights API returned HTTP 429 RESOURCE_EXHAUSTED (shared
API daily quota), so no new Google-hosted PSI result was obtained. Local scores
are not a guarantee of production/Google infrastructure scores. The production
workflow and a fresh PSI desktop check must verify the deployed commit after
merge. Network, runner load, caches and browser versions can change scores.

Final desktop results: **100 / 100 / 100** Performance over three sequential
runs; each recorded LCP 0.3s, TBT 0ms and CLS 0. Accessibility, Best Practices
and SEO also scored 100 in each run. These are local lab results.
