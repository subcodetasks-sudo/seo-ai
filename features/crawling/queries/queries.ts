import { useMutation, useQuery } from "@tanstack/react-query";

import {
	getCrawlPages,
	getCrawlStatus,
	listCrawls,
	startCrawl,
} from "./api";

const crawlingKeys = {
	all: ["crawling"] as const,
	crawls: (projectId: string, page: number, pageSize: number) =>
		[...crawlingKeys.all, "crawls", projectId, page, pageSize] as const,
	crawlStatus: (projectId: string, crawlId: string) =>
		[...crawlingKeys.all, "status", projectId, crawlId] as const,
	crawlPages: (projectId: string, crawlId: string) =>
		[...crawlingKeys.all, "pages", projectId, crawlId] as const,
};

export const useStartCrawl = () =>
	useMutation({
		mutationFn: startCrawl,
	});

export const useListCrawls = (
	projectId: string,
	page: number,
	pageSize: number,
) =>
	useQuery({
		queryKey: crawlingKeys.crawls(projectId, page, pageSize),
		queryFn: () => listCrawls(projectId, page, pageSize),
	});

export const useCrawlStatus = (projectId: string, crawlId: string) =>
	useQuery({
		queryKey: crawlingKeys.crawlStatus(projectId, crawlId),
		queryFn: () => getCrawlStatus(projectId, crawlId),
	});

export const useCrawlPages = (projectId: string, crawlId: string, page: number, pageSize: number) =>
	useQuery({
		queryKey: [...crawlingKeys.crawlPages(projectId, crawlId), page, pageSize] as const,
		queryFn: () => getCrawlPages(projectId, crawlId, page, pageSize),
	});
