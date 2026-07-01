import { queryOptions } from "@tanstack/react-query";

import { getCrawlPages, listCrawls } from "./api";
import { crawlingKeys } from "./query-keys";

export function crawlListQueryOptions(projectId: string, page: number, pageSize: number) {
  return queryOptions({
    queryKey: crawlingKeys.crawls(projectId, page, pageSize),
    queryFn: () => listCrawls(projectId, page, pageSize),
    select: (response) => response.data,
    enabled: Boolean(projectId),
  });
}

export function crawlPagesQueryOptions(
  projectId: string,
  crawlId: string,
  page: number,
  pageSize: number,
) {
  return queryOptions({
    queryKey: crawlingKeys.pages(projectId, crawlId, page, pageSize),
    queryFn: () => getCrawlPages(projectId, crawlId, page, pageSize),
    select: (response) => response.data,
    enabled: Boolean(projectId) && Boolean(crawlId),
  });
}
