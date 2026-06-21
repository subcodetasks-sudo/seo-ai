import { env } from "@/config/env";

export async function serverClient<T>(
  endpoint: string,
  options: RequestInit = {},
  alternativeErrorMessage: string = "Request failed",
): Promise<T> {

    // endpoint should be relative to API_PREFIX, for example "auth/login"
  const res = await fetch(`${env.API_URL}${env.API_PREFIX}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await res.json();
    console.log(`Server response from ${env.API_URL}${env.API_PREFIX}${endpoint}:`, data);
  if (data.status === false) {
    throw new Error(data?.message || alternativeErrorMessage);
  }

  return data;
}