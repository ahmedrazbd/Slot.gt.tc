import React from 'react';
import {
  ShieldCheck,
  Zap,
  Award,
  Search,
  X,
  Sparkles,
  Trophy,
  Flame,
  CreditCard,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { PlatformBadgeFilter } from '../types';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedBadge: PlatformBadgeFilter;
  onSelectBadge: (b: PlatformBadgeFilter) => void;
  favoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  favoritesCount: number;
  totalPlatforms: number;
  filteredCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  selectedBadge,
  onSelectBadge,
  favoritesOnly,
  onToggleFavoritesOnly,
  favoritesCount,
  totalPlatforms,
  filteredCount,
}) => {
  const BADGES: { id: PlatformBadgeFilter; label: string; icon: string }[] = [
    { id: 'all', label: 'All Portals', icon: '🌐' },
    { id: 'Instant-Pay', label: 'Instant Pay', icon: '⚡' },
    { id: 'Vip-Sites', label: 'VIP Portals', icon: '👑' },
    { id: 'Live-Bet', label: 'Live Gaming', icon: '🔴' },
    { id: 'Jackpots', label: 'Jackpots', icon: '🎰' },
    { id: 'Hi-Paying', label: 'High Payout', icon: '💎' },
    { id: 'Trends', label: 'Trending', icon: '🔥' },
  ];

  return (
    <section className="relative overflow-hidden rounded-3xl bg-radial from-slate-900 via-slate-950 to-slate-950 border border-slate-800/90 shadow-2xl p-6 sm:p-8 lg:p-10 mb-8">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/4 -mt-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 -mb-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

      <div className="relative z-10 space-y-8">
        {/* Brand Bar & Official Logo */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Logo Image */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-2xl blur-xs opacity-75 group-hover:opacity-100 transition duration-300" />
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-slate-900 p-2 border border-slate-700/80 flex items-center justify-center overflow-hidden shadow-xl">
                <img
                  src="https://ik.imagekit.io/kpx40qv3r/slot_gt_tc%20logo.png"
                  alt="Trending Slot Bd Logo"
                  className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />
              </div>
            </div>

            {/* Title & Tagline */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-400/30 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Verified Directory 2026
                </span>
                <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/60">
                  47 Portals Active
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-mono">
                Trending Slot <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">Bd</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Bangladesh's premier verified directory for online entertainment & slot portals. Real-time safety ratings, direct affiliate links, instant bKash/Nagad payouts, and integrated SQL database.
              </p>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="hidden lg:grid grid-cols-2 gap-3 shrink-0">
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3.5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Trust Score</p>
                <p className="text-sm font-black text-white font-mono">4.8 / 5.0 ★</p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3.5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Payouts</p>
                <p className="text-sm font-black text-white font-mono">Instant bKash</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Search & Filter Strip */}
        <div className="space-y-4 pt-2 border-t border-slate-800/80">
          {/* Search Box */}
          <div className="relative max-w-3xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-emerald-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search 47 portals by name, badge, affiliate ID (e.g., XX99Bet, Instant-Pay, Its-New)..."
              className="w-full pl-12 pr-12 py-3.5 bg-slate-900/95 border border-slate-700/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-2xl text-sm text-white placeholder-slate-400 transition shadow-inner font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {BADGES.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    onSelectBadge(b.id);
                    if (favoritesOnly) onToggleFavoritesOnly();
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${
                    selectedBadge === b.id && !favoritesOnly
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <span>{b.icon}</span>
                  <span>{b.label}</span>
                </button>
              ))}

              {/* Favorites Filter */}
              <button
                onClick={onToggleFavoritesOnly}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${
                  favoritesOnly
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                    : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>❤️</span>
                <span>Favorites ({favoritesCount})</span>
              </button>
            </div>

            {/* Results Count */}
            <div className="text-xs font-mono text-slate-400">
              Showing <span className="font-bold text-emerald-400">{filteredCount}</span> of {totalPlatforms} portals
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
