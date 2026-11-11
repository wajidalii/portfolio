# Services platform operations

## Structure and content

`src/app/(business)/services/page.tsx` is server rendered in a separate public
layout with the shared header/footer/theme and no homepage WebGL/station runtime.
`src/content/services.ts` controls service descriptions, FAQs and PKR starting
packages; `service-case-studies.ts` controls evidence-backed cases. Package scope,
revision limits, exclusions and final-quote caveats must remain consistent with
written proposals. Do not imply starting prices are unconditional fixed fees.

To add a case, inspect its source and public demo, record the source reference and
visibility in EVIDENCE.md, distinguish client work from independent demonstrations,
and capture only public non-sensitive screens. Place optimized WebP assets under
`public/services/cases`, with dimensions/alt text. Never copy private customer data
or code. Outcomes need evidence; do not invent benchmark deltas. MCPOF has only a
minimal README in the inspected repository and remains owner-described/evidence
pending. Source-backed project tests were inspected, not re-run here.

When changing the privacy notice, update CONSENT_VERSION in
`src/lib/leads/validation.ts` so stored consent remains attributable.

## Lead flow and privacy

The client uses shared validation and sends same-origin bounded JSON to
`POST /api/inquiries`. The server checks types, lengths, enums, consent, origin,
content type/size and honeypot. A transaction stores leads, uses a UUID submission
key for concurrent idempotency, and updates keyed hash-based rate counters. A
changed payload with a previously saved key returns409; a duplicate returns
success without sending again. The form prevents in-flight duplicate clicks.

There is a global cap120/hour and five accepted inquiries per email/hour; optional
trusted IP limiting uses the same lower cap. Global caps can be exhausted by abuse;
use host-level WAF/rate rules in addition to this low-volume application control.
Expired rate hashes are removed during accepted validation paths. No raw IP is
stored. Never configure a trusted header unless your hosting platform strips and
replaces that header before traffic reaches the application. Client-provided
forwarded headers are untrusted by default.

Saving is authoritative: email failure never loses a saved lead or falsely tells
the user their submission failed. Delivery status appears in admin, with private
retry. Resend gets stable idempotency keys; its provider deduplication window still
applies. This is a lightweight synchronous notification + manual retry system,
not a background queue. Review failed/pending notifications regularly. Prospect
acknowledgments require separate explicit opt-in and configured verified sender;
no marketing opt-in is inferred. Email is plain text. Application handlers do not log inquiry contents or return them in public
responses. Configure hosting access-log retention/redaction for private admin
search queries and do not share those URLs. Existing homepage contact messages retain their original flow.

The public `/privacy` notice must be reviewed by the owner before launch. Establish
an appropriate retention/review process for your jurisdiction and contracts. Admin
supports confirmed deletion; there is no automatic inquiry retention/deletion job.
CSV exports contain private data: restrict access, use only when needed and delete
unneeded copies. Never place exports in the public repository.

## Environment and integrations

Use `.env.example` as the inventory; set secrets in the host environment, never git.

| Variable | Behavior |
| --- | --- |
| DATABASE_URL | Existing Neon PostgreSQL database; apply migration before release |
| ADMIN_PASSWORD / ADMIN_SESSION_SECRET | Strong unique owner password and >=32-character random signing secret |
| INQUIRY_RATE_LIMIT_SECRET | Required >=32 random characters; keyed rate identifiers, fail closed when absent |
| RESEND_API_KEY | Existing Resend project for owner notifications |
| CONTACT_FROM_EMAIL | Verified domain sender required for reliable production mail/receipts |
| LEAD_NOTIFICATION_EMAIL | Optional validated owner destination; defaults to existing owner address |
| INQUIRY_ACKNOWLEDGMENTS_ENABLED | Defaultfalse; verified non-sandbox sender and explicit visitor consent required |
| INQUIRY_TRUSTED_IP_HEADER | Optional platform-controlled header; leave empty unless hosting guarantee is verified |
| CONSULTATION_BOOKING_URL | Real free20-minute event on Cal.com/Calendly; blank/invalid uses inquiry fallback |
| NEXT_PUBLIC_CONVERSION_EVENTS_ENABLED | Defaultfalse; optional local allowlisted conversion event bridge |

Consultation setup: create a real20-minute event, connect availability and conflict
calendars, set location/time zone and provider confirmation/cancellation emails,
and test two overlapping bookings. Put its public HTTPS event URL into the server
variable. The site uses a normal external link, no tracking embed or calendar
credentials. Until configured, the CTA explicitly requests a free20-minute call
by inquiry and a time is arranged by email. The portfolio's pre-existing15-minute
booking link remains a distinct event.

No real email, private calendar or production DB credentials were available to this
build. Mocked delivery and database persistence are tested; verified sender delivery,
reply-to, spam placement, acknowledgments and provider booking must be checked by
the owner in staging. Do not describe an unconfigured provider flow as operational.

## Migration-first deployment

1. Review stacked PRs in order (GITHUB_WORKSTREAMS.md). Require CI and applicable
   reviews. Branch-protection read returned HTTP403; this is not approval to merge.
2. Back up the existing DB; test a restored copy. Fresh environments: set DATABASE_URL
   and run `npm run db:migrate`, then optional `npx tsx src/db/seed.ts` for local/demo
   content. Never seed over curated production content as a deployment step.
3. Existing databases originally created using db:push need explicit adoption:
   `npm run db:migrate -- --baseline-existing` on the reviewed staging copy first.
   It checks baseline columns/types/nullability/enum then records initial history
   and applies the additive0002 migration. It does NOT prove constraint/default/
   sequence equivalence. Review a schema diff and back up before approval. If history
   already exists, omit that flag. The operation is explicit, never run in builds.
4. Provision secrets/mail, review privacy/prices/case claims and optional20-minute
   booking. Apply the reviewed migration to production through your release process
   before deploying routes that depend on it. No production migration was run here.
5. Build `npm ci && npm run build`, deploy through existing Netlify integration.
   Services HTML is static: booking/ack configuration changes require rebuild.
6. Smoke test a real staging inquiry, owner notification, optional receipt, admin,
   export and confirmed deletion. Re-run deployed mobile/desktop Lighthouse and
   inspect canonical/sitemap/social image and Search Console indexing.

Rollback: roll back the application deployment first, retain additive lead tables
and migration history to avoid losing inquiries, and restore data only from a
reviewed backup process. Do not drop the lead table as an automatic rollback.

## Analytics

No analytics provider existed in the app. The optional browser bridge dispatches
`portfolio:conversion` with exactly `{event, source}`. Event names:
services_page_viewed, service_cta_clicked, inquiry_started,
inquiry_submitted_successfully, booking_cta_clicked, proposal_requested.
Source is a broad allowlisted category, never a URL/name/email/lead ID/budget or
form content. There are no built-in network requests, cookies or sessions.

An approved subscriber may forward these anonymous events to an owner-selected
analytics solution; review provider retention and consent requirements first.
Example: `window.addEventListener('portfolio:conversion', event => {/* forward only
validated event.detail.event and event.detail.source */})`. Do not forward arbitrary
DOM/query values or form fields. Disabled by default, including external sending.

## Testing

Install dependencies, start disposable local PostgreSQL, apply migrations and seed.
`npm run lint`, `npm run typecheck`, `npm run test:unit`,
`TEST_DATABASE_URL=... npm run test:integration`, then `npm run build`.
Unit tests cover contracts, headers, consent, rates, idempotency, mocked mail,
booking, analytics allowlisting, safe CSV/filter/date parsing and exact money math.
Integration tests use actual isolated PostgreSQL rows and mocked email delivery.
Use an isolated DB: integration tests clean their own synthetic rows; browser
submission fixtures remain until the test database is discarded.

For browser tests: `npx playwright install chromium`, start the production server
with the documented test-only env (see CI), then `npm run test:e2e`.
For system Chromium set CHROMIUM_PATH=/usr/bin/chromium. Stateful E2E tests refuse
non-local origins. E2E_BASE_URL defaults to http://127.0.0.1:3000. Enable the optional
conversion bridge at build time for its browser event test. CI uses test-only
secrets and no Resend key, so no real messages are sent. Browser traces may contain
synthetic test data; never record real inquiries in committed artifacts.

See TEMPLATES.md for independent proposal/invoice editing, print/PDF, configurable
payments/currency/tax and exact monetary calculation behavior. The templates require
no admin/database, browser storage or external providers. Financial instructions
are user-entered, not public source data. Review commercial and tax terms yourself.

## Manual release checklist

- [ ] Owner reviews service scope/prices, project evidence and independent-demo labels.
- [ ] Supply MCPOF implementation evidence before describing runtime capabilities.
- [ ] Verify repository protections/reviewer requirements; merge reviewed stack in order.
- [ ] Back up DB, diff restored schema, test normal/legacy baseline migrations on staging.
- [ ] Set strong owner/session/rate secrets; use production TLS and host abuse controls.
- [ ] Verify Resend sending domain, owner destination, reply-to, optional consented receipt.
- [ ] Confirm persisted lead and delivery states; test notification retry with real staging mail.
- [ ] Configure real20-minute event or retain honest consultation-by-email fallback.
- [ ] Test provider conflict calendar, timezone, cancellation/reschedule and confirmation.
- [ ] Review privacy/retention process and delete a synthetic test lead/export securely.
- [ ] Review proposal/invoice terms and applicable tax; print a real local copy without
      putting bank/client details into source control.
- [ ] Decide whether to connect the optional anonymous event bridge to analytics.
- [ ] Inspect deployed mobile/desktop Lighthouse, social card, sitemap and canonical URLs.
- [ ] Use CrUX/Search Console or appropriate RUM for p75 LCP/CLS/INP once traffic permits.
