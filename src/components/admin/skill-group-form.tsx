import { Button } from "@/components/ui/button";

const DEPTH_OPTIONS = ["primary", "strong", "working"];

export function SkillGroupForm({
  action,
  initial,
}: {
  action: (formData: FormData) => void;
  initial?: {
    name: string;
    glyph: string;
    depth: string;
    items: string[];
  };
}) {
  return (
    <form action={action} className="grid gap-5">
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

      <Button type="submit" size="md" className="justify-self-start">
        Save
      </Button>
    </form>
  );
}
