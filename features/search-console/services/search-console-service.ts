import { getSearchConsoleOverview } from "../queries/api";
import type { SearchConsoleMetric } from "../types";

type Change = { change: number; trend: "up" | "down" } | undefined;

/**
 * The API only exposes a rolling `days` window from today, no explicit date
 * range. To approximate a prior-period comparison we also fetch a window
 * twice as long and subtract the current period out of it. This is exact for
 * additive counts (clicks, impressions) but not meaningful for rate/average
 * fields (ctr, avg_position), so those are left without a trend.
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
  format: SearchConsoleMetric["format"],
  changeInfo: Change,
  icon: SearchConsoleMetric["icon"],
  tone: SearchConsoleMetric["tone"],
): SearchConsoleMetric {
  return { id, labelKey, value, format, change: changeInfo?.change, trend: changeInfo?.trend, icon, tone };
}

export async function getOverviewMetrics(projectId: string, days: number): Promise<SearchConsoleMetric[]> {
  const [current, combined] = await Promise.all([
    getSearchConsoleOverview(projectId, days),
    getSearchConsoleOverview(projectId, days * 2),
  ]);

  return [
    metric("clicks", "overview.clicks", current.clicks, "number", computeChange(current.clicks, combined.clicks), "mousePointer", "green"),
    metric(
      "impressions",
      "overview.impressions",
      current.impressions,
      "number",
      computeChange(current.impressions, combined.impressions),
      "eye",
      "gray",
    ),
    metric("ctr", "overview.ctr", current.ctr, "percent", undefined, "percent", "green"),
    metric("avgPosition", "overview.avgPosition", current.avgPosition, "position", undefined, "hash", "yellow"),
  ];
}
