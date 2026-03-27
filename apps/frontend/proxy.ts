import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const role = request.cookies.get("auth-role")?.value;
  const { pathname } = request.nextUrl;

  // Protect technician routes
  const isAppRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/services") ||
    pathname.startsWith("/profile");

  if (isAppRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Protect admin panel routes (exclude /admin/login)
  const isAdminRoute =
    pathname.startsWith("/admin/dashboard") ||
    pathname.startsWith("/admin/services") ||
    pathname.startsWith("/admin/technicians");

  if (isAdminRoute && (!token || role !== "admin")) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/services/:path*",
    "/profile/:path*",
    "/admin/dashboard/:path*",
    "/admin/services/:path*",
    "/admin/technicians/:path*",
  ],
};
