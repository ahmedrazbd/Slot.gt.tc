import React from 'react';
import { X, ShieldCheck, RefreshCw, Smartphone, Wifi, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateError: () => void;
  onSimulateLoading: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  onSimulateError,
  onSimulateLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-slate-900 border-l border-slate-800 p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-bold">
              A
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">ARENA APP</h2>
              <p className="text-[11px] text-emerald-400">PWA Version 2.4</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* PWA Install Promo */}
        <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1">
            <Smartphone className="w-4 h-4" />
            <span>Install on Your Device</span>
          </div>
          <p className="text-xs text-slate-300 mb-3">
            Add to your home screen for instantaneous loading and offline access to live matches.
          </p>
          <PWAInstallButton variant="banner" />
        </div>

        {/* Developer / Demo States Testing */}
        <div className="mt-6 space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            UI State Testing
          </p>

          <button
            onClick={() => {
              onSimulateLoading();
              onClose();
            }}
            className="w-full flex items-center justify-between rounded-xl bg-slate-800/80 hover:bg-slate-800 px-3.5 py-2.5 text-xs text-slate-200 transition"
          >
            <div className="flex items-center gap-2.5">
              <RefreshCw className="h-4 w-4 text-emerald-400" />
              <span>Simulate Loading Skeleton</span>
            </div>
            <span className="text-[10px] text-slate-400">Demo</span>
          </button>

          <button
            onClick={() => {
              onSimulateError();
              onClose();
            }}
            className="w-full flex items-center justify-between rounded-xl bg-slate-800/80 hover:bg-slate-800 px-3.5 py-2.5 text-xs text-rose-300 transition"
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-4 w-4 text-rose-400" />
              <span>Trigger Error State</span>
            </div>
            <span className="text-[10px] text-slate-400">Recovery</span>
          </button>
        </div>

        {/* Safety & Non-Gambling Policy */}
        <div className="mt-6 rounded-xl bg-slate-800/50 border border-slate-800 p-3.5 text-xs text-slate-300 space-y-2">
          <div className="flex items-center gap-2 text-white font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Safe Entertainment Guarantee</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Strictly non-gambling platform. No real-money wagering, casino mechanics, or prizes. Features community sentiment and statistical sports analytics only.
          </p>
        </div>

        {/* System Info */}
        <div className="mt-auto pt-6 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
          <div className="flex justify-between">
            <span>Service Worker</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Active
            </span>
          </div>
          <div className="flex justify-between">
            <span>Layout Engine</span>
            <span>Mobile-First Fluid</span>
          </div>
        </div>
      </div>
    </div>
  );
};
