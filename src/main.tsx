// Import StrictMode from React to enable additional development checks and warnings
import { StrictMode } from 'react';
// Import createRoot from react-dom/client for React 18's concurrent rendering API
import { createRoot } from 'react-dom/client';
// Import BrowserRouter from react-router-dom to enable client-side routing
import { BrowserRouter } from 'react-router-dom';
// Import AuthProvider from local context to provide authentication state to the app
import { AuthProvider } from './contexts/AuthContext';
// Import the main App component which serves as the root component of the application
import App from './App.tsx';
// Import global CSS styles from index.css (contains Tailwind directives)
import './index.css';

// Register service worker only in production environment for offline capabilities
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  // Add event listener for when the page is fully loaded
  window.addEventListener('load', () => {
    // Register the service worker with the browser
    navigator.serviceWorker.register('/sw.js', { 
      // Set the scope to the root path to control the entire site
      scope: '/' 
    }).then(registration => {
      // Log successful registration to the console
      console.log('ServiceWorker registration successful');
    }).catch(error => {
      // Only log errors in production since we expect it to fail in development
      if (import.meta.env.PROD) {
        // Log detailed error information if registration fails
        console.error('ServiceWorker registration failed:', error);
      }
    });
  });
}

// Create a React root using the DOM element with id 'root'
// The '!' is a TypeScript non-null assertion operator indicating we're certain the element exists
createRoot(document.getElementById('root')!).render(
  /* Wrap the app in StrictMode to highlight potential problems in development */
  <StrictMode>
    {/* Wrap the app in BrowserRouter to enable client-side routing throughout the application */}
    <BrowserRouter>
      {/* Wrap the app in AuthProvider to provide authentication context to all components */}
      <AuthProvider>
        {/* Render the main App component which contains the application's UI */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);