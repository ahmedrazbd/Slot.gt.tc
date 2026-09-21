import React, { useState } from 'react';
import { Platform } from '../types';
import {
  Star,
  ExternalLink,
  ShieldCheck,
  Eye,
  Sparkles,
  Trophy,
  Flame,
  Zap,
  Check,
  Copy,
} from 'lucide-react';

interface PlatformCardProps {
  platform: Platform;
  onSelect: (platform: Platform) => void;
  onToggleFavorite: (id: number) => void;
  isFavorite: boolean;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({
  platform,
  onSelect,
  onToggleFavorite,
  isFavorite,
}) => {
  const [imageError, setImageError] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Safe external click handling
  const handleVisit = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(platform.ctaUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(platform.ctaUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500/25 to-yellow-500/10 border border-amber-400/50 px-3 py-0.5 text-xs font-black text-amber-300 shadow-sm shadow-amber-500/10">
          <Trophy className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>#1 TOP PICK</span>
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="flex items-center gap-1.5 rounded-full bg-slate-300/15 border border-slate-300/40 px-3 py-0.5 text-xs font-bold text-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-slate-300" />
          <span>#2 PREMIER</span>
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="flex items-center gap-1.5 rounded-full bg-amber-700/20 border border-amber-600/40 px-3 py-0.5 text-xs font-bold text-amber-400">
          <span>#3 ELITE</span>
        </span>
      );
    }
    if (rank <= 10) {
      return (
        <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-400 font-mono">
          #{rank} TOP 10
        </span>
      );
    }
    return (
      <span className="rounded-full bg-slate-800/90 border border-slate-700/70 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-slate-400">
        #{rank}
      </span>
    );
  };

  return (
    <div
      onClick={() => onSelect(platform)}
      className="group relative flex flex-col justify-between rounded-3xl bg-slate-900/90 border border-slate-800/90 hover:border-emerald-500/50 hover:bg-slate-850/90 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 p-5 cursor-pointer"
    >
      {/* Top Header: Rank & Partner & Favorite */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          {getRankBadge(platform.place)}
          <span className="text-[10px] text-slate-400 font-mono bg-slate-800/60 px-2 py-0.5 rounded-md">
            ID: {platform.affiliatedBy}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleCopyLink}
            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition"
            title="Copy portal referral link"
          >
            {copiedLink ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(platform.id);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition"
            aria-label="Toggle bookmark"
          >
            <Star
              className={`w-4 h-4 ${
                isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-500'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Info: Logo + Title + Rating Bar */}
      <div className="flex items-start gap-4 my-4">
        {/* Logo Container */}
        <div className="h-14 w-14 shrink-0 rounded-2xl bg-slate-950/80 border border-slate-700/80 overflow-hidden flex items-center justify-center p-1.5 shadow-md group-hover:border-emerald-500/40 transition">
          {!imageError && platform.logo ? (
            <img
              src={platform.logo}
              alt={platform.name}
              onError={() => setImageError(true)}
              referrerPolicy="no-referrer"
              loading="lazy"
              className="h-full w-full object-contain filter drop-shadow-xs group-hover:scale-105 transition duration-200"
            />
          ) : (
            <span className="text-base font-black text-emerald-400 font-mono">
              {platform.name.substring(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-black text-white group-hover:text-emerald-400 transition truncate font-mono">
              {platform.name}
            </h3>
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>

          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center text-amber-400 text-xs font-black">
              <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
              <span>{platform.rating}</span>
            </div>
            <span className="text-slate-700">•</span>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Fast Pay
            </span>
          </div>

          {/* Trust Score Bar */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                style={{ width: `${Math.min(100, Math.round(platform.ratingScore * 20))}%` }}
              />
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-400">
              {Math.min(100, Math.round(platform.ratingScore * 20))}%
            </span>
          </div>
        </div>
      </div>

      {/* Badges Chips */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {platform.badges.map((b) => (
          <span
            key={b}
            className="rounded-lg bg-slate-800/80 border border-slate-700/60 px-2.5 py-1 text-[10px] font-bold text-slate-300"
          >
            {b}
          </span>
        ))}
        {platform.clicksCount >= 3 && (
          <span className="flex items-center gap-1 rounded-lg bg-rose-500/15 border border-rose-500/30 px-2 py-1 text-[10px] font-bold text-rose-400">
            <Flame className="w-3 h-3 fill-rose-400" /> Hot Pick
          </span>
        )}
      </div>

      {/* Bottom Action Row */}
      <div className="flex items-center gap-2 pt-3.5 border-t border-slate-800/80">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(platform);
          }}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 px-3.5 py-2.5 text-xs font-bold text-slate-200 border border-slate-700/60 transition"
        >
          <Eye className="w-3.5 h-3.5 text-slate-400" />
          <span>Inspect</span>
        </button>

        <button
          onClick={handleVisit}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 px-3.5 py-2.5 text-xs font-black text-slate-950 shadow-md shadow-emerald-500/20 transition active:scale-95"
        >
          <span>Play Now</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
