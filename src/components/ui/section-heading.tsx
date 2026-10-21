import type { ReactNode } from "react";

/**
 * Channel label ("CH·02 — Skills") + display heading that wipes up into
 * view. Pass `channel` without the "CH·" prefix.
 */
export function SectionHeading({
  id,
  channel,
  label,
  children,
  className = "",
  size = "lg",
}: {
  id: string;
  channel: string;
  label: string;
  children: ReactNode;
  className?: string;
  size?: "lg" | "md";
}) {
  const sizes =
    size === "lg"
      ? "text-[32px] sm:text-[44px] lg:text-[56px]"
      : "text-[28px] sm:text-[36px] lg:text-[44px]";
  return (
    <div className={className}>
      <div className="channel mb-5" data-reveal="fade">
        <span aria-hidden className="led !w-[7px] !h-[7px]" />
        CH·{channel} — {label}
      </div>
      <h2
        id={id}
        data-reveal="wipe"
        className={`section-title m-0 font-wide font-extrabold leading-[0.98] tracking-[-0.03em] text-balance ${sizes}`}
      >
        {children}
      </h2>
    </div>
  );
}
