// Import React and necessary hooks for component state and side effects
import React, { useEffect, useState } from 'react';
// Import WifiOff icon from Lucide React icons library
import { WifiOff } from 'lucide-react';

// Define OfflineIndicator as a functional component with React.FC type
const OfflineIndicator: React.FC = () => {
  // Initialize state to track offline status, initially set based on navigator.onLine
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Use effect hook to set up event listeners for online/offline status changes
  useEffect(() => {
    // Handler function to update state when device goes online
    const handleOnline = () => setIsOffline(false);
    // Handler function to update state when device goes offline
    const handleOffline = () => setIsOffline(true);

    // Add event listeners to window object for online and offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup function to remove event listeners when component unmounts
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // Empty dependency array means this effect runs only once on mount

  // If user is online, don't render anything (return null)
  if (!isOffline) return null;

  // Render offline notification when user is offline
  return (
    // Container div with styling for notification positioning and appearance
    <div className="fixed bottom-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded shadow-lg">
      // Flex container for icon and text alignment
      <div className="flex items-center">
        // WifiOff icon with styling
        <WifiOff className="h-5 w-5 text-yellow-500 mr-2" />
        // Text message informing user about offline status
        <span className="text-yellow-700">You are currently offline. Some features may be limited.</span>
      </div>
    </div>
  );
};

// Export the OfflineIndicator component as default
export default OfflineIndicator;