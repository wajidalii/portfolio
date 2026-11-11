# Midnight Atelier validation

Validation is against a local Next.js production build, not a deployed release.
Final results and screenshot links are recorded below after verification.

## Baseline and defects found

Production baseline: 1440/768/390px Chromium captures, no horizontal overflow or
uncaught page errors. The intentional redesign changes typography, color, page
hierarchy and navigation, so the old screenshots are review evidence rather than
pixel-match targets. [Before desktop](screenshots/before/desktop.png),
[before tablet](screenshots/before/tablet.png), [before mobile](screenshots/before/mobile.png).

The first new UI browser run passed 29/33. It exposed a native dialog Tab boundary
and opacity-based reveal contrast failures. Explicit focus wrapping and fully
opaque translation-only reveals corrected the source. Visual inspection also
found a logo grid layout defect, excessive image margins and old social-card
colors; these were corrected before final captures. The expanded WCAG 2.1 A label-in-name rule then exposed a custom logo label
mismatch across routes (46/55 browser checks passed, 9 shared-label failures).
Removing the custom label preserves the visible native link name. Final full-suite
results below include that fix and the expanded rules. No failed check was bypassed.

## Automated checks

- Lint, TypeScript and optimized production build: passed.
- Existing unit tests: 24 passed, 0 failed, 0 skipped.
- PostgreSQL integration tests: 6 passed, 0 failed, 0 skipped, actual disposable DB.
- Existing services/browser flows: 16 passed, 0 failed, 0 skipped.
- Production dependency audit: 0 vulnerabilities (`npm audit --omit=dev`).
- Entire final Playwright suite: **55 passed, 0 failed, 0 skipped**, 1.4 minutes.
  Includes39new UI checks and16existing services checks, expanded WCAG2/2.1/2.2
  A/AA tags, four actual screenshot comparisons, and90route/theme/width combinations
  including a representative detailed case study.
- Eight redesigned route/theme axe audits plus existing services audit:0violations.
- All8public routes: no console.error/pageerror; unknown case404, sitemap, schema,
  navigation, reduced-motion and no-JS checks passed.
- Hero/project event checks contain only allowlisted event/source categories.

Local build: Next 15.5.29 / React 19.1, Node 24.22.1, Linux, system Chromium,
localhost production server. Optional conversion events enabled for verification;
no Resend key or private calendar credentials. Synthetic leads only. No production
schema/lead data writes. The homepage route adds173B page JS /112kB first-load;
services4.71kB /116kB. Shared framework/navigation code is included in first-load,
not hidden by quoting the small page component alone.

## Release limitations

Local synthetic Lighthouse cannot establish deployed scores, search ranking,
real-user75th-percentile LCP/CLS, or field INP. Browser screenshots are Linux
Chromium; Safari/Firefox and assistive technology need release smoke review.
Hosted CI must complete independently. Real email delivery, owner-configured
calendar duration/availability and prior production database migration/secrets
remain external configuration checks. No new secret/schema change is introduced.

## Manual release checklist

- [ ] Review copy, price scopes, actual career dates and appreciation-letter attribution.
- [ ] Review intentional before/after design and four committed hero golden images.
- [ ] Verify native mobile menu with keyboard and representative touch device.
- [ ] Check VoiceOver/NVDA landmarks, headings, links and inquiry errors.
- [ ] Verify Safari/Firefox, zoom/text scaling, both themes, reduced motion.
- [ ] Confirm prior services migration 0002 and rate/admin/email secrets in target.
- [ ] Send owner-authorized staging inquiry and verify notification/ack configuration.
- [ ] Configure a genuine 20-minute booking event if desired, or retain request fallback.
- [ ] Wait for hosted checks and required review; merge in documented dependency order.
- [ ] After authorized deploy, verify canonical/social/sitemap/404 and run live mobile/desktop Lighthouse.

## Final Lighthouse measurements

Lighthouse 13.6.0, local optimized server, system Chromium on Linux. Four sequential
runs with default Lighthouse simulated mobile/desktop profiles, no concurrent
build/test browser. Responsive image derivatives may be warm. Settings, timings,
user agent and fetch times are preserved in [lighthouse.json](lighthouse.json).

| Route/device | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home desktop |100|100|100|100|0.603s|0|0ms|
| Home mobile |97|100|100|100|2.684s|0|35.5ms|
| Services desktop |100|100|100|100|0.250s|0.0015|0ms|
| Services mobile |98|100|100|100|2.153s|0.0046|68ms|

All four also scored100 for the Lighthouse agentic-browsing category. Desktop
performance exceeds 99 in these local runs; this is not a production PSI guarantee.
Home mobile LCP 2.684 s is above the 2.5 s objective even though score 97 meets the
performance target. Field INP/p75 cannot be inferred. Earlier home mobile score 88
identified low hero-image priority and excessive competing font downloads. Explicit
high fetch priority and focused font faces reduced font transfer from 111,260 to
73,188 bytes and final TBT from 258.5 to 35.5 ms; these are local implementation audit
results, not client-business outcome claims. Raw local HTML/JSON reports are in
`/workspace/atelier-lighthouse/*-release.report.*`.


Final viewport golden images were compared without updates after the intentional
font refinement; all four passed. Full-page desktop/mobile/light/dark/tablet and
work/case/about/services captures are in [screenshots/after](screenshots/after/CAPTURE.md).
Capture-only overrides are documented there and were excluded from Lighthouse,
axe and performance checks. The final Lighthouse release collection followed the
last accessible-logo fix and full55test pass. Prior optimized mobile scores varied
96–97(home) and98–99(services), illustrating ordinary synthetic-run variability;
the table reports the last complete collection, not the highest observed scores.
