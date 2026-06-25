import { apiClient } from "@/lib/client";
import type { ProfileFormValues } from "../types";

export type UserPlan = {
  name: string;
  max_projects: number;
  max_pages_per_crawl: number;
  max_crawls_per_month: number;
  max_ai_pages_per_month: number;
  price_monthly_usd: string;
  price_monthly_sar: string;
};

export type CurrentUserData = {
  id: string;
  email: string;
  display_name: string;
  is_verified: boolean;
  plan: UserPlan;
  usage: {
    pages_crawled: number;
    pages_crawled_limit: number;
    ai_pages_used: number;
    ai_pages_limit: number;
    crawls_run: number;
    crawls_limit: number;
    month: string;
  };
  created_at: string;
};

type UserResponse = {
  status: boolean;
  message: string;
  data: CurrentUserData;
};

export function getCurrentUser() {
  return apiClient<UserResponse>("users/me", { method: "GET" }, "Failed to fetch user");
}

export function updateProfile(values: ProfileFormValues) {
  return apiClient<UserResponse>(
    "users/me",
    { method: "PATCH", body: JSON.stringify(values) },
    "Failed to update profile",
  );
}

export function changePassword(values: { old_password: string; new_password: string }) {
  return apiClient<{ status: boolean; message: string }>(
    "users/me/change-password",
    { method: "POST", body: JSON.stringify(values) },
    "Failed to change password",
  );
}
