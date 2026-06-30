export type AiInsightsTab = "overview" | "recommendations" | "performance";

export const AI_INSIGHTS_TABS: AiInsightsTab[] = [
  "overview",
  "recommendations",
  "performance",
];

export type AiInsightsPeriod = 7 | 30 | 90;

// --- Issue Summary API ---

export type IssueSummaryTrend = {
  metric: string;
  value: number;
  direction: "up" | "down";
};

export type IssueSummaryMetric = {
  label: string;
  value: number | string;
  change?: number;
  unit?: string;
};

export type IssueSummaryRecommendation = {
  id: string;
  title: string;
  description: string;
  priority: "urgent" | "high" | "medium" | "low";
  expected_impact?: string;
  effort?: "low" | "medium" | "high";
  category?: string;
  confidence?: number;
};

export type IssueSummaryRootCause = {
  issue: string;
  cause: string;
  priority?: string;
  frequency?: number;
};

export type IssueSummary = {
  executive_summary: string;
  period_days?: number;
  trends?: IssueSummaryTrend[];
  key_metrics?: IssueSummaryMetric[];
  performance_score?: number;
  recommendations?: IssueSummaryRecommendation[];
  root_cause_analysis?: IssueSummaryRootCause[];
  confidence_rate?: number;
  generated_at?: string;
};

export type IssueSummaryResponse = {
  status: boolean;
  message: string;
  data: IssueSummary;
};
