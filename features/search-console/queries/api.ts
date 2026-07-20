import { apiClient } from "@/lib/client";

import {
  scCallbackResponseSchema,
  scConnectResponseSchema,
  scCountriesResponseSchema,
  scDevicesResponseSchema,
  scDisconnectResponseSchema,
  scOverviewResponseSchema,
  scPagesResponseSchema,
  scQueriesResponseSchema,
  scSelectSiteResponseSchema,
  scSitemapsResponseSchema,
  scSitesResponseSchema,
  scStatusResponseSchema,
} from "../schemas/search-console.schema";
import type { SearchConsoleItemRow, SearchConsoleSite, SearchConsoleStatus, SitemapRow } from "../types";

function base(projectId: string) {
  return `projects/${projectId}/search-console`;
}

export async function getSearchConsoleStatus(projectId: string): Promise<SearchConsoleStatus> {
  const response = await apiClient(`${base(projectId)}/status`, {}, "Failed to fetch Search Console status");
  const { data } = scStatusResponseSchema.parse(response);
  return { connected: data.connected, siteUrl: data.site_url };
}

export async function getSearchConsoleAuthUrl(projectId: string): Promise<string> {
  const response = await apiClient(`${base(projectId)}/connect`, {}, "Failed to start Search Console connection");
  return scConnectResponseSchema.parse(response).data.auth_url;
}

export async function postSearchConsoleCallback(projectId: string, code: string): Promise<void> {
  const query = new URLSearchParams({ code }).toString();
  const response = await apiClient(
    `${base(projectId)}/callback?${query}`,
    { method: "POST" },
    "Failed to exchange Search Console authorization code",
  );
  scCallbackResponseSchema.parse(response);
}

export async function deleteSearchConsoleConnection(projectId: string): Promise<void> {
  const response = await apiClient(`${base(projectId)}/disconnect`, { method: "DELETE" }, "Failed to disconnect Search Console");
  scDisconnectResponseSchema.parse(response);
}

export async function getSearchConsoleSites(projectId: string): Promise<SearchConsoleSite[]> {
  const response = await apiClient(`${base(projectId)}/sites`, {}, "Failed to fetch Search Console sites");
  const { data } = scSitesResponseSchema.parse(response);
  return data.sites.map((site) => ({ siteUrl: site.site_url, permissionLevel: site.permission_level }));
}

export async function selectSearchConsoleSite(projectId: string, siteUrl: string): Promise<void> {
  const query = new URLSearchParams({ site_url: siteUrl }).toString();
  const response = await apiClient(
    `${base(projectId)}/sites/select?${query}`,
    { method: "POST" },
    "Failed to select Search Console site",
  );
  scSelectSiteResponseSchema.parse(response);
}

export type SearchConsoleOverviewRaw = {
  clicks: number;
  impressions: number;
  ctr: number;
  avgPosition: number;
};

export async function getSearchConsoleOverview(projectId: string, days: number): Promise<SearchConsoleOverviewRaw> {
  const response = await apiClient(
    `${base(projectId)}/overview?days=${days}`,
    {},
    "Failed to fetch Search Console overview",
  );
  const { data } = scOverviewResponseSchema.parse(response);
  return { clicks: data.clicks, impressions: data.impressions, ctr: data.ctr, avgPosition: data.avg_position };
}

export async function getSearchConsoleQueries(
  projectId: string,
  days: number,
  limit: number,
): Promise<SearchConsoleItemRow[]> {
  const response = await apiClient(
    `${base(projectId)}/queries?days=${days}&limit=${limit}`,
    {},
    "Failed to fetch Search Console queries",
  );
  const { data } = scQueriesResponseSchema.parse(response);
  return data.items.map((item) => ({
    id: item.query,
    label: item.query,
    clicks: item.clicks,
    impressions: item.impressions,
    ctr: item.ctr,
    avgPosition: item.avg_position,
  }));
}

export async function getSearchConsolePages(
  projectId: string,
  days: number,
  limit: number,
): Promise<SearchConsoleItemRow[]> {
  const response = await apiClient(
    `${base(projectId)}/pages?days=${days}&limit=${limit}`,
    {},
    "Failed to fetch Search Console pages",
  );
  const { data } = scPagesResponseSchema.parse(response);
  return data.items.map((item) => ({
    id: item.page,
    label: item.page,
    clicks: item.clicks,
    impressions: item.impressions,
    ctr: item.ctr,
    avgPosition: item.avg_position,
  }));
}

export async function getSearchConsoleCountries(
  projectId: string,
  days: number,
  limit: number,
): Promise<SearchConsoleItemRow[]> {
  const response = await apiClient(
    `${base(projectId)}/countries?days=${days}&limit=${limit}`,
    {},
    "Failed to fetch Search Console countries",
  );
  const { data } = scCountriesResponseSchema.parse(response);
  return data.items.map((item) => ({
    id: item.country,
    label: item.country,
    clicks: item.clicks,
    impressions: item.impressions,
    ctr: item.ctr,
    avgPosition: item.avg_position,
  }));
}

export async function getSearchConsoleDevices(projectId: string, days: number): Promise<SearchConsoleItemRow[]> {
  const response = await apiClient(
    `${base(projectId)}/devices?days=${days}`,
    {},
    "Failed to fetch Search Console devices",
  );
  const { data } = scDevicesResponseSchema.parse(response);
  return data.items.map((item) => ({
    id: item.device,
    label: item.device,
    clicks: item.clicks,
    impressions: item.impressions,
    ctr: item.ctr,
    avgPosition: item.avg_position,
  }));
}

export async function getSearchConsoleSitemaps(projectId: string): Promise<SitemapRow[]> {
  const response = await apiClient(`${base(projectId)}/sitemaps`, {}, "Failed to fetch Search Console sitemaps");
  const { data } = scSitemapsResponseSchema.parse(response);
  return data.items.map((item) => ({
    id: item.path,
    path: item.path,
    isPending: item.is_pending,
    isSitemapsIndex: item.is_sitemaps_index,
    lastSubmitted: item.last_submitted,
    lastDownloaded: item.last_downloaded,
    warnings: item.warnings,
    errors: item.errors,
    urlsSubmitted: item.urls_submitted,
    urlsIndexed: item.urls_indexed,
  }));
}
