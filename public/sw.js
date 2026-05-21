self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  self.clients.claim();
});

// Fetch event listener takay browser ko pata chale ye PWA installable hai
self.addEventListener('fetch', (e) => {
  e.respondWith(fetch(e.request));
});