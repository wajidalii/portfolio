"use server";

import { db } from "@/db/client";
import { roles } from "@/db/schema";
import { ROLES_TAG } from "@/db/queries";
import { asc, eq, sql } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

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

export async function createRole(formData: FormData) {
  const fields = readRoleFields(formData);
  if (!fields.title || !fields.company) return;

  const [{ maxOrder }] = await db
    .select({ maxOrder: sql<number>`coalesce(max(${roles.sortOrder}), -1)` })
    .from(roles);

  await db.insert(roles).values({ ...fields, sortOrder: maxOrder + 1 });

  revalidatePath("/");
  revalidatePath("/admin/experience");
  revalidateTag(ROLES_TAG);
  redirect("/admin/experience");
}

export async function updateRole(id: number, formData: FormData) {
  const fields = readRoleFields(formData);
  if (!fields.title || !fields.company) return;

  await db
    .update(roles)
    .set({ ...fields, updatedAt: new Date() })
    .where(eq(roles.id, id));

  revalidatePath("/");
  revalidatePath("/admin/experience");
  revalidateTag(ROLES_TAG);
  redirect("/admin/experience");
}

export async function deleteRole(id: number) {
  await db.delete(roles).where(eq(roles.id, id));
  revalidatePath("/");
  revalidatePath("/admin/experience");
  revalidateTag(ROLES_TAG);
}

export async function moveRole(id: number, direction: "up" | "down") {
  const items = await db.query.roles.findMany({ orderBy: asc(roles.sortOrder) });
  const index = items.findIndex((r) => r.id === id);
  if (index === -1) return;

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= items.length) return;

  const current = items[index];
  const swap = items[swapIndex];

  await db.update(roles).set({ sortOrder: swap.sortOrder }).where(eq(roles.id, current.id));
  await db.update(roles).set({ sortOrder: current.sortOrder }).where(eq(roles.id, swap.id));

  revalidatePath("/");
  revalidatePath("/admin/experience");
  revalidateTag(ROLES_TAG);
}
