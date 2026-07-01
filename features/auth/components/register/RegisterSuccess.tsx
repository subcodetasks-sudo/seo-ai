"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type RegisterSuccessProps = {
  className?: string;
};

export function RegisterSuccess({ className }: RegisterSuccessProps) {
  const router = useRouter();
  const t = useTranslations("auth.success");
  const tToast = useTranslations("auth.toast");

  function handleContinue() {
    toast.success(tToast("accountCreated"));
    router.push("/login");
  }

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
        type="button"
        onClick={handleContinue}
        className="h-11 w-full bg-primary-300 text-secondary-500 hover:bg-primary-200"
      >
        {t("continue")}
      </Button>
    </div>
  );
}
