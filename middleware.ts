import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE } from "@/lib/auth";

const protectedPrefixes = ["/dashboard"];

export function middleware(request: NextRequest) {
  const isAuthed = request.cookies.get(AUTH_COOKIE)?.value === "1";
  const { pathname } = request.nextUrl;

  const isProtected = protectedPrefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (isProtected && !isAuthed) {
    const login = new URL("/login", request.url);
    login.searchParams.set("from", pathname);
    return NextResponse.redirect(login);
  }

  // Đã đăng nhập vẫn cho vào /login (đổi tài khoản / xem form). Không redirect về /.

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
