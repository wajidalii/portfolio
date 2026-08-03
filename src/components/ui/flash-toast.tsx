"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useToast } from "./toast";

export function FlashToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();
  const handled = useRef(false);

  const flash = searchParams.get("flash");

  useEffect(() => {
    if (!flash || handled.current) return;
    handled.current = true;

    showToast(flash, "success");

    const params = new URLSearchParams(searchParams);
    params.delete("flash");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [flash, pathname, router, searchParams, showToast]);

  return null;
}
