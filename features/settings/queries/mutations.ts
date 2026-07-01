import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  changeBillingPlan,
  changePassword,
  openBillingPortal,
  startBillingCheckout,
  updateNotificationPrefs,
  updateProfile,
} from "./api";
import type { NotificationPrefs } from "./api";
import { settingsKeys } from "./query-keys";

// The checkout/portal endpoints' redirect field name isn't confirmed
// against a real response yet — read it defensively under a few likely keys.
export function extractRedirectUrl(data?: Record<string, unknown>): string | null {
  if (!data) return null;
  const candidate = data.url ?? data.checkout_url ?? data.portal_url ?? data.redirect_url;
  return typeof candidate === "string" ? candidate : null;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ current_password, new_password }: { current_password: string; new_password: string }) =>
      changePassword({ old_password: current_password, new_password }),
  });
}

export function useUpdateNotificationPrefs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: Partial<NotificationPrefs>) => updateNotificationPrefs(values),
    onError: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.notificationPrefs() });
    },
  });
}

export function useChangeBillingPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planName: string) => changeBillingPlan(planName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.currentBilling() });
      queryClient.invalidateQueries({ queryKey: settingsKeys.usage() });
    },
  });
}

export function useStartBillingCheckout() {
  return useMutation({
    mutationFn: (planName: string) => startBillingCheckout(planName),
  });
}

export function useOpenBillingPortal() {
  return useMutation({
    mutationFn: () => openBillingPortal(),
  });
}
