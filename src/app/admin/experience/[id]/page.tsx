import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRole } from "@/db/queries";
import { RoleForm } from "@/components/admin/role-form";
import { updateRole } from "../actions";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function EditRolePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const role = await getRole(Number(id));

  if (!role) notFound();

  return (
    <main className="min-h-screen px-6 py-16 max-w-xl mx-auto">
      <Link href="/admin/experience" className="font-mono text-xs text-muted">
        ← Experience
      </Link>
      <h1 className="font-display text-2xl font-bold mt-2 mb-8">Edit role</h1>
      <RoleForm action={updateRole.bind(null, role.id)} initial={role} />
    </main>
  );
}
