import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * Auth Middleware
 * 
 * Protects routes that require authentication.
 * Runs at the edge before the page loads for fast redirects.
 */
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Protected routes that require authentication
  const protectedPaths = ["/profile"];
  const isProtectedRoute = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // Redirect to sign in if accessing protected route without auth
  if (isProtectedRoute && !isLoggedIn) {
    const signInUrl = new URL("/api/auth/signin", req.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

// Only run middleware on specific paths for performance
export const config = {
  matcher: [
    // Protected routes
    "/profile/:path*",
    // Exclude static files and api routes (except auth)
    "/((?!_next/static|_next/image|favicon.ico|images|api(?!/auth)).*)",
  ],
};
