import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const PROTECTED_PATHS = ["/dashboard", "/settings", "/admin"];

export function middleware(request: NextRequest) {
   const { pathname } = request.nextUrl;
   const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
   if (!isProtected) return NextResponse.next();

   // Cookie-presence check only — cheap, edge-safe, NOT a full verification.
   const sessionCookie = getSessionCookie(request);
   if (!sessionCookie) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
   }
   return NextResponse.next();
}

export const config = {
   matcher: ["/dashboard/:path*", "/settings/:path*", "/admin/:path*"],
};