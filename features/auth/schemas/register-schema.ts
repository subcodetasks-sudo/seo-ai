import { z } from "zod";

import type { RegisterFormValues } from "@/features/auth/types";

type RegisterSchemaMessages = {
  fullNameMin: string;
  emailInvalid: string;
  passwordMin: string;
  confirmPasswordRequired: string;
  passwordsMismatch: string;
};

export function createRegisterSchema(messages: RegisterSchemaMessages) {
  return z
    .object({
      fullName: z.string().trim().min(2, messages.fullNameMin),
      email: z.string().trim().email(messages.emailInvalid),
      password: z.string().min(8, messages.passwordMin),
      confirmPassword: z.string().min(1, messages.confirmPasswordRequired),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: messages.passwordsMismatch,
      path: ["confirmPassword"],
    });
}
