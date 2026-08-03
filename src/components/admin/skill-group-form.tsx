"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import type { FormActionState } from "@/app/admin/skills/actions";

const DEPTH_OPTIONS = ["primary", "strong", "working"];

const INITIAL_STATE: FormActionState = { ok: true };

export function SkillGroupForm({
  action,
  initial,
}: {
  action: (state: FormActionState, formData: FormData) => Promise<FormActionState>;
  initial?: {
    name: string;
    glyph: string;
    depth: string;
    items: string[];
  };
}) {
  const [state, formAction, pending] = useActionState(action, INITIAL_STATE);

  return (
    <form action={formAction} className="grid gap-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block font-mono text-xs uppercase tracking-wider text-muted mb-1.5">
            Name
          </label>
          <input
            id="name"
            name="name"
            defaultValue={initial?.name}
            required
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text"
          />
        </div>
        <div>
          <label htmlFor="glyph" className="block font-mono text-xs uppercase tracking-wider text-muted mb-1.5">
            Glyph (single symbol)
          </label>
          <input
            id="glyph"
            name="glyph"
            defaultValue={initial?.glyph}
            required
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text"
          />
        </div>
      </div>

      <div>
        <label htmlFor="depth" className="block font-mono text-xs uppercase tracking-wider text-muted mb-1.5">
          Depth
        </label>
        <select
          id="depth"
          name="depth"
          defaultValue={initial?.depth ?? "primary"}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text"
        >
          {DEPTH_OPTIONS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="items" className="block font-mono text-xs uppercase tracking-wider text-muted mb-1.5">
          Items (one per line)
        </label>
        <textarea
          id="items"
          name="items"
          rows={8}
          defaultValue={initial?.items.join("\n")}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text font-mono text-sm"
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" size="md" disabled={pending} className="justify-self-start">
          {pending ? "Saving…" : "Save"}
        </Button>
        {!state.ok && (
          <span role="alert" className="font-mono text-xs text-red-400">
            {state.error}
          </span>
        )}
      </div>
    </form>
  );
}
