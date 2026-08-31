import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

// Prisma yok — yalnızca JWT doğrulama. Bu dosya güvenlik sınırı DEĞİL
// (Next.js 16 / OWASP: asıl yetki sayfa + API'de). Burada UX yönlendirmesi var.

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user?.role;

  const isAdminLogin = pathname === "/admin/login";
  const isAdminApp = pathname.startsWith("/admin") && !isAdminLogin;
  const isStudentGate =
    pathname.startsWith("/ogrenci/giris") || pathname.startsWith("/ogrenci/kayit");
  const isStudentApp =
    pathname === "/ogrenci" || (pathname.startsWith("/ogrenci/") && !isStudentGate);

  if (isAdminApp && role !== "ADMIN") {
    if (role === "STUDENT") {
      return NextResponse.redirect(new URL("/ogrenci", req.nextUrl));
    }
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }

  if (isStudentApp && role !== "STUDENT") {
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.nextUrl));
    }
    return NextResponse.redirect(new URL("/ogrenci/giris", req.nextUrl));
  }

  if (isAdminLogin && role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }
  if (isStudentGate && role === "STUDENT") {
    return NextResponse.redirect(new URL("/ogrenci", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/ogrenci", "/ogrenci/:path*"],
};
