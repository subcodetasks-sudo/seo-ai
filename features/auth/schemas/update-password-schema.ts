import { z } from "zod";

type UpdatePasswordSchemaMessages = {
  currentPasswordMin: string;
  newPasswordMin: string;
};

export function createUpdatePasswordSchema(messages: UpdatePasswordSchemaMessages) {
  return z.object({
    current_password: z.string().min(8, messages.currentPasswordMin),
    new_password: z.string().min(8, messages.newPasswordMin),
  });
}
