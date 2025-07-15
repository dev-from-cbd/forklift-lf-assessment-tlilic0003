// vite.config.ts - Vite configuration file
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js"; // Import Vite's defineConfig
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs"; // Import React plugin
import { VitePWA } from "file:///home/project/node_modules/vite-plugin-pwa/dist/index.js"; // Import PWA plugin

// Define Vite configuration
var vite_config_default = defineConfig({
  plugins: [
    react(), // Enable React plugin
    VitePWA({ // Configure Progressive Web App
      registerType: "autoUpdate", // Auto-update service worker
      manifest: { // Web App Manifest
        name: "Forklift Training & Assessment", // Full app name
        short_name: "Forklift Training", // Short app name
        description: "TLILIC0003 High Risk Licence Training and Assessment Application", // App description
        theme_color: "#1e40af", // Theme color
        background_color: "#ffffff", // Background color
        display: "standalone", // Display mode
        orientation: "portrait", // Screen orientation
        scope: "/", // App scope
        start_url: "/", // Start URL
        icons: [ // App icons
          {
            src: "/icon-192x192.png", // Icon path
            sizes: "192x192", // Icon size
            type: "image/png", // Icon type
            purpose: "any maskable" // Icon purpose
          },
          {
            src: "/icon-512x512.png", // Larger icon path
            sizes: "512x512", // Larger icon size
            type: "image/png", // Icon type
            purpose: "any maskable" // Icon purpose
          }
        ]
      },
      workbox: { // Service worker config
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"], // Files to cache
        runtimeCaching: [ // Cache strategies
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i, // Image URLs pattern
            handler: "CacheFirst", // Cache strategy
            options: {
              cacheName: "image-cache", // Cache name
              expiration: {
                maxEntries: 50, // Max cached items
                maxAgeSeconds: 30 * 24 * 60 * 60 // Cache duration (30 days)
              }
            }
          },
          {
            urlPattern: /^https:\/\/api\/.*/i, // API URLs pattern
            handler: "NetworkFirst", // Cache strategy
            options: {
              cacheName: "api-cache", // Cache name
              expiration: {
                maxEntries: 50, // Max cached items
                maxAgeSeconds: 24 * 60 * 60 // Cache duration (24 hours)
              }
            }
          }
        ]
      },
      devOptions: { // Development options
        enabled: false // Disable service worker in dev
      }
    })
  ],
  server: { // Dev server config
    proxy: { // API proxies
      "/api/auth": "http://localhost:3001", // Auth API
      "/api/questions": "http://localhost:3002", // Questions API
      "/api/progress": "http://localhost:3003" // Progress API
    }
  }
});

export {
  vite_config_default as default // Export config
};
