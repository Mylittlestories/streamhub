// StreamHub Pro Service Worker — Real Video Stream Network (v13.0.0)
const CACHE_NAME = 'streamhub-pro-v13.0.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.webmanifest',
  './libs/hls.min.js',
  './libs/webtorrent.min.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/logo.svg',
  './favicon.ico'
];

// Install Event - Pre-cache essential shell and skip waiting immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate Event - Immediately delete ALL older caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Deleting stale cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch Event - NETWORK-FIRST strategy: Always get fresh code from network, fallback to cache if offline
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Bypass cache for all external streaming APIs, embeds, magnets, and non-GET requests
  if (url.origin !== self.location.origin || event.request.method !== 'GET') {
    return;
  }

  // Network First for local app scripts and HTML to ensure users always receive latest real-stream updates
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache when completely offline
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
