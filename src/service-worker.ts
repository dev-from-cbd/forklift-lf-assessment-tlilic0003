// Import precacheAndRoute function from workbox-precaching to handle static asset caching
import { precacheAndRoute } from 'workbox-precaching';
// Import registerRoute function from workbox-routing to register custom caching routes
import { registerRoute } from 'workbox-routing';
// Import caching strategies: CacheFirst (cache first, network fallback), NetworkFirst (network first, cache fallback), StaleWhileRevalidate (serve from cache while updating in background)
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
// Import ExpirationPlugin from workbox-expiration to manage cache expiration and size limits
import { ExpirationPlugin } from 'workbox-expiration';

// Declare global type for Workbox manifest that contains list of files to precache
// This is automatically populated by Workbox build tools during the build process
declare const self: ServiceWorkerGlobalScope & {
  // Workbox manifest containing array of files with revision information for precaching
  __WB_MANIFEST: Array<{ url: string; revision: string | null }>;
};

// Precache all static assets defined in the Workbox manifest during service worker installation
// self.__WB_MANIFEST is automatically populated by Workbox build tools with a list of files to precache
precacheAndRoute(self.__WB_MANIFEST);

// Cache API responses using NetworkFirst strategy for dynamic content
// Register a route that matches all URLs starting with '/api/'
registerRoute(
  // Route matcher function that checks if the URL pathname starts with '/api/'
  ({ url }) => url.pathname.startsWith('/api/'),
  // Use NetworkFirst strategy: try network first, fall back to cache if network fails
  new NetworkFirst({
    // Name the cache specifically for API responses
    cacheName: 'api-cache',
    // Configure cache expiration and size management
    plugins: [
      // Plugin to automatically expire old cache entries
      new ExpirationPlugin({
        // Maximum number of entries to keep in this cache
        maxEntries: 50,
        // Maximum age of cache entries in seconds (24 hours = 24 * 60 * 60)
        maxAgeSeconds: 24 * 60 * 60 // 24 hours
      })
    ]
  })
);

// Cache images from Unsplash using CacheFirst strategy for better performance
// Register a route that matches all requests to Unsplash image CDN
registerRoute(
  // Route matcher function that checks if the hostname is 'images.unsplash.com'
  ({ url }) => url.hostname === 'images.unsplash.com',
  // Use CacheFirst strategy: serve from cache if available, otherwise fetch from network
  new CacheFirst({
    // Name the cache specifically for Unsplash images
    cacheName: 'unsplash-images',
    // Configure cache expiration and size management for images
    plugins: [
      // Plugin to automatically expire old image cache entries
      new ExpirationPlugin({
        // Maximum number of image entries to keep in this cache
        maxEntries: 60,
        // Maximum age of cached images in seconds (30 days = 30 * 24 * 60 * 60)
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
      })
    ]
  })
);

// Cache questions data using StaleWhileRevalidate strategy for optimal user experience
// Register a route that matches all URLs containing '/questions' in the pathname
registerRoute(
  // Route matcher function that checks if the URL pathname includes '/questions'
  ({ url }) => url.pathname.includes('/questions'),
  // Use StaleWhileRevalidate strategy: serve from cache immediately while updating cache in background
  new StaleWhileRevalidate({
    // Name the cache specifically for questions data
    cacheName: 'questions-cache',
    // Configure cache expiration and size management for questions
    plugins: [
      // Plugin to automatically expire old question cache entries
      new ExpirationPlugin({
        // Maximum number of question entries to keep in this cache
        maxEntries: 100,
        // Maximum age of cached questions in seconds (7 days = 7 * 24 * 60 * 60)
        maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
      })
    ]
  })
);

// Cache other static assets (CSS, JavaScript, fonts) using StaleWhileRevalidate strategy
// Register a route that matches requests for stylesheets, scripts, and fonts
registerRoute(
  // Route matcher function that checks the request destination type
  ({ request }) => 
    // Check if the request is for a CSS stylesheet
    request.destination === 'style' ||
    // Check if the request is for a JavaScript file
    request.destination === 'script' ||
    // Check if the request is for a font file
    request.destination === 'font',
  // Use StaleWhileRevalidate strategy: serve from cache while updating in background
  new StaleWhileRevalidate({
    // Name the cache for general static resources
    cacheName: 'static-resources'
  })
);