"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { createResetPasswordSchema } from "@/features/auth/schemas/reset-password-schema";
import type { ResetPasswordFormValues } from "@/features/auth/types";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type AuthFormFieldProps = {
  label: string;
  error?: { message?: string };
  successMessage?: string;
  showSuccess?: boolean;
  children: React.ReactNode;
};

function AuthFormField({
  label,
  error,
  successMessage,
  showSuccess,
  children,
}: AuthFormFieldProps) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={undefined}>{label}</FieldLabel>
      {children}
      {error ? (
        <div className="flex items-center gap-1.5 text-destructive">
          <AlertTriangle className="size-4 shrink-0" aria-hidden />
          <FieldError errors={[error]} />
        </div>
      ) : null}
      {showSuccess && successMessage ? (
        <div className="flex items-center gap-1.5 text-success-300">
          <CheckCircle2 className="size-4 shrink-0" aria-hidden />
          <p className="text-sm">{successMessage}</p>
        </div>
      ) : null}
    </Field>
  );
}

type ResetPassFormProps = {
  className?: string;
};

export function ResetPassForm({ className }: ResetPassFormProps) {
  const router = useRouter();
  const t = useTranslations("auth.resetPassword");
  const tToast = useTranslations("auth.toast");
  const tValidation = useTranslations("auth.resetPassword.validation");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const schema = useMemo(
    () =>
      createResetPasswordSchema({
        passwordMin: tValidation("passwordMin"),
        confirmPasswordRequired: tValidation("confirmPasswordRequired"),
        passwordsMismatch: tValidation("passwordsMismatch"),
      }),
    [tValidation]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, dirtyFields },
    watch,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const values = watch();

  function onSubmit(_data: ResetPasswordFormValues) {
    // UI-only: validation passed; no API wiring yet.
    toast.success(tToast("passwordReset"));
    router.push("/reset-password/success");
  }

  function fieldSuccess(field: keyof ResetPasswordFormValues) {
    return (
      touchedFields[field] &&
      dirtyFields[field] &&
      !errors[field] &&
      values[field]?.length > 0
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="space-y-2 text-center">
          <h1 className="text-h2 font-medium text-secondary-500">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        <FieldGroup>
          <AuthFormField
            label={t("password")}
            error={errors.password}
            successMessage={t("fieldValid")}
            showSuccess={fieldSuccess("password")}
          >
            <InputGroup
              className={cn(
                "h-11 bg-white",
                fieldSuccess("password") && "border-success-300"
              )}
            >
              <InputGroupInput
                {...register("password")}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder={t("passwordPlaceholder")}
                aria-invalid={!!errors.password}
              />
              <InputGroupAddon align="inline-end" className="m-1">
                <InputGroupButton
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4 text-muted-foreground" />
                  ) : (
                    <Eye className="size-4 text-muted-foreground" />
                  )}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </AuthFormField>

          <AuthFormField
            label={t("confirmPassword")}
            error={errors.confirmPassword}
            successMessage={t("fieldValid")}
            showSuccess={fieldSuccess("confirmPassword")}
          >
            <InputGroup
              className={cn(
                "h-11 bg-white",
                fieldSuccess("confirmPassword") && "border-success-300"
              )}
            >
              <InputGroupInput
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder={t("confirmPasswordPlaceholder")}
                aria-invalid={!!errors.confirmPassword}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4 text-muted-foreground" />
                  ) : (
                    <Eye className="size-4 text-muted-foreground" />
                  )}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </AuthFormField>
        </FieldGroup>

        <Button
          type="submit"
          className="h-11 w-full bg-primary-300 text-secondary-500 hover:bg-primary-200"
        >
          {t("submit")}
        </Button>
      </form>
    </div>
  );
}
