import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import LoadingState from "@/components/loading-state";
import { AuthPreview, Header, RegisterForm } from "@/features/auth";
import { getLocaleDirection } from "@/i18n/routing";

type RegisterPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const direction = getLocaleDirection(locale);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2 lg:grid-rows-[auto_1fr]">
      <div
        dir={direction}
        className="bg-white lg:col-start-2 lg:row-start-1"
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
        className="flex flex-col items-center justify-center bg-white lg:col-start-2 lg:row-start-2"
      >
        <Suspense fallback={<LoadingState fullPage={false} />}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
