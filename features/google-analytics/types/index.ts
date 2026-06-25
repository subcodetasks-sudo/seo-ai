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
  value: string;
  change: number;
  trend: MetricTrend;
  sparkline: number[];
  icon: MetricIcon;
  tone: MetricTone;
};

export type TrafficDistributionSegment = {
  id: string;
  labelKey: string;
  percentage: number;
  color: string;
};

export type CountryBreakdownItem = {
  code: string;
  labelKey: string;
  percentage: number;
  visitors: number;
};

export type TrafficSourceBreakdownItem = {
  id: string;
  labelKey: string;
  change: number;
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

export type RevenueTrendPoint = {
  label: string;
  value: number;
};

export type ProductTone = "green" | "blue" | "orange" | "purple";

export type TopProductRow = {
  id: string;
  labelKey: string;
  revenue: number;
  units: number;
  share: number;
  tone: ProductTone;
};

export type EcommerceTabData = {
  summary: GoogleAnalyticsMetric[];
  revenueTrend: RevenueTrendPoint[];
  topProducts: TopProductRow[];
};

export type PageSortMode = "views" | "bounceRate";

export type TopPageRow = {
  id: string;
  titleKey: string;
  path: string;
  views: number;
  avgTime: string;
  bounceRate: number;
};

export type PagesTabData = {
  pages: TopPageRow[];
};
