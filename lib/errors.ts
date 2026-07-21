export class ApiError extends Error {
  constructor(
    message: string,
    public readonly errors?: Record<string, unknown>,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Extracts a JSON-serialisable error payload from any thrown value. */
export function toErrorResponse(error: unknown): {
  message: string;
  errors?: Record<string, unknown>;
} {
  if (error instanceof ApiError) {
    return { message: error.message, errors: error.errors };
  }
  return { message: error instanceof Error ? error.message : String(error) };
}

/** Prefer the upstream HTTP status when an ApiError carries one. */
export function resolveApiErrorStatus(error: unknown, fallback = 400): number {
  return error instanceof ApiError && error.status ? error.status : fallback;
}
