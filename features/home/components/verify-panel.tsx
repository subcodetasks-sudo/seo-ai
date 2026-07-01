"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Code,
  Copy,
  FileCode2,
  Globe,
  Loader2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useDirection } from "@/components/ui/direction";
import { verificationTokenQueryOptions } from "@/features/home/queries/queries";
import { useVerifyDomain } from "@/features/home/queries/mutations";

type VerifyMethod = "meta_tag" | "html_file" | "dns_txt";

type MethodConfig = {
  id: VerifyMethod;
  label: string;
  description: string;
  icon: LucideIcon;
};

interface VerifyPanelProps {
  projectId: string;
  onVerified: () => void;
  onBack?: () => void;
  onSkip?: () => void;
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

export function VerifyPanel({ projectId, onVerified, onBack, onSkip }: VerifyPanelProps) {
  const t = useTranslations("home.addProject.step2");
  const dir = useDirection();
  const [selectedMethod, setSelectedMethod] = useState<VerifyMethod>("meta_tag");

  const { data, isLoading } = useQuery(verificationTokenQueryOptions(projectId));
  const verifyMutation = useVerifyDomain();

  const tokenData = data?.data;

  const methods: MethodConfig[] = [
    { id: "meta_tag", label: t("metaTagMethod"), description: t("metaTagDesc"), icon: Code },
    { id: "html_file", label: t("htmlFileMethod"), description: t("htmlFileDesc"), icon: FileCode2 },
    { id: "dns_txt", label: t("dnsTxtMethod"), description: t("dnsTxtDesc"), icon: Globe },
  ];

  const handleVerify = () => {
    verifyMutation.mutate(
      { method: selectedMethod, projectId },
      {
        onSuccess: () => {
          toast.success(t("verificationSuccess"));
          onVerified();
        },
      },
    );
  };

  const filename = tokenData?.html_file_url.split("/").pop() ?? "";
  const hasNav = onBack !== undefined || onSkip !== undefined;

  return (
    <div className="flex w-full max-w-150 flex-col items-center gap-6" dir={dir}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-h1 font-bold text-secondary-500">{t("customTitle")}</h1>
        <p className="text-label-md text-neutral-500">{t("customSubtitle")}</p>
      </div>

      <div className="grid w-full grid-cols-3 gap-3">
        {methods.map(({ id, label, description, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setSelectedMethod(id)}
            className={cn(
              "flex flex-col items-start gap-3 rounded-[12px] border p-4 text-start transition-all",
              selectedMethod === id
                ? "border-primary-300 bg-primary-50/50 shadow-sm"
                : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50",
            )}
          >
            <div
              className={cn(
                "flex size-9 items-center justify-center rounded-[8px]",
                selectedMethod === id ? "bg-primary-100" : "bg-neutral-100",
              )}
            >
              <Icon
                size={18}
                className={cn(selectedMethod === id ? "text-primary-600" : "text-secondary-400")}
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-label-md font-semibold text-secondary-500">{label}</span>
              <span className="text-label-sm text-neutral-400">{description}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="w-full rounded-[12px] border border-neutral-200 bg-white p-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="size-5 animate-spin text-neutral-400" />
          </div>
        ) : tokenData ? (
          <>
            {selectedMethod === "meta_tag" && (
              <div className="flex flex-col gap-4">
                <p className="text-label-sm text-neutral-500">{t("metaTagInstruction")}</p>
                <CopyField label={t("metaTagMethod")} value={tokenData.meta_tag} />
              </div>
            )}
            {selectedMethod === "html_file" && (
              <div className="flex flex-col gap-4">
                <CopyField label={t("htmlFileNameLabel")} value={filename} />
                <CopyField label={t("htmlFileContentLabel")} value={tokenData.html_file_content} />
                <p className="text-label-sm text-neutral-500">{t("htmlFileInstruction")}</p>
              </div>
            )}
            {selectedMethod === "dns_txt" && (
              <div className="flex flex-col gap-4">
                <CopyField label={t("dnsTxtMethod")} value={tokenData.dns_txt} />
                <p className="text-label-sm text-neutral-500">{t("dnsNote")}</p>
              </div>
            )}
          </>
        ) : null}
      </div>

      <div
        className={cn(
          "mt-4 flex w-full items-center",
          hasNav ? "justify-between" : "justify-end",
        )}
      >
        {hasNav && (
          <div className="flex items-center gap-1">
            {onBack && (
              <Button
                type="button"
                variant="ghost"
                onClick={onBack}
                className="flex h-11 items-center gap-2 px-2 text-label-md font-medium text-neutral-500 hover:bg-transparent hover:text-secondary-500"
              >
                {dir === "rtl" ? <ArrowRight className="size-4" /> : <ArrowLeft className="size-4" />}
                <span>{t("back")}</span>
              </Button>
            )}
            {onSkip && (
              <Button
                type="button"
                variant="ghost"
                onClick={onSkip}
                className="flex h-11 items-center gap-2 px-2 text-label-md font-medium text-neutral-400 hover:bg-transparent hover:text-neutral-600"
              >
                <span>{t("skip")}</span>
              </Button>
            )}
          </div>
        )}

        <Button
          type="button"
          onClick={handleVerify}
          disabled={verifyMutation.isPending || !tokenData}
          className="flex h-11 items-center gap-2 rounded-[10px] bg-primary-300 px-6 font-semibold text-secondary-500 transition-all hover:bg-primary-300/90 active:translate-y-px disabled:opacity-50"
        >
          {verifyMutation.isPending && <Loader2 className="size-4 animate-spin" />}
          <span>{t("verifyNow")}</span>
        </Button>
      </div>
    </div>
  );
}
