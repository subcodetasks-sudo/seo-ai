import { env } from "@/config/env";

export async function serverClient<T>(
  endpoint: string,
  options: RequestInit = {},
  alternativeErrorMessage: string = "Request failed",
): Promise<T> {

  const res = await fetch(`${env.API_URL}/api/v1${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok || data.status === false) {
    throw new Error(data.message || alternativeErrorMessage);
  }

  return data;
}