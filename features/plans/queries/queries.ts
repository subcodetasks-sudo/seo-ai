import { queryOptions } from "@tanstack/react-query";

import { getPublicPlan, getPublicPlans } from "../services/public-plans";
import { plansKeys } from "./query-keys";

export function publicPlansQueryOptions() {
  return queryOptions({
    queryKey: plansKeys.list(),
    queryFn: () => getPublicPlans(),
    staleTime: 5 * 60 * 1000,
  });
}

export function publicPlanQueryOptions(planId: string) {
  return queryOptions({
    queryKey: plansKeys.detail(planId),
    queryFn: () => getPublicPlan(planId),
    staleTime: 5 * 60 * 1000,
  });
}
