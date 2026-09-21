import React, { useEffect, useState } from 'react';
import { Platform } from '../types';
import { X, Star, ExternalLink, ShieldCheck, Copy, Check, Info, Award, Globe, Link2, TrendingUp } from 'lucide-react';

interface PlatformDetailModalProps {
  platform: Platform | null;
  onClose: () => void;
  onToggleFavorite: (id: number) => void;
  isFavorite: boolean;
}

export const PlatformDetailModal: React.FC<PlatformDetailModalProps> = ({
  platform,
  onClose,
  onToggleFavorite,
  isFavorite,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!platform) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(platform.ctaUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="platform-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/85 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-t-3xl sm:rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-xs font-bold font-mono">
              #{platform.place} Rank
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Tag: {platform.affiliatedBy}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleFavorite(platform.id)}
              className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition"
              aria-label="Toggle bookmark"
            >
              <Star
                className={`w-4 h-4 ${
                  isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-500'
                }`}
              />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Platform Identity */}
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-slate-800 border border-slate-700/80 overflow-hidden flex items-center justify-center p-2 shadow-inner shrink-0">
              {platform.logo ? (
                <img
                  src={platform.logo}
                  alt={platform.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-xl font-black text-emerald-400">
                  {platform.name.substring(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 id="platform-modal-title" className="text-lg font-bold text-white truncate">
                  {platform.name}
                </h3>
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>

              <div className="flex items-center gap-3 mt-1 text-xs">
                <span className="flex items-center text-amber-400 font-bold font-mono">
                  <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                  {platform.rating} Score
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-semibold">
                  Verified Active
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            {platform.description ||
              'Verified gaming and web entertainment portal curated in our partner directory. Meets quality standards for response latency and device compatibility.'}
          </p>

          {/* Highlights & Badges */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Verified Tags & Certifications
            </h4>
            <div className="flex flex-wrap gap-2">
              {platform.badges.map((b) => (
                <span
                  key={b}
                  className="flex items-center gap-1 rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-200"
                >
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  {b}
                </span>
              ))}
              <span className="flex items-center gap-1 rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-200">
                <Globe className="w-3.5 h-3.5 text-teal-400" /> Web & Mobile
              </span>
            </div>
          </div>

          {/* Directory Specs Matrix */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Leaderboard Position
              </span>
              <span className="text-base font-bold text-white font-mono mt-0.5 block">
                Rank #{platform.place} of 47
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Partner Affiliation
              </span>
              <span className="text-base font-bold text-emerald-400 font-mono mt-0.5 block">
                {platform.affiliatedBy}
              </span>
            </div>
          </div>

          {/* Direct CTA URL Preview with Copy */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Link2 className="w-3.5 h-3.5 text-emerald-400" />
                Direct Referral Destination
              </span>
              <button
                onClick={handleCopyLink}
                className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 text-[11px]"
              >
                {copiedUrl ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" /> Copied URL
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copy Link
                  </>
                )}
              </button>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 truncate">
              {platform.ctaUrl}
            </div>
          </div>

          {/* Harmless Safety Notice */}
          <div className="flex items-start gap-2.5 rounded-xl bg-slate-950/80 p-3 border border-slate-800 text-[11px] text-slate-400">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              Directory listing for educational and informational reference. Arena/SlotGT hosts no wagering or transactions.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 text-xs font-bold text-slate-200 transition"
          >
            Close
          </button>
          <a
            href={platform.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 py-2.5 text-xs font-bold text-slate-950 shadow-md transition active:scale-95"
          >
            <span>Open Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
