# Midnight Atelier

The redesign turns the homepage into a client-first engineering consultancy
experience while retaining separate paths for hiring managers and developers.
Existing inquiry, database, email, admin and standalone financial templates are
unchanged. See [plan and audit](PLAN.md), [workstreams](workstreams.json), and
[validation](VALIDATION.md) for implementation and measured release evidence.

## Design and component architecture

All tokens live in `src/app/globals.css`. The existing semantic token names
(`--bg`, `--surface`, `--text`, `--muted`, `--accent`, `--accent2`, `--border`)
continue to serve services and admin; `--control-border` provides a stronger
visible boundary for inputs and outlined controls. Do not use decorative borders
alone to identify interactive controls. Dark/light values follow the brief;
foreground/accent pairings are verified in automated browser contrast checks.

| Token | Dark | Light |
| --- | --- | --- |
| Background | #0B1020 | #F7F9FC |
| Surface | #151E32 | #FFFFFF |
| Text | #F4F7FB | #101828 |
| Muted | #A7B4CC | #526078 |
| Accent | #7C9BFF | #405CE8 |
| Secondary | #4DE0C4 | #087E73 |
| Border | #29344C | #E2E8F0 |
| Control border | #657693 | #738098 |

Manrope (display), Inter (body) and existing Martian Mono (small labels) are
self-hosted at build time through `next/font`, with swap and system fallbacks.
Manrope uses a focused 600 weight and mono uses 400 without a width axis; mono
is not preloaded, preserving priority for body/display text and the main image.
Display sizes use clamp; layouts use responsive grids and a consistent space
scale. No new CSS or animation framework is installed. The retired palette
picker no longer modifies the public palette. Stored dark/light preference still
applies before first paint; localStorage-denied environments remain usable.

`components/atelier/primitives.tsx` supplies the server Section and instrumented
ProjectLink; shared header/footer/theme switch serve all public pages. Reusable
atelier-card/button/grid/heading/tag/process styles are centralized. Static
server composition avoids a large client home component. The existing Button
and field components remain compatible with admin. Native details remain the FAQ
pattern on services; a native modal dialog handles mobile navigation with explicit
Tab looping, Escape/backdrop/link closure, scroll locking and focus restoration.

## Routes and content

| Route | Purpose |
| --- | --- |
| `/` | Benefit hero, authentic project composition, work, three services, process, about/letter, client/recruiter CTA |
| `/services` | Existing offers/pricing, detailed evidence, consultation fallback and secure inquiry |
| `/work` | Curated project gallery |
| `/work/hrms` | Personal multi-company HRMS, separate from employer history |
| `/work/knowledgecity` | Unofficial independent redesign |
| `/work/mortgage` | Technical assignment, calculations/evidence boundaries |
| `/work/cloudcard` | Unofficial independent redesign |
| `/about` | Approach, owner-managed career chronology/skills/upcoming, recruiter path |
| `/privacy` | Existing inquiry privacy notice |
| `/admin/**` | Existing owner-only operations, unchanged data contracts |

`content/atelier-work.ts` selects records from `service-case-studies.ts` so the
homepage, gallery and case studies share the existing evidence ledger. Add a
reviewed case record with a real image, slug, source limits and factual scope;
then select it in atelier-work. Detail pages and sitemap generate from that list.
Independent demonstrations must retain their disclosures. `/about` uses existing
cached database queries/admin CRUD. It shows dates/company/title/location, not
unverified wins or sample roles. No migrations or new data model are introduced.
Review upcoming content in admin; titles/descriptions tagged sample/placeholder
are filtered from this public presentation. Personal HRMS is not employer-owned.

Prices and service scopes remain in `content/services.ts`. Six existing local
WebP captures remain in `public/services/cases`. Replacing a capture must never
expose authenticated HR data. There is no résumé file: recruiter links lead to
experience/email, not a fake download. Current availability is discussed directly,
not inferred from old dates. One genuine appreciation excerpt links the original
letter; draft peer endorsements and unsupported counts are not rendered.

## Performance and accessibility

The hero is SSR, visible without JavaScript or entrance gates. Its main real
project image is deliberately prioritized; all lower project images are lazy.
Next Image supplies dimensions/responsive sizing. CSS content-visibility defers
safe below-fold painting, and focus-within/print restores visible content.
Native view-timeline reveals use a short translation only; content never fades
below readable contrast. Reduced motion disables transforms/transitions/reveals.
No scroll interception, continuous timers, canvas stage, WebGL or calendar embed
is imported by the redesigned public route tree. Legacy source/dependencies stay
available for older components but do not enter these route bundles.

Keyboard order, modal behavior, labels, skip links, focus rings, touch sizes,
contrast and both themes are covered by Playwright/axe. Automated checks are a
quality gate, not a WCAG certification; manual assistive-technology checks remain
part of release review. Nine widths from 320 to 1920px are checked on all key
routes. Static rendering, semantic headings, factual schema, canonical/social
metadata, sitemap and llms content preserve crawlable context.

## Conversion events and privacy

The existing default-off browser CustomEvent bridge remains the only analytics
implementation. `NEXT_PUBLIC_CONVERSION_EVENTS_ENABLED=true` is a build-time
opt-in, not an external analytics provider. Events carry exactly `{event,source}`
from allowlists. No form text, URLs, customer identifiers or cookies are sent.
New events: `hero_primary_cta_clicked`, `project_case_study_clicked`; existing
service/inquiry/booking/proposal events remain. `resume_downloaded` is a reserved
allowlist name only: no download exists or event is emitted until a genuine file
is supplied. Sources add home/hero/work/about/contact. Installing a subscriber
requires reviewing its privacy behavior and updating the notice as needed.

## Test and screenshot workflow

Use existing setup in [services operations](../services/README.md) for a disposable
Postgres database and test-only secrets. Never run stateful tests against a real
production database. Run lint, typecheck, unit/integration, production build,
then Playwright against that local production server.

```bash
npm run lint
npm run typecheck
npm run test:unit
TEST_DATABASE_URL=postgres://... npm run test:integration
DATABASE_URL=postgres://... NEXT_PUBLIC_CONVERSION_EVENTS_ENABLED=true npm run build
# Start with the existing test-only admin/rate secrets in the environment.
npx playwright install --with-deps chromium
NEXT_PUBLIC_CONVERSION_EVENTS_ENABLED=true npm run test:e2e
```

Four committed viewport snapshots cover desktop/mobile and dark/light hero.
Full-page after captures complement the old production captures. Review the
intentional redesign against before/after; never blindly update golden images.
To regenerate after an approved visual change, run the snapshot tests with
`--update-snapshots`, then rerun without it. Use the lockfile-pinned Playwright browser for canonical snapshots, with
`CHROMIUM_PATH` unset. The system browser remains useful for exploratory tests
and Lighthouse, but is not the golden-image reference. CI pins Ubuntu 24.04,
locale en-US, UTC and deviceScaleFactor 1. Exact viewport, fonts/all hero images
and reduced motion stabilize captures; the unchanged small tolerance accounts
for rasterization. Hosted
CI browser rendering must still be checked before merge. Screenshot artifacts
contain only public portfolio content and synthetic inquiry data.

## Release and configuration

No deployment or merge is performed by this redesign task. Review focused PRs in
dependency order and respect current repository policies/checks. Netlify remains
the host; no Vercel migration or new provider account is needed. Build-time font
downloads require access to Google's font endpoints; fonts serve locally to users.

There are **no new environment variables or database migrations** for the redesign.
The prior services release still requires migration 0002 and strong
`INQUIRY_RATE_LIMIT_SECRET` before inquiry/admin login work. Configure existing
`DATABASE_URL`, admin secrets, Resend verified sender and optional genuine
`CONSULTATION_BOOKING_URL` as documented. With no scheduler URL the existing
inquiry/email fallback is usable; it is not represented as online booking.

Review content/prices/letter attribution with the owner; verify actual email,
production environment/migration and real scheduler outside mocked tests. After
deployment run mobile/desktop Lighthouse on the live URL and monitor field CWV.
Local synthetic results cannot establish real-user p75 LCP/CLS/INP or search rank.

## Before and after

The baseline uses instrument labels/stations and a predominantly recruiter-facing
hero. Midnight Atelier replaces that first impression with a benefit headline,
two clear project/work actions and real layered screenshots. Selected work leads
to substantive evidence-backed case pages; three offers and a concise process
lead to the existing qualified inquiry. Career depth moves to `/about`, and the
recruiter path remains explicit. Outdated availability and unsupported metrics,
placeholder visuals and draft peer endorsement cards leave the public journey.

[Before desktop](screenshots/before/desktop.png) ·
[Before mobile](screenshots/before/mobile.png) ·
[After desktop](screenshots/after/home-desktop-dark.png) ·
[After mobile](screenshots/after/home-mobile-dark.png)

The security boundary remains the existing server-validated, rate-limited inquiry
endpoint and signed owner session. New public routes do not accept private data,
perform server-side fetches of admin-supplied project URLs, or expose lead records.
Case metadata is sourced from reviewed local records; external optional links are
HTTPS-only without embedded credentials. Existing security headers are retained;
the existing partial CSP is not described as a complete strict CSP deployment.
