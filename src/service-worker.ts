// Import precacheAndRoute from workbox-precaching for caching static assets
import { precacheAndRoute } from 'workbox-precaching';
// Import registerRoute from workbox-routing for defining caching routes
import { registerRoute } from 'workbox-routing';
// Import caching strategies from workbox-strategies
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
// Import ExpirationPlugin for cache expiration management
import { ExpirationPlugin } from 'workbox-expiration';

// Precache all static assets defined in the Webpack manifest
precacheAndRoute(self.__WB_MANIFEST);

// Cache API responses with NetworkFirst strategy
registerRoute(
  // Match all routes starting with /api/
  ({ url }) => url.pathname.startsWith('/api/'),
  // Use NetworkFirst strategy (tries network first, falls back to cache)
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      // Set cache expiration rules
      new ExpirationPlugin({
        maxEntries: 50, // Maximum 50 cached entries
        maxAgeSeconds: 24 * 60 * 60 // Cache expires after 24 hours
      })
    ]
  })
);

// Cache images from Unsplash with CacheFirst strategy
registerRoute(
  // Match all requests to images.unsplash.com
  ({ url }) => url.hostname === 'images.unsplash.com',
  // Use CacheFirst strategy (serves from cache if available)
  new CacheFirst({
    cacheName: 'unsplash-images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60, // Maximum 60 cached images
        maxAgeSeconds: 30 * 24 * 60 * 60 // Cache expires after 30 days
      })
    ]
  })
);

// Cache questions data with StaleWhileRevalidate strategy
registerRoute(
  // Match all routes containing '/questions'
  ({ url }) => url.pathname.includes('/questions'),
  // Use StaleWhileRevalidate strategy (serves stale cache while updating in background)
  new StaleWhileRevalidate({
    cacheName: 'questions-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100, // Maximum 100 cached entries
        maxAgeSeconds: 7 * 24 * 60 * 60 // Cache expires after 7 days
      })
    ]
  })
);

// Cache other static assets (styles, scripts, fonts)
registerRoute(
  // Match requests for styles, scripts and fonts
  ({ request }) => 
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font',
  // Use StaleWhileRevalidate strategy
  new StaleWhileRevalidate({
    cacheName: 'static-resources'
  })
);