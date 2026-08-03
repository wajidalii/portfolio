# Architecture

Personal portfolio for Wajid Ali — senior software engineer. Single-owner,
content-driven, SEO/GEO-critical site. This document records the stack
decisions and why, per the project brief (`docs/BRIEF.md`).

## Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router, TypeScript) | Native SSR/SSG, `generateMetadata`/`sitemap.ts`/`robots.ts` primitives cover the SEO/GEO requirements without extra tooling. Pinned to v15, not the newly-released v16, since v16 ships breaking changes not yet reflected in this environment's training data or in Netlify's adapter maturity — v15 is stable and well-supported. |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) | Design tokens (`src/app/globals.css`) map 1:1 to the mockup's CSS custom properties (`--bg`, `--surface`, `--accent`, etc.), toggled via `[data-theme]` rather than `prefers-color-scheme`, matching the mockup's manual light/dark switch. |
| Fonts | next/font/google — Space Grotesk, IBM Plex Sans, JetBrains Mono | Matches the mockup exactly; `next/font` self-hosts and sets `font-display: swap` automatically (Core Web Vitals requirement). |
| Database | Neon (serverless Postgres) + Drizzle ORM | Two sections were made dynamic (owner-editable without a redeploy) at the owner's request: the Experience/Skills content (in place of a static résumé file, which doesn't exist yet) and a new "Upcoming Projects" section (which replaces the mockup's Résumé section — see below). Neon is host-agnostic serverless Postgres, so it isn't coupled to the Netlify hosting choice below. Drizzle keeps the schema typed and migrations explicit for a small number of tables. |
| Admin auth | Single shared password + signed HttpOnly cookie, `middleware.ts` guard on `/admin/**` | This is a single-owner site — no multi-user auth system is justified. A lightweight password gate is sufficient and avoids pulling in a full auth provider for one editor. |
| Content — static sections | Local TypeScript data files (About, Projects, Testimonials, FAQ) | These change rarely and are owner-curated; a database or CMS would add operational overhead (a data store to keep available, a schema to migrate) for content that's really just code. Kept as local files per the brief's own reasoning against a headless CMS for a low-frequency single-owner site. |
| Content — dynamic sections | Neon-backed (Experience/Skills, Upcoming Projects) | See Database row above. Still server-rendered (no client-only fetch) so crawlers and AI answer engines see the content without executing JS. |
| Images | `next/image` | Responsive, lazy-loaded below the fold, avoids layout shift. Remote project screenshots (thum.io pattern from the mockup) are allow-listed via `images.remotePatterns`. |
| Animation | CSS-only micro-interactions (hover states), no scroll-reveal/count-up library | The prior build of this mockup hit a real bug: timeline-driven scroll-reveal and count-up animations never committed frames in the preview context, leaving content invisible. Rather than reintroduce that class of failure with Framer Motion, content renders opaque and at final values by default; hover/focus states are plain CSS transitions with a `prefers-reduced-motion` fallback. |
| Contact form delivery | Resend | Chosen over SendGrid for simpler Next.js integration and free-tier fit for a low-volume contact form. Submissions are validated client- and server-side and emailed to `wajidalii.me@gmail.com`. |
| Hosting | Netlify | The brief defaults to Vercel; deviated because the owner already has a live placeholder at `wajidali.netlify.app` and wants to keep using it until a custom domain is bought. Netlify's official Next.js runtime supports SSR, ISR, and Image Optimization, so no functionality is lost by this substitution. |

## Content model

- **Static, local data** (`src/content/*.ts`): hero copy, the 6 real projects
  (problem/role/stack/outcome), testimonials/endorsements, FAQ. Edited by
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

## Deferred / not yet decided

- Real domain — currently deployed at `wajidali.netlify.app`, canonical
  URLs and structured data will be updated once a domain is purchased.
