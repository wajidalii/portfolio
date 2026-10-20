# Redesign progress log — "Field Instrument"

Plan: [`PLAN.md`](./PLAN.md) · Design canvas:
https://claude.ai/artifact/FUF1dc3BZxU5xUmWkHKoQp · Epic: #40

| Issue | Status | PR |
|---|---|---|
| #41 Design spec & docs | ✅ done | — |
| #42 Tokens, fonts, textures | ✅ done | see log |
| #43 Motion primitives | ✅ done | see log |
| #44 Header + footer | ✅ done | see log |
| #45 Hero, stats, ticker | ✅ done | see log |
| #46 About, skills, experience | ✅ done | see log |
| #47 Projects + upcoming | ✅ done | see log |
| #57 Owner feedback: Steel & ice, no cursor, zoom | ✅ done | see log |
| #48 Recs, FAQ, contact, CTA | ⏳ next | — |
| #49 Admin + QA | ☐ | — |

## Log

### 2026-10-20 — #41 Design spec

- Chose the "Field Instrument" concept: the portfolio as precision hardware
  (Braun / Teenage Engineering / oscilloscope). Warm graphite + bone paper,
  signal orange `#FF5A1F` + amber LCD `#F4B63F`. Explicitly avoids the
  blue/teal/purple/pink defaults.
- Type: Archivo variable (width axis 62–125 drives the proximity-type hero)
  + Martian Mono for labels and readouts.
- Built the design canvas with two boards — full homepage (night theme,
  day theme via tweak) and a design-system board (palette, type scale,
  keycaps, LCD, switch, VU meter, knob, motion inventory). Sources copied to
  `docs/redesign/design/`.
- Created issues #40–#49.

### 2026-10-20 — #42 Tokens, fonts, textures

- `globals.css` rewritten: night/day token sets (all text tokens ≥4.5:1),
  new `on-accent`, `accent-deep`, `danger`, `lcd*` tokens. Old token names
  kept, so admin inherits the palette with zero class changes.
- Fonts: Space Grotesk / IBM Plex / JetBrains Mono → **Archivo** (variable
  `wdth` + `wght`) and **Martian Mono** via `next/font`.
- Page texture: dot-grid body background + animated SVG film grain.
- Utilities: `font-wide`, `font-semiwide`, `channel`, `label-mono`, `lcd`,
  `lcd-text`, `reg-marks`, `.led`.
- Reveal CSS is progressive enhancement (`html[data-motion=on]` only).
- `Button` → keycap variants with press travel. Hard-coded `#08090a` /
  `red-400` replaced by tokens. OG image moved to the new palette.

### 2026-10-20 — #43 Motion primitives

New `src/components/motion/` (no animation library, ~6 kB of hooks):

- `MotionProvider` — scroll reveals for `[data-reveal]` (`wipe`/`fade`/default
  rise), staggered via `[data-reveal-group]`, MutationObserver for late
  content, failsafe if IntersectionObserver never reports, reveal-all on print.
- `Cursor` — crosshair + trailing ring + live X/Y readout; ring grows and
  shows `OPEN ↗` / `GO` / `WRITE` / `PRESS` / `EXPAND` or a custom
  `data-cursor` label.
- `Magnetic`, `TiltCard` (tilt + spotlight via `--mx/--my`),
  `DecodeText` (glyph scramble, layout-stable, SR-safe), `CountUp`
  (SSR prints the final value), `ProximityType` (variable-font letters
  swell near the pointer; breathing wave fallback on touch).
- All pointer effects gated on `(hover:hover) and (pointer:fine)` and
  `prefers-reduced-motion`.

### 2026-10-20 — #44 Header + footer

- Header: keycap `WA` logo (tilts on hover, presses on click), LCD with a
  4-digit **tape counter** (scroll ‰) and the **current channel**
  (scroll-spied from `[data-channel]` sections), orange scroll-progress
  tape along the bottom edge, decode-on-hover nav, hardware **Night/Day
  slide switch** (`role="switch"`), magnetic CTA keycap. Hides on scroll
  down, returns on scroll up. Mobile menu: wide display links with
  staggered entry, animated burger→×, Escape closes.
- Footer: serial plate panel (model/origin/build/status LED), link lists
  with an orange lead-line on hover, "rewind to top" key, and a giant
  outlined `WAJID ALI` wordmark that floods orange on hover.

### 2026-10-20 — #45 Hero, stats, ticker

- Hero `h1` now holds the name **and** the title line (better for SEO
  than the title alone). Name = `ProximityType` — verified in Chrome:
  letters nearest the cursor widen/thicken live.
- Instrument panel: canvas **oscilloscope** (amplitude follows pointer
  speed, pauses off-screen, still frame for reduced motion), live
  **Dubai/Karachi clocks**, numbered proof points that nudge on hover.
- Stats are LCD readouts with `CountUp` (SSR prints final values).
- Stack ticker: tilted signal-orange band, reverses when scrolling up,
  pauses on hover, screen-reader list underneath.
- Dev note: ports 3000/3001 are used by another local project; this one
  runs on `next dev -p 3100` while testing.

### 2026-10-20 — #46 About, skills, experience

- New `SectionHeading` (channel LED label + wide display h2 that wipes up).
  Sections now carry `data-channel` so the header LCD follows along.
- About: spec-sheet panel (sticky on desktop) with hover-lit rows; bold
  phrases get an orange underline that draws in on hover.
- Skills: rack modules with `TiltCard` tilt + spotlight, spinning glyph,
  lifting chips, and a 5-bar **VU depth meter** (primary 5 / strong 4 /
  working 3) that glows amber on hover; `aria-label` reports depth.
- Experience: `Playhead` — rail fills with scroll, the role under the
  playhead lights its node, others dim to 50% (fully lit without JS).
- **Bug found + fixed:** IntersectionObserver reports zero visible area for
  an element hidden with `clip-path`, so "wipe" headings never revealed.
  `MotionProvider` now observes the wipe target's parent instead.
  Verified in Chrome.

### 2026-10-20 — #47 Projects + upcoming

- Project cards: `TiltCard` tilt + spotlight, screenshot **zooms in** and
  goes grey→colour on hover, viewfinder brackets close in, `REC 0n` tag
  blinks, link underline sweeps in.
- Filter: segmented LCD control with a sliding indicator; cards re-enter
  with a staggered rise; result count announced to screen readers.
- Upcoming projects: tilt modules with a status LED (blinks when in
  progress); empty state is an LCD "NO SIGNAL" panel.
- Also (owner request): added the `websitelaunches-verification` meta tag
  via `metadata.verification.other` in the root layout.

### 2026-10-20 — #57 Owner feedback round 1

Owner: "I don't like the design. Remove orange color and focus circle
instead of mouse cursor. The blocks should zoom in when hoverover. It
should not feel like static website or dead website."

- Asked for a palette direction (4 options) → owner chose **Steel & ice**.
  All tokens swapped (both themes, contrast re-checked), oscilloscope,
  LCD glow and OG image recoloured. No orange anywhere.
- **Custom cursor removed** entirely — native pointer everywhere.
- **Hover zoom**: tilt cards now scale to 1.04 (1.03 fallback on touch /
  keyboard focus) with an ice outline; new `hover-zoom` utility on stats,
  hero instrument panel, about spec sheet, footer serial plate.
- **More life**: new `DotField` canvas behind the hero — dots swell under
  the pointer, ripple on click/tap, and a slow diagonal wave keeps rolling
  even on phones. Name gets scroll parallax.
- Design canvas + `docs/redesign/design/` + PLAN.md updated to v2.
- Verified in Chrome: palette, dot lens, card zoom/tilt with native cursor.
