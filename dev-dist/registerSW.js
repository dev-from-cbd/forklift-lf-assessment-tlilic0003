// Checks if the browser supports the Service Worker API.
if ('serviceWorker' in navigator) 
    // If supported, registers a service worker using the `register` method.
    navigator.serviceWorker.register('/dev-sw.js?dev-sw', {
      scope: '/', 
      // Specifies the scope of the service worker. The '/' scope means the service worker will control all pages under the root directory.
      type: 'classic' 
      // Specifies the type of service worker script. 'classic' refers to the traditional JavaScript execution context.
    });