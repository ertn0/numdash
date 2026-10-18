// Offline-Fähigkeit. Diese Vorlage wird beim Build zu dist/sw.js; Version und Dateiliste
// setzt vite.config.ts ein. Jede neue Version installiert alle Dateien vollständig neu und
// löscht danach den alten Cache – so passen Startseite und Programmcode immer zusammen.
const CACHE = 'numdash-9d7340636fa5';
const FILES = ["./","./apple-touch-icon.png","./assets/index-BTIrhkre.css","./assets/index-BhgrsrnB.js","./icon-192.png","./icon-512.png","./index.html","./manifest.webmanifest","./sounds/correct.mp3","./sounds/crash.mp3","./sounds/finish.mp3","./sounds/jump.mp3","./sounds/music-game.mp3","./sounds/music-menu.mp3","./sounds/pause.mp3","./sounds/portal.mp3","./sounds/star.mp3","./sounds/wrong.mp3"];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await cache.addAll(FILES);
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) if (key !== CACHE) await caches.delete(key);
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  // nur aus dem vollständigen Cache dieser Version bedienen, sonst ganz normal übers Netz
  event.respondWith(
    (async () => (await caches.match(request, { cacheName: CACHE, ignoreSearch: true })) ?? fetch(request))(),
  );
});
