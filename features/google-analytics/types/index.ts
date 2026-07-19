export type GoogleAnalyticsTab =
  | "overview"
  | "ecommerce"
  | "conversions"
  | "events"
  | "audience"
  | "pages"
  | "traffic-sources";

export const GOOGLE_ANALYTICS_TABS: GoogleAnalyticsTab[] = [
  "overview",
  "ecommerce",
  "conversions",
  "events",
  "audience",
  "pages",
  "traffic-sources",
];

export type GoogleAnalyticsPeriod = 7 | 30 | 90;

export const GOOGLE_ANALYTICS_PERIODS: GoogleAnalyticsPeriod[] = [7, 30, 90];

export type MetricTrend = "up" | "down";

export type MetricTone = "green" | "gray" | "yellow" | "red";

export type MetricFormat = "number" | "percent" | "duration" | "currency";

export type MetricIcon =
  | "users"
  | "userPlus"
  | "userCheck"
  | "user"
  | "trendingUp"
  | "trendingDown"
  | "clock"
  | "zap"
  | "sparkles"
  | "mousePointer"
  | "video"
  | "download"
  | "fileText"
  | "shoppingCart"
  | "dollarSign"
  | "globe"
  | "layout"
  | "link"
  | "arrowUpRight"
  | "eye"
  | "share2"
  | "mail"
  | "package"
  | "shoppingBag";

export type GoogleAnalyticsMetric = {
  id: string;
  labelKey: string;
  value: number;
  format: MetricFormat;
  change?: number;
  trend?: MetricTrend;
  icon: MetricIcon;
  tone: MetricTone;
};

export type GoogleAnalyticsStatus = {
  connected: boolean;
  propertyId: string | null;
  propertyName: string | null;
};

export type GoogleAnalyticsProperty = {
  propertyId: string;
  displayName: string;
  websiteUrl: string;
};

export type TrafficDistributionSegment = {
  id: string;
  label: string;
  percentage: number;
  color: string;
};

export type CountryBreakdownItem = {
  code: string;
  label: string;
  percentage: number;
  visitors: number;
};

export type TrafficSourceBreakdownItem = {
  id: string;
  label: string;
  change?: number;
  visitors: number;
  tone: MetricTone;
};

export type AudienceTabData = {
  countries: CountryBreakdownItem[];
  distribution: TrafficDistributionSegment[];
};

export type TrafficSourcesTabData = {
  sources: TrafficSourceBreakdownItem[];
  distribution: TrafficDistributionSegment[];
};

export type EcommerceTabData = {
  summary: GoogleAnalyticsMetric[];
};

export type PageSortMode = "views" | "bounceRate";

export type TopPageRow = {
  id: string;
  title: string;
  path: string;
  views: number;
  avgTime: string;
  bounceRate: number;
};

export type PagesTabData = {
  pages: TopPageRow[];
};

export type EventRow = {
  id: string;
  eventName: string;
  eventCount: number;
  users: number;
};

export type EventsTabData = {
  items: EventRow[];
  totalEvents: number;
};

export type ConversionRow = {
  id: string;
  eventName: string;
  conversions: number;
  conversionRate: number;
};

export type ConversionsTabData = {
  items: ConversionRow[];
  totalConversions: number;
};
