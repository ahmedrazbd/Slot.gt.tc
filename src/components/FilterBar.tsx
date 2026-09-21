import React from 'react';
import { PlatformBadgeFilter, ViewMode, SortOption } from '../types';
import { LayoutGrid, List, ArrowUpDown, Star, Search, Sparkles } from 'lucide-react';

interface FilterBarProps {
  selectedBadge: PlatformBadgeFilter;
  onBadgeSelect: (badge: PlatformBadgeFilter) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  favoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  favoritesCount: number;
  totalCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const BADGE_OPTIONS: { label: string; value: PlatformBadgeFilter }[] = [
  { label: 'All Portals', value: 'all' },
  { label: 'VIP Sites', value: 'Vip-Sites' },
  { label: 'Instant Pay', value: 'Instant-Pay' },
  { label: 'Live Action', value: 'Live-Bet' },
  { label: 'Jackpots', value: 'Jackpots' },
  { label: 'High Yield', value: 'Hi-Paying' },
  { label: 'Trending', value: 'Trends' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedBadge,
  onBadgeSelect,
  viewMode,
  onViewModeChange,
  sortOption,
  onSortChange,
  favoritesOnly,
  onToggleFavoritesOnly,
  favoritesCount,
  totalCount,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="space-y-3">
      {/* Mobile Search Bar */}
      <div className="relative sm:hidden">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search 47 verified platforms..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 p-2.5 rounded-2xl">
        {/* Badges Filter Pills (Scrollable horizontally) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {BADGE_OPTIONS.map((item) => (
            <button
              key={item.value}
              onClick={() => onBadgeSelect(item.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedBadge === item.value && !favoritesOnly
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* Bookmarks Filter */}
          <button
            onClick={onToggleFavoritesOnly}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              favoritesOnly
                ? 'bg-amber-400 text-slate-950 font-bold border-amber-300'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            <Star
              className={`w-3.5 h-3.5 ${
                favoritesOnly ? 'fill-slate-950' : 'text-amber-400'
              }`}
            />
            <span>Saved ({favoritesCount})</span>
          </button>
        </div>

        {/* View & Sort Controls */}
        <div className="flex items-center justify-between lg:justify-end gap-2 shrink-0 pt-1 lg:pt-0 border-t lg:border-t-0 border-slate-800/60">
          {/* Result Count */}
          <span className="text-xs text-slate-400 font-mono font-medium pl-1">
            Showing <strong className="text-white">{totalCount}</strong> portals
          </span>

          <div className="flex items-center gap-2">
            {/* Sort Select */}
            <div className="relative flex items-center">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                value={sortOption}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                aria-label="Sort portals"
                className="pl-7 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
              >
                <option value="rank">Sort: Rank (#1-#47)</option>
                <option value="rating">Sort: High Rating</option>
                <option value="clicks">Sort: Most Clicks</option>
                <option value="name">Sort: A-Z Name</option>
              </select>
            </div>

            {/* View Mode Toggle: Grid vs Table */}
            <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-0.5">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'grid'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Grid Card View"
                aria-label="Grid Card View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onViewModeChange('table')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'table'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Ranked Table View"
                aria-label="Ranked Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
