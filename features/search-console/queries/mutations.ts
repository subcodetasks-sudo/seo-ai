import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteSearchConsoleConnection, getSearchConsoleAuthUrl, postSearchConsoleCallback, selectSearchConsoleSite } from "./api";
import { searchConsoleKeys } from "./query-keys";

export function useConnectSearchConsole(projectId: string) {
  return useMutation({
    mutationFn: () => getSearchConsoleAuthUrl(projectId),
  });
}

export function useSearchConsoleCallback(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => postSearchConsoleCallback(projectId, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: searchConsoleKeys.status(projectId) });
    },
  });
}

export function useSelectSearchConsoleSite(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (siteUrl: string) => selectSearchConsoleSite(projectId, siteUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: searchConsoleKeys.status(projectId) });
    },
  });
}

export function useDisconnectSearchConsole(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteSearchConsoleConnection(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: searchConsoleKeys.all });
    },
  });
}
