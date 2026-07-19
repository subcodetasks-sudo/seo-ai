import { queryOptions } from "@tanstack/react-query";

import {
  getGoogleAnalyticsAudience,
  getGoogleAnalyticsConversions,
  getGoogleAnalyticsEvents,
  getGoogleAnalyticsPages,
  getGoogleAnalyticsProperties,
  getGoogleAnalyticsStatus,
} from "./api";
import { googleAnalyticsKeys } from "./query-keys";
import { getEcommerceSummaryMetrics, getOverviewMetrics, getTrafficSourcesData } from "../services/analytics-service";

export function googleAnalyticsStatusQueryOptions(projectId: string) {
  return queryOptions({
    queryKey: googleAnalyticsKeys.status(projectId),
    queryFn: () => getGoogleAnalyticsStatus(projectId),
    enabled: !!projectId,
  });
}

export function googleAnalyticsPropertiesQueryOptions(projectId: string, enabled: boolean) {
  return queryOptions({
    queryKey: googleAnalyticsKeys.properties(projectId),
    queryFn: () => getGoogleAnalyticsProperties(projectId),
    enabled: !!projectId && enabled,
  });
}

export function googleAnalyticsOverviewQueryOptions(projectId: string, days: number) {
  return queryOptions({
    queryKey: googleAnalyticsKeys.overview(projectId, days),
    queryFn: () => getOverviewMetrics(projectId, days),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5,
  });
}

export function googleAnalyticsEcommerceQueryOptions(projectId: string, days: number) {
  return queryOptions({
    queryKey: googleAnalyticsKeys.ecommerce(projectId, days),
    queryFn: () => getEcommerceSummaryMetrics(projectId, days),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5,
  });
}

export function googleAnalyticsTrafficSourcesQueryOptions(projectId: string, days: number) {
  return queryOptions({
    queryKey: googleAnalyticsKeys.trafficSources(projectId, days),
    queryFn: () => getTrafficSourcesData(projectId, days),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5,
  });
}

export function googleAnalyticsPagesQueryOptions(projectId: string, days: number, limit: number = 50) {
  return queryOptions({
    queryKey: googleAnalyticsKeys.pages(projectId, days, limit),
    queryFn: () => getGoogleAnalyticsPages(projectId, days, limit),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5,
  });
}

export function googleAnalyticsAudienceQueryOptions(projectId: string, days: number) {
  return queryOptions({
    queryKey: googleAnalyticsKeys.audience(projectId, days),
    queryFn: () => getGoogleAnalyticsAudience(projectId, days),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5,
  });
}

export function googleAnalyticsEventsQueryOptions(projectId: string, days: number) {
  return queryOptions({
    queryKey: googleAnalyticsKeys.events(projectId, days),
    queryFn: () => getGoogleAnalyticsEvents(projectId, days),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5,
  });
}

export function googleAnalyticsConversionsQueryOptions(projectId: string, days: number) {
  return queryOptions({
    queryKey: googleAnalyticsKeys.conversions(projectId, days),
    queryFn: () => getGoogleAnalyticsConversions(projectId, days),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5,
  });
}
