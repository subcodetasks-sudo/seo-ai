import { queryOptions } from '@tanstack/react-query';
import { apiFetch } from '@/lib/landing-api';
import type { Pricing } from '@/features/landing/types/landing-api';

export const pricingQueryOptions = queryOptions({
  queryKey: ['landing-pricing'],
  queryFn: () => apiFetch<Pricing | Pricing[]>('/api/v1/pricing?lang=ar'),
});
