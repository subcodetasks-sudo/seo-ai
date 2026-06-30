import { queryOptions } from '@tanstack/react-query';
import { apiFetch } from '@/lib/landing-api';
import type { Hero } from '@/features/landing/types/landing-api';
import { landingKeys } from './query-keys';

export function heroQueryOptions(lang: string) {
  return queryOptions({
    queryKey: landingKeys.heroes(lang),
    queryFn: () => apiFetch<Hero[]>(`/api/v1/heroes?lang=${lang}`),
  });
}
