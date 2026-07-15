import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
	continueCrawl,
	createProject,
	deleteProject,
	startCrawl,
	stopCrawl,
	updateProject,
	verifyDomain,
	type CrawlJobData,
} from "./api";
import type {
	AllProjectsResponse,
	CreateProjectRequest,
	ProjectCrawlStatus,
	UpdateProjectRequest,
} from "../types";
import { allProjectsQueryOptions } from "./queries";
import { homeKeys } from "./query-keys";

type CrawlMutationVars = {
	projectId: string;
	crawlJobId: string;
};

function patchProjectCrawlCache(
	queryClient: ReturnType<typeof useQueryClient>,
	projectId: string,
	patch: {
		crawl_job_id?: string | null;
		crawl_status?: ProjectCrawlStatus | null;
		pages_crawled?: number;
	},
) {
	queryClient.setQueryData<AllProjectsResponse>(homeKeys.projects(), (prev) => {
		if (!prev?.data?.items) return prev;
		return {
			...prev,
			data: {
				...prev.data,
				items: prev.data.items.map((item) =>
					item.id === projectId ? { ...item, ...patch } : item,
				),
			},
		};
	});
}

function applyCrawlJobToProjectsCache(
	queryClient: ReturnType<typeof useQueryClient>,
	data: CrawlJobData,
) {
	patchProjectCrawlCache(queryClient, data.project_id, {
		crawl_job_id: data.crawl_job_id,
		crawl_status: data.status as ProjectCrawlStatus,
		pages_crawled: data.pages_crawled,
	});
	queryClient.setQueryData(homeKeys.crawl(data.project_id, data.crawl_job_id), {
		status: true,
		message: data.message ?? "",
		data,
	});
}

export const useCreateProject = () =>
	useMutation({
		mutationFn: (body: CreateProjectRequest) => createProject(body),
	});

export const useUpdateProject = () =>
	useMutation({
		mutationFn: (variables: { body: UpdateProjectRequest; projectId: string }) =>
			updateProject(variables.body, variables.projectId),
	});

export const useDeleteProject = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (projectId: string) => deleteProject(projectId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: homeKeys.projects() });
		},
	});
};

export const useVerifyDomain = () =>
	useMutation({
		mutationFn: (variables: { method: string; projectId: string }) =>
			verifyDomain(variables.method, variables.projectId),
	});

export const useStartCrawl = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (projectId: string) => startCrawl(projectId),
		onSuccess: (response) => {
			applyCrawlJobToProjectsCache(queryClient, response.data);
		},
	});
};

export const useStopCrawl = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ projectId, crawlJobId }: CrawlMutationVars) =>
			stopCrawl(projectId, crawlJobId),
		onSuccess: (response) => {
			applyCrawlJobToProjectsCache(queryClient, response.data);
		},
	});
};

export const useContinueCrawl = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ projectId, crawlJobId }: CrawlMutationVars) =>
			continueCrawl(projectId, crawlJobId),
		onSuccess: (response) => {
			applyCrawlJobToProjectsCache(queryClient, response.data);
		},
	});
};

export const useAllProjects = () =>
	useQuery(allProjectsQueryOptions());