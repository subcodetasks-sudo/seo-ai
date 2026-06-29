import { queryOptions } from '@tanstack/react-query';
import { apiFetch } from '@/lib/landing-api';
import type { Hero } from '@/features/landing/types/landing-api';

export const heroQueryOptions = queryOptions({
  queryKey: ['landing-heroes'],
  queryFn: () => apiFetch<Hero[]>('/api/v1/heroes?lang=ar'),
});
