"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BackLink from "@/components/back-link";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useDirection } from "@/components/ui/direction";
import { VerifyPanel } from "@/features/home/components/verify-panel";

const PLUGIN_DOWNLOAD_URL = "/ai-seo-platform.zip";

const INSTALL_ITEMS = ["installNav", "installUpload"] as const;
const CONNECT_ITEMS = ["connectOpen", "connectPaste", "connectAction"] as const;

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
    <div className="flex w-full flex-col gap-1 text-start">
      <label className="text-label-sm font-medium text-secondary-500">{label}</label>
      <div className="relative w-full">
        <Input
          value={value}
          readOnly
          dir="ltr"
          className="h-9 w-full rounded-lg border border-neutral-300 bg-white px-3 pe-24 py-1.5 text-left text-label-sm text-secondary-500"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className={cn(
            "absolute inset-s-1 top-1/2 h-7 -translate-y-1/2 gap-1 rounded-md border-neutral-200 bg-white px-2 text-label-xs font-medium text-secondary-500 hover:bg-neutral-50",
            copied && "border-success-200 bg-success-50 text-success-600 hover:bg-success-50",
          )}
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          <span>{copied ? t("copied") : t("copy")}</span>
        </Button>
      </div>
    </div>
  );
}

function StepNumber({ index }: { index: number }) {
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-label-sm font-semibold text-primary-700">
      {index}
    </span>
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
    <div className="flex w-full max-w-[720px] flex-col items-center gap-6" dir={dir}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-h1 font-bold text-secondary-500">{t("title")}</h1>
        <p className="text-label-md text-neutral-500">{t("subtitle")}</p>
      </div>

      <div className="flex w-full flex-col gap-5 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3 text-start">
          <StepNumber index={1} />
          <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-body font-semibold text-secondary-500">{t("stepDownloadTitle")}</p>
              <p className="text-label-sm leading-relaxed text-neutral-500">{t("stepDownloadDesc")}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              asChild
              className="h-10 shrink-0 gap-2 rounded-[10px] border-primary-200 bg-primary-100 px-4 text-label-md font-medium text-primary-700 shadow-sm hover:border-primary-300 hover:bg-primary-200 hover:text-primary-800"
            >
              <a href={PLUGIN_DOWNLOAD_URL} download="wordpress-plugin.zip">
                <Download className="size-4" />
                <span>{t("downloadPlugin")}</span>
              </a>
            </Button>
          </div>
        </div>

        <div className="border-t border-neutral-100" />

        <div className="flex items-start gap-3 text-start">
          <StepNumber index={2} />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <p className="text-body font-semibold text-secondary-500">{t("stepInstallTitle")}</p>
            <ul className="flex flex-col gap-1.5 ps-1">
              {INSTALL_ITEMS.map((key) => (
                <li key={key} className="flex items-start gap-2 text-label-sm leading-relaxed text-neutral-500">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-neutral-300" aria-hidden="true" />
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-100" />

        <div className="flex items-start gap-3 text-start">
          <StepNumber index={3} />
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-body font-semibold text-secondary-500">{t("stepConnectTitle")}</p>
              <p className="text-label-sm leading-relaxed text-neutral-500">{t("stepConnectDesc")}</p>
            </div>
            <div className="flex flex-col gap-2.5 rounded-md border border-neutral-100 bg-neutral-50/80 p-2.5">
              <CopyField label={t("setupTokenLabel")} value={setupToken ?? ""} />
              <CopyField label={t("setupLinkLabel")} value={setupLink ?? ""} />
            </div>
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
              {CONNECT_ITEMS.map((key, index) => (
                <li
                  key={key}
                  className="inline-flex items-center gap-1.5 text-label-sm text-neutral-500"
                >
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[11px] font-semibold text-secondary-500">
                    {index + 1}
                  </span>
                  <span>{t(key)}</span>
                  {index < CONNECT_ITEMS.length - 1 && (
                    <span className="ms-0.5 text-neutral-300" aria-hidden="true">
                      ·
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div
          className="flex items-center gap-3 rounded-xl border border-success-200 bg-white p-3.5 text-start shadow-sm ring-1 ring-success-100"
          style={{ animation: "fadeInUp 0.4s ease-out both" }}
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-success-50 text-success-400">
            <CheckCircle2 className="size-5" aria-hidden="true" />
          </span>
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="text-label-md font-semibold text-secondary-500">{t("stepDoneTitle")}</p>
            <p className="text-label-sm leading-relaxed text-neutral-500">{t("stepDoneDesc")}</p>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-1.5 rounded-lg border border-primary-200 bg-primary-50/50 px-3 py-2">
        <div className="flex items-start gap-1.5 text-start">
          <Info className="mt-0.5 size-3 shrink-0 text-primary-600" aria-hidden="true" />
          <p className="text-[11px] leading-snug text-secondary-500">{t("afterConnect")}</p>
        </div>
        <p className="border-t border-primary-100 pt-1.5 text-start text-[10px] leading-snug text-neutral-500">
          {t("tokenNote")}
        </p>
      </div>

      <div className="mt-2 flex w-full items-center justify-between gap-3">
        <BackLink onClick={onBack}>{t("back")}</BackLink>

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
