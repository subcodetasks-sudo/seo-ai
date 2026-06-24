import { ChangePasswordForm } from "./change-password-form";
import { ProfileForm } from "./profile-form";

export function ProfileTab() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ProfileForm />
      <ChangePasswordForm />
    </div>
  );
}
