export const CALLBACK_URL_COOKIE = "callback_url";

// Long enough to survive a register → verify-email → login journey,
// short enough that a stale intent doesn't hijack a later login.
export const CALLBACK_URL_MAX_AGE = 60 * 30;

/**
 * Only same-app absolute paths are allowed as a post-login destination.
 * "//host" and "/\host" are protocol-relative URLs that would let the
 * cookie redirect the user off-site (open redirect).
 */
export function sanitizeCallbackUrl(
  value: string | null | undefined
): string | null {
  if (!value || !value.startsWith("/")) {
    return null;
  }

  if (value.startsWith("//") || value.startsWith("/\\")) {
    return null;
  }

  return value;
}

export function decodeCallbackUrl(raw: string | undefined): string | null {
  if (!raw) {
    return null;
  }

  try {
    return sanitizeCallbackUrl(decodeURIComponent(raw));
  } catch {
    return null;
  }
}

/** Browser-side counterpart of the cookie set by proxy.ts. */
export function storeCallbackUrlCookie(path: string): void {
  if (typeof document === "undefined" || !sanitizeCallbackUrl(path)) {
    return;
  }

  document.cookie = `${CALLBACK_URL_COOKIE}=${encodeURIComponent(path)}; path=/; max-age=${CALLBACK_URL_MAX_AGE}; samesite=lax`;
}

/**
 * Reads the callback_url cookie in the browser, clears it, and returns the
 * sanitized destination (or null if absent/invalid). Clearing on read keeps
 * a stale intent from redirecting an unrelated future login.
 */
export function consumeCallbackUrlCookie(): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const raw = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${CALLBACK_URL_COOKIE}=`))
    ?.slice(CALLBACK_URL_COOKIE.length + 1);

  if (raw) {
    document.cookie = `${CALLBACK_URL_COOKIE}=; path=/; max-age=0; samesite=lax`;
  }

  return decodeCallbackUrl(raw);
}
