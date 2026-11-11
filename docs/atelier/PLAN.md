# Midnight Atelier implementation plan

## Baseline audit — 2026-11-11

Inspected main at 8062378, README/ARCHITECTURE, public and admin routes,
components/content/assets, Tailwind CSS-first tokens, theme persistence, Next
metadata/schema/sitemap, Neon/Drizzle/Resend handlers, tests and CI. Next 15.5.29,
React 19.1, Tailwind 4; no animation framework. Main is default; no designated
development branch. No open PRs; services issues #72–85 track previous release
conditions and must not be duplicated or silently closed. Older feature refs
are unrelated. Branch metadata currently reports main unprotected; no direct
main commits will be made.

Current homepage uses stage/WebGL and engineering-metaphor stations, wide
instrument typography, palette controls, continuous scroll geometry reads and a
separate services visual language. Header/mobile navigation lacks full focus
management. Footer availability date is stale. Static home/about metrics (40x,
99.98%, paid product counts/team size) lack cited evidence; peer endorsement
wording is explicitly draft. Public replacements will omit these claims. Existing
appreciation letter is a source-backed credibility artifact. Personal HRMS must
remain distinct from employer work. No resume file or verified current calendar
availability exists; use recruiter email and configured consultation fallback.
Project imagery already includes six local optimized WebP captures. Existing
services evidence ledger distinguishes independent redesigns and unavailable demos.

Existing secure inquiry processing/admin, database migrations, Resend delivery,
financial templates and deployment requirements will be preserved. New design
must not change their data contracts. No second database, form/email provider,
CSS/animation framework, invented testimonials, client relationships or metrics.

Production desktop/tablet/mobile screenshots are captured in this audit before
UI changes; measured results and any browser errors will be recorded separately.

## Architecture and implementation sequence

1. Document audit/plan; create milestone and 16 scoped issues.
2. Conversion-critical: centralized Midnight Atelier dark/light tokens; next/font
   Manrope + Inter and existing mono; accessible shared navigation; SSR hero,
   optimized real product composition, selected work, services and contact CTA.
   Replace homepage station runtime imports, retain backend/admin functionality.
3. Supporting: four-step process, concise about/recruiter path, factual letter
   attribution; index/detail case studies and about with existing career dates;
   reuse existing services with visual integration and internal links.
4. Quality: subtle CSS hover/reveal progressive enhancement, reduced-motion;
   privacy-safe allowlisted conversion events; metadata/schema/sitemap updates;
   responsive + keyboard + theme + axe + flow tests and production Lighthouse.
5. Document actual results/screenshots/configuration/release checks; focused PRs
   linked to issues, no merge/deployment within this assignment.

## Design decisions

Dark #0B1020 / surface #151E32 / text #F4F7FB / muted #A7B4CC /
accent #7C9BFF / teal #4DE0C4 / border #29344C. Light #F7F9FC /
white / #101828 / #526078 / #405CE8 / #087E73 / #E2E8F0.
Contrast will be tested; meaningful control boundaries may use stronger tokens.
Keep existing token names for admin/services compatibility. Retire palette
selection from public UI, keep dark/light storage. Body Inter, display Manrope,
monospace Martian Mono, self-hosted by Next. Fluid typography, generous spacing,
subtle shadows, no scroll hijacking/constant animation. Hero server-rendered and
visible without JS; primary image eager, below-fold images lazy. Offscreen
content-visibility where safe, no lazy loading of critical text.

## Verification and release policy

Run lint/types/unit/integration/build and existing + new Playwright flows against
a disposable localhost production server. Test widths 320/375/390/430/768/1024/
1280/1440/1920, both themes, native dialog keyboard/escape/focus return,
reduced-motion, no hydration/console errors, no overflow, semantic metadata and
case links. Capture before/after, run axe and separate mobile/desktop Lighthouse.
Performance targets are objectives, not guarantees; no field p75/INP claim.
Record failed/blocked checks honestly. Preserve required existing migration,
INQUIRY_RATE_LIMIT_SECRET, verified email and optional real booking configuration;
no production data mutation or real inquiry/email during tests.

Baseline production browser inspection completed at 1440, 768 and 390 pixels.
All three had no horizontal overflow or uncaught page errors. Full-page captures
are in `screenshots/before/`. This is a visual/functional baseline, not a new
production Lighthouse measurement. Existing local reports are historical only.
Milestone: https://github.com/wajidalii/portfolio/milestone/3 ; issues #92–107.
