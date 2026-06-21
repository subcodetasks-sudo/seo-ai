export type ApiResponse<T> = {
  status: boolean;
  message: string;
  data?: T;
  errors?: unknown;
};

export type RegisterFormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginFormValues = {
  email: string;
  password: string;
};

export type ResetPasswordFormValues = {
  password: string;
  confirmPassword: string;
};
