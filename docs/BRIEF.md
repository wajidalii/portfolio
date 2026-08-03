You are building a production personal portfolio website for me — a senior software
engineer with 4.5+ years of experience in scalable systems, SaaS products, and AI-first
applications — from the ground up, in this repository. I'm attaching/pasting the HTML
design mockup and its accompanying hex/font/detail summary below (from a prior design
pass) — treat it as the source of truth for visual direction, page structure, color
palette, typography, and component behavior. This is a static mockup, not the production
codebase — rebuild it properly in the chosen stack below rather than shipping the raw HTML
as-is. Follow it closely; where it's ambiguous, make a sensible decision and note it.
REMOVE THE RESUME SECTION AND BUTTONS. KEEP THE DESIGN SAME. CREATE A SECTION WHERE I CAN UPCOMING PROJECTS LIST. KEEP IT DYNAMIC.
We've been building Wajid Ali's portfolio — a single-page design (`Portfolio.dc.html`) with dark/light toggle, project filtering, sticky nav, contact form validation, and a skills matrix. The site is feature-complete and visually stable.

We fixed a critical rendering issue: the original scroll-reveal animations and count-up stats depended on timeline-driven CSS that never committed frames in this context, leaving content invisible. We removed animation from the paint path entirely — all content now renders opaque by default, stat numbers print synchronously at their exact values (4.5+, 99.98%, 40×, 12), and micro-interactions on cards remain as state-driven hovers.

**Current state:**

Six real projects are live and filterable: iHorizons (C# / .NET / ASP.NET Core / SQL Server), AfterSchool HQ (same stack), Beam AI (Next.js / NestJS / Nango / n8n), ENBIOSIS, HRMS (Saudi Arabia, Bin Delamah Contracting Co.), and ReelBridge (React / Express / BullMQ monorepo, pre-launch). Four public projects pull live site screenshots; ReelBridge and HRMS use placeholders pending your screenshots.

Endorsements section is real: BDCC appreciation letter (28 Sep 2025) with two verbatim excerpts, plus three peer endorsement cards (Mohammad Tharwat, Ali from Beam, Aftaab Sonday). The wording in the peer cards is draft — they should review before going live.

[files: Portfolio.dc.html, support.js] exist in the design folder.

CONTENT SOURCES
- My resume(s) are attached/available in the repo — use them as the source of truth for
  experience, roles, dates, and skills copy. Do not fabricate achievements or employers.
- real project links (live apps, repos, case studies) for the Projects
  section are added in the design — build the section's structure and data model now; treat actual project
  entries as content to slot in (ask me for the list if the section is about to ship
  without it, rather than inventing placeholder projects).
- Use any relevant memory you have about me (my stack preferences, working style, past
  projects mentioned in other conversations) to inform copy tone, but the resume is
  authoritative for facts.

GOAL
The site must do three things well: (1) convince a technical recruiter/hiring manager of
my seniority within 30 seconds, (2) rank in search for relevant terms, and (3) be the
profile that AI assistants and answer engines surface when someone asks them to
recommend a senior software engineer for scalable systems / SaaS / AI-first application
work.

TARGET REGIONS
Optimize discoverability (search + AI recommendation) for: Gulf countries (UAE, Saudi
Arabia, Qatar, Kuwait, Oman, Bahrain), Pakistan, USA, UK, and Malaysia. This should be
reflected in metadata, structured data (areaServed / availability framing), and keyword
targeting — not in separate localized page copy or RTL support unless you judge it
genuinely adds value (ask me if unsure).

TECH STACK & ARCHITECTURE — decide and justify, then proceed
Choose and justify a stack appropriate for a fast, SEO/GEO-critical, content-driven
personal site (not a complex web app). At minimum, evaluate and pick:
- Framework: e.g. Next.js (App Router) with TypeScript — favor this unless you have a
  strong reason otherwise, for SSR/SSG + built-in metadata/SEO primitives.
- Styling: Tailwind CSS, with a design-tokens setup (colors/fonts/spacing) generated
  directly from the design spec above, including dark mode.
- Animation: Framer Motion (or equivalent) for the motion language specified — scroll
  reveals, hover/micro-interactions — implemented with a prefers-reduced-motion fallback.
- Content: structured local content (MDX/JSON/TS data files) for experience, skills, and
  projects — justify this vs. a headless CMS given this is a single-owner site that
  changes infrequently.
- Images: next/image (or equivalent) with responsive/optimized delivery.
- Contact form: validates client + server side and actually delivers submissions
  (e.g. email via a transactional provider, or a stored lead) — no dead-end form.
- Hosting/deploy target: pick one (e.g. Vercel) and justify.

Document the chosen stack and folder architecture briefly in the repo (e.g. README.md or
ARCHITECTURE.md) before writing feature code.

SEO REQUIREMENTS (non-negotiable, implement fully)
- Per-page metadata (title, description, canonical URL, Open Graph, Twitter cards) via
  the framework's metadata API, with copy targeting relevant search terms (e.g. "senior
  software engineer for hire", "AI-first SaaS engineer", "scalable systems engineer
  [region]") without keyword-stuffing.
- JSON-LD structured data: Person (with sameAs links to GitHub/LinkedIn/etc.,
  knowsAbout, alumniOf/worksFor from resume), ProfilePage, and FAQPage where a FAQ
  section exists.
- Auto-generated sitemap.xml and robots.txt.
- Semantic HTML, correct heading hierarchy, descriptive alt text on all imagery.
- Core Web Vitals discipline: optimized images, font loading strategy (font-display:
  swap or equivalent), no layout shift from animations, lazy-loading below the fold.
- Report actual Lighthouse performance/SEO/accessibility scores before calling an SEO
  phase done.

GEO / AI-DISCOVERABILITY REQUIREMENTS (this is a distinct goal from classic SEO — implement
fully so AI assistants and answer engines can find, parse, and recommend this profile)
- robots.txt: explicitly allow known AI/answer-engine crawlers (e.g. GPTBot, ClaudeBot,
  PerplexityBot, Google-Extended, CCBot) rather than leaving them to default/blocked.
- Add an /llms.txt file at the site root summarizing who I am, my expertise, and links to
  key pages (About, Experience, Skills, Projects, Resume, Contact), in the emerging
  llms.txt convention for making a site legible to LLM-based tools.
- Write content (especially About, Experience, Skills, and a short FAQ block like "Who is
  [Name]?", "What kind of engineering work does [Name] specialize in?", "Is [Name]
  available for remote roles in [region]?") in clear, fact-dense, quotable prose — the
  kind of self-contained statements an AI answer engine can lift directly into a
  recommendation. Avoid vague marketing copy that has no extractable facts.
- Ensure every page is server-rendered/static (no content gated behind client-only JS
  rendering) so both search crawlers and AI crawlers can read it without executing JS.
- Cross-link and encourage consistency with my other professional profiles (GitHub,
  LinkedIn, etc. via sameAs in structured data) — AI answer engines corroborate identity
  claims across sources.

PROJECTS SECTION
Build the Projects section per the design spec's data model (problem, role, stack,
outcome/metrics, live link, repo link). Do not invent project content — implement the
section fully functional and ready, keep the design same.

PROCESS — WORK IN PHASES, GITHUB ISSUES FIRST, THEN IMPLEMENT ONE BY ONE
1. Before writing any feature code, break the full build into GitHub issues — one issue
   per feature/phase (see suggested breakdown below, adjust as you see fit) — using
   `gh issue create`, each with a clear description and acceptance criteria. Create ALL
   issues up front so the full scope is visible before implementation starts.
2. Then implement issues one at a time, in a sensible dependency order (global
   layout/design system before pages that depend on it, etc.):
   a. Create a new branch off main named for the issue/feature (e.g.
      `feat/design-tokens`, `feat/home-page`, `feat/projects-section`, `feat/seo-geo`).
   b. Implement that issue completely on its branch, committing incrementally with clear,
      conventional commit messages, referencing the issue number.
   c. Push the branch and open a pull request with `gh pr create`, linking the issue
      (`Closes #N`), describing what was built and how to verify it.
   d. Review the diff yourself for correctness against the design spec and the SEO/GEO
      requirements above before merging.
   e. Merge the PR with `gh pr merge` (squash preferred unless repo convention says
      otherwise), confirm the linked issue auto-closed, then delete the merged branch.
   f. Only then move to the next issue.
3. Do not batch multiple unrelated issues into one branch/PR. Do not push directly to
   main. If a later phase reveals earlier work needs rework, open a new issue and branch
   for that fix rather than reopening a merged PR.

Suggested issue/phase breakdown (propose refinements, but cover at least this):
  0. Project scaffold, tooling, design tokens from the spec, ARCHITECTURE.md
  1. Global layout: nav, footer, dark mode, base design-system components
  2. Home page
  3. About / Bio page (from resume)
  4. Skills & Expertise section
  5. Experience / Career Timeline (from resume)
  6. Projects section (structure + data model; content wired in once I provide links)
  7. Testimonials section (optional, if content exists)
  8. Resume/CV view + download, Contact section + working form
  9. SEO pass: metadata, JSON-LD, sitemap, robots.txt
  10. GEO pass: llms.txt, AI-crawler allowlist, FAQ block, fact-dense content audit
  11. Performance/accessibility polish, Lighthouse audit, cross-device QA

Before starting, confirm the repository is initialized for git and has a GitHub remote
configured — this directory is not currently a git repo, so run `git init`, create the
GitHub repo, and set the remote first (confirm the repo name/visibility with me before
creating it). Ask me only for decisions that are genuinely mine to make (real domain
name, my actual project list/links, resume file(s), professional profile URLs for
sameAs, contact form destination) — otherwise proceed autonomously through the issues
using the design spec and this brief as the source of truth.

At the end of each merged issue/phase, give me a short summary of what shipped and the
PR link, then continue to the next issue.
