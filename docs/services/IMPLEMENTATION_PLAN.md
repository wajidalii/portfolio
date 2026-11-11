# Portfolio Services & Client Acquisition Platform

Status: implementation prepared in stacked PRs; see VALIDATION.md for actual checks and release limits. No production deployment or merge authorized by this document.

## Inspection baseline

Base: main (9c9e2d6); main is the default branch. No designated development
branch; historical feature branches exist. No open PRs at inspection. Issue #69
tracks previous technical SEO work, not this client acquisition scope.
Next.js 15.5.29 / React 19 / TypeScript, Tailwind v4 tokens, Archivo + Martian Mono,
light/dark palettes and lightweight native motion. Preserve that visual identity.
Existing site layout includes homepage-specific WebGL/station navigation, so
services will use a separate public layout with shared header/footer/theme but
without loading homepage 3D. Public copy stays server rendered.

Persistence: existing Neon PostgreSQL / Drizzle. Existing contact form persists
messages then calls Resend. It lacks maximum lengths, durable rate limits and
spam controls; new leads will use a separately validated workflow in the same DB.
Admin auth: signed HttpOnly cookie; middleware alone must not be relied on for
new actions/routes: each new private handler verifies the session. No new auth
provider, database, form service, styling framework or email provider.
No existing analytics provider found. Add opt-in provider-neutral, allowlisted
conversion events without PII, cookies or form contents; do not imply tracking
is enabled without an external integration.
Existing Cal.com event is 15 minutes. Do not relabel it as 20 minutes. Provide a
validated configurable 20-minute event URL with an honest inquiry fallback.
No unit/integration/E2E test harness currently. Add Node/tsx tests and Playwright
with axe for meaningful security, calculation, persistence and browser coverage.

## GitHub delivery and dependencies

Create the named milestone and all fourteen scoped issues before feature code.
Use conventional commits and issue-linked descriptive branches. Deliver focused,
stacked PRs: requirements → public services/lead workflow → document templates →
operations/admin → validation/documentation. Dependencies are explicit; no direct
main commits, force pushes or automatic merging. Branch-protection read returned
HTTP 403, and rulesets list was empty: review/protection requirements cannot be
fully verified. Leave PRs unmerged for owner review; do not bypass checks.

## Phase 1 — acquisition MVP

1. Curated services data: website tiers from PKR 45,000 / 95,000 / 175,000,
   bounded deliverables/revisions, final quote caveat; SaaS and automation discovery.
2. Server-rendered /services: benefit hero, three offers, pricing, verified work,
   process, native FAQ, primary consultation + project inquiry CTA.
3. Evidence ledger for every project: owner assertions vs repository/live evidence,
   independent redesign disclaimers, unavailable information explicit. No invented
   stacks/outcomes. Capture local optimized screenshots when the public app loads;
   use honest designed previews rather than fabricated product screenshots otherwise.
4. Validated inquiry POST workflow: strict field enum/length/type limits, same-origin
   JSON requests, bounded payloads, honeypot, persistent DB-backed rate limits with
   keyed hashes, idempotency, consent version, generic errors. Persist before email;
   explicit notification state and authenticated retry avoid pretending a failed
   email means a lost lead. Server-rendered email/contact fallback if JS unavailable.
5. Reuse Resend, text-only templates, no PII in logs. Prospect acknowledgment is
   off by default; only enabled with configured verified sender and separate consent.
6. Navigation: all homepage fragment links become /#anchors, add services and quote
   links in shared header/footer/home project surfaces. Preserve existing contact.
7. Standalone editable proposal/invoice templates: local/browser only, print/PDF,
   PKR default, decimal-safe minor units, configurable milestones, no public bank data.

## Phase 2 — conversion and verification

Unique metadata/social image, canonical, breadcrumbs and accurate Service/Offer
JSON-LD; sitemap + llms links. Preserve crawler rules. Privacy notice and opt-in
allowlisted event bridge. No client PII analytics. CSS-native progressive motion,
visible SSR copy, below-fold image/render deferral, keyboard/focus and reduced motion.
Run lint/types/unit/integration/E2E/build/axe and mobile/desktop Lighthouse.
Inspect widths 320/375/390/768/1024/1440/1920, light/dark and no-JS fallback.
Measure actual lab results; field p75 CWV needs production traffic/CrUX and cannot
be established from a local run. Current mission targets >=95 Lighthouse; preserve
prior desktop >99 objective where feasible and report results without guarantees.

## Phase 3 — operations

Lightweight authenticated leads dashboard in existing admin: paginated search,
filters, statuses, notes, follow-up date, safe CSV export, basic pipeline counts
and failed notification retry. Guard all reads/actions/exports, no public lead data.
Explicit migrations and migration runner; never modify a production schema here.

## Deployment and owner configuration

No production credentials available. Use disposable local Postgres and mocked
email for validation. New schema must be migrated in a controlled release before
routing lead traffic; provision strong secrets and verified Resend sender. Configure
a real 20-minute booking event (availability/conflict calendar/confirmation emails
are managed by the scheduling provider), retention policy and optional analytics
subscriber. Owner must review evidence, pricing, taxes/payment terms and privacy
notice before launch. Final report distinguishes completed implementation from
unverified live email, real bookings, production migration and field measurements.
