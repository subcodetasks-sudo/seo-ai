export type BrokenPageStatus = "new" | "resolved" | "ignored";

export type BrokenPage = {
  id: string;
  url: string;
  referrer_url: string | null;
  first_detected_at: string;
  last_triggered_at: string;
  trigger_count: number;
  detection_source: string;
  status: BrokenPageStatus;
};

export type BrokenPagesResponse = {
  status: boolean;
  message: string;
  data: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    items: BrokenPage[];
  };
};

export type RedirectSuggestionStatus = "pending" | "approved" | "rejected";

export type RedirectSuggestion = {
  suggestion_id: string;
  status: RedirectSuggestionStatus;
  target_url: string;
  confidence: number;
  reason: string;
};

export type BrokenPageDetail = BrokenPage & {
  redirect_suggestion: RedirectSuggestion | null;
};

export type BrokenPageDetailResponse = {
  status: boolean;
  message: string;
  data: BrokenPageDetail;
};
