export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  alternativeErrorMessage: string = "Request failed"
): Promise<T> {

  // endpoint should be relative to /api, for example "auth/login"
  const response = await fetch(`/api/${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const result = await response.json();

  if (!response.ok || result.status === false) {
    throw new Error(result.message || alternativeErrorMessage);
  }

  return result;
}
