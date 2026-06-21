import { apiClient } from "@/lib/client";
import {
  LoginFormValues,
  RegisterFormValues,
  ResetPasswordFormValues,
} from "../types";

export const register = (body: RegisterFormValues) =>
  apiClient("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const login = (body: LoginFormValues) =>
  apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const resetPassword = (body: ResetPasswordFormValues) =>
  apiClient("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(body),
  });
