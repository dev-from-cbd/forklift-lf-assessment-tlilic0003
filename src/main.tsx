// Import React's StrictMode for highlighting potential problems
import { StrictMode } from 'react';
// Import createRoot from react-dom/client for rendering the app
import { createRoot } from 'react-dom/client';
// Import BrowserRouter for client-side routing
import { BrowserRouter } from 'react-router-dom';
// Import AuthProvider for managing authentication state
import { AuthProvider } from './contexts/AuthContext';
// Import the main App component
import App from './App.tsx';
// Import global CSS styles
import './index.css';

// Register service worker only in production environment
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  // Wait for page to load before registering service worker
  window.addEventListener('load', () => {
    // Register service worker with root scope
    navigator.serviceWorker.register('/sw.js', { 
      scope: '/' 
    }).then(registration => {
      // Log successful registration
      console.log('ServiceWorker registration successful');
    }).catch(error => {
      // Only log errors in production (expected to fail in development)
      if (import.meta.env.PROD) {
        console.error('ServiceWorker registration failed:', error);
      }
    });
  });
}

// Create root and render the application
createRoot(document.getElementById('root')!).render(
  // Wrap app in StrictMode for additional React checks
  <StrictMode>
    {/* Enable client-side routing */}
    <BrowserRouter>
      {/* Provide authentication context to entire app */}
      <AuthProvider>
        {/* Main application component */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);