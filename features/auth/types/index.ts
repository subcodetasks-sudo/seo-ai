import { resendVerification } from '../queries/api';
export type ApiResponse<T> = {
  status: boolean;
  message: string;
  data?: T;
  errors?: unknown;
};

export type RegisterFormValues = {
  display_name: string;
  email: string;
  password: string;
};

export type LoginFormValues = {
  email: string;
  password: string;
};

export type ResetPasswordFormValues = {
  email: string;
  otp: string;
  new_password: string;
};

export type resendVerificationFormValues = {
  email: string;
};

export type VerifyEmailFormValues = {
  email: string;
  otp: string;
};

export type RefreshFormValues = {
  refresh_token: string;
};

export type ForgotPasswordFormValues = {
  email: string;
};

export type UpdatePasswordFormValues = {
  current_password: string;
  new_password: string;
}