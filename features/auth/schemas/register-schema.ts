import { z } from "zod";

type RegisterSchemaMessages = {
  fullNameMin: string;
  emailInvalid: string;
  passwordMin: string;
  passwordDigitRequired: string;
};

export function createRegisterSchema(messages: RegisterSchemaMessages) {
  return z
    .object({
      display_name: z.string().trim().min(2, messages.fullNameMin),
      email: z.string().trim().email(messages.emailInvalid),
      password: z.string().min(8, messages.passwordMin).regex(/\d/, messages.passwordDigitRequired),
      // confirmPassword: z.string().min(1, messages.confirmPasswordRequired),
    })
}
