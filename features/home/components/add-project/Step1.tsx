"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useDirection } from "@/components/ui/direction";

interface Step1Props {
  onNext: (data: { websiteUrl: string; projectType: "wordpress" | "custom" }) => void;
}

export default function Step1({ onNext }: Step1Props) {
  const dir = useDirection();
  const t = useTranslations("home.addProject.step1");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [projectType, setProjectType] = useState<"wordpress" | "custom">("wordpress");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteUrl.trim()) {
      setError(t("urlRequired"));
      return;
    }
    // Simple URL validation
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!urlPattern.test(websiteUrl)) {
      setError(t("invalidUrl"));
      return;
    }
    setError("");
    onNext({ websiteUrl, projectType });
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-[600px] flex-col items-center gap-6" dir={dir}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-h1 font-bold text-secondary-500">{t("title")}</h1>
        <p className="text-label-md text-neutral-500">{t("subtitle")}</p>
      </div>

      {/* Website URL Input Field */}
      <div className="flex w-full flex-col gap-2 align-right text-start">
        <label htmlFor="website-url" className="text-label-md font-semibold text-secondary-500">
          {t("urlLabel")}
        </label>
        <div className="relative w-full">
          <Input
            id="website-url"
            type="text"
            placeholder="www.gmame.com"
            value={websiteUrl}
            onChange={(e) => {
              setWebsiteUrl(e.target.value);
              if (error) setError("");
            }}
            className={cn(
              "h-12 w-full rounded-[10px] border border-neutral-300 bg-white px-4 py-2 text-left text-body placeholder:text-neutral-400 focus-visible:border-primary-300 focus-visible:ring-3 focus-visible:ring-primary-100/50",
              error && "border-error-300 focus-visible:border-error-300 focus-visible:ring-error-100/50"
            )}
            dir="ltr"
          />
        </div>
        {error && <span className="text-label-sm text-error-300">{error}</span>}
      </div>

      {/* Project Type Options */}
      <div className="flex w-full flex-col gap-3 text-start">
        <span className="text-label-md font-semibold text-secondary-500">
          {t("typeLabel")}
        </span>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* WordPress Card */}
          <button
            type="button"
            onClick={() => setProjectType("wordpress")}
            className={cn(
              "relative flex flex-col items-start gap-2 rounded-[12px] border border-neutral-200 bg-white p-5 text-start transition-all duration-200 outline-none hover:border-primary-200",
              projectType === "wordpress" && "border-primary-300 bg-primary-50/40 ring-1 ring-primary-300"
            )}
          >
            {/* Custom Checkbox Top Left (Relative to RTL context, meaning top right visually but using start/end logic) */}
            <div
              className={cn(
                "absolute top-4 end-4 flex size-5 items-center justify-center rounded-full border border-neutral-200 bg-white transition-all",
                projectType === "wordpress" && "border-primary-300 bg-primary-300 text-white"
              )}
            >
              {projectType === "wordpress" && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 4.5L3.5 7L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>

            <div className="mt-3 flex w-full flex-col items-start gap-1">
              <Globe className="size-6 text-neutral-400" />
              <span className="text-body font-bold text-secondary-500">{t("wordpressTitle")}</span>
              <span className="text-label-sm text-neutral-500 leading-normal">{t("wordpressDesc")}</span>
            </div>
          </button>

          {/* Custom Web Card */}
          <button
            type="button"
            onClick={() => setProjectType("custom")}
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
                  <path d="M1 4.5L3.5 7L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>

            <div className="mt-3 flex w-full flex-col items-start gap-1">
              <Globe className="size-6 text-neutral-400" />
              <span className="text-body font-bold text-secondary-500">{t("customTitle")}</span>
              <span className="text-label-sm text-neutral-500 leading-normal">{t("customDesc")}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex w-full justify-start">
        <Button
          type="submit"
          className="flex h-11 items-center gap-2 rounded-[10px] bg-primary-300 px-6 font-semibold text-secondary-500 transition-all hover:bg-primary-300/90 active:translate-y-px"
        >
          <span>{t("continue")}</span>
          {dir === "rtl" ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
        </Button>
      </div>
    </form>
  );
}
