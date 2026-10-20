"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { usePointerFx } from "./use-motion";

const ZOOM = 2.4;
const LENS = 170;

/**
 * Document preview with a magnifying lens that follows the pointer.
 * The whole thing is a link to the full image, so touch users (no lens)
 * just tap to open it.
 */
export function Loupe({
  src,
  alt,
  width,
  height,
  href,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  href: string;
}) {
  const enabled = usePointerFx();
  const boxRef = useRef<HTMLAnchorElement>(null);
  const lensRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);

  const onMove = (e: React.PointerEvent) => {
    if (!enabled || !boxRef.current || !lensRef.current) return;
    const r = boxRef.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const lens = lensRef.current;
    lens.style.transform = `translate3d(${x - LENS / 2}px, ${y - LENS / 2}px, 0)`;
    lens.style.backgroundSize = `${r.width * ZOOM}px ${r.height * ZOOM}px`;
    lens.style.backgroundPosition = `${-(x * ZOOM - LENS / 2)}px ${-(y * ZOOM - LENS / 2)}px`;
  };

  return (
    <a
      ref={boxRef}
      href={href}
      target="_blank"
      rel="noopener"
      onPointerEnter={() => enabled && setActive(true)}
      onPointerLeave={() => setActive(false)}
      onPointerMove={onMove}
      className={`group relative block overflow-hidden rounded-lg border border-border bg-surface-2 ${enabled ? "cursor-zoom-in" : ""}`}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(min-width: 960px) 480px, 100vw"
        className="block w-full h-auto transition-[filter] duration-500 group-hover:brightness-[0.8]"
      />
      <span
        ref={lensRef}
        aria-hidden
        className={`pointer-events-none absolute left-0 top-0 rounded-full border-2 border-accent bg-no-repeat shadow-[0_24px_50px_-12px_rgba(0,0,0,.7),inset_0_0_0_5px_rgba(10,13,16,.35)] transition-opacity duration-200 ${active ? "opacity-100" : "opacity-0"}`}
        style={{ width: LENS, height: LENS, backgroundImage: `url(${src})` }}
      />
      <span className="absolute left-3 bottom-3 inline-flex items-center gap-2 px-2.5 py-1.5 rounded bg-lcd/90 font-mono text-[10px] tracking-[0.1em] text-lcd-fg">
        {enabled ? `×${ZOOM} LOUPE · CLICK TO OPEN` : "TAP TO OPEN THE LETTER"}
      </span>
    </a>
  );
}
