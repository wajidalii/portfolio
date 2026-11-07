# Where the projects list lives

## Source of truth

`src/content/projects.ts` — static, owner-curated TypeScript (see `ARCHITECTURE.md`, content model). Exports:

- `projects: Project[]` — the list (7 entries, in display order)
- `projectFilters` — `["All", "SaaS", "AI", "Enterprise"]`
- `shotSrc(p)` — thum.io screenshot URL (800×500) built from `href`
- `Project` type

Rendered by `src/components/sections/projects.tsx` (filters by `tag`), mounted in `src/app/(site)/page.tsx`.

## Data shape (`Project`)

| Field | Type | Notes |
| --- | --- | --- |
| `name` | string | Title |
| `kind` | string | Display label, e.g. "Building now", "AI / Agents" |
| `tag` | `"SaaS" \| "AI" \| "Enterprise"` | Used by the filter |
| `href` | string | URL, or `#contact` for private/pre-launch |
| `hrefLabel` | string | Link text |
| `figureLabel`, `figureAlt` | string | Caption and alt text for the figure |
| `problem`, `role`, `outcome` | string | Case-study copy |
| `highlights?` | string[] | Optional bullets |
| `stack` | string[] | Technologies |
| `glyph` | string | Card icon character |
| `scene?` | `ScenePreset` | 3D diagram preset (`fanout`, `cluster`) for private projects (`src/components/three/layouts.ts`) |
| `hasShot` | boolean | Derived: `href` starts with `http` |

## Current entries

| # | name | tag | href |
| --- | --- | --- | --- |
| 1 | ReelBridge | SaaS | `#contact` (scene: fanout) |
| 2 | Multi-tenant SaaS HRMS | SaaS | https://mt.wajidali.dev |
| 3 | HRMS — Bin Delamah Contracting Co. | Enterprise | `#contact` (scene: cluster) |
| 4 | Beam AI | AI | https://beam.ai/ |
| 5 | ENBIOSIS | AI | https://enbiosis.com/ |
| 6 | AfterSchool HQ | SaaS | https://afterschoolhq.com/login |
| 7 | iHorizons | Enterprise | https://www.ihorizons.com/ |

## Other places that reference or duplicate the list

- `public/llms.txt` (line 14) — hand-maintained prose list of project names; must be updated manually.
- `ARCHITECTURE.md` (lines 16, 25) — says "6 real projects"; now stale (7).
- `docs/BRIEF.md`, `docs/design-reference/Portfolio.dc.html`, `docs/redesign/design/Main.dc.html` — design/brief copies, not used at runtime.
- `src/content/testimonials.ts` — mentions Bin Delamah Contracting Co. (BDCC); separate data.
- `src/db/seed.ts` — mentions BDCC in experience seed data, not the projects list.
- `src/components/stage/stations.ts`, `site-header.tsx`, `site-footer.tsx` — only the `#projects` anchor.
- `next.config.ts` — allows thum.io for screenshots.
- `src/app/sitemap.ts` — single URL (site root); does not list projects. No per-project metadata.

## Not the same list

"Upcoming projects" are DB-backed (Neon/Drizzle): table `upcoming_projects` in `src/db/schema.ts` (`title`, `description`, `status` planned|in_progress, `tags`, `expectedDate`, `link`, `sortOrder`), queried in `src/db/queries.ts`, edited under `src/app/admin/upcoming-projects/`, rendered by `src/components/sections/upcoming-projects.tsx`.
