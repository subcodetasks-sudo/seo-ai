"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type ResetSuccessProps = {
  className?: string;
};

export function ResetSuccess({ className }: ResetSuccessProps) {
  const t = useTranslations("auth.resetPasswordSuccess");

  return (
    <div className={cn("flex w-full flex-col items-center gap-8", className)}>
      <div
        className="flex size-24 items-center justify-center rounded-full bg-success-200 sm:size-28"
        aria-hidden
      >
        <Check className="size-10 text-white sm:size-12" strokeWidth={2.5} />
      </div>

      <h1 className="text-center text-h2 font-medium text-secondary-500">
        {t("title")}
      </h1>

      <Button
        asChild
        className="h-11 w-full bg-primary-300 text-secondary-500 hover:bg-primary-200"
      >
        <Link href="/login">{t("submit")}</Link>
      </Button>
    </div>
  );
}
