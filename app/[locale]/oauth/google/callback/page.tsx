"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { useAuth } from "@/features/auth/context/auth-context";
import { useCompleteGoogleOAuth } from "@/features/auth";
import type { ApiResponse, GoogleOAuthUser } from "@/features/auth/types";
import { useRouter } from "@/i18n/navigation";

const KNOWN_ERRORS = new Set(["oauth_not_configured", "oauth_token_exchange_failed", "oauth_userinfo_failed"]);

function buildInitials(displayName: string | undefined) {
  if (!displayName) return "";
  return displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function GoogleOAuthCallbackPage() {
  const t = useTranslations("auth.googleCallback");
  const tToast = useTranslations("auth.toast");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser } = useAuth();

  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");
  const oauthError = searchParams.get("error");

  const { mutate, isPending, isError } = useCompleteGoogleOAuth();
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current || oauthError || !accessToken || !refreshToken) return;
    attempted.current = true;

    mutate(
      {
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: searchParams.get("token_type") ?? undefined,
        user_id: searchParams.get("user_id") ?? undefined,
        email: searchParams.get("email") ?? undefined,
        display_name: searchParams.get("display_name") ?? undefined,
        plan_name: searchParams.get("plan_name") ?? undefined,
        is_verified: searchParams.get("is_verified") === "true",
      },
      {
        onSuccess: (response) => {
          const data = (response as ApiResponse<GoogleOAuthUser>).data;
          if (data) {
            setUser({
              id: data.user_id,
              email: data.email,
              display_name: data.display_name,
              name: data.display_name,
              plan: data.plan_name ?? "",
              initials: buildInitials(data.display_name),
            });
          }
          toast.success(tToast("welcomeBack"));
          router.replace("/dashboard");
        },
      }
    );
  }, [accessToken, refreshToken, oauthError, mutate, router, searchParams, setUser, tToast]);

  const errorCode = oauthError && KNOWN_ERRORS.has(oauthError) ? oauthError : oauthError ? "unknown" : null;
  const missingTokens = !oauthError && (!accessToken || !refreshToken);
  const failed = !!errorCode || missingTokens || isError;

  const errorDescription =
    errorCode === "oauth_not_configured" ? t("errors.notConfigured") : t("errors.retry");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-75 px-6 text-center">
      {failed ? (
        <ErrorState
          title={t("errorTitle")}
          description={errorDescription}
          retryLabel={t("backToLogin")}
          onRetry={() => router.replace("/login")}
        />
      ) : (
        <>
          <LoadingState />
          <p className="text-label-md text-neutral-500">{isPending ? t("connecting") : t("redirecting")}</p>
        </>
      )}
    </div>
  );
}
