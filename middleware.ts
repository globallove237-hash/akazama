import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Authentication and condition middleware
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check for dynamic admin login route pattern
  const adminLoginMatch = pathname.match(/^\/([a-zA-Z0-9]{32})\/login$/);
  
  if (adminLoginMatch) {
    // This is a valid admin login route pattern, allow it
    return NextResponse.next();
  }
  
  const isAdminRoute = pathname.startsWith("/admin");
  const isPaymentRoute = pathname.startsWith("/payment");
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isWaitingListRoute = pathname.startsWith("/waiting-list");

  // Check for condition acceptance on waiting list route
  if (isWaitingListRoute) {
    const conditionsAccepted = request.cookies.get("conditions-accepted");
    
    if (!conditionsAccepted || conditionsAccepted.value !== "true") {
      // Redirect to condition page if conditions not accepted
      const url = request.nextUrl.clone();
      url.pathname = "/condition";
      return NextResponse.redirect(url);
    }
  }

  // Admin routes require admin session
  if (isAdminRoute) {
    const adminSession = request.cookies.get("admin-session");
    
    if (!adminSession || adminSession.value !== "true") {
      // Redirect to home if not admin authenticated
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  // Regular protected routes require user authentication
  if (isPaymentRoute || isDashboardRoute) {
    const authSession = request.cookies.get("auth-session");

    if (!authSession) {
      // Redirect to waiting list page if not authenticated
      const url = request.nextUrl.clone();
      url.pathname = "/waiting-list";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*", 
    "/payment/:path*", 
    "/dashboard/:path*", 
    "/waiting-list/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)/login"
  ],
};
