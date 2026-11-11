# Viewport rendering — 2026-11-11

## Behavior

Keep the server-rendered document intact for indexing, find-in-page, assistive
technology, fragment navigation and JavaScript-disabled access. Use native
`content-visibility: auto` on sections after the hero and individual project
entries. The browser skips offscreen layout/paint and prepares content near the
viewport. This is rendering containment, not removal of content or deferred React
hydration. The initial hero, navigation, CSS and fonts deliberately remain eager.

`contain-intrinsic-block-size: auto <estimate>` reserves space until a section is
measured, then remembers its size. Mobile/desktop estimates match the existing
seeded content approximately; revisit them when content changes significantly.
Document heights can adjust on first reveal, so these are not fixed section
heights. Browsers without support render normally. Print explicitly renders all
sections. Focused content remains rendered.

The timeline uses a section IntersectionObserver before reading descendant
geometry; offscreen scroll callbacks no longer force skipped content into layout.
Project screenshots and letter previews use native lazy images. The letter's
full-resolution magnifier background loads on pointer intent. The Cal.com module
and embed load on hover/focus/click, with a normal booking URL fallback and retry
on failed module loads. Decorative desktop WebGL loads after the first scroll,
key or pointer interaction, during idle time. Existing small scene imports load
near their viewport, and their render loop ignores offscreen views.

Browsers choose the preload/render distance, so a strict pixel boundary is not
promised. CSS containment reduces rendering cost; it does not defer database
queries or all client hydration. Eager loading of critical resources avoids
turning lazy loading into an LCP regression. Chromium intentionally disables
native image lazy loading when JavaScript is disabled; preserve that fallback.

## Validation

- ESLint, TypeScript, production build with seeded disposable PostgreSQL.
- System Chromium/Playwright at 390x844 and 1440x900, reduced motion, and no JS:
  offscreen contact heading initially skipped via
  `checkVisibility({contentVisibilityAuto:true})`; no initial booking/background
  runtime request. With JS enabled, no initial testimonial image request.
- Fragment navigation to projects, project filter state, contact field input,
  print override and zero browser page errors. No email sent.
- Additional final checks cover regular scrolling through each section,
  native anchor rendering without forcing `:target` visible, and desktop
  background activation after intent.

Lighthouse evidence is recorded in `lighthouse-viewport.json`. Default mobile
emulation/simulated throttling, Lighthouse 13.6.0, localhost production build.
Single lab samples are diagnostic, not field Core Web Vitals or ranking proof.

Final local run: Performance 98, Accessibility 100, Best Practices 100, SEO 100;
LCP 0.9s, TBT 176.5ms (displayed as 180ms), CLS 0. Previous local audit in
`lighthouse-local-after.json`: Performance 94, TBT 290ms. These are separate
single-run samples, not a controlled statistical benchmark. The earlier run of
this change scored 96; variance is expected. The committed JSON is a compact
measurement summary (settings and metrics), not the full screenshot/trace report.
Re-run the deployed Lighthouse workflow after release for production evidence.
