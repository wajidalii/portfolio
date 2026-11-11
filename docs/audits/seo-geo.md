# SEO and generative search audit — 2026-11-11

Scope: public repository at baseline `5064611`, canonical https://wajidali.dev,
Next.js production build with a disposable PostgreSQL database seeded from the
repository. This is a technical/content audit, not a penetration test or a
Search Console/analytics audit. No production credentials or database used.

## Findings and fixes

- Existing strengths: server-rendered biography/projects/FAQ, descriptive H1,
  canonical, language, social cards, crawlable contact links, sitemap, Person,
  ProfilePage and FAQPage JSON-LD, and an optional `llms.txt` summary.
- Named crawler groups did not inherit wildcard private-path exclusions. Apply
  identical exclusions and include OAI-SearchBot and Claude-SearchBot. Crawling
  permission does not guarantee search inclusion. Robots is not access control.
- Add `noindex, nofollow` to admin metadata including the accessible login page.
- Replace disconnected structured Person entities with stable shared `@id`.
  Keep structured facts consistent with visible content; never add fake ratings.
- Remove generated sitemap `lastmod`: regeneration is not a content edit. Add it
  back only with a reliable content modification source.
- Avoid importing/running decorative WebGL on narrow/coarse-pointer, reduced
  motion or save-data clients. Desktop animation remains progressively enhanced.
- Update Next.js and its ESLint configuration from 15.5.22 to 15.5.29; update
  vulnerable transitive dependencies. Override Next's PostCSS with compatible
  patched 8.5.x; reassess this override on the next framework upgrade.
- Add read-only CI permissions, PR/main validation, disposable database services,
  concurrency cancellation, timeouts, manual production Lighthouse reporting,
  Conventional Commit and issue-linked branch guidance, and a PR template.

## Measurement

Raw Lighthouse 13.6.0 JSON reports are stored beside this document. Default
mobile emulation, simulated throttling, headless system Chromium. Single lab
runs fluctuate and do not establish field Core Web Vitals or ranking gains.
Production and localhost results differ in network path, deployment and data;
use repeated deployed runs after merge for an actual before/after comparison.
An intermediate local run competed with a build and was discarded.

| Metric | Live baseline | Local patched build |
| --- | --- | --- |
| Performance | 91 | 94 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |
| LCP | 1.3 s | 0.9 s |
| Total blocking time | 340 ms | 290 ms |
| CLS | 0 | 0 |

Playwright system-Chromium checks confirmed visible H1/content and zero page
errors at 390px mobile, 1280px desktop, reduced motion, and JavaScript disabled.
The decorative canvas became ready on desktop and remained inactive on mobile
and reduced-motion views. These are smoke checks, not full interaction tests.
Production dependency audit: 0 vulnerabilities. Development-only transitive
advisories remain (including drizzle-kit's legacy esbuild tooling); review
upstream fixes separately rather than forcing a breaking tool downgrade.

## Verification scope

Lint, TypeScript, production build with seeded local Postgres; HTTP checks of
HTML H1/canonical/linked structured data, robots exclusions, sitemap, llms.txt,
and admin login noindex. Lighthouse exercises browser rendering and accessibility.
Email delivery, booking completion, admin mutations and production DB were outside
this change's validation scope.

## Prioritized follow-up

1. After release, run the manual production Lighthouse workflow and inspect HTML
   reports. Track mobile p75 LCP <=2.5s, INP <=200ms and CLS <=0.1 via CrUX/Search
   Console where traffic allows; lab TBT is a diagnostic, not INP.
2. Verify domain ownership in Google Search Console and Bing Webmaster Tools;
   submit https://wajidali.dev/sitemap.xml, inspect canonical/indexing and monitor
   real search queries, impressions, clicks and qualified contact conversions.
3. Publish indexable project case-study routes with original problem/constraints,
   personal contribution, architecture, dated evidence, public demos or code, and
   permissioned, attributable outcomes. Add internal links and sitemap entries.
   This requires owner-verified evidence; do not invent metrics or client claims.
4. Keep role, availability, experience and project facts synchronized between
   visible content, JSON-LD, llms.txt, GitHub and LinkedIn. Provide concise direct
   answers and cite primary sources; `llms.txt` is optional, not a ranking signal.
5. Earn relevant links through useful engineering articles, public work, and
   professional profiles. Avoid bought links, doorway location pages and stuffing.
6. Investigate remaining animation/style-layout costs on real mobile hardware.
   Preserve content visibility without JS and keyboard/reduced-motion behavior.
7. Configure protected-main required CI/review checks in repository settings;
   this PR documents the recommendation without changing administrator policy.
   The integration received HTTP 403 when reading protection, so existing settings
   could not be verified.

Google's FAQ rich-result eligibility is restricted; this portfolio should not
expect FAQ rich results. No technical change can promise a top search position,
indexing, or inclusion/citation in a generative answer.

References: https://developers.google.com/search/docs/fundamentals/seo-starter-guide,
https://developers.google.com/search/docs/appearance/ai-features,
https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt,
https://developers.google.com/search/docs/appearance/structured-data/profile-page,
https://web.dev/articles/vitals,
https://platform.openai.com/docs/bots,
https://www.conventionalcommits.org/en/v1.0.0/.
