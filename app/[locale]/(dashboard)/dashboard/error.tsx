"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

import ErrorState from "@/components/error-state";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const t = useTranslations("common.state");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-neutral-75 px-6 py-8 lg:px-10">
      <ErrorState
        title={t("errorTitle")}
        description={t("errorDescription")}
        retryLabel={t("retry")}
        onRetry={unstable_retry}
      />
    </div>
  );
}
