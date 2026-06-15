import { setRequestLocale } from "next-intl/server";

import { AuthPreview } from "@/features/auth/components/AuthPreview";
import { Header } from "@/features/auth/components/Header";
import { RegisterForm } from "@/features/auth/components/register/RegisterForm";
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
        className="bg-secondary-50 lg:col-start-2 lg:row-start-1"
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
        className="flex flex-col bg-secondary-50 lg:col-start-2 lg:row-start-2"
      >
        <RegisterForm />
      </div>
    </div>
  );
}
