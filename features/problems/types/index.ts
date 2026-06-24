export type ProblemSeverity = "high" | "medium" | "low";
export type ProblemFilter = "all" | ProblemSeverity;

export type Problem = {
  id: string;
  type: string;
  affected_pages: number;
  severity: ProblemSeverity;
};
