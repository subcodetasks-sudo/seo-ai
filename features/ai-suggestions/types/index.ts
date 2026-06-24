export type ImpactLevel = "high" | "medium" | "low";

export type SuggestionType =
  | "meta"
  | "og_title"
  | "og_description"
  | "schema"
  | "faq"
  | "redirect"
  | "alt_text"
  | "internal_link";

export type SuggestionStatus = "pending" | "approved" | "rejected" | "applied" | "failed";

// --- API: concrete value shapes per suggestion_type ---

export interface MetaCurrentValue {
  meta_title: string;
  meta_description: string;
}

export interface MetaSuggestedValue {
  meta_title: string;
  meta_description: string;
  keywords_used: string[];
  language_detected: string;
  confidence_score: number;
}

export interface RedirectCandidate {
  url: string;
  title: string;
  confidence: number;
  reason: string;
}

export interface RedirectSuggestedValue {
  diagnosis: {
    break_type: string;
    explanation: string;
    suggestion: string;
    confidence: number;
  };
  redirect: {
    target_url: string;
    confidence: number;
    reason: string;
    top_candidates: RedirectCandidate[];
  };
  broken_slug: string;
  low_confidence: boolean;
}

// --- API: raw suggestion (value shapes vary by suggestion_type) ---

export interface ApiSuggestion {
  id: string;
  project_id: string;
  crawl_job_id: string;
  page_url: string;
  suggestion_type: string;
  current_value: Record<string, unknown>;
  suggested_value: Record<string, unknown>;
  modifications: unknown;
  display_value: Record<string, unknown>;
  keywords_used: string[];
  ai_model: string;
  prompt_version: string;
  confidence_score: number;
  status: string;
  reviewed_by: unknown;
  is_human_edited: boolean;
  reviewed_at: unknown;
  applied_at: unknown;
  error_message: unknown;
  raw_ai_output: string;
  created_at: string;
}

export interface ApiSuggestionsResponse {
  suggestions: ApiSuggestion[];
  total: number;
  page: number;
  per_page: number;
}

// --- UI types ---

export type AiSuggestion = {
  id: string;
  url: string;
  type: string;
  priority: ImpactLevel;
  impact: ImpactLevel;
  status: SuggestionStatus;
};

export type AiSuggestionDetail = AiSuggestion & {
  suggestedText: string;
  currentText: string;
  explanation: string;
  keywords: string[];
};
