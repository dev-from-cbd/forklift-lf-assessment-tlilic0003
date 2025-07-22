if('serviceWorker' in navigator) navigator.serviceWorker.register('/dev-sw.js?dev-sw', { scope: '/', type: 'classic' })// Check if the browser supports service workers by looking for 'serviceWorker' property in the navigator object
if('serviceWorker' in navigator) 
    // If service workers are supported, register the development service worker file
    navigator.serviceWorker.register('/dev-sw.js?dev-sw', { 
        scope: '/',      // Set the scope to root directory, meaning the service worker controls the entire site
        type: 'classic'  // Use classic script type (as opposed to module type)
    })