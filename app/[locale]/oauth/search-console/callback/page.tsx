"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { useSearchConsoleCallback } from "@/features/search-console";
import { useRouter } from "@/i18n/navigation";

export default function SearchConsoleOAuthCallbackPage() {
  const t = useTranslations("searchConsole.callbackPage");
  const searchParams = useSearchParams();
  const router = useRouter();

  const code = searchParams.get("code");
  const projectId = searchParams.get("state");
  const oauthError = searchParams.get("error");

  const { mutate, isPending, isError } = useSearchConsoleCallback(projectId ?? "");
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current || !code || !projectId || oauthError) return;
    attempted.current = true;
    mutate(code, {
      onSuccess: () => router.replace("/dashboard/search-console"),
    });
  }, [code, projectId, oauthError, mutate, router]);

  const failed = !code || !projectId || !!oauthError || isError;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-75 px-6 text-center">
      {failed ? (
        <ErrorState
          title={t("errorTitle")}
          description={t("errorDescription")}
          retryLabel={t("backToDashboard")}
          onRetry={() => router.replace("/dashboard/search-console")}
        />
      ) : (
        <>
          <LoadingState />
          <p className="text-label-md text-neutral-500">{isPending ? t("connecting") : t("redirecting")}</p>
        </>
      )}
    </div>
  );
}
