// Import Workbox modules for service worker functionality
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Precache all static assets defined in the webpack manifest
precacheAndRoute(self.__WB_MANIFEST);

// Cache API responses with NetworkFirst strategy (tries network first, falls back to cache)
registerRoute(
  // Match any URL path starting with '/api/'
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      // Limit cache size and duration
      new ExpirationPlugin({
        maxEntries: 50, // Maximum 50 entries
        maxAgeSeconds: 24 * 60 * 60 // Expire after 24 hours
      })
    ]
  })
);

// Cache images from Unsplash with CacheFirst strategy (cache first, network fallback)
registerRoute(
  // Match any request to images.unsplash.com
  ({ url }) => url.hostname === 'images.unsplash.com',
  new CacheFirst({
    cacheName: 'unsplash-images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60, // Maximum 60 images
        maxAgeSeconds: 30 * 24 * 60 * 60 // Expire after 30 days
      })
    ]
  })
);

// Cache questions data with StaleWhileRevalidate strategy (serve stale while updating)
registerRoute(
  // Match any URL path containing '/questions'
  ({ url }) => url.pathname.includes('/questions'),
  new StaleWhileRevalidate({
    cacheName: 'questions-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100, // Maximum 100 entries
        maxAgeSeconds: 7 * 24 * 60 * 60 // Expire after 7 days
      })
    ]
  })
);

// Cache other static assets (CSS, JS, fonts) with StaleWhileRevalidate strategy
registerRoute(
  // Match requests for styles, scripts, or fonts
  ({ request }) => 
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font',
  new StaleWhileRevalidate({
    cacheName: 'static-resources'
  })
);