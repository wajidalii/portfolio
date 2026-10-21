"use client";

import { useEffect, useRef, useState } from "react";
import { DEFAULT_PALETTE, PALETTES, type PaletteId } from "./palettes";
import { originOf, setThemeAttr } from "./theme";

function useCurrentPalette(): [PaletteId, (id: PaletteId, el: Element) => void] {
  const [current, setCurrent] = useState<PaletteId>(DEFAULT_PALETTE);
  useEffect(() => {
    const p = document.documentElement.getAttribute("data-palette");
    if (PALETTES.some((x) => x.id === p)) setCurrent(p as PaletteId);
  }, []);
  const choose = (id: PaletteId, el: Element) => {
    setThemeAttr("data-palette", id, originOf(el));
    setCurrent(id);
  };
  return [current, choose];
}

function Swatches({
  current,
  onPick,
  labelled,
}: {
  current: PaletteId;
  onPick: (id: PaletteId, el: Element) => void;
  labelled?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label="Colour palette" className={labelled ? "grid gap-1" : "flex gap-2"}>
      {PALETTES.map((p) => {
        const active = p.id === current;
        return (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={labelled ? undefined : p.name}
            title={p.name}
            onClick={(e) => onPick(p.id, e.currentTarget)}
            className={
              labelled
                ? `flex items-center gap-3 px-2.5 py-2 rounded font-mono text-[11px] uppercase tracking-[0.1em] transition-colors ${
                    active ? "bg-surface-2 text-lcd-fg" : "text-lcd-muted hover:text-lcd-fg"
                  }`
                : "grid place-items-center w-9 h-9 rounded-md border border-border bg-bg"
            }
          >
            <span
              aria-hidden
              className={`block w-3 h-3 rounded-full transition-[box-shadow,transform] duration-300 ${active ? "scale-125" : ""}`}
              style={{
                background: p.swatch,
                boxShadow: active ? `0 0 0 3px ${p.swatch}33, 0 0 10px ${p.swatch}` : undefined,
              }}
            />
            {labelled && p.name}
          </button>
        );
      })}
    </div>
  );
}

/** Header control: an LCD button showing the active colour, opening a palette list. */
export function PalettePicker() {
  const [current, choose] = useCurrentPalette();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const swatch = PALETTES.find((p) => p.id === current)!.swatch;

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-label="Colour palette"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className="lcd !border-border grid place-items-center w-[28px] h-[28px] !rounded-[5px]"
      >
        <span
          aria-hidden
          className="block w-2.5 h-2.5 rounded-full transition-colors duration-500"
          style={{ background: swatch, boxShadow: `0 0 8px ${swatch}` }}
        />
      </button>
      {open && (
        <div className="lcd absolute right-0 top-[calc(100%+10px)] z-50 p-1.5 w-[170px] animate-[menu-in_.35s_var(--ease-out-expo)_both]">
          <Swatches current={current} onPick={choose} labelled />
        </div>
      )}
    </div>
  );
}

/** Mobile-menu variant: an inline row of swatches. */
export function PaletteRow() {
  const [current, choose] = useCurrentPalette();
  return <Swatches current={current} onPick={choose} />;
}
