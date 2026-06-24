export type ChangelogStatus = "applied" | "pending" | "failed" | "reverted";

export type ChangelogPeriod = 7 | 30 | 90;

export type ChangelogEntry = {
  id: string;
  date: string;
  url: string;
  field: string;
  old_value: string;
  new_value: string;
  status: ChangelogStatus;
};

export type GenerateReportFormValues = {
  title: string;
  email: string;
};
