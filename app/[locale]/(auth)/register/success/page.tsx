import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header, RegisterProgress, RegisterSuccess } from "@/features/auth";
import { getLocaleDirection } from "@/i18n/routing";

type RegisterSuccessPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: RegisterSuccessPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.success.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function RegisterSuccessPage({ params }: RegisterSuccessPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const direction = getLocaleDirection(locale);

  return (
    <div dir={direction} className="flex min-h-screen flex-col bg-secondary-50">
      <Header />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-8 sm:max-w-lg lg:max-w-xl lg:px-10 lg:py-12">
        <div className="flex flex-col gap-10 sm:gap-12">
          <RegisterProgress currentStep={3} isComplete />
          <RegisterSuccess />
        </div>
      </main>
    </div>
  );
}
