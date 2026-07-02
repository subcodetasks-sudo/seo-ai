export type ImpactLevel = "high" | "medium" | "low";

export type SuggestionType =
  | "meta"
  | "og_title"
  | "og_description"
  | "schema"
  | "faq"
  | "redirect"
  | "alt_text"
  | "internal_link"
  | "h1"
  | "content";

export type SuggestionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "applied"
  | "failed"
  | "queued"
  | "processing"
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

export interface H1CurrentValue {
  h1: string;
  h1_count: number;
}

export interface H1SuggestedValue {
  h1_text: string;
  action: string;
  keywords_used: string[];
  language_detected: string;
  confidence_score: number;
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

export interface ContentCurrentValue {
  word_count: number;
}

export interface ContentSection {
  heading: string;
  content: string;
}

export interface ContentSuggestedValue {
  sections: ContentSection[];
  total_word_count: number;
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

// --- PATCH payload shapes per suggestion_type ---
// Whitelists of writable keys only. AI metadata (confidence_score,
// keywords_used, broken_slug, ...) lives in the read-side *SuggestedValue
// types above and must never be echoed back on a PATCH.

export interface MetaPatchValue {
  meta_title: string;
  meta_description: string;
}

export interface OgTitlePatchValue {
  og_title: string;
}

export interface OgDescriptionPatchValue {
  og_description: string;
}

export interface AltTextPatchValue {
  alt_text: string;
  image_url: string;
}

export interface H1PatchValue {
  h1_text: string;
  action: string;
}

export interface FaqPatchValue {
  pairs: FaqPair[];
  pair_count: number;
}

export interface SchemaPatchValue {
  schema: Record<string, unknown>;
  page_type: string;
  language_detected: string;
  validation_warnings: string[];
}

export interface InternalLinkPatchValue {
  links: InternalLink[];
}

export interface ContentPatchValue {
  sections: ContentSection[];
  total_word_count: number;
}

export interface RedirectPatchValue {
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
}

export type SuggestionPatchPayload =
  | { suggestion_type: "meta"; suggested_value: MetaPatchValue }
  | { suggestion_type: "og_title"; suggested_value: OgTitlePatchValue }
  | { suggestion_type: "og_description"; suggested_value: OgDescriptionPatchValue }
  | { suggestion_type: "alt_text"; suggested_value: AltTextPatchValue }
  | { suggestion_type: "h1"; suggested_value: H1PatchValue }
  | { suggestion_type: "faq"; suggested_value: FaqPatchValue }
  | { suggestion_type: "schema"; suggested_value: SchemaPatchValue }
  | { suggestion_type: "internal_link"; suggested_value: InternalLinkPatchValue }
  | { suggestion_type: "redirect"; suggested_value: RedirectPatchValue }
  | { suggestion_type: "content"; suggested_value: ContentPatchValue };

// Fallback for suggestion types outside the known union (forward-compat).
export type UnknownPatchPayload = { suggestion_type: string; suggested_value: Record<string, unknown> };

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

// --- API: POST /ai/generate (suggestion generation is queued, not returned synchronously) ---

export interface GenerateSuggestionResult {
  job_id: string;
  suggestion_id: string;
  generation_id: string;
  status: string;
  message: string;
  project_id: string;
  suggestion_type: string;
  page_type: string | null;
  image_url: string | null;
  page_url: string;
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
