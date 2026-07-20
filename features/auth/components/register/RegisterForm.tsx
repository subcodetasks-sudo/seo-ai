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
import { GoogleSignInButton } from "../GoogleSignInButton";

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
