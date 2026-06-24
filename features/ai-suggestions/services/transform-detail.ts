import type {
  AiSuggestion,
  AiSuggestionDetail,
  ApiSuggestion,
  ImpactLevel,
  RedirectSuggestedValue,
  SuggestionStatus,
} from "../types";

export function scoreToLevel(score: number): ImpactLevel {
  if (score >= 0.8) return "high";
  if (score >= 0.5) return "medium";
  return "low";
}

function extractPrimaryText(type: string, value: Record<string, unknown>): string {
  switch (type) {
    case "meta": return String(value.meta_title ?? value.meta_description ?? "");
    case "og_title": return String(value.og_title ?? "");
    case "og_description": return String(value.og_description ?? "");
    case "alt_text": return String(value.alt_text ?? "");
    default: return "";
  }
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
      rawSuggestedValue: s.display_value,
      rawCurrentValue: s.current_value,
      redirectCandidates: sv.redirect?.top_candidates,
    };
  }

  return {
    ...base,
    suggestedText: extractPrimaryText(s.suggestion_type, s.display_value),
    currentText: extractPrimaryText(s.suggestion_type, s.current_value),
    explanation: "",
    keywords: Array.isArray(s.keywords_used) ? s.keywords_used : [],
    rawSuggestedValue: s.display_value,
    rawCurrentValue: s.current_value,
  };
}
