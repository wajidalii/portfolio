"use server";

import { db } from "@/db/client";
import { upcomingProjects } from "@/db/schema";
import { asc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ItemActionState } from "@/components/ui/action-form";

export type FormActionState = { ok: boolean; error?: string };

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function readFields(formData: FormData) {
  const status = String(formData.get("status") ?? "planned");
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    status: status === "in_progress" ? ("in_progress" as const) : ("planned" as const),
    tags: parseTags(String(formData.get("tags") ?? "")),
    expectedDate: String(formData.get("expectedDate") ?? "").trim() || null,
    link: String(formData.get("link") ?? "").trim() || null,
  };
}

export async function createUpcomingProject(
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const fields = readFields(formData);
  if (!fields.title || !fields.description) {
    return { ok: false, error: "Title and description are required." };
  }

  const [{ maxOrder }] = await db
    .select({ maxOrder: sql<number>`coalesce(max(${upcomingProjects.sortOrder}), -1)` })
    .from(upcomingProjects);

  await db.insert(upcomingProjects).values({ ...fields, sortOrder: maxOrder + 1 });

  revalidatePath("/");
  revalidatePath("/admin/upcoming-projects");
  redirect(`/admin/upcoming-projects?flash=${encodeURIComponent("Upcoming project added.")}`);
}

export async function updateUpcomingProject(
  id: number,
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const fields = readFields(formData);
  if (!fields.title || !fields.description) {
    return { ok: false, error: "Title and description are required." };
  }

  await db
    .update(upcomingProjects)
    .set({ ...fields, updatedAt: new Date() })
    .where(eq(upcomingProjects.id, id));

  revalidatePath("/");
  revalidatePath("/admin/upcoming-projects");
  redirect(`/admin/upcoming-projects?flash=${encodeURIComponent("Upcoming project saved.")}`);
}

export async function deleteUpcomingProject(
  id: number,
  _prevState: ItemActionState,
  _formData: FormData,
): Promise<ItemActionState> {
  try {
    await db.delete(upcomingProjects).where(eq(upcomingProjects.id, id));
    revalidatePath("/");
    revalidatePath("/admin/upcoming-projects");
    return { ok: true, ts: Date.now() };
  } catch {
    return { ok: false, error: "Couldn't delete that upcoming project.", ts: Date.now() };
  }
}

export async function moveUpcomingProject(
  id: number,
  direction: "up" | "down",
  _prevState: ItemActionState,
  _formData: FormData,
): Promise<ItemActionState> {
  try {
    const items = await db.query.upcomingProjects.findMany({
      orderBy: asc(upcomingProjects.sortOrder),
    });
    const index = items.findIndex((p) => p.id === id);
    if (index === -1) return { ok: false, error: "Upcoming project not found.", ts: Date.now() };

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= items.length) return { ok: true, ts: Date.now() };

    const current = items[index];
    const swap = items[swapIndex];

    await db
      .update(upcomingProjects)
      .set({ sortOrder: swap.sortOrder })
      .where(eq(upcomingProjects.id, current.id));
    await db
      .update(upcomingProjects)
      .set({ sortOrder: current.sortOrder })
      .where(eq(upcomingProjects.id, swap.id));

    revalidatePath("/");
    revalidatePath("/admin/upcoming-projects");
    return { ok: true, ts: Date.now() };
  } catch {
    return { ok: false, error: "Couldn't reorder upcoming projects.", ts: Date.now() };
  }
}
