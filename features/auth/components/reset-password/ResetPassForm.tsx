"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { InputOTP, InputOTPGroup } from "@/components/ui/input-otp";
import { CircularOtpSlot } from "@/features/auth/components/CircularOtpSlot";
import { createResetPasswordSchema } from "@/features/auth/schemas/reset-password-schema";
import { useResetPassword } from "@/features/auth/queries/mutations";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const OTP_LENGTH = 6;

type ResetPassFormValues = {
  otp: string;
  new_password: string;
};

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
  email: string;
  resendHref?: string;
  className?: string;
};

export function ResetPassForm({ email, resendHref, className }: ResetPassFormProps) {
  const router = useRouter();
  const t = useTranslations("auth.resetPassword");
  const tToast = useTranslations("auth.toast");
  const tValidation = useTranslations("auth.resetPassword.validation");
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: resetPassword, isPending } = useResetPassword();

  const schema = useMemo(
    () =>
      createResetPasswordSchema({
        otpRequired: tValidation("otpRequired"),
        passwordMin: tValidation("passwordMin"),
      }),
    [tValidation]
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, touchedFields, dirtyFields },
    control,
  } = useForm<ResetPassFormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      otp: "",
      new_password: "",
    },
  });

  const values = useWatch({ control });

  function handleOtpChange(value: string) {
    setValue("otp", value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  }

  function onSubmit(data: ResetPassFormValues) {
    resetPassword(
      {
        email,
        otp: data.otp,
        new_password: data.new_password,
      },
      {
        onSuccess: () => {
          toast.success(tToast("passwordReset"));
          router.push("/reset-password/success");
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : "error"
          );
        },
      }
    );
  }

  function fieldSuccess(field: "new_password") {
    return (
      touchedFields[field] &&
      dirtyFields[field] &&
      !errors[field] &&
      (values[field]?.length ?? 0) > 0
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="space-y-2 text-center">
          <h1 className="text-h2 font-medium text-secondary-500">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("codeSentTo", { email })}
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div dir="ltr" className="flex justify-center">
            <InputOTP
              maxLength={OTP_LENGTH}
              value={values.otp ?? ""}
              onChange={handleOtpChange}
              dir="ltr"
              containerClassName="gap-3 sm:gap-4"
            >
              <InputOTPGroup className="gap-3 border-0 shadow-none sm:gap-4">
                {Array.from({ length: OTP_LENGTH }, (_, index) => (
                  <CircularOtpSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          {errors.otp ? (
            <div className="flex items-center gap-1.5 text-destructive">
              <AlertTriangle className="size-4 shrink-0" aria-hidden />
              <FieldError errors={[errors.otp]} />
            </div>
          ) : null}
        </div>

        <FieldGroup>
          <AuthFormField
            label={t("password")}
            error={errors.new_password}
            successMessage={t("fieldValid")}
            showSuccess={fieldSuccess("new_password")}
          >
            <InputGroup
              className={cn(
                "h-11 bg-white",
                fieldSuccess("new_password") && "border-success-300"
              )}
            >
              <InputGroupInput
                {...register("new_password")}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder={t("passwordPlaceholder")}
                aria-invalid={!!errors.new_password}
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
        </FieldGroup>

        <div className="flex flex-col gap-4">
          <Button
            type="submit"
            disabled={isPending}
            className={cn(
              "h-11 w-full bg-primary-300 text-secondary-500 hover:bg-primary-200",
              {
                "cursor-not-allowed opacity-50": isPending,
              }
            )}
          >
            {isPending ? <LoaderCircle /> : t("submit")}
          </Button>

          {resendHref ? (
            <p className="text-center text-sm text-muted-foreground">
              {t("resendPrompt")}{" "}
              <Link
                href={resendHref}
                className="font-medium text-primary-400 underline underline-offset-4 hover:text-primary-500"
              >
                {t("resendAction")}
              </Link>
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}
