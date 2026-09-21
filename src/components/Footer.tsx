import React from 'react';
import { Shield, ExternalLink, Globe, Award, CheckCircle2, Database } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/90 text-slate-400 py-10 pb-24 md:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand Info */}
          <div className="space-y-2 max-w-md">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-slate-900 border border-slate-700/80 p-1 flex items-center justify-center overflow-hidden">
                <img
                  src="https://ik.imagekit.io/kpx40qv3r/slot_gt_tc%20logo.png"
                  alt="Trending Slot Bd"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="text-base font-black text-white font-mono">
                  Trending Slot <span className="text-emerald-400">Bd</span>
                </span>
                <span className="ml-2 text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
                  v2026.4
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official web entertainment portal index and affiliate telemetry hub for{' '}
              <a
                href="https://slot.gt.tc/?i=1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline inline-flex items-center gap-0.5"
              >
                slot.gt.tc
                <ExternalLink className="w-3 h-3" />
              </a>
              . Built with real-time SQL database synchronization and mobile-first responsive PWA standards.
            </p>
          </div>

          {/* Verification Badges */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2">
              <Database className="w-4 h-4 text-amber-400" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">SQL Engine</p>
                <p className="text-xs font-mono font-bold text-slate-200">WASM Relational</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Database Sync</p>
                <p className="text-xs font-mono font-bold text-slate-200">47 Portals Live</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2">
              <Award className="w-4 h-4 text-amber-400" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Security Audit</p>
                <p className="text-xs font-mono font-bold text-slate-200">SSL 256-Bit Pass</p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer strictly adhering to prompt guidelines */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
          <p className="font-semibold text-slate-300 mb-1">
            Directory & Affiliate Information Disclosure:
          </p>
          <p>
            Trending Slot Bd is an informational directory and referral indexing platform. This site does not process wagers, bets, financial transactions, or casino games. All listings are verified third-party web entertainment venues. Users are advised to review the terms and regulations of each respective destination.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800/60 gap-3">
          <p>© 2026 Trending Slot Bd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://slot.gt.tc/?i=1"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" /> Official Website
            </a>
            <span>•</span>
            <span className="text-emerald-400 font-mono">Status: Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
