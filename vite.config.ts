// Import the defineConfig function from Vite, which provides type checking for the configuration
import { defineConfig } from 'vite'
// Import the React plugin for Vite, which enables JSX/TSX support and Fast Refresh
import react from '@vitejs/plugin-react'
// Import the PWA (Progressive Web App) plugin for Vite, which adds service worker and manifest support
import { VitePWA } from 'vite-plugin-pwa'

// Export the default Vite configuration using defineConfig for type safety
export default defineConfig({
  // Define the plugins array to extend Vite's functionality
  plugins: [
    // Enable React support with default options
    react(),
    // Configure the Progressive Web App (PWA) features
    VitePWA({
      // Set the service worker registration strategy to automatically update when new content is available
      registerType: 'autoUpdate',
      // Define the Web App Manifest, which provides metadata for the PWA
      manifest: {
        // Full name of the application shown in app stores and installation prompts
        name: 'Forklift Training & Assessment',
        // Short name used on the home screen and in limited space contexts
        short_name: 'Forklift Training',
        // Detailed description of the application's purpose and functionality
        description: 'TLILIC0004 Licence to Operate an Order Picking Forklift Truck (LO) Training and Assessment Application',
        // Primary theme color that affects browser UI elements like the address bar
        theme_color: '#1e40af',
        // Background color used during app loading and on splash screens
        background_color: '#ffffff',
        // Display mode determining how the app appears (standalone removes browser UI)
        display: 'standalone',
        // Preferred screen orientation for the application
        orientation: 'portrait',
        // Base path scope for the application (root path in this case)
        scope: '/',
        // Initial URL to load when the application is launched
        start_url: '/',
        // Array of icon definitions for different device sizes and contexts
        icons: [
          {
            // Path to the 192x192 pixel icon relative to the public directory
            src: '/icon-192x192.png',
            // Dimensions of this icon
            sizes: '192x192',
            // MIME type of the icon file
            type: 'image/png',
            // Purpose indicating how the icon should be used (any maskable allows adaptive icons)
            purpose: 'any maskable'
          },
          {
            // Path to the 512x512 pixel icon relative to the public directory
            src: '/icon-512x512.png',
            // Dimensions of this larger icon for high-resolution displays
            sizes: '512x512',
            // MIME type of the icon file
            type: 'image/png',
            // Purpose indicating how the icon should be used (any maskable allows adaptive icons)
            purpose: 'any maskable'
          }
        ]
      },
      // Configure Workbox, the library that powers the service worker
      workbox: {
        // Define patterns for files to be precached when the service worker installs
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        // Configure runtime caching strategies for specific URL patterns
        runtimeCaching: [
          {
            // Regular expression pattern matching Unsplash image URLs
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            // Use CacheFirst strategy (serve from cache, fall back to network)
            handler: 'CacheFirst',
            // Additional options for this caching rule
            options: {
              // Name of the cache storage for these resources
              cacheName: 'image-cache',
              // Configure cache expiration policy
              expiration: {
                // Maximum number of entries to store in this cache
                maxEntries: 50,
                // Maximum age of entries (30 days in seconds)
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            }
          },
          {
            // Regular expression pattern matching API URLs
            urlPattern: /^https:\/\/api\/.*/i,
            // Use NetworkFirst strategy (try network first, fall back to cache)
            handler: 'NetworkFirst',
            // Additional options for this caching rule
            options: {
              // Name of the cache storage for API responses
              cacheName: 'api-cache',
              // Configure cache expiration policy
              expiration: {
                // Maximum number of entries to store in this cache
                maxEntries: 50,
                // Maximum age of entries (24 hours in seconds)
                maxAgeSeconds: 24 * 60 * 60 // 24 hours
              }
            }
          }
        ]
      },
      // Development-specific options for the PWA plugin
      devOptions: {
        // Disable service worker during development to avoid caching issues
        enabled: false // Disable service worker in development
      }
    })
  ],
  // Server configuration options
  server: {
    // File watching configuration
    watch: {
      // Enable polling for file changes (useful in certain environments like Docker)
      usePolling: true,
    },
  }
})