import { queryOptions } from "@tanstack/react-query";
import { apiFetch } from "@/lib/landing-api";
import type { AboutUs, Faq, Hero, LegalPage, Statistics, TestimonialsData, ToolUsage } from "@/features/landing/types/landing-api";
import { landingKeys } from "./query-keys";
import { fetchLandingPricing } from "./fetch-pricing";

export function heroQueryOptions(lang: string) {
  return queryOptions({
    queryKey: landingKeys.heroes(lang),
    queryFn: () => apiFetch<Hero[]>(`/api/v1/heroes?lang=${lang}`, lang),
  });
}

export function pricingQueryOptions(lang: string) {
  return queryOptions({
    queryKey: landingKeys.pricing(lang),
    queryFn: () => fetchLandingPricing(lang),
  });
}

export function aboutUsQueryOptions(lang: string) {
  return queryOptions({
    queryKey: landingKeys.aboutUs(lang),
    queryFn: () => apiFetch<AboutUs>(`/api/v1/about-us?lang=${lang}`, lang),
  });
}

export function statisticsQueryOptions(lang: string) {
    return queryOptions({
    queryKey: landingKeys.statistics(lang),
    queryFn: () => apiFetch<Statistics>(`/api/v1/statistics?lang=${lang}`, lang),
  });
}

export function toolUsageQueryOptions(lang: string) {
    return queryOptions({
    queryKey: landingKeys.toolUsage(lang),
    queryFn: () => apiFetch<ToolUsage[]>(`/api/v1/tool-usages?lang=${lang}`, lang),
    })
}

export function faqsQueryOptions(lang: string) {
    return queryOptions({
    queryKey: landingKeys.faqs(lang),
    queryFn: () => apiFetch<Faq[]>(`/api/v1/faqs?lang=${lang}`, lang),
    })
}

export function testimonialsQueryOptions(lang: string) {
    return queryOptions({
    queryKey: landingKeys.testimonials(lang),
    queryFn: () => apiFetch<TestimonialsData>(`/api/v1/testimonials/content?lang=${lang}`, lang),
    })
}

export function settingsQueryOptions(lang: string) {
  return queryOptions({
    queryKey: landingKeys.settings(lang),
    queryFn: () => apiFetch<import('../types/landing-api').Settings>('/api/v1/auth/settings', lang),
  });
}


export function footerQueryOptions(lang: string) {
    return queryOptions({
    queryKey: landingKeys.footer(lang),
    queryFn: () => apiFetch(`/api/v1/footer-cta?lang=${lang}`, lang),
    })
}

export function termsOfUseQueryOptions(lang: string) {
  return queryOptions({
    queryKey: landingKeys.termsOfUse(lang),
    queryFn: () => apiFetch<LegalPage>('/api/v1/terms-of-use', lang),
  });
}

export function privacyPolicyQueryOptions(lang: string) {
  return queryOptions({
    queryKey: landingKeys.privacyPolicy(lang),
    queryFn: () => apiFetch<LegalPage>('/api/v1/privacy-policy', lang),
  });
}