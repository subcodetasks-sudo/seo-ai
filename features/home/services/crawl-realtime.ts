import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, onValue, Database } from "firebase/database";

import { env } from "@/config/env";

// Realtime crawl-status updates pushed by the backend. Mirrors the Firebase
// client setup used for notifications (features/notifications/services), but
// subscribes to the Realtime Database instead of Cloud Messaging.

export type CrawlRealtimeStatus = "queued" | "running" | "done" | "stopped" | "failed";

export type CrawlRealtimePayload = {
  job_id: string;
  project_id: string;
  status: CrawlRealtimeStatus;
  updated_at: string;
};

// Backend writes one node per crawl job, keyed by job id.
const CRAWL_NODE = "crawl_jobs";

function isRealtimeConfigured(): boolean {
  return !!(
    env.FIREBASE_DATABASE_URL &&
    env.FIREBASE_API_KEY &&
    env.FIREBASE_PROJECT_ID
  );
}

function getRealtimeDb(): Database | null {
  if (typeof window === "undefined" || !isRealtimeConfigured()) {
    return null;
  }

  const firebaseConfig = {
    apiKey: env.FIREBASE_API_KEY,
    authDomain: env.FIREBASE_AUTH_DOMAIN,
    databaseURL: env.FIREBASE_DATABASE_URL,
    projectId: env.FIREBASE_PROJECT_ID,
    storageBucket: env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
    appId: env.FIREBASE_APP_ID,
  };

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

  try {
    // Pass the URL explicitly so it works even when the shared app instance
    // was first initialised (e.g. by notifications) without a databaseURL.
    return getDatabase(app, env.FIREBASE_DATABASE_URL);
  } catch (error) {
    console.error("[crawl-realtime] Failed to init Realtime Database:", error);
    return null;
  }
}

/**
 * Subscribe to live status for a single crawl job. The callback fires with the
 * latest payload (or null if the node is empty). Returns an unsubscribe fn.
 *
 * This is a best-effort enhancement on top of the REST polling — if Firebase is
 * not configured or the read fails, it silently no-ops and the UI falls back to
 * polling.
 */
export function subscribeToCrawlStatus(
  jobId: string,
  onUpdate: (payload: CrawlRealtimePayload | null) => void,
): () => void {
  const db = getRealtimeDb();
  if (!db || !jobId) {
    return () => {};
  }

  try {
    const statusRef = ref(db, `${CRAWL_NODE}/${jobId}`);
    return onValue(
      statusRef,
      (snapshot) => onUpdate(snapshot.val() as CrawlRealtimePayload | null),
      (error) => console.error("[crawl-realtime] subscription error:", error),
    );
  } catch (error) {
    console.error("[crawl-realtime] Failed to subscribe:", error);
    return () => {};
  }
}
