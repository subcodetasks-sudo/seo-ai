import { z } from "zod";

type VerifyEmailSchemaMessages = {
  tokenRequired: string;
};

export function createVerifyEmailSchema(messages: VerifyEmailSchemaMessages) {
  return z.object({
    token: z.string().min(1, messages.tokenRequired),
  });
}
