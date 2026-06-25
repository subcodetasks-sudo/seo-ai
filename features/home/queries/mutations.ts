import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
	createProject,
	deleteProject,
	updateProject,
	verifyDomain,
	startCrawl,
} from "./api";
import type {
	CreateProjectRequest,
	UpdateProjectRequest,
} from "../types";
import { allProjectsQueryOptions } from './queries';
import { homeKeys } from "./query-keys";

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

export const useStartCrawl = () =>
	useMutation({
		mutationFn: (projectId: string) => startCrawl(projectId),
	});

export const useAllProjects = () =>
	useQuery(allProjectsQueryOptions());