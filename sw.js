const CACHE_NAME = 'thy-route-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/variables.css',
  '/js/config.js',
  '/js/data.js',
  '/js/state.js',
  '/js/utils.js',
  '/js/map.js',
  '/js/flights.js',
  '/js/journal.js',
  '/js/trips.js',
  '/js/init.js',
  '/manifest.json'
];

// Install Event - Precache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Precaching App Shell');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate Event - Clean Up Old Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing Old Cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch Event - Serve Cached Assets or Dynamic Fetch & Cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests (e.g. POST requests from collab, or analytics)
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Network-First for real-time collaboration or database endpoints
  if (url.origin.includes('firebase') || url.pathname.includes('collab') || url.searchParams.has('trip')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-First with Network Fallback for static assets and CDN resources (like Leaflet tiles, icons)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return from cache, but update cache in the background for local app resources
        if (url.origin === self.location.origin) {
          fetch(event.request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          }).catch(() => {/* Ignore background sync failures */});
        }
        return cachedResponse;
      }

      // If not in cache, fetch from network
      return fetch(event.request).then((networkResponse) => {
        // Cache valid HTTP responses, including cross-origin CDN assets (Leaflet, Phosphor, Confetti)
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (url.origin === self.location.origin || 
           url.origin.includes('unpkg.com') || 
           url.origin.includes('cdn.jsdelivr.net') || 
           url.origin.includes('wikimedia.org'))
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch((err) => {
        // Fallback for offline map tiles or index.html
        const acceptHeader = event.request.headers.get('accept');
        if (acceptHeader && acceptHeader.includes('text/html')) {
          return caches.match('/index.html');
        }
        console.warn('[Service Worker] Fetch failed offline:', event.request.url, err);
      });
    })
  );
});
