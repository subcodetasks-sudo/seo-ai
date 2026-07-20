export type SearchConsoleTab = "overview" | "queries" | "pages" | "countries" | "devices" | "sitemaps";

export const SEARCH_CONSOLE_TABS: SearchConsoleTab[] = [
  "overview",
  "queries",
  "pages",
  "countries",
  "devices",
  "sitemaps",
];

export type SearchConsolePeriod = 7 | 30 | 90;

export const SEARCH_CONSOLE_PERIODS: SearchConsolePeriod[] = [7, 30, 90];

export type MetricTrend = "up" | "down";

export type MetricTone = "green" | "gray" | "yellow" | "red";

export type MetricFormat = "number" | "percent" | "position";

export type MetricIcon = "mousePointer" | "eye" | "percent" | "hash";

export type SearchConsoleMetric = {
  id: string;
  labelKey: string;
  value: number;
  format: MetricFormat;
  change?: number;
  trend?: MetricTrend;
  icon: MetricIcon;
  tone: MetricTone;
};

export type SearchConsoleStatus = {
  connected: boolean;
  siteUrl: string | null;
};

export type SearchConsoleSite = {
  siteUrl: string;
  permissionLevel: string;
};

export type SearchConsoleSortMode = "clicks" | "ctr";

export type SearchConsoleItemRow = {
  id: string;
  label: string;
  secondaryLabel?: string;
  clicks: number;
  impressions: number;
  ctr: number;
  avgPosition: number;
};

export type SitemapRow = {
  id: string;
  path: string;
  isPending: boolean;
  isSitemapsIndex: boolean;
  lastSubmitted: string | null;
  lastDownloaded: string | null;
  warnings: number;
  errors: number;
  urlsSubmitted: number;
  urlsIndexed: number;
};
