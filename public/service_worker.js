let CACHE_NAME = "shadhn-v1";

let URLS_TO_CACHE = ["/", "/best", "/newest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (!event.request.url.includes("api") && response) {
        return response;
      }
      return fetch(event.request);
    })
  );
  if (event.request.url.includes("api")) {
    return;
  }

  caches
    .open(CACHE_NAME)
    .then(async (cache) => {
      await cache.add(event.request.url);
    })
    .catch();
});

self.addEventListener("activate", (event) => {
  let cacheWhiteList = [CACHE_NAME];
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