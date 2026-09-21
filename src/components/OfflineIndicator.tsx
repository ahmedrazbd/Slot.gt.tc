import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="offline-banner"
      role="status"
      aria-live="polite"
      className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-6 md:right-auto z-50 flex items-center justify-between gap-3 rounded-xl bg-amber-500/95 backdrop-blur-xs px-4 py-2.5 text-xs font-semibold text-slate-950 shadow-xl border border-amber-400"
    >
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 animate-bounce" />
        <span>Offline Mode — Displaying cached match scores and schedules.</span>
      </div>
    </div>
  );
};
