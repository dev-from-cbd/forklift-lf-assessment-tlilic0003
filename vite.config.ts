import { defineConfig } from 'vite';
// Imports the `defineConfig` function from Vite, which helps in defining the configuration for the project.

import react from '@vitejs/plugin-react';
// Imports the React plugin for Vite, enabling support for React development.

import { VitePWA } from 'vite-plugin-pwa';
// Imports the Progressive Web App (PWA) plugin for Vite, enabling PWA functionality in the project.

export default defineConfig({
  // Exports the Vite configuration using `defineConfig`.

  plugins: [
    // Defines an array of plugins to be used in the Vite project.

    react(),
    // Adds the React plugin to enable React-specific features like JSX and Fast Refresh.

    VitePWA({
      registerType: 'autoUpdate',
      // Configures the service worker registration type to automatically update when new content is available.

      manifest: {
        // Defines the web app manifest for the PWA.
        name: 'Forklift Training & Assessment',
        // The full name of the application.
        short_name: 'Forklift Training',
        // A shorter name for the application, typically used on home screens.
        description: 'TLILIC0003 High Risk Licence Training and Assessment Application',
        // A brief description of the application.
        theme_color: '#1e40af',
        // The primary theme color for the application.
        background_color: '#ffffff',
        // The background color for the splash screen.
        display: 'standalone',
        // Specifies how the app should be displayed (standalone mode hides browser UI).
        orientation: 'portrait',
        // Locks the orientation of the app to portrait mode.
        scope: '/',
        // Defines the navigation scope of the PWA.
        start_url: '/',
        // Specifies the URL to load when the app is launched.
        icons: [
          // Defines the app icons for different sizes.
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },

      workbox: {
        // Configures Workbox, a library for managing service workers and caching strategies.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        // Specifies the file patterns to cache during the build process.

        runtimeCaching: [
          // Defines runtime caching rules for specific URL patterns.
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            // Matches requests to Unsplash images.
            handler: 'CacheFirst',
            // Uses the Cache First strategy for serving cached images.
            options: {
              cacheName: 'image-cache',
              // Names the cache for images.
              expiration: {
                maxEntries: 50,
                // Limits the number of entries in the cache.
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
                // Sets the maximum age of cached entries to 30 days.
              }
            }
          },
          {
            urlPattern: /^https:\/\/api\/.*/i,
            // Matches requests to API endpoints.
            handler: 'NetworkFirst',
            // Uses the Network First strategy for serving API responses.
            options: {
              cacheName: 'api-cache',
              // Names the cache for API responses.
              expiration: {
                maxEntries: 50,
                // Limits the number of entries in the cache.
                maxAgeSeconds: 24 * 60 * 60 // 24 hours
                // Sets the maximum age of cached entries to 24 hours.
              }
            }
          }
        ]
      },

      devOptions: {
        // Configures development-specific options for the PWA plugin.
        enabled: false
        // Disables the service worker in development mode to avoid caching issues.
      }
    })
  ],

  server: {
    // Configures the development server settings.
    proxy: {
      // Sets up proxy rules to redirect certain API requests to backend servers.
      '/api/auth': 'http://localhost:3001',
      // Redirects requests to `/api/auth` to the authentication server running on port 3001.
      '/api/questions': 'http://localhost:3002',
      // Redirects requests to `/api/questions` to the questions server running on port 3002.
      '/api/progress': 'http://localhost:3003'
      // Redirects requests to `/api/progress` to the progress server running on port 3003.
    }
  }
});