import React, { useState, useMemo, useEffect } from 'react';
import {
  Platform,
  PlatformBadgeFilter,
  ViewMode,
  SortOption,
  Offer,
  ClickRecord,
  ChatMessage,
  ActiveTab,
} from './types';
import {
  RAW_PLATFORMS,
  RAW_OFFERS,
  RAW_CLICKS,
  RAW_MESSAGES,
  CURRENT_USER,
} from './data/databaseData';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FilterBar } from './components/FilterBar';
import { PlatformCard } from './components/PlatformCard';
import { PlatformTable } from './components/PlatformTable';
import { PlatformDetailModal } from './components/PlatformDetailModal';
import { OffersView } from './components/OffersView';
import { ClicksDashboardView } from './components/ClicksDashboardView';
import { MessagesView } from './components/MessagesView';
import { SqlStudioView } from './components/SqlStudioView';
import { MobileNav } from './components/MobileNav';
import { Footer } from './components/Footer';
import { Sparkles, Compass, Database, ExternalLink } from 'lucide-react';
import { getSqlDb } from './services/sqlDatabase';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('directory');
  const [platforms, setPlatforms] = useState<Platform[]>(RAW_PLATFORMS);
  const [offers] = useState<Offer[]>(RAW_OFFERS);
  const [clickRecords] = useState<ClickRecord[]>(RAW_CLICKS);
  const [messages] = useState<ChatMessage[]>(RAW_MESSAGES);
  const [sqlReady, setSqlReady] = useState(false);

  // Initialize SQLite database in background
  useEffect(() => {
    getSqlDb()
      .then((db) => {
        setSqlReady(true);
        // Sync platforms from SQL
        try {
          const res = db.exec("SELECT * FROM platforms ORDER BY place ASC;");
          if (res && res.length > 0) {
            const cols = res[0].columns;
            const rows = res[0].values;
            const loadedPlatforms: Platform[] = rows.map((r) => {
              const obj: any = {};
              cols.forEach((col, idx) => {
                obj[col] = r[idx];
              });
              return {
                id: Number(obj.id),
                place: Number(obj.place),
                name: String(obj.name),
                logo: String(obj.logo),
                affiliatedBy: String(obj.affiliated_by),
                badges: typeof obj.badges === 'string' ? obj.badges.split(',').filter(Boolean) : [],
                rating: String(obj.rating),
                ratingScore: Number(obj.rating_score),
                ctaUrl: String(obj.cta_url),
                status: String(obj.status) as any,
                clicksCount: Number(obj.clicks_count || 0),
                description: obj.description ? String(obj.description) : undefined,
              };
            });
            if (loadedPlatforms.length > 0) {
              setPlatforms(loadedPlatforms);
            }
          }
        } catch (e) {
          console.warn('Could not query platforms from SQL yet:', e);
        }
      })
      .catch((err) => {
        console.warn('SQL wasm background init warning:', err);
      });
  }, []);

  // Favorites state persisted in localStorage
  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('trending_slot_bd_favorites');
      return saved ? JSON.parse(saved) : [1, 22, 29, 35];
    } catch {
      return [1, 22, 29, 35];
    }
  });

  const toggleFavorite = (id: number) => {
    setFavoriteIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('trending_slot_bd_favorites', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBadge, setSelectedBadge] = useState<PlatformBadgeFilter>('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortOption, setSortOption] = useState<SortOption>('rank');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);

  // PWA install prompt handler
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstallPwa, setCanInstallPwa] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPwa(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setCanInstallPwa(false);
    }
    setDeferredPrompt(null);
  };

  // Filtered & Sorted platforms
  const filteredPlatforms = useMemo(() => {
    let list = [...platforms];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.affiliatedBy.toLowerCase().includes(q) ||
          p.badges.some((b) => b.toLowerCase().includes(q))
      );
    }

    // Badge filter
    if (selectedBadge !== 'all') {
      list = list.filter((p) =>
        p.badges.some((b) => b.toLowerCase() === selectedBadge.toLowerCase())
      );
    }

    // Favorites only
    if (favoritesOnly) {
      list = list.filter((p) => favoriteIds.includes(p.id));
    }

    // Sorting
    list.sort((a, b) => {
      if (sortOption === 'rank') {
        return a.place - b.place;
      }
      if (sortOption === 'rating') {
        return b.ratingScore - a.ratingScore;
      }
      if (sortOption === 'clicks') {
        return b.clicksCount - a.clicksCount;
      }
      if (sortOption === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return list;
  }, [platforms, searchQuery, selectedBadge, favoritesOnly, sortOption, favoriteIds]);

  const totalClicksCount = useMemo(() => {
    return clickRecords.reduce((sum, r) => sum + r.clicks, 0);
  }, [clickRecords]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border-b border-emerald-900/40 px-4 py-2 text-center text-xs text-emerald-300 flex flex-wrap items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>
          Welcome to <strong className="text-white font-mono">Trending Slot Bd</strong> — 47 verified platforms, instant bKash/Nagad payouts & integrated SQL Studio.
        </span>
        <button
          onClick={() => setActiveTab('sql')}
          className="underline hover:text-white font-bold inline-flex items-center gap-1 text-amber-300 ml-1 cursor-pointer"
        >
          <Database className="w-3 h-3 text-amber-400" />
          <span>Open SQL Database</span>
        </button>
        <span className="text-slate-600 hidden sm:inline">|</span>
        <a
          href="https://slot.gt.tc/?i=1"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white font-semibold inline-flex items-center gap-0.5 ml-1"
        >
          slot.gt.tc <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Main App Navigation Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalPlatforms={platforms.length}
        totalOffers={offers.length}
        totalClicks={totalClicksCount}
        onInstallPwa={handleInstallPwa}
        canInstallPwa={canInstallPwa}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {activeTab === 'directory' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* 2026 Modern Hero Section */}
            <HeroSection
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedBadge={selectedBadge}
              onSelectBadge={setSelectedBadge}
              favoritesOnly={favoritesOnly}
              onToggleFavoritesOnly={() => setFavoritesOnly((prev) => !prev)}
              favoritesCount={favoriteIds.length}
              totalPlatforms={platforms.length}
              filteredCount={filteredPlatforms.length}
            />

            {/* Filter & Controls Toolbar */}
            <FilterBar
              selectedBadge={selectedBadge}
              onBadgeSelect={setSelectedBadge}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              sortOption={sortOption}
              onSortChange={setSortOption}
              favoritesOnly={favoritesOnly}
              onToggleFavoritesOnly={() => setFavoritesOnly((prev) => !prev)}
              favoritesCount={favoriteIds.length}
              totalCount={filteredPlatforms.length}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* List / Grid Display */}
            {filteredPlatforms.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredPlatforms.map((platform) => (
                    <PlatformCard
                      key={platform.id}
                      platform={platform}
                      onSelect={setSelectedPlatform}
                      onToggleFavorite={toggleFavorite}
                      isFavorite={favoriteIds.includes(platform.id)}
                    />
                  ))}
                </div>
              ) : (
                <PlatformTable
                  platforms={filteredPlatforms}
                  onSelect={setSelectedPlatform}
                  onToggleFavorite={toggleFavorite}
                  favoriteIds={favoriteIds}
                />
              )
            ) : (
              /* Empty State */
              <div className="rounded-3xl bg-slate-900 border border-slate-800 p-12 text-center space-y-3 shadow-xl">
                <Compass className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="text-base font-bold text-white">No Portals Match Your Filter</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try clearing your search query or selecting &quot;All Portals&quot; to browse all 47 verified platforms.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedBadge('all');
                    setFavoritesOnly(false);
                  }}
                  className="rounded-xl bg-slate-800 hover:bg-slate-750 px-4 py-2 text-xs font-bold text-emerald-400 transition"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'offers' && <OffersView offers={offers} />}

        {activeTab === 'clicks' && (
          <ClicksDashboardView
            clickRecords={clickRecords}
            user={CURRENT_USER}
            platforms={platforms}
            onSelectPlatform={setSelectedPlatform}
          />
        )}

        {activeTab === 'messages' && (
          <MessagesView initialMessages={messages} user={CURRENT_USER} />
        )}

        {activeTab === 'sql' && <SqlStudioView />}
      </main>

      {/* Modal Dialog for Platform Details */}
      <PlatformDetailModal
        platform={selectedPlatform}
        onClose={() => setSelectedPlatform(null)}
        onToggleFavorite={toggleFavorite}
        isFavorite={selectedPlatform ? favoriteIds.includes(selectedPlatform.id) : false}
      />

      {/* Mobile Fixed Bottom Navigation for PWA Handheld Devices */}
      <MobileNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        totalPlatforms={platforms.length}
        totalOffers={offers.length}
        totalClicks={totalClicksCount}
      />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default App;
