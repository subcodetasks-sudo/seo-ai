"use client";

import { useState } from "react";
import { CircleCheck, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useDirection } from "@/components/ui/direction";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { redirectBrokenPage } from "../queries/api";

const MOCK_DATA = {
  referrer: "collections/womens/",
  brokenUrl: "products/rose-elixir-discontinued/",
  detectedAt: "3",
  suggestedRedirectUrl: "/products/rose-garden-elixir",
} as const;

type InfoCardProps = {
  label: string;
  value: string;
  valueClassName?: string;
};

function InfoCard({ label, value, valueClassName }: InfoCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-4">
      <span className="text-label-xs text-neutral-400 text-start">{label}</span>
      <span className={cn("text-label-md font-medium text-start", valueClassName ?? "text-secondary-500")}>
        {value}
      </span>
    </div>
  );
}

export function AiFixContent() {
  const t = useTranslations("notFoundProblems.aifix");
  const dir = useDirection();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [manualUrl, setManualUrl] = useState("");
  const isRtl = dir === "rtl";

  const projectId = searchParams.get("projectId") ?? "";
  const pageId = searchParams.get("pageId") ?? "";

  const redirectMutation = useMutation({
    mutationFn: (targetUrl: string) =>
      redirectBrokenPage(projectId, pageId, targetUrl),
    onSuccess: () => {
      router.back();
    },
  });

  function handleApprove() {
    redirectMutation.mutate(MOCK_DATA.suggestedRedirectUrl);
  }

  function handleApply() {
    if (!manualUrl.trim()) return;
    redirectMutation.mutate(manualUrl.trim());
  }

  const isPending = redirectMutation.isPending;

  return (
    <div dir={dir} className="flex flex-1 flex-col bg-neutral-75 px-6 py-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">

        <h1 className="text-h1 font-semibold text-secondary-500 text-start">{t("title")}</h1>

        {/* Row 1: Referrer + Broken URL */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoCard label={t("referrer")} value={MOCK_DATA.referrer} />
          <InfoCard
            label={t("brokenUrl")}
            value={MOCK_DATA.brokenUrl}
            valueClassName="text-error-500"
          />
        </div>

        {/* Row 2: Status + Detected At */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoCard label={t("status")} value={t("unresolved")} />
          <InfoCard label={t("detectedAt")} value={t("daysAgo", { count: MOCK_DATA.detectedAt })} />
        </div>

        {/* AI Redirect Suggestion */}
        <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4">
          <div className="flex items-center justify-start gap-2">
            <Sparkles className="size-4 text-primary-400" aria-hidden="true" />
            <span className="text-label-md font-semibold text-secondary-500">{t("aiSuggestion")}</span>
          </div>

          <div className="flex flex-col gap-2 rounded-lg bg-neutral-100 p-3">
            <span className="text-label-xs text-neutral-400 text-start">{t("suggestedUrl")}</span>
            <span className="font-mono text-label-md font-semibold text-secondary-500 text-start">
              {MOCK_DATA.suggestedRedirectUrl}
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-label-sm font-semibold text-error-500 text-start">{t("reason")}</span>
              <p className="text-label-sm text-secondary-400 text-start leading-relaxed">
                {t("reasonText")}
              </p>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleApprove}
            disabled={isPending || !projectId || !pageId}
            className="w-full gap-2 bg-primary-300 text-secondary-500 hover:bg-primary-400 h-11"
          >
            <CircleCheck className="size-4" aria-hidden="true" />
            {t("approve")}
          </Button>
        </div>

        {/* Manual Entry */}
        <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4">
          <span className="text-label-md font-medium text-secondary-500 text-start">
            {t("enterManually")}
          </span>
          <div className="flex gap-2">
            <Input
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              placeholder={t("manualPlaceholder")}
              className="h-10 flex-1"
              disabled={isPending}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleApply}
              disabled={isPending || !manualUrl.trim() || !projectId || !pageId}
              className="shrink-0 border-neutral-200 bg-white text-secondary-500 hover:bg-neutral-50"
            >
              {t("apply")}
            </Button>
          </div>
        </div>

        {/* Back link */}
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-label-sm text-neutral-500 hover:text-secondary-500 transition-colors self-start"
        >
          {isRtl ? (
            <>
              {t("back")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </>
          ) : (
            <>
              <ArrowLeft className="size-4" aria-hidden="true" />
              {t("back")}
            </>
          )}
        </button>

      </div>
    </div>
  );
}
