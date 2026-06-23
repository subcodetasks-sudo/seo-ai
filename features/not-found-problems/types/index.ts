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
