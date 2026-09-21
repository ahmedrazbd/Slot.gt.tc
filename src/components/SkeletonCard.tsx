import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 space-y-4 animate-pulse">
      <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
        <div className="h-3 w-32 bg-slate-800 rounded-sm" />
        <div className="h-3 w-16 bg-slate-800 rounded-sm" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-800" />
            <div className="space-y-1.5">
              <div className="h-3.5 w-28 bg-slate-800 rounded-sm" />
              <div className="h-2.5 w-16 bg-slate-800/60 rounded-sm" />
            </div>
          </div>
          <div className="h-6 w-8 bg-slate-800 rounded-md" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-800" />
            <div className="space-y-1.5">
              <div className="h-3.5 w-24 bg-slate-800 rounded-sm" />
              <div className="h-2.5 w-14 bg-slate-800/60 rounded-sm" />
            </div>
          </div>
          <div className="h-6 w-8 bg-slate-800 rounded-md" />
        </div>
      </div>

      <div className="h-1.5 w-full bg-slate-800 rounded-full" />

      <div className="flex justify-between pt-1">
        <div className="h-3 w-20 bg-slate-800 rounded-sm" />
        <div className="h-3 w-24 bg-slate-800 rounded-sm" />
      </div>
    </div>
  );
};
