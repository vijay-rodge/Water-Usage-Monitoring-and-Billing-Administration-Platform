import React from 'react';
import { WifiOff, Wifi, AlertCircle, RefreshCw } from 'lucide-react';
import { usePwa } from '../../context/PwaContext';

export const OfflineIndicator = () => {
  const { isOnline, justReconnected } = usePwa();

  if (isOnline && !justReconnected) {
    return null;
  }

  if (justReconnected) {
    return (
      <aside aria-label="Connection Status" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-none">
        <div className="flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 text-xs font-semibold backdrop-blur-md">
          <Wifi className="w-4 h-4 animate-bounce" />
          <span>You are back online. Synchronizing water telemetry...</span>
        </div>
      </aside>
    );
  }

  return (
    <aside aria-label="Offline Mode Notice" className="fixed top-0 left-0 right-0 z-50 animate-in slide-in-from-top-2 duration-300 shadow-md">
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-4 py-2 flex items-center justify-between text-xs sm:text-sm font-medium">
        <div className="flex items-center space-x-2 max-w-5xl mx-auto w-full justify-between">
          <div className="flex items-center space-x-2 truncate">
            <WifiOff className="w-4 h-4 shrink-0 animate-pulse" />
            <span className="font-bold">Offline Mode:</span>
            <span className="truncate text-amber-100 hidden sm:inline">
              Displaying cached application shell. Live telemetry, payments, and document verification will sync once reconnected.
            </span>
            <span className="truncate text-amber-100 sm:hidden">
              Displaying cached shell. Working offline.
            </span>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="shrink-0 flex items-center space-x-1 bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg transition ml-2 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
