const CACHE_NAME = "fermermarket-shell-v3";
const APP_SHELL = [
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/offline.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .catch((err) => console.error("SW install cache error:", err))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (!url.protocol.startsWith("http")) return;

  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_next/webpack-hmr")
  ) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          // IMPORTANT: browsers set redirect mode to "manual" on navigation
          // requests intercepted by a service worker. Our middleware issues
          // 307 redirects for locale detection (e.g. "/" -> "/az"). If we
          // fetch(request) as-is, a redirect response comes back as an
          // opaque "opaqueredirect" with status 0 — NOT 200 — even though
          // the server and network are perfectly fine. That falsely
          // triggered the offline fallback page. Explicitly force
          // redirect: "follow" so real redirects resolve to their final
          // 200 response instead of being misread as a network failure.
          const networkResponse = await fetch(request, { redirect: "follow" });
          if (networkResponse && (networkResponse.ok || networkResponse.status === 200)) {
            return networkResponse;
          }
          const offlinePage = await caches.match("/offline.html");
          if (offlinePage) return offlinePage;
          return (
            networkResponse ||
            new Response("Oflayn", { status: 503, headers: { "Content-Type": "text/html" } })
          );
        } catch (error) {
          const offlinePage = await caches.match("/offline.html");
          if (offlinePage) return offlinePage;
          return new Response(
            "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Oflayn</title></head><body><h1>Oflayn rejim</h1><p>İnternet bağlantınızı yoxlayın.</p></body></html>",
            { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } }
          );
        }
      })()
    );
    return;
  }

  const isStaticAsset =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".jpeg") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".ico") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".json");

  if (!isStaticAsset) {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }

        const networkResponse = await fetch(request, { redirect: "follow" });
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache).catch(() => {});
          }).catch(() => {});
        }
        if (networkResponse) {
          return networkResponse;
        }
      } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) return cachedResponse;
      }

      return new Response("", { status: 408, statusText: "Request Timeout" });
    })()
  );
});

self.addEventListener("push", (event) => {
  if (!event.data) return;
  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "FermerMarket", body: event.data.text() };
  }
  const title = payload.title || "Fermer Market";
  const options = {
    body: payload.body || "",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    data: { url: payload.url || "/" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(url) && "focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
