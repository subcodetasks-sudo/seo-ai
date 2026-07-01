import { z } from "zod";

type ResetPasswordSchemaMessages = {
  otpRequired: string;
  passwordMin: string;
};

export function createResetPasswordSchema(messages: ResetPasswordSchemaMessages) {
  return z.object({
    otp: z.string().min(1, messages.otpRequired),
    new_password: z.string().min(8, messages.passwordMin),
  });
}
