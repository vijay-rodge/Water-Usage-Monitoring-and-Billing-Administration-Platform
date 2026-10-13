/**
 * AquaFlow Smart Water Platform - Production Service Worker
 * Version: 1.0.0
 * 
 * Features:
 * - Static UI shell caching for rapid, reliable offline boots.
 * - Automatic update lifecycle (skipWaiting + clients.claim).
 * - STRICT NETWORK-FIRST / NO-CACHE for sensitive auth, user, payment, invoice, and admin APIs.
 * - Offline navigation fallback to index.html SPA shell.
 */

const CACHE_VERSION = 'aquaflow-static-v1.0.0';
const OFFLINE_SHELL = '/index.html';

// Static application assets to pre-cache on installation
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/manifest.json',
  '/favicon.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-maskable-192x192.png',
  '/icons/icon-maskable-512x512.png',
  '/icons/apple-touch-icon.png',
  '/icons/favicon-32x32.png',
  '/icons/favicon-16x16.png'
];

// Sensitive route patterns that MUST NEVER be stored in unencrypted persistent CacheStorage
const SENSITIVE_URL_PATTERNS = [
  '/api/',
  '/auth/',
  '/invoice',
  '/invoices/',
  '/billing/',
  '/payments',
  '/payment/',
  '/admin/',
  '/resident-documents',
  '/verification',
  '/chat/assistant'
];

/**
 * Helper to determine if a request URL contains sensitive data
 */
function isSensitiveRequest(url) {
  const pathname = url.pathname.toLowerCase();
  return SENSITIVE_URL_PATTERNS.some((pattern) => pathname.includes(pattern));
}

/**
 * Helper to determine if a request is a static asset (scripts, styles, fonts, images)
 */
function isStaticAsset(url) {
  const pathname = url.pathname;
  return (
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/icons/') ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.woff2') ||
    pathname.endsWith('.woff') ||
    pathname.endsWith('.ttf')
  );
}

// 1. Install Event - Pre-cache shell assets & auto-activate
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[ServiceWorker] Some pre-cache assets failed to load:', err);
      });
    }).then(() => {
      // Force the waiting service worker to become the active service worker
      return self.skipWaiting();
    })
  );
});

// 2. Activate Event - Clean up stale cache versions & claim all active clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_VERSION) {
            console.log('[ServiceWorker] Deleting old cache version:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all open client tabs immediately
      return self.clients.claim();
    })
  );
});

// 3. Message Event - Allow client to trigger skipWaiting on demand
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 4. Fetch Event - Intelligent, security-compliant routing
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle HTTP/HTTPS GET requests
  if (request.method !== 'GET' || !request.url.startsWith('http')) {
    return;
  }

  const url = new URL(request.url);

  // A. SENSITIVE DATA & API ENDPOINTS:
  // Strict Network-First. Never store sensitive credentials, user records, or invoice PDFs in persistent CacheStorage.
  if (isSensitiveRequest(url)) {
    event.respondWith(
      fetch(request).catch(() => {
        // Safe offline response for API queries when network is unavailable
        return new Response(
          JSON.stringify({
            offline: true,
            status: 'offline',
            message: 'Network offline. Sensitive telemetry and billing actions require an active connection.'
          }),
          {
            status: 503,
            statusText: 'Service Unavailable (Offline)',
            headers: { 'Content-Type': 'application/json' }
          }
        );
      })
    );
    return;
  }

  // B. NAVIGATION REQUESTS (SPA App Shell):
  // Network-first with cache fallback to /index.html so offline navigation continues to function
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_VERSION).then((cache) => {
              cache.put(request, clone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_VERSION);
          const cachedShell = await cache.match(OFFLINE_SHELL);
          if (cachedShell) return cachedShell;
          return (await cache.match('/')) || Response.error();
        })
    );
    return;
  }

  // C. STATIC ASSETS (JS, CSS, fonts, public icons, images):
  // Stale-While-Revalidate: Return cached response immediately for speed, then update cache in background
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(CACHE_VERSION).then((cache) => {
                cache.put(request, clone);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // D. DEFAULT GET HANDLER:
  // Network with cache fallback
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_VERSION).then((cache) => {
            cache.put(request, clone);
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(request))
  );
});
