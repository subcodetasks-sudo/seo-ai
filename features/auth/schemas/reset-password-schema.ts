import { z } from "zod";

type ResetPasswordSchemaMessages = {
  passwordMin: string;
  confirmPasswordRequired: string;
  passwordsMismatch: string;
};

export function createResetPasswordSchema(messages: ResetPasswordSchemaMessages) {
  return z
    .object({
      password: z.string().min(8, messages.passwordMin),
      confirmPassword: z.string().min(1, messages.confirmPasswordRequired),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: messages.passwordsMismatch,
      path: ["confirmPassword"],
    });
}
