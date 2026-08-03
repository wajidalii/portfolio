"use server";

import { db } from "@/db/client";
import { contactSubmissions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { ItemActionState } from "@/components/ui/action-form";

export async function deleteContactSubmission(
  id: number,
  _prevState: ItemActionState,
  _formData: FormData,
): Promise<ItemActionState> {
  try {
    await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));
    revalidatePath("/admin/messages");
    return { ok: true, ts: Date.now() };
  } catch {
    return { ok: false, error: "Couldn't delete that message.", ts: Date.now() };
  }
}
