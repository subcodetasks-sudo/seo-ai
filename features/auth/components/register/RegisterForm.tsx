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
import { useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { createRegisterSchema } from "@/features/auth/schemas/register-schema";
import type { RegisterFormValues } from "@/features/auth/types";
import { Link } from "@/i18n/navigation";
import { readCallbackUrl, withCallbackUrl } from "@/lib/callback-url";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";
import { useRegister } from "../../queries/mutations";
import { toast } from "sonner";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

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

type GoogleSignInButtonProps = {
  label: string;
  className?: string;
};

function GoogleSignInButton({ label, className }: GoogleSignInButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "h-11 w-full border-neutral-200 bg-white text-secondary-500 hover:bg-neutral-50",
        className
      )}
    >
      <GoogleIcon />
      <span className="sr-only">{label}</span>
    </Button>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = readCallbackUrl(searchParams);
  const t = useTranslations("auth.register");
  const tValidation = useTranslations("auth.register.validation");
  const [showPassword, setShowPassword] = useState(false);

  const schema = useMemo(
    () =>
      createRegisterSchema({
        fullNameMin: tValidation("fullNameMin"),
        emailInvalid: tValidation("emailInvalid"),
        passwordMin: tValidation("passwordMin"),
        passwordLetterRequired: tValidation("passwordLetterRequired"),
        passwordDigitRequired: tValidation("passwordDigitRequired"),
        passwordSymbolRequired: tValidation("passwordSymbolRequired"),
      }),
    [tValidation]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, dirtyFields },
    control,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      display_name: "",
      email: "",
      password: "",
      // confirmPassword: "",
    },
  });

  const { mutate: registerUser, isPending } = useRegister();

  const values = useWatch({ control });

  function onSubmit(_data: RegisterFormValues) {
    registerUser(_data, {
      onSuccess: () => {
        router.push(
          withCallbackUrl(`/register/verify?email=${encodeURIComponent(_data.email)}`, callbackUrl)
        );
      },
      onError: (error) => {
        toast.error(error.message || t("registrationFailed"));
      }
    });
  }

  function fieldSuccess(field: keyof RegisterFormValues) {
    return (
      touchedFields[field] &&
      dirtyFields[field] &&
      !errors[field] &&
      typeof values[field] === "string" &&
      values[field].length > 0
    );
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-8 lg:py-12">
      <div
        className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 lg:p-8"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, var(--neutral-100) 0%, transparent 70%), radial-gradient(circle at center, var(--neutral-75) 0%, transparent 55%)",
          backgroundSize: "120% 120%, 90% 90%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="relative flex flex-col gap-6">
          <div className="space-y-2 text-center lg:text-start">
            <h2 className="text-h2 font-medium text-secondary-500">{t("title")}</h2>
            <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>

          <GoogleSignInButton label={t("google")} className="lg:hidden" />

          <FieldSeparator className="lg:hidden">{t("orCreateAccount")}</FieldSeparator>

          <FieldGroup>
            <AuthFormField
              label={t("fullName")}
              error={errors.display_name}
              successMessage={t("fieldValid")}
              showSuccess={fieldSuccess("display_name")}
            >
              <Input
                {...register("display_name")}
                placeholder={t("fullNamePlaceholder")}
                aria-invalid={!!errors.display_name}
                className={cn(
                  "h-11 bg-white",
                  fieldSuccess("display_name") && "border-success-300"
                )}
              />
            </AuthFormField>

            <AuthFormField
              label={t("email")}
              error={errors.email}
              successMessage={t("fieldValid")}
              showSuccess={fieldSuccess("email")}
            >
              <Input
                {...register("email")}
                type="email"
                autoComplete="email"
                placeholder={t("emailPlaceholder")}
                aria-invalid={!!errors.email}
                className={cn(
                  "h-11 bg-white",
                  fieldSuccess("email") && "border-success-300"
                )}
              />
            </AuthFormField>

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

            {/* <AuthFormField
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
                <InputGroupAddon align="inline-end" className="m-1">
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
            </AuthFormField> */}
          </FieldGroup>

          <Button
            type="submit"
            className={cn(
              "h-11 w-full bg-primary-300 text-secondary-500 hover:bg-primary-200",
              isPending && "cursor-not-allowed opacity-70"
            )}
            disabled={isPending}
          >
            {isPending ? <LoaderCircle /> : t("submit")}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {t("hasAccount")}{" "}
            <Link
              href="/login"
              className="font-semibold text-secondary-500 underline-offset-4 hover:underline"
            >
              {t("login")}
            </Link>
          </p>

          <FieldSeparator className="hidden lg:flex">{t("or")}</FieldSeparator>

          <GoogleSignInButton label={t("google")} className="hidden lg:flex hover:border-primary-300" />
        </form>
      </div>
    </div>
  );
}
