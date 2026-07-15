import { z } from "zod";

const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
const projectTypes = ["wordpress", "custom", "salla"] as const;

type Step1Messages = {
  urlRequired: string;
  invalidUrl: string;
};

export function createStep1Schema(messages: Step1Messages) {
  return z.object({
    websiteUrl: z
      .string()
      .min(1, messages.urlRequired)
      .regex(urlRegex, messages.invalidUrl),
    projectType: z.enum(projectTypes),
  });
}

export const step1Schema = createStep1Schema({
  urlRequired: "URL is required",
  invalidUrl: "Invalid URL format",
});

export type Step1FormData = z.infer<ReturnType<typeof createStep1Schema>>;

export const step2Schema = z.object({
  token: z.string().min(1, "Token is required"),
});

export type Step2FormData = z.infer<typeof step2Schema>;

export const step3Schema = z.object({
  selectedSections: z.set(z.string()),
});

export type Step3FormData = z.infer<typeof step3Schema>;
