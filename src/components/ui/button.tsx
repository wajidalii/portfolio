import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

const VARIANT_CLASSES = {
  primary:
    "bg-accent text-[#08090a] hover:bg-accent-2 shadow-[0_8px_26px_-12px_var(--accent)]",
  secondary:
    "border border-border bg-surface text-text hover:border-accent",
} as const;

const BASE_CLASSES =
  "inline-flex items-center gap-2 rounded-[11px] px-6 py-3.5 font-semibold text-[15.5px] transition-transform duration-200 hover:-translate-y-0.5";

type Variant = keyof typeof VARIANT_CLASSES;

type ButtonAsLink = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  children: ReactNode;
};

type ButtonAsButton = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: undefined;
  variant?: Variant;
  children: ReactNode;
};

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = "primary", className = "", children, ...rest } = props;
  const classes = `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`;

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
