import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE, isDemoLoginValid } from "@/lib/auth";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email ?? "";
  const password = body.password ?? "";

  if (!isDemoLoginValid(email, password)) {
    return NextResponse.json(
      { error: "Email và mật khẩu không hợp lệ (mật khẩu tối thiểu 4 ký tự)." },
      { status: 401 },
    );
  }

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ ok: true });
}
