import { z } from "zod";

type ForgotPasswordSchemaMessages = {
  emailInvalid: string;
};

export function createForgotPasswordSchema(messages: ForgotPasswordSchemaMessages) {
  return z.object({
    email: z.string().trim().email(messages.emailInvalid),
  });
}
