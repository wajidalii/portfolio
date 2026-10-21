import type { ReactNode } from "react";
import { STATIONS, stationLabel } from "./stations";

const WIDTHS = {
  narrow: "max-w-[600px]",
  wide: "max-w-[800px]",
  full: "",
} as const;

/**
 * One stop on the system map: a full-height section whose content docks to
 * one side as a panel, leaving the other side for that station's 3D
 * cluster. `data-station` / `data-side` are read by the 3D stage to place
 * the camera; `bare` drops the panel chrome for sections that bring their
 * own surfaces.
 */
export function Station({
  index,
  side,
  width = "wide",
  bare = false,
  labelledBy,
  className = "",
  children,
}: {
  index: number;
  side: "left" | "right" | "center";
  width?: keyof typeof WIDTHS;
  bare?: boolean;
  labelledBy: string;
  className?: string;
  children: ReactNode;
}) {
  const align = side === "right" ? "min-[960px]:ml-auto" : side === "center" ? "mx-auto" : "";
  return (
    <section
      id={STATIONS[index].id}
      data-station={index}
      data-side={side}
      data-channel={stationLabel(index)}
      aria-labelledby={labelledBy}
      className={`station relative flex items-center py-14 min-[960px]:py-28 min-[960px]:min-h-[100svh] ${className}`}
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 w-full">
        <div data-side={side} className={`${bare ? "" : "station-panel"} ${WIDTHS[width]} ${align}`}>
          {children}
        </div>
      </div>
    </section>
  );
}
