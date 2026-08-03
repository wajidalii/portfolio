import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-[1180px] mx-auto px-6 ${className}`}>
      {children}
    </div>
  );
}
