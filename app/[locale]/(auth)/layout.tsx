import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

type AuthLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function AuthLayout({ children, params }: AuthLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div dir="ltr" className="min-h-screen bg-white font-sans">
      {children}
    </div>
  );
}
