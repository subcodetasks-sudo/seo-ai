import { z } from "zod";

type ProfileSchemaMessages = {
  emailInvalid: string;
  fullNameMin: string;
};

export function createProfileSchema(messages: ProfileSchemaMessages) {
  return z.object({
    email: z.string().email(messages.emailInvalid),
    display_name: z.string().min(2, messages.fullNameMin),
  });
}
