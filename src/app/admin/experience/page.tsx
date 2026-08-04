import type { Metadata } from "next";
import Link from "next/link";
import { getRoles } from "@/db/queries";
import { Button } from "@/components/ui/button";
import { deleteRole, moveRole } from "./actions";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminExperiencePage() {
  const items = await getRoles();

  return (
    <main className="min-h-screen px-6 py-16 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="font-mono text-xs text-muted">
            ← Admin
          </Link>
          <h1 className="font-display text-2xl font-bold mt-2">Experience</h1>
        </div>
        <Button href="/admin/experience/new" size="md">
          Add role
        </Button>
      </div>

      <div className="grid gap-3">
        {items.map((r, i) => (
          <div
            key={r.id}
            className="border border-border rounded-xl bg-surface p-4 flex items-center gap-4"
          >
            <div className="flex flex-col gap-1">
              <form action={moveRole.bind(null, r.id, "up")}>
                <Button
                  type="submit"
                  variant="secondary"
                  size="icon"
                  disabled={i === 0}
                  aria-label="Move up"
                >
                  ↑
                </Button>
              </form>
              <form action={moveRole.bind(null, r.id, "down")}>
                <Button
                  type="submit"
                  variant="secondary"
                  size="icon"
                  disabled={i === items.length - 1}
                  aria-label="Move down"
                >
                  ↓
                </Button>
              </form>
            </div>
            <div className="flex-1">
              <div className="font-semibold">
                {r.title} — {r.company}
              </div>
              <div className="text-muted text-sm">{r.period}</div>
            </div>
            <Button href={`/admin/experience/${r.id}`} variant="secondary" size="sm">
              Edit
            </Button>
            <form action={deleteRole.bind(null, r.id)}>
              <Button type="submit" variant="danger" size="sm">
                Delete
              </Button>
            </form>
          </div>
        ))}
        {items.length === 0 && <p className="text-muted text-sm">No roles yet.</p>}
      </div>
    </main>
  );
}
