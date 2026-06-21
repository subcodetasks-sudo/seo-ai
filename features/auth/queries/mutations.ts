import { useMutation } from "@tanstack/react-query";
import { login, register, resendVerification, resetPassword, verifyEmail, refresh, forgotPassword, updatePassword } from "./api";

export const useLogin = () =>
  useMutation({
    mutationFn: login,
  });

export const useRegister = () =>
  useMutation({
    mutationFn: register,
  });

export const useResetPassword = () =>
  useMutation({
    mutationFn: resetPassword,
  });

export const useResendVerification = () =>
  useMutation({
    mutationFn: resendVerification,
  });

export const useVerifyEmail = () =>
  useMutation({
    mutationFn: verifyEmail,
  });

export const useRefresh = () =>
  useMutation({
    mutationFn: refresh,
  });

export const useForgotPassword = () =>
  useMutation({
    mutationFn: forgotPassword,
  });

export const useUpdatePassword = () =>
  useMutation({
    mutationFn: updatePassword,
  });