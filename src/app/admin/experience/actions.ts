"use server";

import { db } from "@/db/client";
import { roles } from "@/db/schema";
import { asc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ItemActionState } from "@/components/ui/action-form";

export type FormActionState = { ok: boolean; error?: string };

function parseLines(raw: string): string[] {
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function readRoleFields(formData: FormData) {
  return {
    period: String(formData.get("period") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    scope: String(formData.get("scope") ?? "").trim(),
    wins: parseLines(String(formData.get("wins") ?? "")),
    stack: parseLines(String(formData.get("stack") ?? "")),
  };
}

export async function createRole(
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const fields = readRoleFields(formData);
  if (!fields.title || !fields.company) {
    return { ok: false, error: "Title and company are required." };
  }

  const [{ maxOrder }] = await db
    .select({ maxOrder: sql<number>`coalesce(max(${roles.sortOrder}), -1)` })
    .from(roles);

  await db.insert(roles).values({ ...fields, sortOrder: maxOrder + 1 });

  revalidatePath("/");
  revalidatePath("/admin/experience");
  redirect(`/admin/experience?flash=${encodeURIComponent("Role added.")}`);
}

export async function updateRole(
  id: number,
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const fields = readRoleFields(formData);
  if (!fields.title || !fields.company) {
    return { ok: false, error: "Title and company are required." };
  }

  await db
    .update(roles)
    .set({ ...fields, updatedAt: new Date() })
    .where(eq(roles.id, id));

  revalidatePath("/");
  revalidatePath("/admin/experience");
  redirect(`/admin/experience?flash=${encodeURIComponent("Role saved.")}`);
}

export async function deleteRole(
  id: number,
  _prevState: ItemActionState,
  _formData: FormData,
): Promise<ItemActionState> {
  try {
    await db.delete(roles).where(eq(roles.id, id));
    revalidatePath("/");
    revalidatePath("/admin/experience");
    return { ok: true, ts: Date.now() };
  } catch {
    return { ok: false, error: "Couldn't delete that role.", ts: Date.now() };
  }
}

export async function moveRole(
  id: number,
  direction: "up" | "down",
  _prevState: ItemActionState,
  _formData: FormData,
): Promise<ItemActionState> {
  try {
    const items = await db.query.roles.findMany({ orderBy: asc(roles.sortOrder) });
    const index = items.findIndex((r) => r.id === id);
    if (index === -1) return { ok: false, error: "Role not found.", ts: Date.now() };

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= items.length) return { ok: true, ts: Date.now() };

    const current = items[index];
    const swap = items[swapIndex];

    await db.update(roles).set({ sortOrder: swap.sortOrder }).where(eq(roles.id, current.id));
    await db.update(roles).set({ sortOrder: current.sortOrder }).where(eq(roles.id, swap.id));

    revalidatePath("/");
    revalidatePath("/admin/experience");
    return { ok: true, ts: Date.now() };
  } catch {
    return { ok: false, error: "Couldn't reorder roles.", ts: Date.now() };
  }
}
