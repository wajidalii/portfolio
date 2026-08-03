import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db/client";
import { contactSubmissions } from "@/db/schema";
import { desc } from "drizzle-orm";
import { deleteContactSubmission } from "./actions";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const items = await db.query.contactSubmissions.findMany({
    orderBy: desc(contactSubmissions.createdAt),
  });

  return (
    <main className="min-h-screen px-6 py-16 max-w-3xl mx-auto">
      <div className="mb-8">
        <Link href="/admin" className="font-mono text-xs text-muted">
          ← Admin
        </Link>
        <h1 className="font-display text-2xl font-bold mt-2">Contact Messages</h1>
      </div>

      <div className="grid gap-3">
        {items.map((m) => (
          <div key={m.id} className="border border-border rounded-xl bg-surface p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold">{m.name}</div>
                <a href={`mailto:${m.email}`} className="text-accent-fg text-sm">
                  {m.email}
                </a>
                <div className="text-muted text-xs font-mono mt-1">
                  {m.topic} · {m.createdAt.toLocaleString()}
                </div>
              </div>
              <form action={deleteContactSubmission.bind(null, m.id)}>
                <button type="submit" className="font-mono text-xs text-red-400 shrink-0">
                  Delete
                </button>
              </form>
            </div>
            <p className="text-text text-sm mt-3 whitespace-pre-wrap">{m.message}</p>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-muted text-sm">No messages yet.</p>
        )}
      </div>
    </main>
  );
}
