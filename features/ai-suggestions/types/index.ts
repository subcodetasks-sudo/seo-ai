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

export type SuggestionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "applied"
  | "failed"
  | "queued"
  | "skipped"
  | "ignored";

// --- Value shapes per suggestion_type ---

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

export interface OgTitleCurrentValue {
  og_title: string;
}

export interface OgTitleSuggestedValue {
  og_title: string;
}

export interface OgDescriptionCurrentValue {
  og_description: string;
}

export interface OgDescriptionSuggestedValue {
  og_description: string;
}

export interface AltTextValue {
  alt_text: string;
  image_url: string;
}

export interface FaqPair {
  question: string;
  answer: string;
}

export interface FaqSuggestedValue {
  pairs: FaqPair[];
  pair_count: number;
  language_detected: string;
  hallucination_warning: boolean;
  dropped_pairs: number;
}

export interface SchemaSuggestedValue {
  schema: Record<string, unknown>;
  page_type: string;
  language_detected: string;
  validation_warnings: string[];
}

export interface InternalLink {
  target_url: string;
  anchor_text: string;
  relevance_reason: string;
  confidence: number;
}

export interface InternalLinkSuggestedValue {
  links: InternalLink[];
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

// --- API: raw suggestion ---

export interface ApiSuggestion {
  id: string;
  project_id: string;
  crawl_job_id: string;
  page_url: string;
  suggestion_type: string;
  current_value: Record<string, unknown>;
  suggested_value: Record<string, unknown>;
  modifications: Record<string, unknown> | null;
  display_value: Record<string, unknown>;
  keywords_used: string[];
  ai_model: string;
  prompt_version: string;
  confidence_score: number;
  status: string;
  reviewed_by: string | null;
  is_human_edited: boolean;
  reviewed_at: string | null;
  applied_at: string | null;
  error_message: string | null;
  error_code: string | null;
  generation_id: string | null;
  job_id: string | null;
  raw_ai_output: string;
  created_at: string;
}

export interface ApiSuggestionsResponse {
  suggestions: ApiSuggestion[];
  total: number;
  page: number;
  per_page: number;
}

export interface BackendResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

// --- UI types ---

export type AiSuggestion = {
  id: string;
  url: string;
  type: SuggestionType | string;
  priority: ImpactLevel;
  impact: ImpactLevel;
  status: SuggestionStatus;
};

export type AiSuggestionDetail = AiSuggestion & {
  suggestedText: string;
  currentText: string;
  explanation: string;
  keywords: string[];
  rawSuggestedValue: Record<string, unknown>;
  rawCurrentValue: Record<string, unknown>;
  redirectCandidates?: RedirectCandidate[];
};
