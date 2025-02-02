import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

const OfflineIndicator: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded shadow-lg">
      <div className="flex items-center">
        <WifiOff className="h-5 w-5 text-yellow-500 mr-2" />
        <span className="text-yellow-700">You are currently offline. Some features may be limited.</span>
      </div>
    </div>
  );
};

export default OfflineIndicator;