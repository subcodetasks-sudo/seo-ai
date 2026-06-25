import { z } from "zod";

import {
  createPasswordSchema,
  type PasswordSchemaMessages,
} from "@/features/auth/schemas/password-schema";

type RegisterSchemaMessages = PasswordSchemaMessages & {
  fullNameMin: string;
  emailInvalid: string;
};

export function createRegisterSchema(messages: RegisterSchemaMessages) {
  return z.object({
    display_name: z.string().trim().min(2, messages.fullNameMin),
    email: z.string().trim().email(messages.emailInvalid),
    password: createPasswordSchema(messages),
    // confirmPassword: z.string().min(1, messages.confirmPasswordRequired),
  });
}
