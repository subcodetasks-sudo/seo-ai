import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import LoadingState from "@/components/loading-state";
import { AuthPreview, Header, LoginForm } from "@/features/auth";
import { getLocaleDirection } from "@/i18n/routing";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.login.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const direction = getLocaleDirection(locale);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2 lg:grid-rows-[auto_1fr] bg-white">
      <div
        dir={direction}
        className="lg:col-start-2 lg:row-start-1"
      >
        <Header />
      </div>
      <div
        dir={direction}
        className="lg:col-start-1 lg:row-start-1 lg:row-span-2"
      >
        <AuthPreview className="h-full" />
      </div>
      <div
        dir={direction}
        className="flex flex-col items-center justify-center lg:col-start-2 lg:row-start-2"
      >
        <Suspense fallback={<LoadingState fullPage={false} />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
