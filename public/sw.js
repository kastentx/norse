/**
 * Service Worker for Norse Mythology Knowledge Base
 * 
 * Provides offline access by caching static assets and pages.
 * Cache is invalidated on each new deployment via version number.
 * 
 * Strategy:
 * - Static assets (JS/CSS/images): Cache First
 * - Pages (HTML): Network First, Cache Fallback
 * - Read-only API (gods, stories, realms): Network First, Cache Fallback
 * - User API (auth, favorites): Network Only (handled by IndexedDB sync)
 * - Fonts: Cache First
 */

// Version is updated on each deployment - changing this invalidates old caches
const CACHE_VERSION = 'v3';
const CACHE_NAME = `norse-mythology-${CACHE_VERSION}`;

// Assets to pre-cache on install (app shell)
// Note: We DON'T precache page routes like /gods, /stories, /realms
// because Next.js code-splits and we'd cache HTML without the JS chunks.
// Instead, pages cache naturally when visited (Network First strategy).
// Note: favicon.ico and icon.svg are in /app folder (Next.js route), not /public
const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  // Pre-cache API data for offline access
  '/api/gods',
];

// Patterns for different caching strategies
const STATIC_ASSET_PATTERN = /\.(js|css|woff2?|ttf|eot|ico|svg|png|jpg|jpeg|gif|webp)$/;
const NEXT_STATIC_PATTERN = /^\/_next\/static\//;
const NEXT_IMAGE_PATTERN = /^\/_next\/image/;

// API routes that should NOT be cached (user-specific, auth, sync)
const SKIP_CACHE_API_PATTERN = /^\/api\/(auth|user)\//;

// API routes that CAN be cached (read-only static data)
const CACHEABLE_API_PATTERN = /^\/api\/(gods|stories|realms|search)\b/;

/**
 * Install Event
 * Pre-cache essential assets for offline app shell
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Pre-caching app shell');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Pre-cache failed:', error);
      })
  );
});

/**
 * Activate Event
 * Clean up old caches from previous versions
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('norse-mythology-') && name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        // Claim all clients immediately
        return self.clients.claim();
      })
  );
});

/**
 * Fetch Event
 * Intercept requests and apply appropriate caching strategy
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Only handle same-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip user/auth API routes - these are handled by IndexedDB sync
  if (SKIP_CACHE_API_PATTERN.test(url.pathname)) {
    return;
  }
  
  // Cache read-only API routes (gods, stories, realms, search)
  if (CACHEABLE_API_PATTERN.test(url.pathname)) {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // Apply caching strategy based on resource type
  if (NEXT_STATIC_PATTERN.test(url.pathname) || STATIC_ASSET_PATTERN.test(url.pathname)) {
    // Cache First for static assets
    event.respondWith(cacheFirst(request));
  } else if (NEXT_IMAGE_PATTERN.test(url.pathname)) {
    // Cache First for optimized images
    event.respondWith(cacheFirst(request));
  } else {
    // Network First for pages (HTML)
    event.respondWith(networkFirst(request));
  }
});

/**
 * Cache First Strategy
 * Best for static assets that don't change often
 */
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // If both cache and network fail, return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline');
    }
    // For other requests (images, etc.), return a simple error response
    // instead of throwing, which causes console errors
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

/**
 * Network First Strategy
 * Best for pages where fresh content is preferred
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If this is a navigation request, show offline page
    if (request.mode === 'navigate') {
      return caches.match('/offline');
    }
    
    // For API and other requests, return a proper error response
    return new Response(JSON.stringify({ error: 'Offline', cached: false }), { 
      status: 503, 
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Message Handler
 * Allow clients to communicate with the service worker
 */
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data === 'clearCache') {
    event.waitUntil(
      caches.delete(CACHE_NAME).then(() => {
        console.log('[SW] Cache cleared');
      })
    );
  }
});
