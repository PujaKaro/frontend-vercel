const CACHE_NAME = 'pujakaro-cache-v3'; // Increment version to force cache update
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/manifest.json',
  '/images/heroBanner.jpg',
  '/images/ganesh.jpg',
  '/images/featuredPuja.jpg'
];

// Install the service worker and cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Fetch from cache first, then network
self.addEventListener('fetch', event => {
  // Skip caching for development
  if (event.request.url.includes('localhost') || event.request.url.includes('127.0.0.1')) {
    return;
  }

  // Skip caching for API calls and dynamic content
  if (event.request.url.includes('/api/') || event.request.url.includes('firebase')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // For HTML files, try network first, then cache
        if (event.request.destination === 'document') {
          return fetch(event.request)
            .then(networkResponse => {
              // Cache the new response
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
              return networkResponse;
            })
            .catch(() => {
              // If network fails, return cached version
              return response;
            });
        }
        
        // For other resources, return from cache if found
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        // Make network request and cache the response
        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          }
        );
      })
  );
});

// Delete old caches when a new service worker activates
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
}); 