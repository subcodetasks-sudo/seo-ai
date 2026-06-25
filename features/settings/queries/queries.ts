import { queryOptions } from "@tanstack/react-query";
import { getCurrentUser } from "./api";
import { settingsKeys } from "./query-keys";

export function currentUserQueryOptions() {
  return queryOptions({
    queryKey: settingsKeys.profile(),
    queryFn: () => getCurrentUser(),
  });
}
