import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changePassword, updateProfile } from "./api";
import { settingsKeys } from "./query-keys";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ current_password, new_password }: { current_password: string; new_password: string }) =>
      changePassword({ old_password: current_password, new_password }),
  });
}
