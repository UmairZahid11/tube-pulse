import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuth = !!token;

  console.error("Middleware running for:", req.nextUrl.pathname);
  console.error("Token:", token);
  

  const protectedRoutes = ["/user", "/admin"];
  const isProtected = protectedRoutes.some((path) => req.nextUrl.pathname.startsWith(path));

  if (isProtected && !isAuth) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // matcher: ["/admin", "/admin/:path*", "/user", "/user/:path*"],
  matcher: "/:path*",
};
