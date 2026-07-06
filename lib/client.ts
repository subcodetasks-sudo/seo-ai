import { ApiError } from "@/lib/errors";

let refreshing: Promise<void> | null = null;

// Called when the refresh endpoint responds 401 (refresh token invalid/expired).
// The auth cookies are already cleared server-side by /api/auth/refresh; here we
// drop any persisted client state and hard-redirect to the locale-aware login
// page, which also resets all in-memory React/React Query state.
function logout() {
  if (typeof window === "undefined") return;

  try {
    localStorage.clear();
  } catch {
    // Ignore storage access errors (private mode, etc.).
  }

  const { pathname } = window.location;
  const locale = pathname.split("/")[1];
  const prefix = ["ar", "en"].includes(locale) ? `/${locale}` : "/ar";
  const loginPath = `${prefix}/login`;

  // Guard against redirecting when we're already on the login page, which would
  // reload the page and re-fire the failing request in an endless loop.
  if (pathname !== loginPath) {
    window.location.href = loginPath;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  alternativeErrorMessage: string = "Request failed",
): Promise<T> {
  // endpoint should be relative to /api, for example "auth/login"
  const response = await fetch(`/api/${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const result = await response?.json();
  // console.log("result", result);

  if (response.status === 401) {
    if (!refreshing) {
      refreshing = fetch("/api/auth/refresh", { method: "POST" })
        .then(async (r) => {
          if (!r.ok) throw new Error("refresh_failed");
        })
        .finally(() => {
          refreshing = null;
        });
    }

    try {
      await refreshing;
      // Retry once after refresh
      const retryResponse = await fetch(`/api/${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });
      const retryResult = await retryResponse.json();

      if (!retryResponse.ok || retryResult.status === false) {
        throw new ApiError(retryResult.message || alternativeErrorMessage, retryResult.errors);
      }

      return retryResult;
    } catch {
      // Refresh failed (refresh token invalid/expired) — log the user out.
      logout();
      throw new ApiError("Session expired. Please log in again.", undefined, 401);
    }
  }

  if (!response.ok || result.status === false) {
    throw new ApiError(result.message || alternativeErrorMessage, result.errors, response.status);
  }

  return result;
}
