# Redesign plan — "Field Instrument"

Owner brief (2026-10-20): make the portfolio feel alive and interactive —
hover animations, zoom effects, modern motion — with a look nobody would
guess was AI-generated. No green, purple or pink themes. Keep the contact
form (Resend) and every admin function working.

## 1. Concept

The site is a **precision hardware instrument** — think a Braun field
recorder, a Teenage Engineering synth, a lab oscilloscope. Wajid's work is
about systems that hold up under load; the site *behaves* like a well-made
measuring device: labelled channels, LCD readouts, tactile keys, a live
signal trace, registration marks, a tape counter that tracks your scroll.

Why it's not "AI default": no gradient blobs, no glassmorphism, no
blue/purple/teal palette, no Inter. Warm graphite + bone paper, one hot
signal-orange, one amber LCD colour, expanded industrial type.

## 2. Design system

### Palette

| Token | Night (default) | Day | Use |
|---|---|---|---|
| `--bg` | `#121110` graphite | `#E9E4D8` bone paper | page ground |
| `--surface` | `#1B1A18` | `#F4F0E7` | panels |
| `--surface2` | `#24221F` | `#DDD6C6` | chips, insets |
| `--border` | `#34312C` | `#C3BAA6` | hairlines |
| `--text` | `#EEE8DC` bone | `#171614` ink | body |
| `--muted` | `#A39B8C` | `#5F584C` | secondary text (≥4.5:1) |
| `--accent` | `#FF5A1F` signal orange | `#FF5A1F` | fills, keys, LEDs |
| `--accent-fg` | `#FF6A33` | `#A3330A` | orange as text (≥4.5:1) |
| `--accent2` | `#F4B63F` amber LCD | `#F4B63F` | readouts, highlights |
| `--accent2-fg` | `#F4B63F` | `#7F5300` | amber as text |
| `--lcd-bg` / `--lcd-fg` | `#0D0C0A` / `#F4B63F` | same | LCD panels stay dark in both themes |

### Type

- **Archivo** (variable, `wdth` 62–125, `wght` 100–900). Display at
  `wdth 125 / wght 800` — wide, flat, industrial. Body at `wdth 100 / wght 400`.
- **Martian Mono** (variable, `wdth` 75–112.5) for labels, readouts, chips.
- Section labels use a channel convention: `CH·01 — ABOUT`.

### Shape & texture

- Radii are small (4–10 px) — machined, not bubbly.
- Corner registration marks (`+`) on key panels.
- Faint dot grid + film grain overlay over the page.
- Keycap buttons: flat face + 3 px bottom "travel" shadow that collapses on press.

## 3. Interaction & motion inventory

| # | Effect | Where |
|---|---|---|
| M1 | **Proximity type** — each letter of the hero name widens/thickens as the cursor nears (variable-font axes) | Hero |
| M2 | **Reticle cursor** — crosshair with live X/Y readout; morphs into a labelled ring over links/buttons | Global (fine pointer only) |
| M3 | **Live signal trace** — canvas oscilloscope whose amplitude follows mouse speed + live Dubai/Karachi clocks | Hero instrument panel |
| M4 | **LCD count-up** — stats roll up from 0 when scrolled into view | Stats |
| M5 | **Tape counter + channel display** — header shows scroll % as a 4-digit counter and the current section channel | Header |
| M6 | **Reveal wipes** — headings rise out of a clip mask, panels fade/slide in on scroll | All sections |
| M7 | **Tilt + spotlight cards** — 3D tilt toward cursor with a light spot following it | Projects, Skills, Upcoming |
| M8 | **Zoom-in screenshots** — screenshot scales up + desaturated→colour on hover | Projects |
| M9 | **Magnetic keycaps** — primary buttons drift toward the cursor, press down on click | Buttons |
| M10 | **Text decode** — nav labels scramble then resolve on hover | Header nav |
| M11 | **Stack ticker** — infinite marquee that reverses with scroll direction, pauses on hover | Between hero and about |
| M12 | **VU meters** — skill depth shown as LED bars that light up on hover | Skills |
| M13 | **Playhead timeline** — experience rail fills as you scroll, active role lights up | Experience |
| M14 | **Loupe** — magnifying lens over the BDCC appreciation letter | Recommendations |
| M15 | **Knob accordions** — FAQ indicator rotates like a dial | FAQ |
| M16 | **Slide switch** — Day/Night theme toggle as a hardware switch | Header |
| M17 | **Transmit button** — contact submit shows a progress sweep while sending, "signal received" on success | Contact |

### Motion rules (non-negotiable)

- **Content is visible without JavaScript.** All server-rendered copy paints
  at full opacity and final values. Reveal/count-up only activate after
  hydration sets `html[data-motion="on"]`, and a failsafe reveals everything
  after 2.5 s. (Fixes the class of bug recorded in ARCHITECTURE.md.)
- `prefers-reduced-motion: reduce` disables cursor, tilt, magnetic,
  proximity type, marquee and reveals.
- Cursor/tilt/magnetic only on `(hover: hover) and (pointer: fine)`.
- No animation library — small hand-written client hooks with
  `requestAnimationFrame` and `IntersectionObserver`. Keeps JS small.
- Only animate `transform`, `opacity`, `clip-path`, `font-variation-settings`.

## 4. What stays the same

- All SEO/GEO: metadata, JSON-LD, sitemap, robots, llms.txt, semantic headings.
- All content (static TS files + DB-backed sections).
- Contact form server action + Resend delivery + validation.
- Admin: login, messages, skills, experience, upcoming projects CRUD,
  toasts, pending states, caching. Admin gets the new tokens and type only.

## 5. Delivery

- Design canvas (source of truth for look):
  https://claude.ai/artifact/FUF1dc3BZxU5xUmWkHKoQp — a copy of the
  artboard source is stored in `docs/redesign/design/`.
- Integration branch `redesign/field-instrument` (off `main`). Each issue
  gets its own branch + PR into the integration branch. A final PR
  `redesign/field-instrument → main` is opened for the owner to review on
  the Netlify deploy preview before going live.
- Progress is logged in `docs/redesign/PROGRESS.md`.

### Issues (in dependency order)

Epic: #40

1. #41 Design spec, design canvas, plan/progress docs
2. #42 Design tokens, fonts, textures, theme switch foundation
3. #43 Motion primitives library (reveal, cursor, magnetic, tilt, decode, count-up, proximity type)
4. #44 Header (tape counter, channel display, decode nav, slide switch) + footer
5. #45 Hero + stats + stack ticker
6. #46 About, Skills (VU meters), Experience (playhead timeline)
7. #47 Projects (tilt, zoom, filter transitions) + Upcoming projects
8. #48 Recommendations (loupe), FAQ (knobs), Contact (transmit), CTA
9. #49 Admin restyle + QA pass (lint, build, a11y, reduced motion, mobile, Lighthouse)
