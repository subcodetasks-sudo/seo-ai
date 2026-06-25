import { z } from "zod";

import {
  createPasswordSchema,
  type PasswordSchemaMessages,
} from "@/features/auth/schemas/password-schema";

type LoginSchemaMessages = PasswordSchemaMessages & {
  emailInvalid: string;
};

export function createLoginSchema(messages: LoginSchemaMessages) {
  return z.object({
    email: z.string().trim().email(messages.emailInvalid),
    password: createPasswordSchema(messages),
  });
}
