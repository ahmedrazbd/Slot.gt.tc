import React, { useState } from 'react';
import { Platform } from '../types';
import { Star, ExternalLink, ShieldCheck, Trophy, Eye } from 'lucide-react';

interface PlatformTableProps {
  platforms: Platform[];
  onSelect: (platform: Platform) => void;
  onToggleFavorite: (id: number) => void;
  favoriteIds: number[];
}

export const PlatformTable: React.FC<PlatformTableProps> = ({
  platforms,
  onSelect,
  onToggleFavorite,
  favoriteIds,
}) => {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/90 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <tr>
              <th scope="col" className="py-3.5 px-4 w-16 text-center">Rank</th>
              <th scope="col" className="py-3.5 px-4">Platform Portal</th>
              <th scope="col" className="py-3.5 px-3 text-center">Rating</th>
              <th scope="col" className="py-3.5 px-4 hidden md:table-cell">Badges & Specs</th>
              <th scope="col" className="py-3.5 px-3 text-center hidden sm:table-cell">Affiliate Tag</th>
              <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-medium">
            {platforms.map((p) => {
              const isFav = favoriteIds.includes(p.id);
              return (
                <tr
                  key={p.id}
                  onClick={() => onSelect(p)}
                  className="hover:bg-slate-850/70 transition cursor-pointer group"
                >
                  {/* Rank Column */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                        p.place === 1
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-xs'
                          : p.place === 2
                          ? 'bg-slate-400/20 text-slate-200 border border-slate-400/40'
                          : p.place === 3
                          ? 'bg-amber-700/20 text-amber-400 border border-amber-700/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {p.place}
                    </span>
                  </td>

                  {/* Name & Crest */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 shrink-0 rounded-lg bg-slate-800 border border-slate-700/60 overflow-hidden flex items-center justify-center p-0.5">
                        {p.logo ? (
                          <img
                            src={p.logo}
                            alt={p.name}
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <span className="text-xs font-bold text-emerald-400">
                            {p.name.substring(0, 2)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-sm group-hover:text-emerald-400 transition truncate">
                            {p.name}
                          </span>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        </div>
                        <span className="text-[10px] text-slate-400 block sm:hidden">
                          {p.affiliatedBy}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="py-3.5 px-3 text-center">
                    <div className="inline-flex items-center gap-1 font-bold text-amber-400 font-mono text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{p.rating}</span>
                    </div>
                  </td>

                  {/* Badges */}
                  <td className="py-3.5 px-4 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {p.badges.map((badge) => (
                        <span
                          key={badge}
                          className="rounded-md bg-slate-800 border border-slate-700/50 px-2 py-0.5 text-[10px] text-slate-300"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Affiliate Tag */}
                  <td className="py-3.5 px-3 text-center hidden sm:table-cell font-mono text-[11px] text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-750">
                      {p.affiliatedBy}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onToggleFavorite(p.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition"
                        aria-label="Bookmark"
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            isFav ? 'fill-amber-400 text-amber-400' : 'text-slate-500'
                          }`}
                        />
                      </button>

                      <button
                        onClick={() => onSelect(p)}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
                        aria-label="View details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <a
                        href={p.ctaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 px-2.5 py-1 text-xs font-bold text-slate-950 transition active:scale-95"
                      >
                        <span>Visit</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
