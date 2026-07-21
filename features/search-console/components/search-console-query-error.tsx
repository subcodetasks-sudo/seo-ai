"use client";

import { useTranslations } from "next-intl";

import ErrorState from "@/components/error-state";
import { ApiError } from "@/lib/errors";

type SearchConsoleQueryErrorProps = {
  error: unknown;
  onRetry: () => void;
};

export function SearchConsoleQueryError({ error, onRetry }: SearchConsoleQueryErrorProps) {
  const t = useTranslations("searchConsole.errors");
  const tCommon = useTranslations("common.state");
  const tPicker = useTranslations("searchConsole.sitePicker");

  const isGoogleForbidden = error instanceof ApiError && error.status === 403;
  const title = isGoogleForbidden ? t("apiUnreachable") : tCommon("errorTitle");
  const description = isGoogleForbidden ? undefined : tCommon("errorDescription");

  return (
    <ErrorState
      title={title}
      description={description}
      retryLabel={tPicker("retry")}
      onRetry={onRetry}
      fullPage={false}
    />
  );
}
