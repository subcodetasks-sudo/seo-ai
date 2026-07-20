import { apiClient } from "@/lib/client";
import {
  LoginFormValues,
  RegisterFormValues,
  resendVerificationFormValues,
  ResetPasswordFormValues,
  VerifyEmailFormValues,
  RefreshFormValues,
  ForgotPasswordFormValues,
  UpdatePasswordFormValues,
  GoogleOAuthCallbackData,
} from "../types";

export const register = (body: RegisterFormValues) =>
  apiClient("auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const login = (body: LoginFormValues) =>
  apiClient("auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const resetPassword = (body: ResetPasswordFormValues) =>
  apiClient("auth/reset-password", {
    method: "POST",
    body: JSON.stringify(body),
  });

  export const resendVerification = (body: resendVerificationFormValues) =>
  apiClient("auth/resend-verification", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const verifyEmail = (body: VerifyEmailFormValues) =>
  apiClient("auth/verify-email", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const refresh = (body: RefreshFormValues) =>
  apiClient("auth/refresh", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const forgotPassword = (body: ForgotPasswordFormValues) =>
  apiClient("auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const updatePassword = (body: UpdatePasswordFormValues) =>
  apiClient("auth/reset-password", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const logout = () =>
  apiClient("auth/logout", {
    method: "POST",
  });

export const completeGoogleOAuth = (body: GoogleOAuthCallbackData) =>
  apiClient("auth/oauth/google", {
    method: "POST",
    body: JSON.stringify(body),
  });