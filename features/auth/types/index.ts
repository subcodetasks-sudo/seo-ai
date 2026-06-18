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
