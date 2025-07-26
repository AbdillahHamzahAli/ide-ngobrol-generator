import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.nextUrl.origin;

  if (origin === host) {
    return NextResponse.next();
  }

  console.error(`Forbidden: Origin "${origin}" does not match host "${host}"`);
  return new NextResponse("Forbidden", { status: 403 });
}

export const config = {
  matcher: "/api/:path*",
};
