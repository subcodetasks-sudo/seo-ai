import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getMessaging,
  onMessage,
  Messaging,
  MessagePayload,
} from "firebase/messaging";

import { env } from "@/config/env";

let messaging: Messaging | null = null;
let foregroundUnsubscribe: (() => void) | null = null;

function isFirebaseConfigured(): boolean {
  return !!(
    env.FIREBASE_API_KEY &&
    env.FIREBASE_PROJECT_ID &&
    env.FIREBASE_APP_ID &&
    env.FIREBASE_MESSAGING_SENDER_ID
  );
}

function getFirebaseApp() {
  const firebaseConfig = {
    apiKey: env.FIREBASE_API_KEY,
    authDomain: env.FIREBASE_AUTH_DOMAIN,
    projectId: env.FIREBASE_PROJECT_ID,
    storageBucket: env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
    appId: env.FIREBASE_APP_ID,
  };
  return getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
}

export const getFirebaseMessaging = (): Messaging | null => {
  if (typeof window !== "undefined" && !messaging && isFirebaseConfigured()) {
    messaging = getMessaging(getFirebaseApp());
  }
  return messaging;
};

// Singleton foreground listener — avoids duplicate toasts when React Strict
// Mode remounts or when multiple components call this helper.
export const onForegroundMessage = (
  callback: (payload: MessagePayload) => void
) => {
  const messagingInstance = getFirebaseMessaging();
  if (!messagingInstance) {
    return () => {};
  }

  if (foregroundUnsubscribe) {
    foregroundUnsubscribe();
    foregroundUnsubscribe = null;
  }

  foregroundUnsubscribe = onMessage(messagingInstance, (payload: MessagePayload) => {
    callback(payload);
  });

  return () => {
    if (foregroundUnsubscribe) {
      foregroundUnsubscribe();
      foregroundUnsubscribe = null;
    }
  };
};
