const CACHE = 'krans-v1';
const ASSETS = [
  '/', '/index.html', '/mysteries.html',
  '/manifest.webmanifest',
  '/assets/icons/icon-192.png', '/assets/icons/icon-512.png', '/assets/icons/maskable-512.png'
];

// Install: cache core assets
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

// Activate: cleanup old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

// Fetch: network-first, fallback to cache
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(()=>{});
      return res;
    }).catch(() => caches.match(e.request))
  );
});
