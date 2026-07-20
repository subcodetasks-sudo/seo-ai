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
import { toast } from "sonner";

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
import { useAuth } from "@/features/auth/context/auth-context";
import { createLoginSchema } from "@/features/auth/schemas/login-schema";
import type { ApiResponse, LoginFormValues } from "@/features/auth/types";
import { Link } from "@/i18n/navigation";
import { readCallbackUrl, withCallbackUrl } from "@/lib/callback-url";
import { ApiError } from "@/lib/errors";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";
import { useLogin, useResendVerification } from "../../queries/mutations";
import { GoogleSignInButton } from "../GoogleSignInButton";

type AuthFormFieldProps = {
  label: string;
  labelAction?: React.ReactNode;
  error?: { message?: string };
  successMessage?: string;
  showSuccess?: boolean;
  children: React.ReactNode;
};

function AuthFormField({
  label,
  labelAction,
  error,
  successMessage,
  showSuccess,
  children,
}: AuthFormFieldProps) {
  return (
    <Field data-invalid={!!error}>
      {labelAction ? (
        <div className="flex items-center justify-between gap-3">
          <FieldLabel htmlFor={undefined}>{label}</FieldLabel>
          {labelAction}
        </div>
      ) : (
        <FieldLabel htmlFor={undefined}>{label}</FieldLabel>
      )}
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

type LoginUser = {
  id?: string;
  email?: string;
  display_name?: string;
  name?: string;
  plan?: string | { name?: string };
  avatar?: string;
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = readCallbackUrl(searchParams);
  const { setUser } = useAuth();
  const t = useTranslations("auth.login");
  const tToast = useTranslations("auth.toast");
  const tValidation = useTranslations("auth.login.validation");
  const [showPassword, setShowPassword] = useState(false);

  const schema = useMemo(
    () =>
      createLoginSchema({
        emailInvalid: tValidation("emailInvalid"),
        passwordMin: tValidation("passwordMin"),
        passwordLetterRequired: tValidation("passwordLetterRequired"),
        passwordDigitRequired: tValidation("passwordDigitRequired"),
        passwordSymbolRequired: tValidation("passwordSymbolRequired"),
      }),
    [tValidation]
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, touchedFields, dirtyFields },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });


  const { mutate: login, isPending } = useLogin();
  const { mutate: resendVerification } = useResendVerification();

  const values = (useWatch({ control }) ?? {
    email: "",
    password: "",
  }) as LoginFormValues;

  function onSubmit(_data: LoginFormValues) {
    login(_data, {
      onSuccess: (response) => {
        const typedResponse = response as ApiResponse<LoginUser>;
        const userData = typedResponse.data;
        if (userData) {
          const initials = userData.display_name
            ? userData.display_name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
            : "";
          setUser({
            id: userData.id,
            email: userData.email,
            display_name: userData.display_name || userData.name,
            name: userData.display_name || userData.name,
            plan:
              typeof userData.plan === "string"
                ? userData.plan
                : userData.plan?.name ?? "",
            avatar: userData.avatar,
            initials,
          });
        }
        toast.success(tToast("welcomeBack"));
        router.push(callbackUrl ?? "/dashboard");
      },
      onError: (error) => {
        if (error instanceof ApiError && error.status === 403) {
          const email = _data.email;
          resendVerification(
            { email },
            {
              onSettled: () => {
                router.push(
                  withCallbackUrl(`/login/verify-email?email=${encodeURIComponent(email)}`, callbackUrl)
                );
              },
            }
          );
        }
      }
    });

  }

  function fieldSuccess(field: keyof LoginFormValues) {
    return (
      touchedFields[field] &&
      dirtyFields[field] &&
      !errors[field] &&
      values[field]?.length > 0
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

          <FieldSeparator className="lg:hidden">{t("or")}</FieldSeparator>

          <FieldGroup>
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
              labelAction={
                <Link
                  href="/login/forget-password"
                  className="text-sm text-secondary-500 underline underline-offset-4 hover:text-secondary-400"
                >
                  {t("forgotPassword")}
                </Link>
              }
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
                  autoComplete="current-password"
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
            {t("noAccount")}{" "}
            <Link
              href="/register"
              className="font-semibold text-secondary-500 underline-offset-4 hover:underline"
            >
              {t("createAccount")}
            </Link>
          </p>

          <FieldSeparator className="hidden lg:flex">{t("or")}</FieldSeparator>

          <GoogleSignInButton
            label={t("google")}
            className="hidden lg:flex hover:border-primary-300"
          />
        </form>
      </div>
    </div>
  );
}
