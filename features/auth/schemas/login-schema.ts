import { z } from "zod";

type LoginSchemaMessages = {
  emailInvalid: string;
  passwordMin: string;
};

export function createLoginSchema(messages: LoginSchemaMessages) {
  return z.object({
    email: z.string().trim().email(messages.emailInvalid),
    password: z.string().min(8, messages.passwordMin),
  });
}
