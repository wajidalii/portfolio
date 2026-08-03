import type { Metadata } from "next";
import Link from "next/link";
import { RoleForm } from "@/components/admin/role-form";
import { createRole } from "../actions";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function NewRolePage() {
  return (
    <main className="min-h-screen px-6 py-16 max-w-xl mx-auto">
      <Link href="/admin/experience" className="font-mono text-xs text-muted">
        ← Experience
      </Link>
      <h1 className="font-display text-2xl font-bold mt-2 mb-8">Add role</h1>
      <RoleForm action={createRole} />
    </main>
  );
}
