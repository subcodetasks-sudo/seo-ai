import { apiClient } from "@/lib/client";

import {
  gaAudienceResponseSchema,
  gaCallbackResponseSchema,
  gaConnectResponseSchema,
  gaConversionsResponseSchema,
  gaDisconnectResponseSchema,
  gaEcommerceResponseSchema,
  gaEventsResponseSchema,
  gaOverviewResponseSchema,
  gaPagesResponseSchema,
  gaPropertiesResponseSchema,
  gaSelectPropertyResponseSchema,
  gaStatusResponseSchema,
  gaTrafficSourcesResponseSchema,
} from "../schemas/google-analytics.schema";
import type {
  AudienceTabData,
  ConversionsTabData,
  EventsTabData,
  GoogleAnalyticsProperty,
  GoogleAnalyticsStatus,
  PagesTabData,
  TopPageRow,
} from "../types";

function base(projectId: string) {
  return `projects/${projectId}/analytics`;
}

export async function getGoogleAnalyticsStatus(projectId: string): Promise<GoogleAnalyticsStatus> {
  const response = await apiClient(`${base(projectId)}/status`, {}, "Failed to fetch Google Analytics status");
  const { data } = gaStatusResponseSchema.parse(response);
  return { connected: data.connected, propertyId: data.property_id, propertyName: data.property_name };
}

export async function getGoogleAnalyticsAuthUrl(projectId: string): Promise<string> {
  const response = await apiClient(`${base(projectId)}/connect`, {}, "Failed to start Google Analytics connection");
  return gaConnectResponseSchema.parse(response).data.auth_url;
}

export async function postGoogleAnalyticsCallback(projectId: string, code: string): Promise<void> {
  const query = new URLSearchParams({ code }).toString();
  const response = await apiClient(
    `${base(projectId)}/callback?${query}`,
    { method: "POST" },
    "Failed to exchange Google Analytics authorization code",
  );
  gaCallbackResponseSchema.parse(response);
}

export async function deleteGoogleAnalyticsConnection(projectId: string): Promise<void> {
  const response = await apiClient(
    `${base(projectId)}/disconnect`,
    { method: "DELETE" },
    "Failed to disconnect Google Analytics",
  );
  gaDisconnectResponseSchema.parse(response);
}

export async function getGoogleAnalyticsProperties(projectId: string): Promise<GoogleAnalyticsProperty[]> {
  const response = await apiClient(`${base(projectId)}/properties`, {}, "Failed to fetch Google Analytics properties");
  const { data } = gaPropertiesResponseSchema.parse(response);
  return data.properties.map((property) => ({
    propertyId: property.property_id,
    displayName: property.display_name,
    websiteUrl: property.website_url ?? "",
  }));
}

export async function selectGoogleAnalyticsProperty(
  projectId: string,
  propertyId: string,
  propertyName: string,
): Promise<void> {
  const query = new URLSearchParams({ property_id: propertyId, property_name: propertyName }).toString();
  const response = await apiClient(
    `${base(projectId)}/properties/select?${query}`,
    { method: "POST" },
    "Failed to select Google Analytics property",
  );
  gaSelectPropertyResponseSchema.parse(response);
}

export type GoogleAnalyticsOverviewRaw = {
  sessions: number;
  users: number;
  newUsers: number;
  activeUsers: number;
  bounceRate: number;
  avgSessionDuration: number;
  pageViews: number;
};

export async function getGoogleAnalyticsOverview(projectId: string, days: number): Promise<GoogleAnalyticsOverviewRaw> {
  const response = await apiClient(
    `${base(projectId)}/overview?days=${days}`,
    {},
    "Failed to fetch Google Analytics overview",
  );
  const { data } = gaOverviewResponseSchema.parse(response);
  return {
    sessions: data.sessions,
    users: data.users,
    newUsers: data.new_users,
    activeUsers: data.active_users,
    bounceRate: data.bounce_rate,
    avgSessionDuration: data.avg_session_duration,
    pageViews: data.page_views,
  };
}

export type GoogleAnalyticsTrafficSourceRaw = {
  channel: string;
  sessions: number;
  users: number;
  bounceRate: number;
};

export async function getGoogleAnalyticsTrafficSources(
  projectId: string,
  days: number,
): Promise<{ items: GoogleAnalyticsTrafficSourceRaw[]; totalSessions: number }> {
  const response = await apiClient(
    `${base(projectId)}/traffic-sources?days=${days}`,
    {},
    "Failed to fetch Google Analytics traffic sources",
  );
  const { data } = gaTrafficSourcesResponseSchema.parse(response);
  return {
    items: data.items.map((item) => ({
      channel: item.channel,
      sessions: item.sessions,
      users: item.users,
      bounceRate: item.bounce_rate,
    })),
    totalSessions: data.total_sessions,
  };
}

export async function getGoogleAnalyticsPages(
  projectId: string,
  days: number,
  limit: number,
): Promise<PagesTabData> {
  const response = await apiClient(
    `${base(projectId)}/pages?days=${days}&limit=${limit}`,
    {},
    "Failed to fetch Google Analytics pages",
  );
  const { data } = gaPagesResponseSchema.parse(response);
  const pages: TopPageRow[] = data.items.map((item) => ({
    id: item.page_path,
    title: item.page_title,
    path: item.page_path,
    views: item.views,
    avgTime: formatSecondsAsClock(item.avg_time_on_page),
    bounceRate: Math.round(item.bounce_rate * 100),
  }));
  return { pages };
}

export async function getGoogleAnalyticsAudience(projectId: string, days: number): Promise<AudienceTabData> {
  const response = await apiClient(
    `${base(projectId)}/audience?days=${days}`,
    {},
    "Failed to fetch Google Analytics audience",
  );
  const { data } = gaAudienceResponseSchema.parse(response);
  const totalSessions = data.total_sessions || 1;
  const countries = data.countries.map((item) => ({
    code: item.country.slice(0, 2).toUpperCase(),
    label: item.country,
    percentage: Math.round((item.sessions / totalSessions) * 100),
    visitors: item.sessions,
  }));
  return {
    countries,
    distribution: buildDistribution(countries.map((item) => ({ id: item.code, label: item.label, percentage: item.percentage }))),
  };
}

export async function getGoogleAnalyticsEvents(projectId: string, days: number): Promise<EventsTabData> {
  const response = await apiClient(`${base(projectId)}/events?days=${days}`, {}, "Failed to fetch Google Analytics events");
  const { data } = gaEventsResponseSchema.parse(response);
  return {
    items: data.items.map((item, index) => ({
      id: `${item.event_name}-${index}`,
      eventName: item.event_name,
      eventCount: item.event_count,
      users: item.users,
    })),
    totalEvents: data.total_events,
  };
}

export async function getGoogleAnalyticsConversions(projectId: string, days: number): Promise<ConversionsTabData> {
  const response = await apiClient(
    `${base(projectId)}/conversions?days=${days}`,
    {},
    "Failed to fetch Google Analytics conversions",
  );
  const { data } = gaConversionsResponseSchema.parse(response);
  return {
    items: data.items.map((item, index) => ({
      id: `${item.event_name}-${index}`,
      eventName: item.event_name,
      conversions: item.conversions,
      conversionRate: Math.round(item.conversion_rate * 1000) / 10,
    })),
    totalConversions: data.total_conversions,
  };
}

export type GoogleAnalyticsEcommerceRaw = {
  totalRevenue: number;
  transactions: number;
  avgOrderValue: number;
  conversionRate: number;
  itemsPurchased: number;
};

export async function getGoogleAnalyticsEcommerce(projectId: string, days: number): Promise<GoogleAnalyticsEcommerceRaw> {
  const response = await apiClient(
    `${base(projectId)}/ecommerce?days=${days}`,
    {},
    "Failed to fetch Google Analytics ecommerce data",
  );
  const { data } = gaEcommerceResponseSchema.parse(response);
  return {
    totalRevenue: data.total_revenue,
    transactions: data.transactions,
    avgOrderValue: data.avg_order_value,
    conversionRate: data.ecommerce_conversion_rate,
    itemsPurchased: data.items_purchased,
  };
}

function formatSecondsAsClock(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(total / 60);
  const remainingSeconds = total % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

const DISTRIBUTION_COLORS = ["#84CC16", "#3F6212", "#22C55E", "#CA8A04", "#94A3B8", "#0EA5E9", "#A855F7"];

function buildDistribution(
  items: { id: string; label: string; percentage: number }[],
): { id: string; label: string; percentage: number; color: string }[] {
  return items
    .slice()
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5)
    .map((item, index) => ({ ...item, color: DISTRIBUTION_COLORS[index % DISTRIBUTION_COLORS.length] }));
}
