/* global self, firebase */

// Firebase Messaging Service Worker — handles background push notifications.
// Uses the compat CDN (importScripts) because ES-module imports are not
// available in classic service-worker scope without a bundler step.

importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAw750mAZaJ73G37Q5KCSqtbJ1yToDIqL0",
  authDomain: "seo-ai-1acc8.firebaseapp.com",
  projectId: "seo-ai-1acc8",
  storageBucket: "seo-ai-1acc8.firebasestorage.app",
  messagingSenderId: "1055837749186",
  appId: "1:1055837749186:web:dc9f3a3fb45527a1b7605b",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  // console.log("[SW] Background message received:", payload);

  const title =
    payload.data?.title ||
    payload.notification?.title ||
    "New Notification";

  const options = {
    body:
      payload.data?.body || payload.notification?.body || "",
    icon: payload.data?.icon || "/imgs/logo.png",
    badge: "/imgs/logo.png",
    data: payload.data ?? {},
  };

  self.registration.showNotification(title, options);
});
