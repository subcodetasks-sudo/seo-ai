import { z } from "zod";

const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
const projectTypes = ["wordpress", "custom", "salla"] as const;

export const step1Schema = z.object({
  websiteUrl: z
    .string()
    .min(1, "URL is required")
    .regex(urlRegex, "Invalid URL format"),
  projectType: z.enum(projectTypes),
  sitemapUrl: z
    .string()
    .regex(urlRegex, "Invalid URL format")
    .optional()
    .or(z.literal("")),
});

export type Step1FormData = z.infer<typeof step1Schema>;

export const step2Schema = z.object({
  token: z.string().min(1, "Token is required"),
});

export type Step2FormData = z.infer<typeof step2Schema>;

export const step3Schema = z.object({
  selectedSections: z.set(z.string()),
});

export type Step3FormData = z.infer<typeof step3Schema>;
