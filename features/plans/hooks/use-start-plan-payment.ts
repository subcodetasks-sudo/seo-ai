"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import type { CurrentBilling } from "@/features/settings/queries/api";
import {
  useChangeBillingPlan,
  useStartBillingCheckout,
} from "@/features/settings/queries/mutations";

type StartPaymentArgs = {
  billingPlanName: string | null | undefined;
  currentBilling?: CurrentBilling;
  onStarted?: () => void;
};

export function useStartPlanPayment() {
  const tBilling = useTranslations("settings.billing");
  const { mutate: changePlan, isPending: isChangingPlan } = useChangeBillingPlan();
  const { mutate: startCheckout, isPending: isStartingCheckout } = useStartBillingCheckout();
  const inFlightRef = useRef<string | null>(null);

  const isPending = isChangingPlan || isStartingCheckout;

  function startPayment({ billingPlanName, currentBilling, onStarted }: StartPaymentArgs) {
    if (!billingPlanName) {
      toast.error(tBilling("planUnavailable"));
      return;
    }

    const normalized = billingPlanName.toLowerCase();
    if (currentBilling?.plan_name?.toLowerCase() === normalized) {
      toast.message(tBilling("alreadyOnPlan"));
      return;
    }

    if (inFlightRef.current === normalized || isPending) return;
    inFlightRef.current = normalized;
    onStarted?.();

    const needsCheckout =
      normalized !== "free" && !currentBilling?.subscription_status;

    if (needsCheckout) {
      startCheckout(billingPlanName, {
        onSuccess: (response) => {
          window.location.href = response.data.payment_url;
        },
        onError: () => {
          inFlightRef.current = null;
        },
      });
      return;
    }

    changePlan(billingPlanName, {
      onSuccess: () => {
        toast.success(tBilling("planChanged"));
        inFlightRef.current = null;
      },
      onError: () => {
        inFlightRef.current = null;
      },
    });
  }

  return { startPayment, isPending };
}
