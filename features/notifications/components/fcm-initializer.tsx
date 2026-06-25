"use client";

import { useFirebaseNotifications } from "../hooks/use-firebase-notifications";

export function FcmInitializer() {
  useFirebaseNotifications();
  return null;
}
