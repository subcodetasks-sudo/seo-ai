import { env } from "@/config/env";

/** Safe, non-revealing message shown to users when something fails internally. */
export const GENERIC_ERROR = "Something went wrong. Please try again later.";

export async function serverClient<T>(
  endpoint: string,
  options: RequestInit = {},
  alternativeErrorMessage: string = "Request failed",
): Promise<T> {
  // Misconfiguration (e.g. missing API_URL) must never leak to the client.
  if (!env.API_URL) {
    console.error("[serverClient] Missing NEXT_PUBLIC_API_URL env variable");
    throw new Error(GENERIC_ERROR);
  }

  const url = `${env.API_URL}${env.API_PREFIX}${endpoint}`;

  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch (error) {
    // Network / DNS / bad URL — log the detail, surface a generic message.
    console.error(`[serverClient] Request to ${url} failed:`, error);
    throw new Error(GENERIC_ERROR);
  }

  let data: { status?: boolean; message?: string } & Record<string, unknown>;
  try {
    data = await res.json();
  } catch (error) {
    console.error(`[serverClient] Invalid JSON from ${url}:`, error);
    throw new Error(GENERIC_ERROR);
  }

  console.log(`Server response from ${url}:`, data);

  // Backend business errors carry a safe, user-facing message.
  if (data.status === false) {
    throw new Error(data?.message || alternativeErrorMessage);
  }

  return data as T;
}
