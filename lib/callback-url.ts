/** Query param used to remember where to send the user after auth (mirrors NextAuth's `callbackUrl`). */
export const CALLBACK_URL_PARAM = "callbackUrl";

/**
 * Only same-app absolute paths are allowed as a post-auth destination.
 * "//host" and "/\host" are protocol-relative URLs that would let the
 * param redirect the user off-site (open redirect).
 */
export function sanitizeCallbackUrl(value: string | null | undefined): string | null {
  if (!value || !value.startsWith("/")) {
    return null;
  }

  if (value.startsWith("//") || value.startsWith("/\\")) {
    return null;
  }

  return value;
}

/** Appends a sanitized `callbackUrl` query param to `path`, if one is given. */
export function withCallbackUrl(path: string, callbackUrl?: string | null): string {
  const safe = sanitizeCallbackUrl(callbackUrl);

  if (!safe) {
    return path;
  }

  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${CALLBACK_URL_PARAM}=${encodeURIComponent(safe)}`;
}

/** Reads + sanitizes the `callbackUrl` param from a URLSearchParams-like source. */
export function readCallbackUrl(
  searchParams: { get(key: string): string | null } | undefined | null
): string | null {
  return sanitizeCallbackUrl(searchParams?.get(CALLBACK_URL_PARAM));
}
