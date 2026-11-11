# Services security review

Review date: 2026-11-11. Scope: new inquiry workflow, private lead operations,
standalone templates, conversion bridge, consultation configuration, migration
runner and the existing sign-in boundary now protecting lead information.
This is a source review and targeted automated verification, not a penetration
test or a compliance certification.

## Remediated finding

The existing login redirect helper accepted a leading slash while only rejecting
`//`. URL parsing normalized `/\\attacker.test` and control-separated `//` inputs
to an external origin. The new `safeAdminRedirect` rejects backslashes/control
characters and allows only same-origin `/admin` paths. Regression tests cover
these inputs and traversal to non-admin destinations.

The sign-in handler now requires an exact same-origin URL-encoded POST, bounds
its body to 4 KiB and password to 256 characters, and applies durable keyed-hash
rate counters before checking credentials. The existing HMAC session mechanism
remains; cookies retain HttpOnly/SameSite=Lax and Secure in production. Missing
secret, rate storage or auth configuration fails closed without raw provider or
database errors. The sign-in rate table requires the new migration and
`INQUIRY_RATE_LIMIT_SECRET` before releasing this version.

## Reviewed controls

- Inquiry JSON is streamed under 16 KiB, validates types/lengths/enums and consent,
  rejects cross-origin browser submissions and keeps errors generic.
- Persistence uses prepared queries, an idempotency key plus transaction/advisory
  lock, bounded DB rate counters and no raw IP storage by default.
- Lead read, mutation and CSV boundaries each verify the signed session in
  addition to middleware. Admin output is React-escaped; exports are no-store,
  capped and spreadsheet-formula escaped. Filters and mutation values are bounded.
- Text-only Resend notifications have durable retry state and stable provider
  idempotency keys. Acknowledgments require explicit prospect opt-in and configured
  sender credentials. Public responses contain no lead ID or private inquiry data.
- The analytics bridge emits only allowlisted event/source values, without form
  values, cookies, URLs or identifiers. It is opt-in and has no bundled remote
  tracking subscriber.
- Booking accepts HTTPS URLs on the allowed scheduling hosts and otherwise falls
  back to inquiry. No private calendar credentials are stored or exposed.
- New templates do not inject editable content as HTML, persist it, or transmit it.
- Security headers cover framing, MIME sniffing, base/object restrictions,
  referrer behavior and device permissions. The CSP is intentionally partial;
  this is not a nonce-based strict script policy for the whole existing site.
- Migration baseline adoption is explicit, not automatic. It checks legacy
  columns/types/nullability and enum labels but is not a complete constraint or
  default equivalence proof. Back up and review a staging diff before adoption.

## Verification performed

- 4 sign-in unit tests passed: redirect normalization, origin/media/body bounds,
  fail-closed configuration/storage, rate rejection, secure cookies and normal
  failed/successful authentication responses.
- 1 real disposable-PostgreSQL integration test passed: global 61st/hour and
  trusted-IP 11th/10-minute attempts rejected, with test counters removed afterward.
- Targeted ESLint and full-workspace TypeScript passed after these changes.
- Root integration verification covers actual browser/admin flows separately.

## Operational limits requiring owner attention

- The global login 60/hour and inquiry 120/hour caps can be deliberately exhausted;
  they are abuse backstops for a low-volume, single-owner service. Configure a
  trusted platform-replaced IP header only if its provenance is guaranteed.
  Host-level firewall limits provide additional defense without trusting arbitrary
  `X-Forwarded-For` values.
- Notification delivery is attempted after durable persistence. A process crash or
  provider failure can leave pending/failed state requiring the private retry
  control; there is no scheduled outbox worker. Provider idempotency is subject to
  the provider's retention window.
- Real Resend delivery, calendar conflict/confirmation setup, production migration,
  credential strength/rotation and data-retention policy require owner-controlled
  configuration and verification. No production credentials were used here.

Final integration replaced new lead mutation server actions with native guarded
POST handling (`admin-handler.ts` and `/admin/leads/mutate`). Review found no
blocking defect; stream errors now return generic400, and unauthorized non-GET
redirects use303. Public no-JS inquiry submission is disabled with email fallback;
its explicit POST action prevents sensitive fields appearing in GET URLs.
