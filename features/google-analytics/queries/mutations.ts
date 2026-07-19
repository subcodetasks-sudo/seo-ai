import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deleteGoogleAnalyticsConnection,
  getGoogleAnalyticsAuthUrl,
  postGoogleAnalyticsCallback,
  selectGoogleAnalyticsProperty,
} from "./api";
import { googleAnalyticsKeys } from "./query-keys";

export function useConnectGoogleAnalytics(projectId: string) {
  return useMutation({
    mutationFn: () => getGoogleAnalyticsAuthUrl(projectId),
  });
}

export function useGoogleAnalyticsCallback(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => postGoogleAnalyticsCallback(projectId, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: googleAnalyticsKeys.status(projectId) });
    },
  });
}

export function useSelectGoogleAnalyticsProperty(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ propertyId, propertyName }: { propertyId: string; propertyName: string }) =>
      selectGoogleAnalyticsProperty(projectId, propertyId, propertyName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: googleAnalyticsKeys.status(projectId) });
    },
  });
}

export function useDisconnectGoogleAnalytics(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteGoogleAnalyticsConnection(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: googleAnalyticsKeys.all });
    },
  });
}
