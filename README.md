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

## Deployment

Deployed to Netlify (`wajidali.netlify.app` until a custom domain is
purchased) via the official Next.js runtime.
