# Architecture

Personal portfolio for Wajid Ali — senior software engineer. Single-owner,
content-driven, SEO/GEO-critical site. This document records the stack
decisions and why, per the project brief (`docs/BRIEF.md`).

## Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router, TypeScript) | Native SSR/SSG, `generateMetadata`/`sitemap.ts`/`robots.ts` primitives cover the SEO/GEO requirements without extra tooling. Pinned to the existing Next15 release to preserve the tested app/hosting integration; framework upgrades are a separate change. |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) | Design tokens live in `src/app/globals.css` (Midnight Atelier dark/light palette, see `docs/atelier/README.md`), toggled via persisted `[data-theme]` (dark default). Token names are shared by the public site and `/admin`. |
| Fonts | next/font/google — Manrope, Inter and Martian Mono | Manrope is display, Inter is body, Martian Mono is the small label face. `next/font` self-hosts with `font-display: swap`. |
| Database | Neon (serverless Postgres) + Drizzle ORM | Two sections were made dynamic (owner-editable without a redeploy) at the owner's request: the Experience/Skills content (in place of a static résumé file, which doesn't exist yet) and a new "Upcoming Projects" section (which replaces the mockup's Résumé section — see below). Neon is host-agnostic serverless Postgres, so it isn't coupled to the Netlify hosting choice below. Drizzle keeps the schema typed and migrations explicit for a small number of tables. |
| Admin auth | Single shared password + signed HttpOnly cookie, `middleware.ts` guard on `/admin/**` | This is a single-owner site — no multi-user auth system is justified. A lightweight password gate is sufficient and avoids pulling in a full auth provider for one editor. |
| Content — static sections | Local TypeScript data files (About, Projects, Testimonials, FAQ) | These change rarely and are owner-curated; a database or CMS would add operational overhead (a data store to keep available, a schema to migrate) for content that's really just code. Kept as local files per the brief's own reasoning against a headless CMS for a low-frequency single-owner site. |
| Content — dynamic sections | Neon-backed (Experience/Skills, Upcoming Projects) | See Database row above. Still server-rendered (no client-only fetch) so crawlers and AI answer engines see the content without executing JS. |
| Images | `next/image` | Responsive local WebP captures with dimensions and below-fold lazy loading. The hero main image is eager. Legacy thum.io allowance remains for retired components, outside the redesigned route tree. |
| Animation | Native CSS transitions/view timelines and native modal dialog | Public content stays visible without JS. Small translations never lower readable contrast; reduced motion disables animation. Retired stage/WebGL and pointer effects are not imported by public layouts. |
| Contact form delivery | Resend | Chosen over SendGrid for simpler Next.js integration and free-tier fit for a low-volume contact form. Submissions are validated client- and server-side and emailed to `wajidalii.me@gmail.com`. |
| Hosting | Netlify | The owner's existing site is hosted on Netlify at `wajidali.dev`; the old Netlify subdomain redirects to the canonical domain. Netlify's official Next.js runtime supports SSR, ISR, and Image Optimization, so no functionality is lost by this substitution. |

## Content model

- **Static, local data** (`src/content/*.ts`): service offers and reviewed project
  evidence, four selected work case studies, a genuine appreciation source and FAQ. Edited by
  changing code and redeploying — appropriate for content that changes on
  the order of months, not days.
- **Dynamic, DB-backed** (Drizzle schema in `src/db/schema.ts`, admin CRUD
  under `/admin`): skill groups, experience/career timeline roles, and
  upcoming projects. Editable from `/admin` without a code change or
  redeploy. Seeded with clearly-marked sample data until real resume facts
  are entered — no fabricated employers or achievements ship to production
  copy.

## Deviations from the mockup (owner-directed)

- The Résumé section and its download buttons (hero, résumé section,
  footer) are **removed**. In their place, a new **Upcoming Projects**
  section (dynamic, admin-editable) occupies that slot in the page flow.
  Rest of the visual design is unchanged.

## Folder structure (target)

```
src/
  app/                # routes, layouts, metadata files (sitemap.ts, robots.ts)
  app/admin/          # password-gated CRUD UI
  app/api/            # contact form route, admin actions
  components/         # design-system primitives + section components
  content/            # static local data (projects, testimonials, faq, hero copy)
  db/                 # Drizzle schema + client
  lib/                # auth, validation, email helpers
middleware.ts          # /admin/** auth guard
```


## Services and client acquisition (2026-11)

The consultancy journey adds a separate `(business)` route group for `/services`
and `/privacy`. Shared navigation/footer/theme retain the portfolio identity,
without loading homepage WebGL/station code on services routes. Offers and
source-backed case evidence are local typed content; the page and schema are SSR.
Six local WebP public-page captures use next/image; no visitor screenshot proxy.

`POST /api/inquiries` composes browser-safe validation, bounded same-origin JSON,
HMAC-keyed durable rate counters and transactional idempotent lead storage. Lead
and counter tables are additive in the existing Neon database. Resend remains
the sole email provider. Persistence precedes delivery, with durable notification
state and private retry; prospect receipts require configuration and separate
consent. New admin reads/actions/export verify the signed session at each handler,
use uncached bounded queries and formula-safe CSV. No private lead is returned
by the public endpoint. Explicit migrations replace db:push for release changes;
legacy baseline adoption is a reviewed one-time operation, not build behavior.

Standalone editable financial documents use local classic JS/CSS and exact BigInt
minor-unit arithmetic, with no database, autosave, financial secrets or external
PDF service. The optional analytics bridge is allowlisted, provider-neutral and
disabled by default. Booking uses a validated owner-configured20-minute public
provider URL, with a working inquiry fallback rather than an invented scheduler.
Tests use Node/tsx, actual disposable PostgreSQL, Playwright/axe and Lighthouse.
Operational setup and evidence limits: [docs/services/README.md](docs/services/README.md).

## Midnight Atelier public redesign

Homepage and business route groups now share a minimal header/footer/conversion
shell. Hero/work/services/process/about/contact are server composition; client
state is limited to navigation/theme and the existing inquiry form. Shared semantic
CSS tokens keep admin/services compatible. Native dialog focus is explicitly
wrapped; Escape/resize restore scroll and focus. Manrope/Inter replace Archivo
without introducing an external font runtime request.

`content/atelier-work.ts` selects reviewed service case records, generating a
`/work` gallery and four static detail routes with factual CreativeWork/Breadcrumb
schema. `/about` reuses existing cached DB queries/admin-managed career/skill/
upcoming data. It omits unsupported wins/sample records, separates personal work,
and avoids any invented experience-duration or current-availability claim. Root
metadata and llms copy no longer make unsupported counts/availability claims.

Below-fold images are lazy and CSS content-visibility defers painting while
keeping crawlable HTML. The main hero preview is eager to protect LCP. No new
backend/schema/provider was introduced. See [Midnight Atelier guide](docs/atelier/README.md)
for theme tokens, component/content architecture, QA and deployment requirements.
