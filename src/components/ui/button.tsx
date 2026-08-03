import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

const VARIANT_CLASSES = {
  primary:
    "bg-accent text-[#08090a] hover:bg-accent-2 shadow-[0_8px_26px_-12px_var(--accent)]",
  secondary:
    "border border-border bg-surface text-text hover:border-accent",
  ghost:
    "border border-border bg-surface text-muted hover:text-text hover:border-accent",
  danger: "text-red-400 hover:text-red-300",
} as const;

const SIZE_CLASSES = {
  lg: "gap-2 px-6 py-3.5 text-[15.5px] rounded-[11px]",
  md: "gap-1.5 px-4 py-2.5 text-sm rounded-lg",
  sm: "gap-1 px-3 py-1.5 text-xs font-mono rounded-lg",
  icon: "w-7 h-7 justify-center rounded-md text-xs",
} as const;

const BASE_CLASSES =
  "inline-flex items-center justify-center font-semibold transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-40 disabled:pointer-events-none disabled:hover:translate-y-0";

type Variant = keyof typeof VARIANT_CLASSES;
type Size = keyof typeof SIZE_CLASSES;

type ButtonAsLink = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

type ButtonAsButton = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: undefined;
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const {
    variant = "primary",
    size = "lg",
    className = "",
    children,
    ...rest
  } = props;
  const classes = `${BASE_CLASSES} ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${className}`;

  if ("href" in rest && rest.href) {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
