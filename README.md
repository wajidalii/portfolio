# portfolio

Wajid Ali's personal portfolio — senior software engineer, scalable systems
and AI-first products. Next.js (App Router) + TypeScript + Tailwind CSS,
built for SEO and AI-answer-engine discoverability (GEO).

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for stack decisions and folder
structure, and [`docs/BRIEF.md`](./docs/BRIEF.md) for the original project
brief. The source design mockup lives in
[`docs/design-reference/`](./docs/design-reference/).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string (skills, experience, upcoming projects) |
| `ADMIN_PASSWORD` | Gates `/admin` |
| `ADMIN_SESSION_SECRET` | Signs the admin session cookie |
| `RESEND_API_KEY` | Contact form email delivery |
| `CONTACT_FROM_EMAIL` | Optional — overrides the contact form's "from" address once a custom domain is verified in Resend |

## Deployment (Netlify)

Served at `wajidali.dev` (the old `wajidali.netlify.app` address
301-redirects there), via the official `@netlify/plugin-nextjs` runtime (already configured in
`netlify.toml`). This requires your Netlify account, so it isn't something
that gets done from this repo alone:

1. In the [Netlify dashboard](https://app.netlify.com), **Add new site →
   Import an existing project**, and connect the `wajidalii/portfolio`
   GitHub repo. Netlify auto-detects the build command from
   `netlify.toml`.
2. Under **Site configuration → Environment variables**, add
   `DATABASE_URL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, and
   `RESEND_API_KEY` (see the table above) — production values, not the
   local dev ones in `.env.local`.
3. Deploy. Once it's live, verify the contact form end-to-end (a real
   send wasn't verified during development — see PR #27) and re-run
   Lighthouse against the live URL rather than localhost.

## Engineering services and client acquisition

`/services` offers website packages, discovery-priced software/automation, real
project evidence and a qualified inquiry flow. It reuses this site's fonts/tokens,
Neon/Drizzle, Resend and owner admin. `/admin/leads` manages the private pipeline.
Standalone editable proposal/invoice documents live at `/templates/proposal.html`
and `/templates/invoice.html` with browser print/PDF support.

Read [Services operations](docs/services/README.md),
[Implementation plan](docs/services/IMPLEMENTATION_PLAN.md),
[Evidence ledger](docs/services/EVIDENCE.md),
[Templates](docs/services/TEMPLATES.md), and
[GitHub workstreams](docs/services/GITHUB_WORKSTREAMS.md).

Use `npm run db:migrate` with a reviewed migration history; do not use `db:push`
as the production release process. Existing db:push-created databases need the
explicit backup/staging baseline procedure in the services guide. New lead routes
require a strong `INQUIRY_RATE_LIMIT_SECRET`; verified mail and a real20-minute
booking event need owner configuration. Without booking configuration the page
remains useful through an email-arranged consultation/inquiry fallback.

Checks: `npm run lint`, `npm run typecheck`, `npm run test:unit`,
`TEST_DATABASE_URL=... npm run test:integration`, `npm run build`, and
`npm run test:e2e` against a disposable local production server. See the services
guide for exact setup and limits; real-provider delivery is a separate release check.
