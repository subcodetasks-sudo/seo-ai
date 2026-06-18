import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header, OtpCode, RegisterProgress } from "@/features/auth";
import { getLocaleDirection } from "@/i18n/routing";

type VerifyPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ email?: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.verify.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function VerifyPage({ params, searchParams }: VerifyPageProps) {
  const { locale } = await params;
  const { email } = await searchParams;
  setRequestLocale(locale);
  const direction = getLocaleDirection(locale);

  const userEmail = email ?? "aa62@gmail.com";

  return (
    <div dir={direction} className="flex min-h-screen flex-col bg-secondary-50">
      <Header />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-8 sm:max-w-lg lg:max-w-xl lg:px-10 lg:py-12">
        <div className="flex flex-col gap-10 sm:gap-12">
          <RegisterProgress currentStep={2} />
          <OtpCode
            email={userEmail}
            successHref="/plans"
            successToastKey="accountCreated"
          />
        </div>
      </main>
    </div>
  );
}
