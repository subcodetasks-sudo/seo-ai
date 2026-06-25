import type {
  AudienceTabData,
  EcommerceTabData,
  GoogleAnalyticsMetric,
  GoogleAnalyticsTab,
  PagesTabData,
  TrafficDistributionSegment,
  TrafficSourcesTabData,
} from "../types";

const SPARKLINE_A = [12, 18, 14, 22, 19, 26, 24, 28, 25, 31];
const SPARKLINE_B = [20, 18, 22, 19, 24, 21, 27, 25, 29, 28];
const SPARKLINE_C = [15, 17, 16, 20, 18, 22, 21, 23, 22, 24];
const SPARKLINE_DOWN = [28, 26, 27, 24, 25, 22, 23, 21, 22, 20];

function metric(
  partial: Omit<GoogleAnalyticsMetric, "sparkline"> & { sparkline?: number[] },
): GoogleAnalyticsMetric {
  return {
    sparkline: SPARKLINE_A,
    ...partial,
  };
}

const OVERVIEW_METRICS: GoogleAnalyticsMetric[] = [
  metric({
    id: "totalUsers",
    labelKey: "overview.totalUsers",
    value: "24,831",
    change: 12.4,
    trend: "up",
    icon: "users",
    tone: "gray",
    sparkline: SPARKLINE_B,
  }),
  metric({
    id: "newUsers",
    labelKey: "overview.newUsers",
    value: "18,294",
    change: 8.7,
    trend: "up",
    icon: "userPlus",
    tone: "green",
    sparkline: SPARKLINE_A,
  }),
  metric({
    id: "activeUsers",
    labelKey: "overview.activeUsers",
    value: "6,537",
    change: 15.2,
    trend: "up",
    icon: "userCheck",
    tone: "green",
    sparkline: SPARKLINE_C,
  }),
  metric({
    id: "sessions",
    labelKey: "overview.sessions",
    value: "31,420",
    change: 9.3,
    trend: "up",
    icon: "trendingUp",
    tone: "green",
  }),
  metric({
    id: "engagedSessions",
    labelKey: "overview.engagedSessions",
    value: "22,180",
    change: 11.6,
    trend: "up",
    icon: "sparkles",
    tone: "gray",
    sparkline: SPARKLINE_B,
  }),
  metric({
    id: "avgSessionDuration",
    labelKey: "overview.avgSessionDuration",
    value: "3:24",
    change: 5.1,
    trend: "up",
    icon: "clock",
    tone: "green",
    sparkline: SPARKLINE_C,
  }),
  metric({
    id: "engagementRate",
    labelKey: "overview.engagementRate",
    value: "70.6%",
    change: 2.1,
    trend: "up",
    icon: "zap",
    tone: "yellow",
    sparkline: SPARKLINE_A,
  }),
  metric({
    id: "bounceRate",
    labelKey: "overview.bounceRate",
    value: "29.4%",
    change: -3.2,
    trend: "down",
    icon: "trendingDown",
    tone: "red",
    sparkline: SPARKLINE_DOWN,
  }),
];

const ECOMMERCE_SUMMARY: GoogleAnalyticsMetric[] = [
  metric({
    id: "revenue",
    labelKey: "revenue",
    value: "184,200",
    change: 22.5,
    trend: "up",
    icon: "dollarSign",
    tone: "green",
    sparkline: SPARKLINE_A,
  }),
  metric({
    id: "purchases",
    labelKey: "purchases",
    value: "623",
    change: 15.3,
    trend: "up",
    icon: "shoppingBag",
    tone: "gray",
    sparkline: SPARKLINE_B,
  }),
  metric({
    id: "avgOrderValue",
    labelKey: "avgOrderValue",
    value: "295.6",
    change: 6.2,
    trend: "up",
    icon: "package",
    tone: "green",
    sparkline: SPARKLINE_C,
  }),
  metric({
    id: "abandonedCarts",
    labelKey: "abandonedCarts",
    value: "187",
    change: -8.4,
    trend: "down",
    icon: "shoppingCart",
    tone: "red",
    sparkline: SPARKLINE_DOWN,
  }),
];

const ECOMMERCE_REVENUE_TREND = Array.from({ length: 15 }, (_, index) => ({
  label: String(index + 1),
  value: 8200 + index * 680 + (index % 3) * 240,
}));

const ECOMMERCE_TOP_PRODUCTS = [
  {
    id: "enterprise",
    labelKey: "products.enterprise",
    revenue: 82400,
    units: 124,
    share: 45,
    tone: "green" as const,
  },
  {
    id: "pro",
    labelKey: "products.pro",
    revenue: 48600,
    units: 210,
    share: 28,
    tone: "blue" as const,
  },
  {
    id: "starter",
    labelKey: "products.starter",
    revenue: 31200,
    units: 186,
    share: 17,
    tone: "orange" as const,
  },
  {
    id: "addons",
    labelKey: "products.addons",
    revenue: 22000,
    units: 103,
    share: 10,
    tone: "purple" as const,
  },
] satisfies EcommerceTabData["topProducts"];

const TOP_PAGES = [
  {
    id: "home",
    titleKey: "items.home",
    path: "/",
    views: 8421,
    avgTime: "3:18",
    bounceRate: 19,
  },
  {
    id: "ai-solutions",
    titleKey: "items.aiSolutions",
    path: "/blog/ai-solutions",
    views: 4821,
    avgTime: "4:32",
    bounceRate: 24,
  },
  {
    id: "pricing",
    titleKey: "items.pricing",
    path: "/pricing",
    views: 3912,
    avgTime: "2:54",
    bounceRate: 31,
  },
  {
    id: "seo-guide",
    titleKey: "items.seoGuide",
    path: "/blog/seo-guide",
    views: 2844,
    avgTime: "5:12",
    bounceRate: 15,
  },
  {
    id: "about",
    titleKey: "items.about",
    path: "/about",
    views: 2108,
    avgTime: "1:48",
    bounceRate: 42,
  },
  {
    id: "contact",
    titleKey: "items.contact",
    path: "/contact",
    views: 1764,
    avgTime: "2:06",
    bounceRate: 28,
  },
  {
    id: "features",
    titleKey: "items.features",
    path: "/features",
    views: 1542,
    avgTime: "3:44",
    bounceRate: 22,
  },
  {
    id: "case-studies",
    titleKey: "items.caseStudies",
    path: "/case-studies",
    views: 1298,
    avgTime: "4:08",
    bounceRate: 18,
  },
] satisfies PagesTabData["pages"];

const CONVERSIONS_METRICS: GoogleAnalyticsMetric[] = [
  metric({
    id: "orders",
    labelKey: "conversions.orders",
    value: "24,831",
    change: 12.4,
    trend: "up",
    icon: "users",
    tone: "gray",
    sparkline: SPARKLINE_B,
  }),
  metric({
    id: "conversionRate",
    labelKey: "conversions.conversionRate",
    value: "18,294",
    change: 8.7,
    trend: "up",
    icon: "userPlus",
    tone: "green",
    sparkline: SPARKLINE_A,
  }),
  metric({
    id: "conversionValue",
    labelKey: "conversions.conversionValue",
    value: "6,537",
    change: 15.2,
    trend: "up",
    icon: "user",
    tone: "green",
    sparkline: SPARKLINE_C,
  }),
  metric({
    id: "totalConversions",
    labelKey: "conversions.totalConversions",
    value: "31,420",
    change: 9.3,
    trend: "up",
    icon: "trendingUp",
    tone: "green",
  }),
  metric({
    id: "registrations",
    labelKey: "conversions.registrations",
    value: "29.4%",
    change: -3.2,
    trend: "down",
    icon: "arrowUpRight",
    tone: "red",
    sparkline: SPARKLINE_DOWN,
  }),
];

const EVENTS_METRICS: GoogleAnalyticsMetric[] = [
  metric({
    id: "videoPlayback",
    labelKey: "events.videoPlayback",
    value: "8,412",
    change: 10.5,
    trend: "up",
    icon: "video",
    tone: "green",
  }),
  metric({
    id: "totalUsers",
    labelKey: "events.totalUsers",
    value: "18,294",
    change: 8.7,
    trend: "up",
    icon: "users",
    tone: "gray",
    sparkline: SPARKLINE_B,
  }),
  metric({
    id: "buttonClicks",
    labelKey: "events.buttonClicks",
    value: "42,180",
    change: 13.1,
    trend: "up",
    icon: "mousePointer",
    tone: "green",
    sparkline: SPARKLINE_A,
  }),
  metric({
    id: "fileDownloads",
    labelKey: "events.fileDownloads",
    value: "2,964",
    change: 6.4,
    trend: "up",
    icon: "download",
    tone: "red",
    sparkline: SPARKLINE_C,
  }),
  metric({
    id: "customEvents",
    labelKey: "events.customEvents",
    value: "15,720",
    change: 18.9,
    trend: "up",
    icon: "zap",
    tone: "yellow",
  }),
  metric({
    id: "formSubmissions",
    labelKey: "events.formSubmissions",
    value: "4,318",
    change: 7.8,
    trend: "up",
    icon: "fileText",
    tone: "green",
    sparkline: SPARKLINE_B,
  }),
];

const TRAFFIC_DISTRIBUTION: TrafficDistributionSegment[] = [
  { id: "organic", labelKey: "distribution.organic", percentage: 45, color: "#84CC16" },
  { id: "direct", labelKey: "distribution.direct", percentage: 25, color: "#3F6212" },
  { id: "social", labelKey: "distribution.social", percentage: 15, color: "#22C55E" },
  { id: "paid", labelKey: "distribution.paid", percentage: 10, color: "#CA8A04" },
  { id: "referral", labelKey: "distribution.referral", percentage: 5, color: "#94A3B8" },
];

const AUDIENCE_COUNTRIES = [
  { code: "SA", labelKey: "country.sa", percentage: 50, visitors: 12415 },
  { code: "AE", labelKey: "country.ae", percentage: 20, visitors: 4966 },
  { code: "EG", labelKey: "country.eg", percentage: 15, visitors: 3724 },
  { code: "KW", labelKey: "country.kw", percentage: 5, visitors: 1242 },
  { code: "BH", labelKey: "country.bh", percentage: 3, visitors: 745 },
] satisfies AudienceTabData["countries"];

const TRAFFIC_SOURCE_BREAKDOWN = [
  { id: "organic", labelKey: "items.organic", change: 8, visitors: 11243, tone: "green" as const },
  { id: "direct", labelKey: "items.direct", change: 3, visitors: 6234, tone: "green" as const },
  { id: "social", labelKey: "items.social", change: 18, visitors: 3745, tone: "green" as const },
  { id: "paid", labelKey: "items.paid", change: -2, visitors: 2494, tone: "yellow" as const },
  { id: "referral", labelKey: "items.referral", change: 5, visitors: 1249, tone: "gray" as const },
] satisfies TrafficSourcesTabData["sources"];

const METRICS_BY_TAB: Record<GoogleAnalyticsTab, GoogleAnalyticsMetric[]> = {
  overview: OVERVIEW_METRICS,
  ecommerce: [],
  conversions: CONVERSIONS_METRICS,
  events: EVENTS_METRICS,
  audience: [],
  pages: [],
  "traffic-sources": [],
};

export function getGoogleAnalyticsMetrics(tab: GoogleAnalyticsTab): GoogleAnalyticsMetric[] {
  return METRICS_BY_TAB[tab];
}

export function getAudienceTabData(): AudienceTabData {
  return {
    countries: AUDIENCE_COUNTRIES,
    distribution: TRAFFIC_DISTRIBUTION,
  };
}

export function getTrafficSourcesTabData(): TrafficSourcesTabData {
  return {
    sources: TRAFFIC_SOURCE_BREAKDOWN,
    distribution: TRAFFIC_DISTRIBUTION,
  };
}

export function getEcommerceTabData(): EcommerceTabData {
  return {
    summary: ECOMMERCE_SUMMARY,
    revenueTrend: ECOMMERCE_REVENUE_TREND,
    topProducts: ECOMMERCE_TOP_PRODUCTS,
  };
}

export function getPagesTabData(): PagesTabData {
  return {
    pages: TOP_PAGES,
  };
}
