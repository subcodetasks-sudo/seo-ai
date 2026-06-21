import { useMutation } from "@tanstack/react-query";
import { login, register, resetPassword } from "./api";

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
