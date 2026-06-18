import { Suspense } from "react";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import { LocaleDirectionProvider } from "@/app/[locale]/locale-direction-provider";
import { Spinner } from "@/components/ui/spinner";
import { routing } from "@/i18n/routing";

import { LocaleShell } from "./locale-shell";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

function LocaleLayoutFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner className="size-8 text-primary" />
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
