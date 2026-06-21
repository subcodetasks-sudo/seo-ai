import { z } from "zod";

type RefreshSchemaMessages = {
  refreshTokenRequired: string;
};

export function createRefreshSchema(messages: RefreshSchemaMessages) {
  return z.object({
    refresh_token: z.string().min(1, messages.refreshTokenRequired),
  });
}
