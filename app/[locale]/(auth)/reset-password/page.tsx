import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header, ResetPassForm } from "@/features/auth";
import { getLocaleDirection } from "@/i18n/routing";

type ResetPasswordPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ email?: string }>;
};

export async function generateMetadata({
  params,
}: ResetPasswordPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "auth.resetPassword.metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ResetPasswordPage({
  params,
  searchParams,
}: ResetPasswordPageProps) {
  const { locale } = await params;
  const { email } = await searchParams;
  setRequestLocale(locale);
  const direction = getLocaleDirection(locale);

  const userEmail = email ?? "";

  return (
    <div dir={direction} className="flex min-h-screen flex-col bg-secondary-50">
      <Header />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-8 sm:max-w-lg lg:max-w-xl lg:px-10 lg:py-12">
        <ResetPassForm
          email={userEmail}
          resendHref={`/login/forget-password/resend-otp?email=${encodeURIComponent(userEmail)}`}
        />
      </main>
    </div>
  );
}


































































































































































