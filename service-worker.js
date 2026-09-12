const CACHE='ordre-terminal-v193-ceremonie-handshake';
const ASSETS=[
'./','./index.html','./style.css','./app.js','./manifest.webmanifest','./service-worker.js',
'./order-logo.png','./apple-touch-icon.png','./icon-192.png','./icon-512.png',
'./division-1-oeil-fendu.png','./division-2-flamme-inversee.png','./division-3-main-cassee.png',
'./division-4-spirale-os.png','./division-5-sablier-noir.png',
'./ceremony.html','./ceremonie.mp3','./oeil.png','./flamme.png','./main.png','./spirale.png','./sablier.png','./ordre.png'
];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
