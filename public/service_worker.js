const CACHE_NAME = "shadhn-v1";

const URLS_TO_CACHE = ["/", "/best", "/newest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // addAll rejects (aborting install) if any single request fails, so add
      // them individually and tolerate misses.
      return Promise.all(
        URLS_TO_CACHE.map((url) => cache.add(url).catch(() => undefined))
      );
    })
  );
});

// Only same-origin GET assets (the app shell) are cached. Data requests to the
// Hacker News API — and any other cross-origin request — always go straight to
// the network so the feed and comments are never served stale.
function isCacheable(request) {
  if (request.method !== "GET") return false;
  const url = new URL(request.url);
  return url.origin === self.location.origin;
}

self.addEventListener("fetch", (event) => {
  if (!isCacheable(event.request)) {
    return; // let the browser handle it normally (network)
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // Cache a clone of successful, same-origin ("basic") responses.
        if (response.ok && response.type === "basic") {
          const copy = response.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, copy));
        }
        return response;
      });
    })
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhiteList = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhiteList.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
