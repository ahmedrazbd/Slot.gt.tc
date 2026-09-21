import React from 'react';
import { Compass, Tag, BarChart2, MessageSquare, Database } from 'lucide-react';
import { ActiveTab } from '../types';

interface MobileNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  totalPlatforms: number;
  totalOffers: number;
  totalClicks: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onTabChange,
  totalPlatforms,
  totalOffers,
  totalClicks,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-lg px-2 py-1.5 safe-area-pb shadow-2xl">
      <div className="grid grid-cols-5 gap-1">
        <button
          onClick={() => onTabChange('directory')}
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
            activeTab === 'directory'
              ? 'text-emerald-400 bg-emerald-500/10 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Compass className="w-5 h-5" />
            <span className="absolute -top-1 -right-2 bg-slate-800 text-slate-300 text-[8px] font-mono px-1 rounded-full">
              {totalPlatforms}
            </span>
          </div>
          <span className="text-[9px] mt-1 font-medium">Portals</span>
        </button>

        <button
          onClick={() => onTabChange('offers')}
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
            activeTab === 'offers'
              ? 'text-emerald-400 bg-emerald-500/10 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Tag className="w-5 h-5" />
            <span className="absolute -top-1 -right-2 bg-slate-800 text-slate-300 text-[8px] font-mono px-1 rounded-full">
              {totalOffers}
            </span>
          </div>
          <span className="text-[9px] mt-1 font-medium">Vouchers</span>
        </button>

        <button
          onClick={() => onTabChange('clicks')}
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
            activeTab === 'clicks'
              ? 'text-emerald-400 bg-emerald-500/10 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <BarChart2 className="w-5 h-5" />
            <span className="absolute -top-1 -right-2 bg-slate-800 text-slate-300 text-[8px] font-mono px-1 rounded-full">
              {totalClicks}
            </span>
          </div>
          <span className="text-[9px] mt-1 font-medium">Referrals</span>
        </button>

        <button
          onClick={() => onTabChange('messages')}
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
            activeTab === 'messages'
              ? 'text-emerald-400 bg-emerald-500/10 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[9px] mt-1 font-medium">Support</span>
        </button>

        <button
          onClick={() => onTabChange('sql')}
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
            activeTab === 'sql'
              ? 'text-emerald-400 bg-emerald-500/10 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-5 h-5 text-amber-400" />
          <span className="text-[9px] mt-1 font-medium">SQL DB</span>
        </button>
      </div>
    </nav>
  );
};
