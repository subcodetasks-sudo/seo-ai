import { useMutation, useQuery } from "@tanstack/react-query";

import {
	createProject,
	deleteProject,
	updateProject,
	verifyDomain,
} from "./api";
import type {
	CreateProjectRequest,
	UpdateProjectRequest,
} from "../types";
import { allProjectsQueryOptions } from './queries';

export const useCreateProject = () =>
	useMutation({
		mutationFn: (body: CreateProjectRequest) => createProject(body),
	});

export const useUpdateProject = () =>
	useMutation({
		mutationFn: (variables: { body: UpdateProjectRequest; projectId: string }) =>
			updateProject(variables.body, variables.projectId),
	});

export const useDeleteProject = () =>
	useMutation({
		mutationFn: (projectId: string) => deleteProject(projectId),
	});

export const useVerifyDomain = () =>
	useMutation({
		mutationFn: (variables: { method: string; projectId: string }) =>
			verifyDomain(variables.method, variables.projectId),
	});


	export const useAllProjects = () =>
	useQuery(allProjectsQueryOptions());