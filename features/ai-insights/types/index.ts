export type AiInsightsTab = "overview" | "analysis" | "recommendations" | "performance";

export const AI_INSIGHTS_TABS: AiInsightsTab[] = [
  "overview",
  "analysis",
  "recommendations",
  "performance",
];

export type AiInsightsPeriod = 7 | 30 | 90;

// --- Issue Summary API ---

export type IssueSummaryTrend = {
  metric: string;
  value: number;
  direction: "up" | "down";
  tone?: "positive" | "negative" | "warning";
};

export type SparklinePoint = { label: string; value: number };

export type IssueSummaryMetric = {
  label: string;
  value: number | string;
  change?: number;
  unit?: string;
  sparkline?: SparklinePoint[];
  previousPeriodLabel?: string;
};

export type IssueSummaryRecommendation = {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  expected_impact?: string;
  effort?: "low" | "medium" | "high";
  category?: string;
  confidence?: number;
  estimatedTime?: string;
  affectedPage?: string;
  why?: string;
};

export type IssueSummaryRootCause = {
  issue: string;
  cause: string;
  priority?: string;
  frequency?: number;
};

export type WorkPerformanceIndicator = {
  weaknesses: string[];
  strengths: string[];
  confidence: number;
  growthTrend: number;
  status: string;
};

export type CriticalInsight = {
  title: string;
  category: string;
  change: number;
  tone: "positive" | "negative";
};

export type SmartInsightMetric = { label: string; value: string };

export type SmartInsight = {
  category: string;
  severity: "medium" | "critical" | "positive";
  title: string;
  description: string;
  metrics: SmartInsightMetric[];
};

export type RootCauseDetail = IssueSummaryRootCause & {
  causes: { severity: "high" | "medium"; text: string }[];
  affectedPages: string[];
  confidenceLevel: "high" | "medium" | "low";
  confidence: number;
};

export type GrowthOpportunity = {
  title: string;
  description: string;
  potential: "high" | "medium";
  expectedImpact: string;
  difficulty: "low" | "medium" | "high";
};

export type RecommendationTracking = {
  id: string;
  title: string;
  category: string;
  status: "completed" | "in_progress" | "not_started";
  before?: number;
  after?: number;
  progress?: number;
  assignee: string;
  date: string;
};

export type TimelineEvent = {
  tag: "result" | "event" | "recommendation" | "seo" | "update" | "campaign";
  title: string;
  date: string;
};

export type PerformanceComparisonColumn = {
  status: "stable" | "improved" | "declined";
  rows: { label: string; value: string }[];
};

export type AiLearningStats = {
  conversionLift: string;
  revenueLift: string;
  successfulRecs: number;
  appliedRecs: number;
  generatedRecs: number;
  successRate: number;
  periodLabel: string;
};

export type PerformanceHistory = {
  chartData: SparklinePoint[];
  metrics: IssueSummaryMetric[];
  timeline: TimelineEvent[];
  comparison: PerformanceComparisonColumn[];
  learningStats: AiLearningStats;
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
  work_performance?: WorkPerformanceIndicator;
  critical_insights?: CriticalInsight[];
  smart_insights?: SmartInsight[];
  root_cause_details?: RootCauseDetail[];
  growth_opportunities?: GrowthOpportunity[];
  recommendation_tracking?: RecommendationTracking[];
  performance_history?: PerformanceHistory;
};

export type IssueSummaryResponse = {
  status: boolean;
  message: string;
  data: IssueSummary;
};
