const CACHE_NAME = 'bar-resto-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/_next/static/',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/screenshot-wide.png',
  '/screenshot-mobile.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Try to cache each resource, but don't fail if some resources can't be cached
        return Promise.allSettled(
          urlsToCache.map(url => 
            fetch(url)
              .then(response => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return cache.put(url, response);
              })
              .catch(error => {
                console.log('Could not cache:', url, error);
                return Promise.resolve(); // Continue despite error
              })
          )
        );
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(error => {
          console.log('Fetch failed:', error);
          return new Response('Offline');
        });
      })
  );
});


5. Update your manifest.json and service worker paths: