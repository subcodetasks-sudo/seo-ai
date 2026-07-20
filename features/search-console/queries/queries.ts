import { queryOptions } from "@tanstack/react-query";

import {
  getSearchConsoleCountries,
  getSearchConsoleDevices,
  getSearchConsolePages,
  getSearchConsoleQueries,
  getSearchConsoleSitemaps,
  getSearchConsoleSites,
  getSearchConsoleStatus,
} from "./api";
import { searchConsoleKeys } from "./query-keys";
import { getOverviewMetrics } from "../services/search-console-service";

export function searchConsoleStatusQueryOptions(projectId: string) {
  return queryOptions({
    queryKey: searchConsoleKeys.status(projectId),
    queryFn: () => getSearchConsoleStatus(projectId),
    enabled: !!projectId,
  });
}

export function searchConsoleSitesQueryOptions(projectId: string, enabled: boolean) {
  return queryOptions({
    queryKey: searchConsoleKeys.sites(projectId),
    queryFn: () => getSearchConsoleSites(projectId),
    enabled: !!projectId && enabled,
  });
}

export function searchConsoleOverviewQueryOptions(projectId: string, days: number) {
  return queryOptions({
    queryKey: searchConsoleKeys.overview(projectId, days),
    queryFn: () => getOverviewMetrics(projectId, days),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5,
  });
}

export function searchConsoleQueriesQueryOptions(projectId: string, days: number, limit: number = 50) {
  return queryOptions({
    queryKey: searchConsoleKeys.queries(projectId, days, limit),
    queryFn: () => getSearchConsoleQueries(projectId, days, limit),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5,
  });
}

export function searchConsolePagesQueryOptions(projectId: string, days: number, limit: number = 50) {
  return queryOptions({
    queryKey: searchConsoleKeys.pages(projectId, days, limit),
    queryFn: () => getSearchConsolePages(projectId, days, limit),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5,
  });
}

export function searchConsoleCountriesQueryOptions(projectId: string, days: number, limit: number = 20) {
  return queryOptions({
    queryKey: searchConsoleKeys.countries(projectId, days, limit),
    queryFn: () => getSearchConsoleCountries(projectId, days, limit),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5,
  });
}

export function searchConsoleDevicesQueryOptions(projectId: string, days: number) {
  return queryOptions({
    queryKey: searchConsoleKeys.devices(projectId, days),
    queryFn: () => getSearchConsoleDevices(projectId, days),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5,
  });
}

export function searchConsoleSitemapsQueryOptions(projectId: string) {
  return queryOptions({
    queryKey: searchConsoleKeys.sitemaps(projectId),
    queryFn: () => getSearchConsoleSitemaps(projectId),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5,
  });
}
