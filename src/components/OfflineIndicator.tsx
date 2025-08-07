// Import React library and hooks for component functionality
import React, { useEffect, useState } from 'react';
// Import WifiOff icon from lucide-react library for offline status visualization
import { WifiOff } from 'lucide-react';

// Define OfflineIndicator component as a functional component
const OfflineIndicator: React.FC = () => {
  // Initialize state for tracking offline status, using browser's navigator.onLine property
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Set up event listeners for online/offline status changes when component mounts
  useEffect(() => {
    // Define handler function for online event - sets offline state to false
    const handleOnline = () => setIsOffline(false);
    // Define handler function for offline event - sets offline state to true
    const handleOffline = () => setIsOffline(true);

    // Add event listeners to window for online and offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup function to remove event listeners when component unmounts
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // If user is online, don't render anything (early return pattern)
  if (!isOffline) return null;

  // Render offline notification when user is offline
  return (
    // Container positioned at bottom-right corner with yellow styling and shadow
    <div className="fixed bottom-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded shadow-lg">
      {/* Flex container to align icon and text */}
      <div className="flex items-center">
        {/* WifiOff icon with yellow color and margin */}
        <WifiOff className="h-5 w-5 text-yellow-500 mr-2" />
        {/* Notification text with yellow-dark color */}
        <span className="text-yellow-700">You are currently offline. Some features may be limited.</span>
      </div>
    </div>
  );
};

// Export the OfflineIndicator component as the default export
export default OfflineIndicator;