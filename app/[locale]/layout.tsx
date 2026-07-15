import { Suspense } from "react";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";

import { LocaleDirectionProvider } from "@/app/[locale]/locale-direction-provider";
import { routing } from "@/i18n/routing";

import { LocaleShell } from "./locale-shell";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

function LocaleLayoutFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div
        role="status"
        aria-hidden="true"
        className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent"
      />
    </div>
  );
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  return (
    <Suspense fallback={<LocaleLayoutFallback />}>
      <LocaleLayoutContent params={params}>{children}</LocaleLayoutContent>
    </Suspense>
  );
}

async function LocaleLayoutContent({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LocaleDirectionProvider>
        <LocaleShell>{children}</LocaleShell>
      </LocaleDirectionProvider>
    </NextIntlClientProvider>
  );
}
