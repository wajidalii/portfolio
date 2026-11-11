import { adminRequestOrigin } from "../admin-login";
import { parseLeadUpdate, validLeadId } from "./admin";

type Update = NonNullable<ReturnType<typeof parseLeadUpdate>>;
export type LeadMutationDependencies = {
  authorized: () => Promise<boolean>;
  save: (id: string, value: Update) => Promise<void>;
  remove: (id: string) => Promise<void>;
  retry: (id: string) => Promise<void>;
};
/** Native same-origin form POST keeps private operations progressively enhanced,
 * including deterministic HTTP303 feedback and a no-JavaScript admin path. */
export function createLeadMutationHandler(deps: LeadMutationDependencies) {
  return async (request: Request) => {
    const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };
    const origin = adminRequestOrigin(request);
    const fail = (status: number) => new Response("The update could not be processed.", { status, headers });
    if (!origin || request.headers.get("origin") !== origin || request.headers.get("sec-fetch-site") === "cross-site") return fail(403);
    if (!(await deps.authorized())) return new Response(null, { status: 303, headers: { ...headers, Location: new URL("/admin/login?from=%2Fadmin%2Fleads", origin).href } });
    if (request.headers.get("content-type")?.split(";")[0] !== "application/x-www-form-urlencoded") return fail(415);
    if (!request.body || Number(request.headers.get("content-length") || 0) > 65536) return fail(413);
    const reader = request.body.getReader();
    const chunks: Uint8Array[] = []; let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        size += value.byteLength; if (size > 65536) { await reader.cancel(); return fail(413); }
        chunks.push(value);
      }
    } catch { return fail(400); } finally { reader.releaseLock(); }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    let fields: URLSearchParams;
    try { fields = new URLSearchParams(new TextDecoder("utf-8", { fatal: true }).decode(bytes)); } catch { return fail(400); }
    const form = new FormData(); for (const [key, value] of fields) form.append(key, value);
    const id = form.get("id"), operation = form.get("operation");
    let notice = "invalid";
    if (validLeadId(id)) {
      try {
        if (operation === "save") { const values = parseLeadUpdate(form); if (values) { await deps.save(id, values); notice = "saved"; } }
        else if (operation === "retry") { await deps.retry(id); notice = "notification"; }
        else if (operation === "delete" && form.get("confirm") === "delete") { await deps.remove(id); notice = "deleted"; }
      } catch { notice = "unavailable"; }
    }
    return new Response(null, { status: 303, headers: { ...headers, Location: new URL(`/admin/leads?notice=${notice}`, origin).href } });
  };
}
