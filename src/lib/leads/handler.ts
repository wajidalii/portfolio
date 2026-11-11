import { createHmac } from "node:crypto";
import { MAX_INQUIRY_BYTES, validateInquiry, type Inquiry } from "./validation";

export type ReceivedLead = Inquiry & { id: string };
export type ReceiveResult = { kind: "created"; lead: ReceivedLead } | { kind: "duplicate" | "conflict" | "limited" };
export type InquiryDependencies = {
  secret: string | undefined;
  receive: (data: Inquiry, hash: string, keys: string[]) => Promise<ReceiveResult>;
  notify: (lead: ReceivedLead) => Promise<void>;
  trustedIpHeader?: string;
};
const SUCCESS = { ok: true, message: "Your inquiry has been received. I’ll review the details and reply by email." };
function reply(body: object, status = 200, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...headers } });
}
async function readJson(request: Request) {
  if (!request.body) throw new Error("invalid_body");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_INQUIRY_BYTES) { await reader.cancel(); throw new Error("too_large"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0; for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}
/** Strict same-origin JSON endpoint; exported factory allows deterministic tests. */
export function createInquiryHandler(dependencies: InquiryDependencies) {
  return async function handle(request: Request): Promise<Response> {
    const failure = (message: string, status: number) => reply({ ok: false, message }, status);
    let origin: string;
    try {
      const url = new URL(request.url);
      // Next may normalize request.url to localhost even when the browser used
      // 127.0.0.1. Host is the actual addressed host; never trust forwarded-host.
      const host = request.headers.get("host");
      if (host && !/^[a-z0-9.:[\]-]+$/i.test(host)) return failure("Invalid request host.", 400);
      origin = host ? new URL(`${url.protocol}//${host}`).origin : url.origin;
    } catch { return failure("Invalid request.", 400); }
    if (request.headers.get("origin") !== origin || request.headers.get("sec-fetch-site") === "cross-site") return failure("Please submit from this website.", 403);
    if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") return failure("Use the project inquiry form.", 415);
    const length = request.headers.get("content-length");
    if (length && (!/^\d+$/.test(length) || Number(length) > MAX_INQUIRY_BYTES)) return failure("The inquiry is too large.", 413);
    let raw: unknown;
    try { raw = await readJson(request); }
    catch (error) { return failure(error instanceof Error && error.message === "too_large" ? "The inquiry is too large." : "Invalid inquiry data.", error instanceof Error && error.message === "too_large" ? 413 : 400); }
    const { data, errors, spam } = validateInquiry(raw);
    // Do not disclose the honeypot or persist/notify on detected spam.
    if (spam) return reply(SUCCESS);
    if (!data) return reply({ ok: false, errors, message: "Please check the highlighted fields." }, 422);
    if (!dependencies.secret || dependencies.secret.length < 32) return failure("Project inquiries are temporarily unavailable. Please email me directly.", 503);
    const hash = (input: string) => createHmac("sha256", dependencies.secret!).update(input).digest("hex");
    const keys = [hash("global"), hash(`email:${data.email}`)];
    if (dependencies.trustedIpHeader) {
      const ip = request.headers.get(dependencies.trustedIpHeader)?.trim();
      // Never use an unbounded forwarded list or trust headers by default.
      if (ip && ip.length <= 64 && /^[\da-fA-F:.]+$/.test(ip)) keys.push(hash(`ip:${ip}`));
    }
    try {
      const result = await dependencies.receive(data, hash(JSON.stringify(data)), keys);
      if (result.kind === "limited") return reply({ ok: false, message: "Too many inquiries. Please try again in an hour or email me directly." }, 429, { "Retry-After": "3600" });
      if (result.kind === "conflict") return failure("This form was already sent with different details. Reload to start a new inquiry.", 409);
      if (result.kind === "created") {
        // Persistence is authoritative. Delivery failure must not induce duplicate
        // submissions or expose provider errors; a private retry is available.
        try { await dependencies.notify(result.lead); } catch { /* durable pending state remains retryable */ }
      }
      return reply(SUCCESS);
    } catch {
      return failure("Your inquiry could not be saved. Please try again or email me directly.", 503);
    }
  };
}
