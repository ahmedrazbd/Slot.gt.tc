import React, { useState } from 'react';
import { ClickRecord, UserProfile, Platform } from '../types';
import { MousePointerClick, Users, TrendingUp, Copy, Check, Share2, BarChart2, Award, ArrowUpRight } from 'lucide-react';

interface ClicksDashboardViewProps {
  clickRecords: ClickRecord[];
  user: UserProfile;
  platforms: Platform[];
  onSelectPlatform: (platform: Platform) => void;
}

export const ClicksDashboardView: React.FC<ClicksDashboardViewProps> = ({
  clickRecords,
  user,
  platforms,
  onSelectPlatform,
}) => {
  const [activeRefCode, setActiveRefCode] = useState(user.refCode);
  const [copiedLink, setCopiedLink] = useState(false);

  const currentRecord =
    clickRecords.find((r) => r.refCode === activeRefCode) || clickRecords[0];

  const fullReferralLink = `https://slot.gt.tc/?ref=${activeRefCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullReferralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Build sorted list of platform clicks
  const platformClickList = Object.entries(currentRecord.platforms)
    .map(([platformIdStr, count]) => {
      const pId = parseInt(platformIdStr, 10);
      const matchedPlatform = platforms.find((p) => p.id === pId);
      return {
        id: pId,
        name: matchedPlatform?.name || `Platform #${pId}`,
        logo: matchedPlatform?.logo,
        place: matchedPlatform?.place || pId,
        rating: matchedPlatform?.rating || '4.0/5',
        count,
        platform: matchedPlatform,
      };
    })
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Overview Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                Affiliate Referral & Click Telemetry
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Real-time analytics recorded by the SlotGT referral tracker (`clicks` database engine). Track user clicks, portal redirections, and affiliate engagement.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {clickRecords.map((r) => (
              <button
                key={r.refCode}
                onClick={() => setActiveRefCode(r.refCode)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition border ${
                  activeRefCode === r.refCode
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
              >
                {r.refCode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Clicks Tracked</span>
            <MousePointerClick className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-mono font-black text-white pt-1">
            {currentRecord.clicks}
          </p>
          <span className="text-[11px] text-emerald-400">
            Last logged: {currentRecord.updatedAt.split(' ')[0]}
          </span>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Confirmed Signups</span>
            <Users className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-3xl font-mono font-black text-white pt-1">
            {currentRecord.signups}
          </p>
          <span className="text-[11px] text-slate-400">
            Conversion rate: {currentRecord.clicks > 0 ? ((currentRecord.signups / currentRecord.clicks) * 100).toFixed(1) : 0}%
          </span>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Platforms Tracked</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-mono font-black text-white pt-1">
            {Object.keys(currentRecord.platforms).length}
          </p>
          <span className="text-[11px] text-slate-400">
            Across 47 directory hubs
          </span>
        </div>
      </div>

      {/* Shareable Link Generator */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>Your Affiliate Referral Link</span>
          </h3>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            Active Code: {activeRefCode}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="flex-1 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 truncate">
            {fullReferralLink}
          </div>
          <button
            onClick={handleCopy}
            className="rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 text-xs font-bold text-slate-950 transition active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5" /> Copied Link!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Link
              </>
            )}
          </button>
        </div>
      </div>

      {/* Platform Click Leaderboard Breakdown */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Platform Click Distribution Breakdown</span>
          </h3>
          <span className="text-xs text-slate-400">
            Click counts by portal ID
          </span>
        </div>

        <div className="space-y-2.5">
          {platformClickList.map((item) => {
            const maxClicks = 4;
            const pct = Math.min(100, Math.round((item.count / maxClicks) * 100));

            return (
              <div
                key={item.id}
                onClick={() => item.platform && onSelectPlatform(item.platform)}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-850 hover:border-slate-700 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-[200px]">
                  <span className="h-6 w-6 rounded-md bg-slate-800 text-[11px] font-mono font-bold flex items-center justify-center text-slate-300">
                    #{item.place}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-white hover:text-emerald-400 transition">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-slate-400">Rating: {item.rating}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="flex-1 max-w-md flex items-center gap-3">
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-400 shrink-0">
                    {item.count} clicks
                  </span>
                </div>

                <ArrowUpRight className="w-4 h-4 text-slate-500 hidden sm:block shrink-0" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
