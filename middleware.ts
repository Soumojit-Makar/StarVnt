// middleware.ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn   = !!req.auth;
  const role         = (req.auth?.user as { role?: string })?.role;
  const status       = (req.auth?.user as { accountStatus?: string })?.accountStatus;

  // Public routes
  if (pathname.startsWith("/login")) {
    return isLoggedIn ? NextResponse.redirect(new URL("/dashboard", req.url)) : NextResponse.next();
  }

  // All /dashboard and /admin routes require auth
  if ((pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Suspended accounts → show suspended page
  if (isLoggedIn && status === "SUSPENDED" && !pathname.startsWith("/suspended")) {
    return NextResponse.redirect(new URL("/suspended", req.url));
  }

  // Admin-only routes
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Admin users who visit /dashboard → redirect to /admin
  if (pathname === "/dashboard" && role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
