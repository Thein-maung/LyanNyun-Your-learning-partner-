const CACHE = "ged-v1";
const FILES = [
  "./",
  "index.html",
  "app.js",
  "manifest.json",
  "data/math.json"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});