import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const AUTH_COOKIE_NAMES = ["access_token", "accessToken"];
const AUTH_PATH_PATTERN = /\/(login|register|reset-password|reset-passwod)(?=\/|$)/;

function getLocaleFromPathname(pathname: string) {
  const firstSegment = pathname.split("/")[1];

  return routing.locales.includes(firstSegment as (typeof routing.locales)[number])
    ? firstSegment
    : null;
}

function stripLocalePrefix(pathname: string) {
  const locale = getLocaleFromPathname(pathname);

  if (!locale) {
    return pathname;
  }

  const stripped = pathname.slice(locale.length + 1);

  return stripped.length > 0 ? stripped : "/";
}

function hasAccessToken(request: NextRequest) {
  return AUTH_COOKIE_NAMES.some(
    (cookieName) => request.cookies.get(cookieName)?.value
  );
}

function buildLocalizedPath(pathname: string, targetPath: string) {
  const locale = getLocaleFromPathname(pathname);

  if (!locale || locale === routing.defaultLocale) {
    return targetPath;
  }

  return `/${locale}${targetPath}`;
}

export default function middleware(request: NextRequest) {
  const pathname = stripLocalePrefix(request.nextUrl.pathname);
  const accessTokenExists = hasAccessToken(request);

  if (!accessTokenExists && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(
      new URL(buildLocalizedPath(request.nextUrl.pathname, "/login"), request.url)
    );
  }

  if (accessTokenExists && AUTH_PATH_PATTERN.test(pathname)) {
    return NextResponse.redirect(
      new URL(buildLocalizedPath(request.nextUrl.pathname, "/dashboard"), request.url)
    );
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except API routes, Next internals, and static files.
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
