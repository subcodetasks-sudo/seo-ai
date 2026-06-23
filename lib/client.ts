let refreshing: Promise<void> | null = null;

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
  console.log("result", result);

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
        throw new Error(retryResult.message || alternativeErrorMessage);
      }

      return retryResult;
    } catch {
      // Refresh failed — redirect to login (locale-aware). Guard against
      // redirecting when we're already on the login page, which would reload
      // the page and re-fire the failing request in an endless loop.
      const { pathname } = window.location;
      const locale = pathname.split("/")[1];
      const prefix =
        ["ar", "en"].includes(locale) && locale ? `/${locale}` : "/ar";
      const loginPath = `${prefix}/login`;

      if (pathname !== loginPath) {
        window.location.href = loginPath;
      }

      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!response.ok || result.status === false) {
    throw new Error(result.message || alternativeErrorMessage);
  }

  return result;
}
