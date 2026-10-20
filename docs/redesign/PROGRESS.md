# Redesign progress log — "Field Instrument"

Plan: [`PLAN.md`](./PLAN.md) · Design canvas:
https://claude.ai/artifact/FUF1dc3BZxU5xUmWkHKoQp · Epic: #40

| Issue | Status | PR |
|---|---|---|
| #41 Design spec & docs | ✅ done | — |
| #42 Tokens, fonts, textures | ✅ done | see log |
| #43 Motion primitives | ⏳ next | — |
| #44 Header + footer | ☐ | — |
| #45 Hero, stats, ticker | ☐ | — |
| #46 About, skills, experience | ☐ | — |
| #47 Projects + upcoming | ☐ | — |
| #48 Recs, FAQ, contact, CTA | ☐ | — |
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
