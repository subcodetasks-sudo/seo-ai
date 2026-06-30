import { queryOptions } from '@tanstack/react-query';
import { apiFetch } from '@/lib/landing-api';
import type { Pricing } from '@/features/landing/types/landing-api';
import { landingKeys } from './query-keys';

export function pricingQueryOptions(lang: string) {
  return queryOptions({
    queryKey: landingKeys.pricing(lang),
    queryFn: () => apiFetch<Pricing | Pricing[]>(`/api/v1/pricing?lang=${lang}`),
  });
}
