import type {
  AiSuggestion,
  AiSuggestionDetail,
  ApiSuggestion,
  ImpactLevel,
  MetaCurrentValue,
  MetaSuggestedValue,
  RedirectSuggestedValue,
  SuggestionStatus,
} from "../types";

export function scoreToLevel(score: number): ImpactLevel {
  if (score >= 0.8) return "high";
  if (score >= 0.5) return "medium";
  return "low";
}

export function transformSuggestionDetail(s: ApiSuggestion): AiSuggestionDetail {
  const level = scoreToLevel(s.confidence_score);

  const base: AiSuggestion = {
    id: s.id,
    url: s.page_url,
    type: s.suggestion_type,
    status: s.status as SuggestionStatus,
    priority: level,
    impact: level,
  };

  if (s.suggestion_type === "redirect") {
    const sv = s.suggested_value as unknown as RedirectSuggestedValue;
    return {
      ...base,
      suggestedText: sv.redirect?.target_url ?? "",
      currentText: s.page_url,
      explanation: sv.diagnosis?.explanation ?? "",
      keywords: [],
    };
  }

  // meta, og_title, og_description, alt_text, schema, faq, internal_link
  const sv = s.suggested_value as unknown as MetaSuggestedValue;
  const cv = s.current_value as unknown as Partial<MetaCurrentValue>;
  return {
    ...base,
    suggestedText: sv.meta_title ?? sv.meta_description ?? "",
    currentText: cv.meta_title ?? cv.meta_description ?? "",
    explanation: "",
    keywords: sv.keywords_used ?? [],
  };
}
