"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type ResendOtpFormValues = {
  email: string;
};

type ResendOtpCodeProps = {
  defaultEmail?: string;
  className?: string;
  verifyPath?: string;
};

export function ResendOtpCode({
  defaultEmail = "",
  className,
  verifyPath = "/register/verify",
}: ResendOtpCodeProps) {
  const router = useRouter();
  const t = useTranslations("auth.resendOtp");
  const tToast = useTranslations("auth.toast");
  const tValidation = useTranslations("auth.register.validation");

  const schema = useMemo(
    () =>
      z.object({
        email: z.string().trim().email(tValidation("emailInvalid")),
      }),
    [tValidation]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendOtpFormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      email: defaultEmail,
    },
  });

  function onSubmit(data: ResendOtpFormValues) {
    // UI-only: no API wiring yet.
    const isForgetPasswordFlow = verifyPath.includes("forget-password");
    toast.success(
      tToast(isForgetPasswordFlow ? "forgetPasswordOtpSent" : "otpSent")
    );
    router.push(`${verifyPath}?email=${encodeURIComponent(data.email)}`);
  }

  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="space-y-2 text-center">
          <h1 className="text-h2 font-medium text-secondary-500">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="resend-email">{t("email")}</FieldLabel>
          <Input
            id="resend-email"
            {...register("email")}
            type="email"
            autoComplete="email"
            dir="ltr"
            placeholder={t("emailPlaceholder")}
            aria-invalid={!!errors.email}
            className="h-11 bg-white"
          />
          {errors.email ? (
            <div className="flex items-center gap-1.5 text-destructive">
              <AlertTriangle className="size-4 shrink-0" aria-hidden />
              <FieldError errors={[errors.email]} />
            </div>
          ) : null}
        </Field>

        <div className="flex flex-col gap-4">
          <Button
            type="submit"
            className="h-11 w-full bg-primary-300 text-secondary-500 hover:bg-primary-200"
          >
            {t("submit")}
          </Button>
        </div>
      </form>
    </div>
  );
}
