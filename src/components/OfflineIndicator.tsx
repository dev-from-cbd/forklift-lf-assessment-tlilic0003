// Import React hooks
import React, { useEffect, useState } from 'react';
// Import WiFi Off icon from Lucide React
import { WifiOff } from 'lucide-react';

// OfflineIndicator component definition
const OfflineIndicator: React.FC = () => {
  // State to track offline status, initialized with current browser status
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Effect hook to listen for online/offline events
  useEffect(() => {
    // Handler for when connection is restored
    const handleOnline = () => setIsOffline(false);
    // Handler for when connection is lost
    const handleOffline = () => setIsOffline(true);

    // Add event listeners for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup function to remove event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // Empty dependency array means this runs once on mount

  // Don't render anything if online
  if (!isOffline) return null;

  // Render offline indicator UI
  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded shadow-lg">
      <div className="flex items-center">
        {/* WiFi Off icon */}
        <WifiOff className="h-5 w-5 text-yellow-500 mr-2" />
        {/* Offline message */}
        <span className="text-yellow-700">You are currently offline. Some features may be limited.</span>
      </div>
    </div>
  );
};

export default OfflineIndicator;