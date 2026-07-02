import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header, ResendOtpCode } from "@/features/auth";
import { getLocaleDirection } from "@/i18n/routing";

type ResendOtpPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ email?: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.resendOtp.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ResendOtpPage({
  params,
  searchParams,
}: ResendOtpPageProps) {
  const { locale } = await params;
  const { email } = await searchParams;
  setRequestLocale(locale);
  const direction = getLocaleDirection(locale);

  return (
    <div dir={direction} className="flex min-h-screen flex-col bgwhite">
      <Header />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-8 sm:max-w-lg lg:max-w-xl lg:px-10 lg:py-12">
        <ResendOtpCode defaultEmail={email ?? ""} />
      </main>
    </div>
  );
}
