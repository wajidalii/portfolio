import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, createSessionToken, verifyPassword } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");

  if (!password || !verifyPassword(password)) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url, { status: 303 });
  }

  const token = await createSessionToken();
  const response = NextResponse.redirect(new URL("/admin", request.url), {
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
