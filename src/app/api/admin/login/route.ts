import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, createSessionToken, verifyPassword } from "@/lib/admin-auth";

function safeRedirectTarget(from: FormDataEntryValue | null): string {
  const path = String(from ?? "");
  // Only allow same-app relative paths — reject protocol-relative ("//evil.com")
  // or absolute URLs to avoid an open redirect via the `from` param.
  if (path.startsWith("/") && !path.startsWith("//")) return path;
  return "/admin";
}

export async function POST(request: Request) {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");
  const from = safeRedirectTarget(form.get("from"));

  if (!password || !verifyPassword(password)) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("error", "1");
    if (from !== "/admin") url.searchParams.set("from", from);
    return NextResponse.redirect(url, { status: 303 });
  }

  const token = await createSessionToken();
  const response = NextResponse.redirect(new URL(from, request.url), {
    status: 303,
  });
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
