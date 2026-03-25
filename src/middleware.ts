import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");

  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isDashboard) {
    const res = NextResponse.next();
    res.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
    res.headers.set("Pragma", "no-cache");
    res.headers.set("Expires", "0");
    return res;
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*"],
};