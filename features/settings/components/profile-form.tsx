"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/context/auth-context";
import { useUpdateProfile } from "../queries/mutations";

import { createProfileSchema } from "../schemas/profile-schema";
import type { ProfileFormValues } from "../types";

type ProfileFormProps = {
  onSaved?: () => void;
};

export function ProfileForm({ onSaved }: ProfileFormProps) {
  const t = useTranslations("settings.profile");
  const tValidation = useTranslations("settings.validation");
  const { user, setUser } = useAuth();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const schema = useMemo(
    () =>
      createProfileSchema({
        emailInvalid: tValidation("emailInvalid"),
        fullNameMin: tValidation("fullNameMin"),
      }),
    [tValidation],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: user?.email ?? "",
      display_name: user?.display_name ?? user?.name ?? "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        email: user.email ?? "",
        display_name: user.display_name ?? user.name ?? "",
      });
    }
  }, [user, reset]);

  function onSubmit(values: ProfileFormValues) {
    updateProfile(values, {
      onSuccess: (response) => {
        const data = response.data;
        const initials = data.display_name
          ? data.display_name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
          : "";
        setUser({
          ...user,
          id: data.id,
          email: data.email,
          display_name: data.display_name,
          name: data.display_name,
          plan: data.plan?.name,
          initials,
        });
        toast.success(t("saved"));
        onSaved?.();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  }

  return (
    <Card className="settings-card border border-neutral-200 bg-white shadow-none ring-0">
      <CardHeader className="border-b border-neutral-100 pb-4">
        <CardTitle className="text-label-lg font-semibold text-secondary-500">
          {t("personalInfo")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <FieldGroup>
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="profile-email">{t("email")}</FieldLabel>
              <Input id="profile-email" type="email" {...register("email")} />
              <FieldError errors={[errors.email]} />
            </Field>
            <Field data-invalid={!!errors.display_name}>
              <FieldLabel htmlFor="profile-name">{t("fullName")}</FieldLabel>
              <Input id="profile-name" {...register("display_name")} />
              <FieldError errors={[errors.display_name]} />
            </Field>
          </FieldGroup>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-primary-300 text-secondary-500 hover:bg-primary-400"
            >
              {t("saveChanges")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
