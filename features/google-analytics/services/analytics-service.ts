import {
  getGoogleAnalyticsEcommerce,
  getGoogleAnalyticsOverview,
  getGoogleAnalyticsTrafficSources,
} from "../queries/api";
import type {
  GoogleAnalyticsMetric,
  MetricTone,
  TrafficSourceBreakdownItem,
  TrafficSourcesTabData,
} from "../types";

type Change = { change: number; trend: "up" | "down" } | undefined;

/**
 * The API only exposes a rolling `days` window from today, no explicit date
 * range. To approximate a prior-period comparison we also fetch a window
 * twice as long and subtract the current period out of it. This is exact for
 * additive counts (sessions, page views, revenue, …) but GA4 "users" figures
 * are distinct-user counts, so a user active in both halves makes this an
 * undercount of the prior period — good enough for a trend arrow, not exact.
 */
function computeChange(current: number, combinedTwoPeriods: number): Change {
  const previous = combinedTwoPeriods - current;
  if (previous <= 0) return undefined;
  const change = Math.round(((current - previous) / previous) * 1000) / 10;
  return { change, trend: change >= 0 ? "up" : "down" };
}

function metric(
  id: string,
  labelKey: string,
  value: number,
  format: GoogleAnalyticsMetric["format"],
  changeInfo: Change,
  icon: GoogleAnalyticsMetric["icon"],
  tone: GoogleAnalyticsMetric["tone"],
): GoogleAnalyticsMetric {
  return { id, labelKey, value, format, change: changeInfo?.change, trend: changeInfo?.trend, icon, tone };
}

export async function getOverviewMetrics(projectId: string, days: number): Promise<GoogleAnalyticsMetric[]> {
  const [current, combined] = await Promise.all([
    getGoogleAnalyticsOverview(projectId, days),
    getGoogleAnalyticsOverview(projectId, days * 2),
  ]);

  return [
    metric("sessions", "overview.sessions", current.sessions, "number", computeChange(current.sessions, combined.sessions), "trendingUp", "green"),
    metric("totalUsers", "overview.totalUsers", current.users, "number", computeChange(current.users, combined.users), "users", "gray"),
    metric("newUsers", "overview.newUsers", current.newUsers, "number", computeChange(current.newUsers, combined.newUsers), "userPlus", "green"),
    metric("activeUsers", "overview.activeUsers", current.activeUsers, "number", computeChange(current.activeUsers, combined.activeUsers), "userCheck", "green"),
    metric("pageViews", "overview.pageViews", current.pageViews, "number", computeChange(current.pageViews, combined.pageViews), "eye", "gray"),
    metric("avgSessionDuration", "overview.avgSessionDuration", current.avgSessionDuration, "duration", undefined, "clock", "green"),
    metric("bounceRate", "overview.bounceRate", current.bounceRate * 100, "percent", undefined, "trendingDown", "red"),
  ];
}

export async function getEcommerceSummaryMetrics(projectId: string, days: number): Promise<GoogleAnalyticsMetric[]> {
  const [current, combined] = await Promise.all([
    getGoogleAnalyticsEcommerce(projectId, days),
    getGoogleAnalyticsEcommerce(projectId, days * 2),
  ]);

  return [
    metric("revenue", "ecommerce.revenue", current.totalRevenue, "currency", computeChange(current.totalRevenue, combined.totalRevenue), "dollarSign", "green"),
    metric("transactions", "ecommerce.transactions", current.transactions, "number", computeChange(current.transactions, combined.transactions), "shoppingBag", "gray"),
    metric("itemsPurchased", "ecommerce.itemsPurchased", current.itemsPurchased, "number", computeChange(current.itemsPurchased, combined.itemsPurchased), "shoppingCart", "green"),
    metric("avgOrderValue", "ecommerce.avgOrderValue", current.avgOrderValue, "currency", undefined, "package", "green"),
    metric("purchaseConversion", "ecommerce.purchaseConversion", current.conversionRate * 100, "percent", undefined, "zap", "yellow"),
  ];
}

const CHANNEL_TONE_KEYWORDS: { keyword: string; tone: MetricTone }[] = [
  { keyword: "organic", tone: "green" },
  { keyword: "direct", tone: "gray" },
  { keyword: "social", tone: "green" },
  { keyword: "paid", tone: "yellow" },
  { keyword: "referral", tone: "gray" },
  { keyword: "email", tone: "green" },
];
const FALLBACK_TONES: MetricTone[] = ["green", "gray", "yellow", "red"];
const DISTRIBUTION_PALETTE = ["#84CC16", "#3F6212", "#22C55E", "#CA8A04", "#94A3B8", "#0EA5E9", "#A855F7"];

function toneForChannel(channel: string, index: number): MetricTone {
  const lower = channel.toLowerCase();
  const match = CHANNEL_TONE_KEYWORDS.find((entry) => lower.includes(entry.keyword));
  return match ? match.tone : FALLBACK_TONES[index % FALLBACK_TONES.length];
}

export async function getTrafficSourcesData(projectId: string, days: number): Promise<TrafficSourcesTabData> {
  const [current, combined] = await Promise.all([
    getGoogleAnalyticsTrafficSources(projectId, days),
    getGoogleAnalyticsTrafficSources(projectId, days * 2),
  ]);

  const totalSessions = current.totalSessions || 1;
  const sortedItems = current.items.slice().sort((a, b) => b.sessions - a.sessions);

  const sources: TrafficSourceBreakdownItem[] = sortedItems.map((item, index) => {
    const combinedItem = combined.items.find((entry) => entry.channel === item.channel);
    const changeInfo = combinedItem ? computeChange(item.sessions, combinedItem.sessions) : undefined;
    return {
      id: item.channel,
      label: item.channel,
      change: changeInfo?.change,
      visitors: item.sessions,
      tone: toneForChannel(item.channel, index),
    };
  });

  const distribution = sortedItems.slice(0, 5).map((item, index) => ({
    id: item.channel,
    label: item.channel,
    percentage: Math.round((item.sessions / totalSessions) * 100),
    color: DISTRIBUTION_PALETTE[index % DISTRIBUTION_PALETTE.length],
  }));

  return { sources, distribution };
}
