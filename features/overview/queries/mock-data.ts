import type { ChartPoint } from "../types";

// TODO: replace with API time-series when backend exposes it
export const MOCK_HEALTH_SCORE_TREND: ChartPoint[] = [
  { label: "Jan", value: 62 },
  { label: "Feb", value: 65 },
  { label: "Mar", value: 68 },
  { label: "Apr", value: 71 },
  { label: "May", value: 73 },
  { label: "Jun", value: 75 },
];

// TODO: replace with API time-series when backend exposes it
export const MOCK_SEO_ISSUES_TREND: ChartPoint[] = [
  { label: "Jan", value: 28 },
  { label: "Feb", value: 24 },
  { label: "Mar", value: 20 },
  { label: "Apr", value: 16 },
  { label: "May", value: 14 },
  { label: "Jun", value: 12 },
];
