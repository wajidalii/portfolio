import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { serviceLeads } from "@/db/schema";
import { isAdmin } from "@/lib/require-admin";
import { createLeadMutationHandler } from "@/lib/leads/admin-handler";
import { notifyLead } from "@/lib/leads/notifications";
export const runtime = "nodejs";
export async function POST(request: Request) {
  return createLeadMutationHandler({
    authorized: isAdmin,
    save: async (id, values) => { await db.update(serviceLeads).set({ ...values, updatedAt: new Date() }).where(eq(serviceLeads.id, id)); revalidatePath("/admin/leads"); },
    remove: async (id) => { await db.delete(serviceLeads).where(eq(serviceLeads.id, id)); revalidatePath("/admin/leads"); },
    retry: async (id) => { await notifyLead(id); revalidatePath("/admin/leads"); },
  })(request);
}
