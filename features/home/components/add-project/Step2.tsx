"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Check, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useDirection } from "@/components/ui/direction";
import { VerifyPanel } from "@/features/home/components/verify-panel";

const PLUGIN_DOWNLOAD_URL = "/ai-seo-platform.zip";
const pluginInstructions = ["instruction1", "instruction2", "instruction3"] as const;

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
  setupLink?: string;
  setupToken?: string;
  platform?: "wordpress" | "salla" | "custom";
  projectId?: string;
}

function CopyField({ label, value }: { label: string; value: string }) {
  const t = useTranslations("home.addProject.step2");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex w-full flex-col gap-2 text-start">
      <label className="text-label-md font-semibold text-secondary-500">{label}</label>
      <div className="relative w-full">
        <Input
          value={value}
          readOnly
          dir="ltr"
          className="h-12 w-full rounded-[10px] border border-neutral-300 bg-neutral-50 px-4 pe-28 py-2 text-left text-body text-secondary-500"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className={cn(
            "absolute inset-s-1.5 top-1/2 h-9 -translate-y-1/2 gap-1.5 rounded-[8px] border-neutral-200 bg-white px-3 text-label-md font-medium text-secondary-500 hover:bg-neutral-50",
            copied && "border-success-200 bg-success-50 text-success-600 hover:bg-success-50",
          )}
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          <span>{copied ? t("copied") : t("copy")}</span>
        </Button>
      </div>
    </div>
  );
}

function WordPressStep2({
  onNext,
  onBack,
  setupLink,
  setupToken,
}: {
  onNext: () => void;
  onBack: () => void;
  setupLink?: string;
  setupToken?: string;
}) {
  const dir = useDirection();
  const t = useTranslations("home.addProject.step2");

  return (
    <div className="flex w-full max-w-150 flex-col items-center gap-6" dir={dir}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-h1 font-bold text-secondary-500">{t("title")}</h1>
        <p className="text-label-md text-neutral-500">{t("subtitle")}</p>
      </div>

      <div className="w-full rounded-[12px] border border-neutral-200 bg-white p-5">
        <ol className="flex flex-col gap-5">
          {pluginInstructions.map((key, index) => (
            <li key={key} className="flex items-start gap-3 text-start">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-label-sm font-semibold text-secondary-500">
                {index + 1}
              </span>
              {key === "instruction1" ? (
                <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-body text-secondary-500">{t(key)}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-9 shrink-0 gap-2 rounded-[10px] border-neutral-200 bg-primary-300 px-4 text-label-md font-medium text-secondary-500 hover:bg-primary-500"
                  >
                    <a href={PLUGIN_DOWNLOAD_URL} download>
                      <Download className="size-4" />
                      <span>{t("downloadPlugin")}</span>
                    </a>
                  </Button>
                </div>
              ) : (
                <span className="flex-1 text-body text-secondary-500">{t(key)}</span>
              )}
            </li>
          ))}
        </ol>
      </div>

      <CopyField label={t("setupLinkLabel")} value={setupLink ?? ""} />
      <CopyField label={t("setupTokenLabel")} value={setupToken ?? ""} />

      <div className="mt-4 flex w-full items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="flex h-11 items-center gap-2 px-2 text-label-md font-medium text-neutral-500 hover:bg-transparent hover:text-secondary-500 disabled:opacity-50"
        >
          {dir === "rtl" ? <ArrowRight className="size-4" /> : <ArrowLeft className="size-4" />}
          <span>{t("back")}</span>
        </Button>

        <Button
          type="button"
          onClick={onNext}
          className="flex h-11 items-center gap-2 rounded-[10px] bg-primary-300 px-6 font-semibold text-secondary-500 transition-all hover:bg-primary-300/90 active:translate-y-px disabled:opacity-50"
        >
          <span>{t("continue")}</span>
          {dir === "rtl" ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
        </Button>
      </div>
    </div>
  );
}

export default function Step2({ onNext, onBack, setupLink, setupToken, platform, projectId }: Step2Props) {
  if (platform === "custom" && projectId) {
    return (
      <VerifyPanel
        projectId={projectId}
        onVerified={onNext}
        onBack={onBack}
        onSkip={onNext}
      />
    );
  }

  return (
    <WordPressStep2
      onNext={onNext}
      onBack={onBack}
      setupLink={setupLink}
      setupToken={setupToken}
    />
  );
}
