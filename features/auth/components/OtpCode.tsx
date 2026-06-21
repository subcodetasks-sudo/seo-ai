"use client";

import { useContext, useState, useMemo } from "react";
import { OTPInputContext } from "input-otp";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup } from "@/components/ui/input-otp";
import { createVerifyEmailSchema } from "@/features/auth/schemas/verify-email-schema";
import { useVerifyEmail } from "@/features/auth/queries/mutations";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

const OTP_LENGTH = 5;

function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");

  if (!localPart || !domain) {
    return email;
  }

  const visible = localPart.slice(0, Math.min(4, localPart.length));
  return `${visible}***@${domain}`;
}

type OtpCodeProps = {
  email: string;
  className?: string;
  resendHref?: string;
  successHref?: string;
  successToastKey?: "accountCreated";
};

function CircularOtpSlot({
  index,
  className,
}: {
  index: number;
  className?: string;
}) {
  const inputOTPContext = useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};
  const filled = Boolean(char);

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex size-12 items-center justify-center rounded-full border-2 bg-white text-lg font-medium transition-all outline-none sm:size-14 sm:text-xl",
        filled || isActive
          ? "border-primary-300 text-secondary-500"
          : "border-neutral-200 text-neutral-400",
        isActive && "ring-2 ring-primary-75",
        className
      )}
    >
      {char ?? "–"}
      {hasFakeCaret ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      ) : null}
    </div>
  );
}

export function OtpCode({
  email,
  className,
  resendHref,
  successHref,
  successToastKey,
}: OtpCodeProps) {
  const router = useRouter();
  const t = useTranslations("auth.verify");
  const tToast = useTranslations("auth.toast");
  const tValidation = useTranslations("auth.verify.validation");
  const [code, setCode] = useState("");
  const { mutate: verifyEmail, isPending } = useVerifyEmail();
  const displayEmail = maskEmail(email);
  const resendLink =
    resendHref ?? `/register/resend-otp?email=${encodeURIComponent(email)}`;

  const schema = useMemo(
    () =>
      createVerifyEmailSchema({
        tokenRequired: tValidation("tokenRequired") || "Token is required",
      }),
    [tValidation]
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (code.length < OTP_LENGTH) {
      return;
    }

    verifyEmail(
      { token: code },
      {
        onSuccess: () => {
          if (successToastKey) {
            toast.success(tToast(successToastKey));
          }
          if (successHref) {
            router.push(successHref);
          }
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : "error"
          );
        },
      }
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="space-y-2 text-center">
          <h1 className="text-h2 font-medium text-secondary-500">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("subtitle", { email: displayEmail })}
          </p>
        </div>

        <div dir="ltr" className="flex justify-center">
          <InputOTP
            maxLength={OTP_LENGTH}
            value={code}
            onChange={setCode}
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

        <div className="flex flex-col gap-4">
          <Button
            type="submit"
            disabled={code.length < OTP_LENGTH || isPending}
            className={cn(
              "h-11 w-full bg-primary-300 text-secondary-500 hover:bg-primary-200",
              {
                "cursor-not-allowed opacity-50": isPending,
              }
            )}
          >
            {isPending ? <LoaderCircle /> : t("submit")}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {t("resendPrompt")}{" "}
            <Link
              href={resendLink}
              className="font-medium text-primary-400 underline underline-offset-4 hover:text-primary-500"
            >
              {t("resendAction")}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
