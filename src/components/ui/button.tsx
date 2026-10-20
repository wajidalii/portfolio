import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

// Keycap buttons: a flat face with a "travel" shadow underneath that
// collapses when pressed (see docs/redesign/PLAN.md, Shape & texture).
const VARIANT_CLASSES = {
  primary:
    "bg-accent text-on-accent shadow-[0_4px_0_var(--accent-deep),0_14px_30px_-14px_var(--accent)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_0_0_var(--accent-deep)]",
  secondary:
    "border border-border bg-surface text-text shadow-[0_3px_0_var(--border)] hover:-translate-y-0.5 hover:border-accent active:translate-y-[3px] active:shadow-none",
  ghost:
    "border border-border bg-surface text-muted shadow-[0_2px_0_var(--border)] hover:text-text hover:border-accent active:translate-y-0.5 active:shadow-none",
  danger: "text-danger hover:opacity-80",
} as const;

const SIZE_CLASSES = {
  lg: "gap-2.5 px-6 py-3.5 text-[15.5px] rounded-md font-semiwide",
  md: "gap-1.5 px-4 py-2.5 text-sm rounded-md",
  sm: "gap-1 px-3 py-1.5 text-xs font-mono rounded",
  icon: "w-7 h-7 justify-center rounded text-xs",
} as const;

const BASE_CLASSES =
  "inline-flex items-center justify-center font-semibold cursor-pointer transition-[transform,box-shadow,border-color,color,opacity] duration-150 disabled:opacity-40 disabled:pointer-events-none";

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
