import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { routing } from "./i18n/routing";
import { readCallbackUrl, withCallbackUrl } from "./lib/callback-url";

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
    // Remember where the user was headed so the auth flow can send them
    // back after login/register (see lib/callback-url.ts). Carried as a
    // query param — like NextAuth's callbackUrl — through the
    // register → verify-email → login detour via each page's own link.
    const target = withCallbackUrl("/login", pathname + request.nextUrl.search);
    return NextResponse.redirect(new URL(target, request.url));
  }

  if (isAuthenticated && AUTH_PATH_PATTERN.test(pathname)) {
    const callbackUrl = readCallbackUrl(request.nextUrl.searchParams);
    return NextResponse.redirect(new URL(callbackUrl ?? "/dashboard", request.url));
  }

  // next-intl's own cookie-based locale detection is tied to the same flag
  // as accept-language detection (routing.localeDetection), and we only want
  // the former. Guaranteeing a NEXT_LOCALE cookie is always present before
  // next-intl resolves the locale makes its cookie check (which takes
  // priority over accept-language) always win, so the browser's language
  // never gets consulted while a real NEXT_LOCALE cookie still drives the
  // `[locale]` route param (and therefore locale-tagged API requests).
  if (!request.cookies.has("NEXT_LOCALE")) {
    request.cookies.set("NEXT_LOCALE", routing.defaultLocale);
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except API routes, Next internals, and static files.
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
