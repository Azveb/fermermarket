"use client";
import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then((reg) => {
        // Automatically ask for push permissions on first visit if not denied
        if (Notification.permission === 'default') {
          Notification.requestPermission();
        }
      }).catch(() => {});
    }
  }, []);
  return null;
}
