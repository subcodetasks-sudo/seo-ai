import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Decodes percent-encoded URL segments (e.g. Arabic slugs) for human-readable display. */
export function decodeUrlForDisplay(url: string): string {
  try {
    return decodeURIComponent(url);
  } catch {
    return url;
  }
}

/** Returns a decoded pathname for display, falling back to a decoded raw string for relative paths. */
export function getDisplayPathname(url: string): string {
  try {
    return decodeUrlForDisplay(new URL(url).pathname);
  } catch {
    return decodeUrlForDisplay(url);
  }
}
