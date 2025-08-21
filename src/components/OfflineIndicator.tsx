import React, { useEffect, useState } from 'react'; // Import React library with useEffect and useState hooks
import { WifiOff } from 'lucide-react'; // Import WifiOff icon from Lucide React icon library

// Functional component to display offline status indicator
const OfflineIndicator: React.FC = () => {
  // State to track offline status, initialized with current navigator online status
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Effect hook to set up event listeners for online/offline status changes
  useEffect(() => {
    // Handler function to set offline state to false when coming online
    const handleOnline = () => setIsOffline(false);
    // Handler function to set offline state to true when going offline
    const handleOffline = () => setIsOffline(true);

    // Add event listener for online event
    window.addEventListener('online', handleOnline);
    // Add event listener for offline event
    window.addEventListener('offline', handleOffline);

    // Cleanup function to remove event listeners when component unmounts
    return () => {
      // Remove online event listener
      window.removeEventListener('online', handleOnline);
      // Remove offline event listener
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // Early return null if user is online (don't show indicator)
  if (!isOffline) return null;

  // JSX return for offline indicator UI
  return (
    // Fixed positioned container with yellow styling and shadow
    <div className="fixed bottom-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded shadow-lg">
      {/* Flex container for icon and text alignment */}
      <div className="flex items-center">
        {/* WiFi off icon with yellow color and right margin */}
        <WifiOff className="h-5 w-5 text-yellow-500 mr-2" />
        {/* Offline message text with yellow color */}
        <span className="text-yellow-700">You are currently offline. Some features may be limited.</span>
      </div>
    </div>
  );
}; // End of OfflineIndicator component

// Export OfflineIndicator component as default export
export default OfflineIndicator;