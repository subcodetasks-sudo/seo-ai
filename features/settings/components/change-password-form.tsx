"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

import { createChangePasswordSchema } from "../schemas/change-password-schema";
import type { ChangePasswordFormValues } from "../types";

type PasswordFieldProps = {
  id: string;
  label: string;
  error?: { message?: string };
  registration: ReturnType<ReturnType<typeof useForm<ChangePasswordFormValues>>["register"]>;
};

function PasswordField({ id, label, error, registration }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id={id}
          type={visible ? "text" : "password"}
          autoComplete="off"
          {...registration}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="button"
            size="icon-xs"
            onClick={() => setVisible((value) => !value)}
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <FieldError errors={[error]} />
    </Field>
  );
}

export function ChangePasswordForm() {
  const t = useTranslations("settings.password");
  const tValidation = useTranslations("settings.validation");
  const [saved, setSaved] = useState(false);

  const schema = useMemo(
    () =>
      createChangePasswordSchema({
        currentPasswordMin: tValidation("currentPasswordMin"),
        newPasswordMin: tValidation("newPasswordMin"),
        confirmPasswordMin: tValidation("confirmPasswordMin"),
        passwordsMismatch: tValidation("passwordsMismatch"),
      }),
    [tValidation],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  function onSubmit() {
    setSaved(true);
    reset();
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <Card className="settings-card border border-neutral-200 bg-white shadow-none ring-0">
      <CardHeader className="border-b border-neutral-100 pb-4">
        <CardTitle className="text-label-lg font-semibold text-secondary-500">
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <FieldGroup>
            <PasswordField
              id="current-password"
              label={t("currentPassword")}
              error={errors.current_password}
              registration={register("current_password")}
            />
            <PasswordField
              id="new-password"
              label={t("newPassword")}
              error={errors.new_password}
              registration={register("new_password")}
            />
            <PasswordField
              id="confirm-password"
              label={t("confirmPassword")}
              error={errors.confirm_password}
              registration={register("confirm_password")}
            />
          </FieldGroup>
          {saved ? (
            <p className="text-label-sm text-primary-700">{t("saved")}</p>
          ) : null}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
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
