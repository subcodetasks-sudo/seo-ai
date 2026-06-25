import { z } from "zod";

type ChangePasswordSchemaMessages = {
  currentPasswordMin: string;
  newPasswordMin: string;
  confirmPasswordMin: string;
  passwordsMismatch: string;
};

export function createChangePasswordSchema(messages: ChangePasswordSchemaMessages) {
  return z
    .object({
      current_password: z.string().min(8, messages.currentPasswordMin),
      new_password: z.string().min(8, messages.newPasswordMin),
      confirm_password: z.string().min(8, messages.confirmPasswordMin),
    })
    .refine((data) => data.new_password === data.confirm_password, {
      message: messages.passwordsMismatch,
      path: ["confirm_password"],
    });
}
