import { defineConfig } from 'vite' // Import Vite configuration function
import react from '@vitejs/plugin-react' // Import React plugin
import { VitePWA } from 'vite-plugin-pwa' // Import PWA plugin

export default defineConfig({ // Export default Vite configuration
  plugins: [ // Array of Vite plugins
    react(), // React plugin for JSX/TSX support
    VitePWA({ // Progressive Web App configuration
      registerType: 'autoUpdate', // Auto-update service worker
      manifest: { // Web App Manifest
        name: 'Forklift Training & Assessment', // Full app name
        short_name: 'Forklift Training', // Short app name
        description: 'TLILIC0004 Licence to Operate an Order Picking Forklift Truck (LO) Training and Assessment Application', // App description
        theme_color: '#1e40af', // Theme color
        background_color: '#ffffff', // Background color
        display: 'standalone', // Display mode
        orientation: 'portrait', // Screen orientation
        scope: '/', // App scope
        start_url: '/', // Start URL
        icons: [ // App icons
          {
            src: '/icon-192x192.png', // Icon path
            sizes: '192x192', // Icon size
            type: 'image/png', // Icon type
            purpose: 'any maskable' // Icon purpose
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: { // Service worker configuration
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'], // Files to cache
        runtimeCaching: [ // Runtime caching rules
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i, // Image cache pattern
            handler: 'CacheFirst', // Cache strategy
            options: {
              cacheName: 'image-cache', // Cache name
              expiration: {
                maxEntries: 50, // Max cached items
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days cache duration
              }
            }
          },
          {
            urlPattern: /^https:\/\/api\/.*/i, // API cache pattern
            handler: 'NetworkFirst', // Cache strategy
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60 // 24 hours cache duration
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: false // Disable service worker in development
      }
    })
  ],
  server: { // Development server options
    watch: {
      usePolling: true, // Use polling for file watching
    },
  }
})