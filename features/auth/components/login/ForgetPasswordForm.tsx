"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, LoaderCircle } from 'lucide-react';
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createForgotPasswordSchema } from "@/features/auth/schemas/forgot-password-schema";
import { useForgotPassword } from "@/features/auth/queries/mutations";
import type { ForgotPasswordFormValues } from "@/features/auth/types";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type ForgetPasswordFormProps = {
  defaultEmail?: string;
  className?: string;
};

export function ForgetPasswordForm({
  defaultEmail = "",
  className,
}: ForgetPasswordFormProps) {
  const router = useRouter();
  const t = useTranslations("auth.forgetPassword");
  const tToast = useTranslations("auth.toast");
  const tValidation = useTranslations("auth.login.validation");
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const schema = useMemo(
    () =>
      createForgotPasswordSchema({
        emailInvalid: tValidation("emailInvalid"),
      }),
    [tValidation]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      email: defaultEmail,
    },
  });

  function onSubmit(data: ForgotPasswordFormValues) {
    forgotPassword(data, {
      onSuccess: () => {
        toast.success(tToast("forgetPasswordOtpSent"));
        router.push(
          `/login/forget-password/verify?email=${encodeURIComponent(data.email)}`
        );
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "error"
        );
      },
    });
  }

  function handleCancel() {
    router.push("/login");
  }

  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="space-y-2 text-center">
          <h1 className="text-h2 font-medium text-secondary-500">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="forget-password-email">{t("email")}</FieldLabel>
          <Input
            id="forget-password-email"
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
            // className="h-11 w-full bg-primary-300 text-secondary-500 hover:bg-primary-200 disabled:opacity-50"
            className={cn("h-11 w-full bg-primary-300 text-secondary-500 hover:bg-primary-200", {
              "cursor-not-allowed opacity-50": isPending,
            })}
          >
            {isPending ? <LoaderCircle /> : t("submit")}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="h-11 w-full border-neutral-200 bg-white text-secondary-500 hover:bg-neutral-50"
          >
            {t("cancel")}
          </Button>
        </div>
      </form>
    </div>
  );
}
