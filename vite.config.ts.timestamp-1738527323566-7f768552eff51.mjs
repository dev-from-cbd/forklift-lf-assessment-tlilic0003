// vite.config.ts - Main configuration file for Vite
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js"; // Import Vite's defineConfig function
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs"; // Import React plugin for Vite
import { VitePWA } from "file:///home/project/node_modules/vite-plugin-pwa/dist/index.js"; // Import PWA plugin for Vite

// Define Vite configuration
var vite_config_default = defineConfig({
  plugins: [
    react(), // Enable React plugin
    VitePWA({ // Configure Progressive Web App settings
      registerType: "autoUpdate", // Auto-update service worker
      manifest: { // Web App Manifest configuration
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
            src: "/icon-192x192.png", // Icon source
            sizes: "192x192", // Icon size
            type: "image/png", // Icon type
            purpose: "any maskable" // Icon purpose
          },
          {
            src: "/icon-512x512.png", // Larger icon source
            sizes: "512x512", // Larger icon size
            type: "image/png", // Icon type
            purpose: "any maskable" // Icon purpose
          }
        ]
      },
      workbox: { // Service worker configuration
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"], // Files to cache
        runtimeCaching: [ // Runtime caching strategies
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i, // Pattern for image URLs
            handler: "CacheFirst", // Caching strategy
            options: {
              cacheName: "image-cache", // Cache name
              expiration: {
                maxEntries: 50, // Maximum cached entries
                maxAgeSeconds: 30 * 24 * 60 * 60 // Cache duration (30 days)
              }
            }
          },
          {
            urlPattern: /^https:\/\/api\/.*/i, // Pattern for API URLs
            handler: "NetworkFirst", // Caching strategy
            options: {
              cacheName: "api-cache", // Cache name
              expiration: {
                maxEntries: 50, // Maximum cached entries
                maxAgeSeconds: 24 * 60 * 60 // Cache duration (24 hours)
              }
            }
          }
        ]
      },
      devOptions: { // Development options
        enabled: false // Disable service worker in development
      }
    })
  ],
  server: { // Development server configuration
    proxy: { // Proxy configuration
      "/api/auth": "http://localhost:3001", // Auth API proxy
      "/api/questions": "http://localhost:3002", // Questions API proxy
      "/api/progress": "http://localhost:3003" // Progress API proxy
    }
  }
});

export {
  vite_config_default as default // Export the configuration
};
