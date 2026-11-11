"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { serviceLeads } from "@/db/schema";
import { isAdmin } from "@/lib/require-admin";
import { parseLeadUpdate, validLeadId } from "@/lib/leads/admin";
import { notifyLead } from "@/lib/leads/notifications";

async function authorize() { if (!(await isAdmin())) redirect("/admin/login?from=%2Fadmin%2Fleads"); }
export async function saveLead(id: string, formData: FormData) {
  await authorize();
  const values = parseLeadUpdate(formData);
  if (!validLeadId(id) || !values) redirect("/admin/leads?notice=invalid");
  try { await db.update(serviceLeads).set({ ...values, updatedAt: new Date() }).where(eq(serviceLeads.id, id)); }
  catch { redirect("/admin/leads?notice=unavailable"); }
  revalidatePath("/admin/leads");
  redirect("/admin/leads?notice=saved");
}
export async function retryLeadNotification(id: string) {
  await authorize();
  if (!validLeadId(id)) redirect("/admin/leads?notice=invalid");
  try { await notifyLead(id); }
  catch { redirect("/admin/leads?notice=unavailable"); }
  revalidatePath("/admin/leads");
  redirect("/admin/leads?notice=notification");
}
export async function deleteLead(id: string, formData: FormData) {
  await authorize();
  if (!validLeadId(id) || formData.get("confirm") !== "delete") redirect("/admin/leads?notice=invalid");
  try { await db.delete(serviceLeads).where(eq(serviceLeads.id, id)); }
  catch { redirect("/admin/leads?notice=unavailable"); }
  revalidatePath("/admin/leads");
  redirect("/admin/leads?notice=deleted");
}
