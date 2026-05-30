import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Keep in sync with @/lib/auth/constants — inlined for Edge middleware bundle */
const SESSION_COOKIE_NAME = "__segment_admin_session";

const ADMIN_LOGIN = "/admin/login";
const ADMIN_DASHBOARD = "/admin/dashboard";

function hasSession(request: NextRequest): boolean {
  return Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = hasSession(request);

  if (pathname === "/admin") {
    return NextResponse.redirect(
      new URL(session ? ADMIN_DASHBOARD : ADMIN_LOGIN, request.url),
    );
  }

  if (pathname.startsWith(ADMIN_DASHBOARD)) {
    if (!session) {
      const login = new URL(ADMIN_LOGIN, request.url);
      login.searchParams.set("from", pathname);
      return NextResponse.redirect(login);
    }
    return NextResponse.next();
  }

  if (pathname === ADMIN_LOGIN && session) {
    return NextResponse.redirect(new URL(ADMIN_DASHBOARD, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/login", "/admin/dashboard/:path*"],
};
