// Original filename: vite.config.ts - This is a compiled version of the Vite configuration file
// Import the defineConfig function from Vite's node module - provides type checking for configuration
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
// Import the React plugin for Vite - enables JSX/TSX support and Fast Refresh
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
// Import the PWA (Progressive Web App) plugin for Vite - adds service worker and manifest support
import { VitePWA } from "file:///home/project/node_modules/vite-plugin-pwa/dist/index.js";
// Create the default Vite configuration object using defineConfig for type safety
var vite_config_default = defineConfig({
  // Define the plugins array to extend Vite's functionality
  plugins: [
    // Enable React support with default options
    react(),
    // Configure the Progressive Web App (PWA) features
    VitePWA({
      // Set the service worker registration strategy to automatically update when new content is available
      registerType: "autoUpdate",
      // Define the Web App Manifest, which provides metadata for the PWA
      manifest: {
        // Full name of the application shown in app stores and installation prompts
        name: "Forklift Training & Assessment",
        // Short name used on the home screen and in limited space contexts
        short_name: "Forklift Training",
        // Detailed description of the application's purpose and functionality
        description: "TLILIC0003 High Risk Licence Training and Assessment Application",
        // Primary theme color that affects browser UI elements like the address bar
        theme_color: "#1e40af",
        // Background color used during app loading and on splash screens
        background_color: "#ffffff",
        // Display mode determining how the app appears (standalone removes browser UI)
        display: "standalone",
        // Preferred screen orientation for the application
        orientation: "portrait",
        // Base path scope for the application (root path in this case)
        scope: "/",
        // Initial URL to load when the application is launched
        start_url: "/",
        // Array of icon definitions for different device sizes and contexts
        icons: [
          {
            // Path to the 192x192 pixel icon relative to the public directory
            src: "/icon-192x192.png",
            // Dimensions of this icon
            sizes: "192x192",
            // MIME type of the icon file
            type: "image/png",
            // Purpose indicating how the icon should be used (any maskable allows adaptive icons)
            purpose: "any maskable"
          },
          {
            // Path to the 512x512 pixel icon relative to the public directory
            src: "/icon-512x512.png",
            // Dimensions of this larger icon for high-resolution displays
            sizes: "512x512",
            // MIME type of the icon file
            type: "image/png",
            // Purpose indicating how the icon should be used (any maskable allows adaptive icons)
            purpose: "any maskable"
          }
        ]
      },
      // Configure Workbox, the library that powers the service worker
      workbox: {
        // Define patterns for files to be precached when the service worker installs
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
        // Configure runtime caching strategies for specific URL patterns
        runtimeCaching: [
          {
            // Regular expression pattern matching Unsplash image URLs
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            // Use CacheFirst strategy (serve from cache, fall back to network)
            handler: "CacheFirst",
            // Additional options for this caching rule
            options: {
              // Name of the cache storage for these resources
              cacheName: "image-cache",
              // Configure cache expiration policy
              expiration: {
                // Maximum number of entries to store in this cache
                maxEntries: 50,
                // Maximum age of entries (30 days in seconds)
                maxAgeSeconds: 30 * 24 * 60 * 60
                // 30 days
              }
            }
          },
          {
            // Regular expression pattern matching API URLs
            urlPattern: /^https:\/\/api\/.*/i,
            // Use NetworkFirst strategy (try network first, fall back to cache)
            handler: "NetworkFirst",
            // Additional options for this caching rule
            options: {
              // Name of the cache storage for API responses
              cacheName: "api-cache",
              // Configure cache expiration policy
              expiration: {
                // Maximum number of entries to store in this cache
                maxEntries: 50,
                // Maximum age of entries (24 hours in seconds)
                maxAgeSeconds: 24 * 60 * 60
                // 24 hours
              }
            }
          }
        ]
      },
      // Development-specific options for the PWA plugin
      devOptions: {
        // Disable service worker during development to avoid caching issues
        enabled: false
      }
    })
  ],
  // Server configuration options
  server: {
    // Proxy configuration for API requests during development
    proxy: {
      // Route API authentication requests to the auth service on port 3001
      "/api/auth": "http://localhost:3001",
      // Route API questions requests to the questions service on port 3002
      "/api/questions": "http://localhost:3002",
      // Route API progress requests to the progress service on port 3003
      "/api/progress": "http://localhost:3003"
    }
  }
});
// Export the configuration as the default export
export {
  vite_config_default as default
};
// Source map URL for debugging - contains the original source code and mapping information
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgVml0ZVBXQSh7XG4gICAgICByZWdpc3RlclR5cGU6ICdhdXRvVXBkYXRlJyxcbiAgICAgIG1hbmlmZXN0OiB7XG4gICAgICAgIG5hbWU6ICdGb3JrbGlmdCBUcmFpbmluZyAmIEFzc2Vzc21lbnQnLFxuICAgICAgICBzaG9ydF9uYW1lOiAnRm9ya2xpZnQgVHJhaW5pbmcnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1RMSUxJQzAwMDMgSGlnaCBSaXNrIExpY2VuY2UgVHJhaW5pbmcgYW5kIEFzc2Vzc21lbnQgQXBwbGljYXRpb24nLFxuICAgICAgICB0aGVtZV9jb2xvcjogJyMxZTQwYWYnLFxuICAgICAgICBiYWNrZ3JvdW5kX2NvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgIGRpc3BsYXk6ICdzdGFuZGFsb25lJyxcbiAgICAgICAgb3JpZW50YXRpb246ICdwb3J0cmFpdCcsXG4gICAgICAgIHNjb3BlOiAnLycsXG4gICAgICAgIHN0YXJ0X3VybDogJy8nLFxuICAgICAgICBpY29uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogJy9pY29uLTE5MngxOTIucG5nJyxcbiAgICAgICAgICAgIHNpemVzOiAnMTkyeDE5MicsXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICAgICAgICAgIHB1cnBvc2U6ICdhbnkgbWFza2FibGUnXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6ICcvaWNvbi01MTJ4NTEyLnBuZycsXG4gICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICAgICAgICBwdXJwb3NlOiAnYW55IG1hc2thYmxlJ1xuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHdvcmtib3g6IHtcbiAgICAgICAgZ2xvYlBhdHRlcm5zOiBbJyoqLyoue2pzLGNzcyxodG1sLGljbyxwbmcsc3ZnLHdvZmYsd29mZjJ9J10sXG4gICAgICAgIHJ1bnRpbWVDYWNoaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXJsUGF0dGVybjogL15odHRwczpcXC9cXC9pbWFnZXNcXC51bnNwbGFzaFxcLmNvbVxcLy4qL2ksXG4gICAgICAgICAgICBoYW5kbGVyOiAnQ2FjaGVGaXJzdCcsXG4gICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgIGNhY2hlTmFtZTogJ2ltYWdlLWNhY2hlJyxcbiAgICAgICAgICAgICAgZXhwaXJhdGlvbjoge1xuICAgICAgICAgICAgICAgIG1heEVudHJpZXM6IDUwLFxuICAgICAgICAgICAgICAgIG1heEFnZVNlY29uZHM6IDMwICogMjQgKiA2MCAqIDYwIC8vIDMwIGRheXNcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXJsUGF0dGVybjogL15odHRwczpcXC9cXC9hcGlcXC8uKi9pLFxuICAgICAgICAgICAgaGFuZGxlcjogJ05ldHdvcmtGaXJzdCcsXG4gICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgIGNhY2hlTmFtZTogJ2FwaS1jYWNoZScsXG4gICAgICAgICAgICAgIGV4cGlyYXRpb246IHtcbiAgICAgICAgICAgICAgICBtYXhFbnRyaWVzOiA1MCxcbiAgICAgICAgICAgICAgICBtYXhBZ2VTZWNvbmRzOiAyNCAqIDYwICogNjAgLy8gMjQgaG91cnNcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIGRldk9wdGlvbnM6IHtcbiAgICAgICAgLy8gRGlzYWJsZSBzZXJ2aWNlIHdvcmtlciBpbiBkZXZlbG9wbWVudFxuICAgICAgICBlbmFibGVkOiBmYWxzZVxuICAgICAgfVxuICAgIH0pXG4gIF0sXG4gIHNlcnZlcjoge1xuICAgIHByb3h5OiB7XG4gICAgICAnL2FwaS9hdXRoJzogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMScsXG4gICAgICAnL2FwaS9xdWVzdGlvbnMnOiAnaHR0cDovL2xvY2FsaG9zdDozMDAyJyxcbiAgICAgICcvYXBpL3Byb2dyZXNzJzogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMydcbiAgICB9XG4gIH1cbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxvQkFBb0I7QUFDdFAsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBZTtBQUV4QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsTUFDTixjQUFjO0FBQUEsTUFDZCxVQUFVO0FBQUEsUUFDUixNQUFNO0FBQUEsUUFDTixZQUFZO0FBQUEsUUFDWixhQUFhO0FBQUEsUUFDYixhQUFhO0FBQUEsUUFDYixrQkFBa0I7QUFBQSxRQUNsQixTQUFTO0FBQUEsUUFDVCxhQUFhO0FBQUEsUUFDYixPQUFPO0FBQUEsUUFDUCxXQUFXO0FBQUEsUUFDWCxPQUFPO0FBQUEsVUFDTDtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFlBQ04sU0FBUztBQUFBLFVBQ1g7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsWUFDTixTQUFTO0FBQUEsVUFDWDtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDUCxjQUFjLENBQUMsMkNBQTJDO0FBQUEsUUFDMUQsZ0JBQWdCO0FBQUEsVUFDZDtBQUFBLFlBQ0UsWUFBWTtBQUFBLFlBQ1osU0FBUztBQUFBLFlBQ1QsU0FBUztBQUFBLGNBQ1AsV0FBVztBQUFBLGNBQ1gsWUFBWTtBQUFBLGdCQUNWLFlBQVk7QUFBQSxnQkFDWixlQUFlLEtBQUssS0FBSyxLQUFLO0FBQUE7QUFBQSxjQUNoQztBQUFBLFlBQ0Y7QUFBQSxVQUNGO0FBQUEsVUFDQTtBQUFBLFlBQ0UsWUFBWTtBQUFBLFlBQ1osU0FBUztBQUFBLFlBQ1QsU0FBUztBQUFBLGNBQ1AsV0FBVztBQUFBLGNBQ1gsWUFBWTtBQUFBLGdCQUNWLFlBQVk7QUFBQSxnQkFDWixlQUFlLEtBQUssS0FBSztBQUFBO0FBQUEsY0FDM0I7QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQSxZQUFZO0FBQUE7QUFBQSxRQUVWLFNBQVM7QUFBQSxNQUNYO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsYUFBYTtBQUFBLE1BQ2Isa0JBQWtCO0FBQUEsTUFDbEIsaUJBQWlCO0FBQUEsSUFDbkI7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
