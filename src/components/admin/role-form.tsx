import { Button } from "@/components/ui/button";

export function RoleForm({
  action,
  initial,
}: {
  action: (formData: FormData) => void;
  initial?: {
    period: string;
    location: string;
    title: string;
    company: string;
    scope: string;
    wins: string[];
    stack: string[];
  };
}) {
  return (
    <form action={action} className="grid gap-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="title" className="block font-mono text-xs uppercase tracking-wider text-muted mb-1.5">
            Title
          </label>
          <input
            id="title"
            name="title"
            defaultValue={initial?.title}
            required
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text"
          />
        </div>
        <div>
          <label htmlFor="company" className="block font-mono text-xs uppercase tracking-wider text-muted mb-1.5">
            Company
          </label>
          <input
            id="company"
            name="company"
            defaultValue={initial?.company}
            required
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="period" className="block font-mono text-xs uppercase tracking-wider text-muted mb-1.5">
            Period (e.g. 2024 — Present)
          </label>
          <input
            id="period"
            name="period"
            defaultValue={initial?.period}
            required
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text"
          />
        </div>
        <div>
          <label htmlFor="location" className="block font-mono text-xs uppercase tracking-wider text-muted mb-1.5">
            Location
          </label>
          <input
            id="location"
            name="location"
            defaultValue={initial?.location}
            required
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text"
          />
        </div>
      </div>

      <div>
        <label htmlFor="scope" className="block font-mono text-xs uppercase tracking-wider text-muted mb-1.5">
          Scope (e.g. Platform team · 5 engineers)
        </label>
        <input
          id="scope"
          name="scope"
          defaultValue={initial?.scope}
          required
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text"
        />
      </div>

      <div>
        <label htmlFor="wins" className="block font-mono text-xs uppercase tracking-wider text-muted mb-1.5">
          Wins (one per line)
        </label>
        <textarea
          id="wins"
          name="wins"
          rows={5}
          defaultValue={initial?.wins.join("\n")}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text font-mono text-sm"
        />
      </div>

      <div>
        <label htmlFor="stack" className="block font-mono text-xs uppercase tracking-wider text-muted mb-1.5">
          Stack (one per line)
        </label>
        <textarea
          id="stack"
          name="stack"
          rows={4}
          defaultValue={initial?.stack.join("\n")}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text font-mono text-sm"
        />
      </div>

      <Button type="submit" size="md" className="justify-self-start">
        Save
      </Button>
    </form>
  );
}
