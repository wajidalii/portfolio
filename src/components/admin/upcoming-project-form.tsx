import { Button } from "@/components/ui/button";

export function UpcomingProjectForm({
  action,
  initial,
}: {
  action: (formData: FormData) => void;
  initial?: {
    title: string;
    description: string;
    status: string;
    tags: string[];
    expectedDate: string | null;
    link: string | null;
  };
}) {
  return (
    <form action={action} className="grid gap-5">
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
        <label htmlFor="description" className="block font-mono text-xs uppercase tracking-wider text-muted mb-1.5">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={initial?.description}
          required
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block font-mono text-xs uppercase tracking-wider text-muted mb-1.5">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={initial?.status ?? "planned"}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text"
          >
            <option value="planned">Planned</option>
            <option value="in_progress">In progress</option>
          </select>
        </div>
        <div>
          <label htmlFor="expectedDate" className="block font-mono text-xs uppercase tracking-wider text-muted mb-1.5">
            Expected date (optional, e.g. Q1 2027)
          </label>
          <input
            id="expectedDate"
            name="expectedDate"
            defaultValue={initial?.expectedDate ?? ""}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text"
          />
        </div>
      </div>

      <div>
        <label htmlFor="tags" className="block font-mono text-xs uppercase tracking-wider text-muted mb-1.5">
          Tags (comma-separated)
        </label>
        <input
          id="tags"
          name="tags"
          defaultValue={initial?.tags.join(", ")}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text font-mono text-sm"
        />
      </div>

      <div>
        <label htmlFor="link" className="block font-mono text-xs uppercase tracking-wider text-muted mb-1.5">
          Link (optional)
        </label>
        <input
          id="link"
          name="link"
          type="url"
          defaultValue={initial?.link ?? ""}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text"
        />
      </div>

      <Button type="submit" size="md" className="justify-self-start">
        Save
      </Button>
    </form>
  );
}
