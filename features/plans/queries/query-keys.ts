export const plansKeys = {
  all: ["plans"] as const,
  list: () => [...plansKeys.all, "list"] as const,
  detail: (planId: string) => [...plansKeys.all, "detail", planId] as const,
};
