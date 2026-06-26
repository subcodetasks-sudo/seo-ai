"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Globe, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useDirection } from "@/components/ui/direction";
import { useCreateProject } from "@/features/home";
import type { Project } from "@/features/home/types";
import { step1Schema, type Step1FormData } from "@/features/home/schemas/add-project";

interface Step1Props {
  onNext: (project: Project) => void;
}

export default function Step1({ onNext }: Step1Props) {
  const dir = useDirection();
  const t = useTranslations("home.addProject.step1");
  const createProjectMutation = useCreateProject();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      websiteUrl: "",
      projectType: "wordpress",
    },
  });

  const projectType = watch("projectType");
  const urlError = errors.websiteUrl;

  const onSubmit = async (data: Step1FormData) => {
    const fullUrl = data.websiteUrl.startsWith("http") ? data.websiteUrl : `https://${data.websiteUrl}`;

    let projectName = "Untitled Project";
    try {
      projectName = new URL(fullUrl).hostname || projectName;
    } catch {
      // keep fallback name
    }

    try {
      const response = await createProjectMutation.mutateAsync({
        name: projectName,
        domain: fullUrl,
        platform: data.projectType,
        sitemap_url: null,
        url_filter: null,
      });
      onNext({ ...response.data, platform: data.projectType });
    } catch {
      // Errors surface via the global mutation handler.
    }
  };

  const isSubmitting = createProjectMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-[600px] flex-col items-center gap-6" dir={dir}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-h1 font-bold text-secondary-500">{t("title")}</h1>
        <p className="text-label-md text-neutral-500">{t("subtitle")}</p>
      </div>

      {/* Website URL Input Field */}
      <div className="flex w-full flex-col gap-2 text-start">
        <label htmlFor="website-url" className="text-label-md font-semibold text-secondary-500">
          {t("urlLabel")}
        </label>
        <Controller
          name="websiteUrl"
          control={control}
          render={({ field }) => (
            <div className="relative w-full">
              <Input
                {...field}
                id="website-url"
                type="text"
                placeholder="www.example.com"
                className={cn(
                  "h-12 w-full rounded-[10px] border border-neutral-300 bg-white px-4 py-2 text-left text-body placeholder:text-neutral-400 focus-visible:border-primary-300 focus-visible:ring-3 focus-visible:ring-primary-100/50",
                  urlError && "border-error-300 focus-visible:border-error-300 focus-visible:ring-error-100/50"
                )}
                dir="ltr"
              />
            </div>
          )}
        />
        {urlError && <span className="text-label-sm text-error-300">{urlError.message}</span>}
      </div>

      {/* Project Type Options */}
      <div className="flex w-full flex-col gap-3 text-start">
        <span className="text-label-md font-semibold text-secondary-500">
          {t("typeLabel")}
        </span>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* WordPress Card */}
          <Controller
            name="projectType"
            control={control}
            render={({ field }) => (
              <button
                type="button"
                onClick={() => field.onChange("wordpress")}
                className={cn(
                  "relative flex flex-col items-start gap-2 rounded-[12px] border border-neutral-200 bg-white p-5 text-start transition-all duration-200 outline-none hover:border-primary-200",
                  projectType === "wordpress" && "border-primary-300 bg-primary-50/40 ring-1 ring-primary-300"
                )}
              >
                <div
                  className={cn(
                    "absolute top-4 end-4 flex size-5 items-center justify-center rounded-full border border-neutral-200 bg-white transition-all",
                    projectType === "wordpress" && "border-primary-300 bg-primary-300 text-white"
                  )}
                >
                  {projectType === "wordpress" && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 4.5L3.5 7L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>

                <div className="mt-3 flex w-full flex-col items-start gap-1">
                  <Globe className="size-6 text-neutral-400" />
                  <span className="text-body font-bold text-secondary-500">{t("wordpressTitle")}</span>
                  <span className="text-label-sm text-neutral-500 leading-normal">{t("wordpressDesc")}</span>
                </div>
              </button>
            )}
          />

          {/* Custom Web Card */}
          <Controller
            name="projectType"
            control={control}
            render={({ field }) => (
              <button
                type="button"
                onClick={() => field.onChange("custom")}
                className={cn(
                  "relative flex flex-col items-start gap-2 rounded-[12px] border border-neutral-200 bg-white p-5 text-start transition-all duration-200 outline-none hover:border-primary-200",
                  projectType === "custom" && "border-primary-300 bg-primary-50/40 ring-1 ring-primary-300"
                )}
              >
                <div
                  className={cn(
                    "absolute top-4 end-4 flex size-5 items-center justify-center rounded-full border border-neutral-200 bg-white transition-all",
                    projectType === "custom" && "border-primary-300 bg-primary-300 text-white"
                  )}
                >
                  {projectType === "custom" && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 4.5L3.5 7L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>

                <div className="mt-3 flex w-full flex-col items-start gap-1">
                  <Globe className="size-6 text-neutral-400" />
                  <span className="text-body font-bold text-secondary-500">{t("customTitle")}</span>
                  <span className="text-label-sm text-neutral-500 leading-normal">{t("customDesc")}</span>
                </div>
              </button>
            )}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex w-full justify-start">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex h-11 items-center gap-2 rounded-[10px] bg-primary-300 px-6 font-semibold text-secondary-500 transition-all hover:bg-primary-300/90 active:translate-y-px disabled:opacity-50"
        >
          {isSubmitting && <LoaderCircle className="size-4 animate-spin" />}
          <span>{t("continue")}</span>
          {!isSubmitting && (dir === "rtl" ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />)}
        </Button>
      </div>
    </form>
  );
}
