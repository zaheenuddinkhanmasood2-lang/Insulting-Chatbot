const CACHE_NAME = 'insult-chatbot-v1';
const OFFLINE_URL = '/offline.html';

// Assets to precache - app shell and static resources
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/index.css',
  '/manifest.json',
  '/favicon.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-maskable-512x512.png',
  '/icons/apple-touch-icon.png'
];

// Install event - precache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - handle routing with different strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Don't cache API requests or POST requests - always go to network
  if (
    request.method === 'POST' ||
    url.pathname.startsWith('/api/') ||
    request.headers.get('content-type')?.includes('application/json')
  ) {
    event.respondWith(fetch(request).catch(() => {
      // Return a basic error response if offline
      return new Response(
        JSON.stringify({ error: 'You are offline. Please check your connection.' }),
        { 
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }));
    return;
  }

  // For navigation requests - network first, fall back to cache, then offline page
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  // For static assets - stale while revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((response) => {
        // Only cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      });

      return cachedResponse || fetchPromise;
    })
  );
});
