import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const REFRESH_TOKEN_COOKIE = "refresh_token";
const AUTH_PATH_PATTERN = /\/(login|register|reset-password)(?=\/|$)/;

// function getLocaleFromPathname(pathname: string) {
//   const firstSegment = pathname.split("/")[1];

//   return routing.locales.includes(
//     firstSegment as (typeof routing.locales)[number]
//   )
//     ? firstSegment
//     : null;
// }

// function stripLocalePrefix(pathname: string) {
//   const locale = getLocaleFromPathname(pathname);

//   if (!locale) {
//     return pathname;
//   }

//   const stripped = pathname.slice(locale.length + 1);

//   return stripped.length > 0 ? stripped : "/";
// }

function hasRefreshToken(request: NextRequest) {
  return !!request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
}

// function buildLocalizedPath(pathname: string, targetPath: string) {
//   const locale = getLocaleFromPathname(pathname);

//   if (!locale || locale === routing.defaultLocale) {
//     return targetPath;
//   }

//   return `/${locale}${targetPath}`;
// }

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAuthenticated = hasRefreshToken(request);

  if (!isAuthenticated && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthenticated && AUTH_PATH_PATTERN.test(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except API routes, Next internals, and static files.
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
