# Delivery validation and release status

Implementation is prepared for review in the stacked PRs listed in
GITHUB_WORKSTREAMS.md. No merge, production migration or production deployment
was performed. Release requires repository review/protection verification and
owner configuration; this is not a claim of live email/calendar delivery.

## Architecture and delivered features

- Shared Next.js/TypeScript/Tailwind/font/theme identity, separate SSR services
  layout with no homepage 3D runtime; no second DB, form service or email provider.
- Three offers with detailed buyer/problem/deliverable/workflow/FAQ sections,
  PKR45k/95k/175k starting packages and clear scope/revision/quote caveats.
- Nine case records with source context and independent-demo disclaimers; six
  real public screenshots, two unavailable-demo notices and MCPOF evidence limits.
- Accessible qualified inquiry with bounded shared validation, consent, spam/
  keyed durable rate controls, same-origin JSON, transactional UUID idempotency,
  persisted leads and existing Resend notifications/conditional opt-in receipt.
- Configurable real20-minute public scheduling link; default honest inquiry/email
  fallback, keeping the original15-minute portfolio event distinct.
- Private pipeline with eight statuses, notes, UTC follow-ups, filters, pagination,
  counts, CSV, notification retry and confirmed deletion. New boundaries verify
  signed sessions; native POST mutations provide deterministic303 feedback.
- Standalone editable proposal/invoice, print/PDF, PKR/default configurable currency,
  exact BigInt calculations, optional tax/discount and configurable50/30/20 terms.
- Factual Service/Offer/breadcrumb schema, social card, canonical, sitemap/llms and
  homepage/header/footer/project links. Optional allowlisted non-PII event bridge.

## Executed checks

| Check | Actual result |
| --- | --- |
| ESLint | Passed, including generated browser artifacts excluded explicitly |
| TypeScript | Passed |
| Unit tests | 24 passed, 0 failed, 0 skipped |
| PostgreSQL integration | 6 passed including nested checks, 0 failed, 0 skipped |
| Playwright E2E | 16 passed, 0 failed, 0 skipped on final full run |
| Production build | Passed; /services116kB first load JS, page4.66kB in measured build |
| Production dependency audit | 0 vulnerabilities (`npm audit --omit=dev`) |
| Fresh DB migrations + seed | Passed on disposable local database |
| Legacy db:push baseline adoption | Passed on separate existing local database; no production accessed |
| axe WCAG2/2.1/2.2 tagged rules | 0 violations for services in dark/light modes; standalone templates separately passed |
| Responsive layouts | No horizontal overflow at320/375/390/768/1024/1440/1920 |
| Native FAQ keyboard | Focus + Enter opens/closes details in browser check |
| PDF/print | Both standalone documents produced valid PDFs; default samples verified one A4 page by pdfinfo |

The E2E suite covers pricing/canonical/social image, successful form persistence,
client/server rejection, honeypot, actual-route429 limits, idempotency/conflict,
keyboard/focus/reduced motion, no-JS email fallback with disabled POST submission,
responsive form layout, exact invoice UI totals, print/PDF, unauthenticated read/
write rejection and authenticated status/notes/follow-up/export/deletion, existing
homepage access, and allowlisted analytics without field contents. Email delivery
is tested using injected mocks and real DB state; no real email was sent.

Found and fixed during testing: Next Host/origin normalization causing false403,
nonexistent generated social image URL, no-JS default-GET privacy risk, unstable
admin labels, currency ambiguity, unreliable server-action feedback (replaced new
mutations with guarded native POST), existing admin open redirect and missing login
abuse controls. Earlier failed test attempts are not counted as passing.

## Lighthouse

Measurements and environment are recorded in `lighthouse.json` (compact summaries).
Default mobile simulation and desktop preset were measured separately against a
local production Next.js build using system Chromium and Lighthouse13.6.0, with
repository-seeded disposable PostgreSQL and no concurrent build/browser tests.
Optimized local screenshot derivatives may have been warmed by browser QA.
These are lab samples, not production PSI or p75 field Core Web Vitals. INP needs
real interactions/field data; lab TBT is not proof of INP. Deployed checks and
Search Console/CrUX remain release verification. The manual Lighthouse workflow
now includes services and portfolio, mobile and desktop, with explicit budgets.

| Local production route/device | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| /services mobile | 98 | 100 | 100 | 100 | 1.0s | 150ms | 0 |
| /services desktop | 100 | 100 | 100 | 100 | 0.3s | 0ms | 0 |
| / desktop regression | 100 | 100 | 100 | 100 | 0.3s | 0ms | 0 |

## Screenshots

- [Desktop services](screenshots/services-desktop.png)
- [Mobile services](screenshots/services-mobile.png)
- [Desktop inquiry](screenshots/inquiry-desktop.png)
- [Mobile inquiry](screenshots/inquiry-mobile.png)
- [Proposal](screenshots/proposal-template.png)
- [Invoice](screenshots/invoice-template.png)

## Outstanding owner/release checks

1. Verify actual branch protections/review requirements (GitHub integration returned
   HTTP403 on branch protection; no bypass attempted). Review/merge PR stack in order.
2. Back up/diff staging schema, approve baseline adoption where needed, and apply
   the additive migration before serving new routes/login. Existing login now also
   requires INQUIRY_RATE_LIMIT_SECRET and the rate-limit table; missing configuration
   fails closed503. Do not seed production over curated data.
3. Configure strong session/password/rate secrets and verified Resend key/sender;
   verify a real owner notification, reply-to and optional separately consented receipt.
4. Configure a real20-minute Cal.com/Calendly event, or retain the functioning
   consultation-by-email fallback. Provider availability/conflicts/timezones,
   confirmation/reschedule/cancellation workflows were not verified externally.
5. Provide MCPOF implementation evidence before expanding capability claims. STV
   and ReelBridge public demos were unreachable here; source-based descriptions do
   not establish live provider readiness or commercial client outcomes.
6. Review privacy/retention, package terms, legal/tax/payment instructions, and choose
   an analytics subscriber if desired. No analytics provider is connected by default.
7. Re-run deployed Lighthouse and inspect indexing/social links and field metrics.

All issues stay open pending review/release and their explicitly documented external
verification. Automated accessibility is not a full screen-reader or WCAG certification.
Direct file:// template testing was blocked by managed browser policy; standalone
local HTTP operation succeeded. Failed/pending notifications need owner review and
manual retry; no background queue or automatic retention job is implied.
