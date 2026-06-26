export type ChangelogStatus = "applied" | "pending" | "failed" | "reverted";

export type ChangelogPeriod = 7 | 30 | 90;

export type ChangelogEntry = {
  id: string;
  page_url: string;
  change_type: string;
  old_value: string;
  new_value: string;
  applied_by: string;
  applied_at: string;
  status: ChangelogStatus;
  error_message: string | null;
};

export type ChangelogResponse = {
  status: boolean;
  message: string;
  data: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
    items: ChangelogEntry[];
  };
};

export type GenerateReportFormValues = {
  title: string;
  email: string;
};
