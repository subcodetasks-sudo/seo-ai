import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { routing } from "./i18n/routing";
import {
  CALLBACK_URL_COOKIE,
  CALLBACK_URL_MAX_AGE,
  decodeCallbackUrl,
} from "./lib/callback-url";

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
    const response = NextResponse.redirect(new URL("/login", request.url));

    // Remember where the user was headed so the auth flow can send them
    // back after login (see lib/callback-url.ts). A cookie (rather than a
    // query param) survives the register → verify-email → login detours
    // without threading the URL through every auth page.
    response.cookies.set(
      CALLBACK_URL_COOKIE,
      encodeURIComponent(pathname + request.nextUrl.search),
      { path: "/", maxAge: CALLBACK_URL_MAX_AGE, sameSite: "lax" }
    );

    return response;
  }

  if (isAuthenticated && AUTH_PATH_PATTERN.test(pathname)) {
    const callbackUrl = decodeCallbackUrl(
      request.cookies.get(CALLBACK_URL_COOKIE)?.value
    );
    const response = NextResponse.redirect(
      new URL(callbackUrl ?? "/dashboard", request.url)
    );

    if (callbackUrl) {
      response.cookies.set(CALLBACK_URL_COOKIE, "", { path: "/", maxAge: 0 });
    }

    return response;
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
