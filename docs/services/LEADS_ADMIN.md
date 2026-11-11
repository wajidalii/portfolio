# Private services lead operations

`/admin/leads` extends the existing single-owner admin, database and signed-cookie
session. No public lead list or additional CRM is introduced. All new page reads,
server-action mutations and the CSV route verify the session at their boundary;
existing middleware provides an additional check. Do not share the admin password.

## Workflow

New → Contacted → Qualified → Discovery Scheduled → Proposal Sent → Negotiating →
Won / Lost. Status changes are manual: a quote click is not a sale and an inquiry
requesting a call is not a confirmed booking. The owner updates notes and a UTC
follow-up date after reviewing the inquiry. The overview counts all statuses;
the due count excludes Won/Lost. Search, status, service, source and budget filters
apply to the list and export. Queries are parameterized and wildcard search is
escaped. The list uses 25 records/page, bounded at 1000 pages.

Email notifications are independent of lead persistence. Pending/failed messages
can be retried privately; the dashboard shows the provider-delivery state and
attempt count. Resend receives stable idempotency keys. A stale sending claim is
retryable after ten minutes. Provider idempotency windows are finite, so inspect
delivery records before repeated manual retries much later. Acknowledgments need
separate prospect consent and explicit verified-sender configuration; they are
not a marketing subscription and contain no project-description echo.

## Export and privacy

`/admin/leads/export` exports up to the 1000 newest matching rows. This is an
explicit download with `private, no-store` headers, not a public artifact or
analytics feed. Cells are quoted and formula prefixes neutralized even after
whitespace/control characters. Treat CSV files as customer data: use encrypted
storage, limit sharing, and delete working copies when no longer required.

Lead cards contain a privacy/retention section. Permanent deletion requires an
explicit confirmation checkbox; the signed-session server action validates that
confirmation. Deleting removes the inquiry and internal notes from the application
DB. It does not erase email already delivered through Resend or independently
saved CSV copies. Follow your documented retention schedule and deletion process
for those systems and backups as well. No automatic legal retention period is
assumed by the application.

## Release checks

Apply the additive Drizzle services migration before enabling inquiries. Configure
strong `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` and `INQUIRY_RATE_LIMIT_SECRET`;
verify sender/domain in Resend and set `CONTACT_FROM_EMAIL`. Keep prospect
acknowledgments disabled unless the sender is verified and the owner approves.
Check unauthorized page, export and mutation rejection, then sign in and test
search, filters, status/notes/date persistence, CSV and confirmed deletion using
synthetic data. Never use real customer inquiries as test fixtures or screenshots.

Tests: `tests/leads-admin.unit.test.ts` covers field parsing, calendar dates,
UUIDs, query bounds, literal wildcard search and CSV injection. Integration tests
require an explicit disposable `TEST_DATABASE_URL` and cover actual filtered reads,
updates, export content and deletion. Browser tests must cover the signed-session
boundary and actual forms; unit tests alone do not prove authorization.

## Final browser integration

New lead mutations use native POST `/admin/leads/mutate` with session, Origin,
media/body, ID/status/date and deletion-confirmation checks, followed by explicit
HTTP303 feedback. This replaces the initial server-action implementation after
browser testing found unreliable same-path action redirect feedback. It also
keeps private editing progressively usable without JavaScript. Middleware uses
303 for unauthenticated POSTs to avoid forwarding private bodies to login.
