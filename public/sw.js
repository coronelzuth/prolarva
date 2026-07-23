const CACHE = 'prolarva-v3';
const OFFLINE_URLS = ['/socios', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(OFFLINE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('/api/')) return; // never cache API calls

  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

// ─── Push notifications ───────────────────────────────────────────────────────

self.addEventListener('push', e => {
  if (!e.data) return;
  let payload;
  try { payload = e.data.json(); } catch { payload = { title: 'ProLarva', body: e.data.text() }; }

  e.waitUntil(
    self.registration.showNotification(payload.title ?? 'ProLarva 🪲', {
      body: payload.body ?? '',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: payload.tag ?? 'prolarva',
      requireInteraction: payload.requireInteraction ?? false,
      data: { url: payload.url ?? '/socios' },
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url ?? '/socios';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
      const existing = cs.find(c => c.url.includes('/socios'));
      if (existing) { existing.focus(); return; }
      return clients.openWindow(url);
    })
  );
});
