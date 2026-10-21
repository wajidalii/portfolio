// Accent palettes layered on top of Night/Day. Token values live in
// globals.css under [data-palette]; "steel" is the base :root palette.
// Kept dependency-free: the root layout's theme init script reads it.
export const PALETTES = [
  { id: "steel", name: "Steel", swatch: "#a9c7e8" },
  { id: "phosphor", name: "Phosphor", swatch: "#7ee0a1" },
  { id: "amber", name: "Amber", swatch: "#ffb547" },
  { id: "ember", name: "Ember", swatch: "#ff8a66" },
  { id: "ultraviolet", name: "Ultraviolet", swatch: "#b9a6ff" },
] as const;

export type PaletteId = (typeof PALETTES)[number]["id"];
