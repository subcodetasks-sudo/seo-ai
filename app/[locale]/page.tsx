import "../landing.css";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { cacheLife } from "next/cache";
import { connection } from "next/server";
import { getLocaleDirection } from "@/i18n/routing";
import { LandingHeader } from "@/features/landing/components/LandingHeader";
import { HeroSection } from "@/features/landing/components/sections/HeroSection";
import { TrustedSection } from "@/features/landing/components/sections/TrustedSection";
import { UseCasesSection } from "@/features/landing/components/sections/UseCasesSection";
import { AboutSection } from "@/features/landing/components/sections/AboutSection";
import { StatsSection } from "@/features/landing/components/sections/StatsSection";
import { PricingSection } from "@/features/landing/components/sections/PricingSection";
import { TestimonialsSection } from "@/features/landing/components/sections/TestimonialsSection";
import { FaqSection } from "@/features/landing/components/sections/FaqSection";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { GsapAnimations } from "@/components/motion/GsapAnimations";
import {
  heroQueryOptions,
  aboutUsQueryOptions,
  statisticsQueryOptions,
  toolUsageQueryOptions,
  pricingQueryOptions,
  testimonialsQueryOptions,
  faqsQueryOptions,
  settingsQueryOptions,
} from "@/features/landing/queries/queries";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div id="landing-root" dir={getLocaleDirection(locale)}>
      <StaticLanding
        locale={locale}
        pricing={
          <Suspense key="pricing" fallback={null}>
            <DynamicPricing locale={locale} />
          </Suspense>
        }
        footer={
          <Suspense key="footer" fallback={null}>
            <DynamicFooter locale={locale} />
          </Suspense>
        }
      />
      <GsapAnimations />
    </div>
  );
}

/**
 * Everything except pricing and the footer is content that only changes on
 * redeploy, so it is prerendered as a static shell. `pricing`/`footer` are
 * passed through without being read here, so they don't join this cache
 * entry — see "Interleaving" in the use cache docs.
 */
async function StaticLanding({
  locale,
  pricing,
  footer,
}: {
  locale: string;
  pricing: ReactNode;
  footer: ReactNode;
}) {
  "use cache";
  cacheLife("days");

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery(heroQueryOptions(locale)),
    queryClient.prefetchQuery(aboutUsQueryOptions(locale)),
    queryClient.prefetchQuery(statisticsQueryOptions(locale)),
    queryClient.prefetchQuery(toolUsageQueryOptions(locale)),
    queryClient.prefetchQuery(testimonialsQueryOptions(locale)),
    queryClient.prefetchQuery(faqsQueryOptions(locale)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LandingHeader key="header" />
      <main key="main">
        <HeroSection key="hero" />
        <TrustedSection key="trusted" />
        <UseCasesSection key="use-cases" />
        <AboutSection key="about" />
        <StatsSection key="stats" />
        {pricing}
        <TestimonialsSection key="testimonials" />
        <FaqSection key="faq" />
      </main>
      {footer}
    </HydrationBoundary>
  );
}

/** Pricing stays live/per-request: it prefetches with the same no-store
 * fetcher as before, just scoped to its own Suspense boundary instead of
 * forcing the whole route dynamic. */
async function DynamicPricing({ locale }: { locale: string }) {
  await connection();
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(pricingQueryOptions(locale));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PricingSection />
    </HydrationBoundary>
  );
}

/** Footer settings (contact info, social links, offices) can change without
 * a redeploy, so it stays live/per-request instead of joining the static
 * "use cache" shell above. */
async function DynamicFooter({ locale }: { locale: string }) {
  await connection();
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(settingsQueryOptions(locale));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LandingFooter />
    </HydrationBoundary>
  );
}
