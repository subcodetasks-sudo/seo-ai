import { z } from "zod";

type ChangePasswordSchemaMessages = {
  currentPasswordMin: string;
  newPasswordMin: string;
};

export function createChangePasswordSchema(messages: ChangePasswordSchemaMessages) {
  return z.object({
    current_password: z.string().min(8, messages.currentPasswordMin),
    new_password: z.string().min(8, messages.newPasswordMin),
  });
}
