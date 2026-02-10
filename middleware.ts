import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 1. Define routes that anyone can see (Sign-in, Sign-up, Landing page)
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/' // Adding the root landing page as public is usually safer
]);

export default clerkMiddleware(async (auth, req) => {
  // 2. If the user is NOT logged in and tries to access a private route
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  // 3. Optional: Add logic here if you need to force a redirect 
  // to /wizard after login, though usually handled in .env.local
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};