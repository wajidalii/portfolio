"use client";

import { useActionState, useEffect, useRef, type ReactNode } from "react";
import { useToast } from "./toast";

export type ItemActionState = { ok: boolean; error?: string; ts: number };

export const INITIAL_ITEM_ACTION_STATE: ItemActionState = { ok: true, ts: 0 };

export function ActionForm({
  action,
  successMessage,
  children,
}: {
  action: (state: ItemActionState, formData: FormData) => Promise<ItemActionState>;
  successMessage?: string;
  children: (pending: boolean) => ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, INITIAL_ITEM_ACTION_STATE);
  const { showToast } = useToast();
  const lastTs = useRef(0);

  useEffect(() => {
    if (state.ts === 0 || state.ts === lastTs.current) return;
    lastTs.current = state.ts;

    if (state.ok) {
      if (successMessage) showToast(successMessage, "success");
    } else {
      showToast(state.error ?? "Something went wrong.", "error");
    }
  }, [state, successMessage, showToast]);

  return <form action={formAction}>{children(pending)}</form>;
}
