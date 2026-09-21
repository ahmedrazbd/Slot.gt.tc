import React, { useState } from 'react';
import { Offer } from '../types';
import { Tag, Copy, Check, Clock, ShieldCheck, Gift, Search, Sparkles } from 'lucide-react';

interface OffersViewProps {
  offers: Offer[];
}

export const OffersView: React.FC<OffersViewProps> = ({ offers }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [inputCode, setInputCode] = useState('');
  const [validationResult, setValidationResult] = useState<{
    status: 'idle' | 'valid' | 'invalid';
    message: string;
  }>({ status: 'idle', message: '' });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCheckCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    const matched = offers.find(
      (o) => o.code.toUpperCase() === inputCode.trim().toUpperCase()
    );

    if (matched) {
      setValidationResult({
        status: 'valid',
        message: `Verified Promo Code: "${matched.code}" is ACTIVE (${matched.description}).`,
      });
    } else {
      setValidationResult({
        status: 'invalid',
        message: `Code "${inputCode}" not found in current directory database. Check spelling or try CRYPTO50.`,
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                Exclusive Partner Vouchers & Promo Codes
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Official partner discount codes and promotional vouchers recorded in the SlotGT directory database. Copy any code to claim perks across registered platforms.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 shrink-0">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Available Codes</p>
              <p className="text-xl font-mono font-bold text-emerald-400">
                {offers.filter((o) => o.active).length} Active
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Code Validator Widget */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Voucher Validator Tool</span>
        </h3>
        <form onSubmit={handleCheckCode} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter voucher code (e.g. CRYPTO50, YFIKV)..."
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 uppercase font-mono font-bold"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 text-xs font-bold text-slate-950 transition active:scale-95 shrink-0"
          >
            Verify Code
          </button>
        </form>

        {validationResult.status !== 'idle' && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
              validationResult.status === 'valid'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            {validationResult.status === 'valid' ? (
              <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <Tag className="w-4 h-4 shrink-0 text-rose-400" />
            )}
            <span>{validationResult.message}</span>
          </div>
        )}
      </div>

      {/* Offers Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Tag className="w-4 h-4 text-emerald-400" />
          <span>Verified Database Promo Codes</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="relative flex flex-col justify-between rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-sm hover:border-slate-700 transition"
            >
              {/* Badge & Expiry */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                  <ShieldCheck className="w-3 h-3" /> Active Voucher
                </span>

                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>
                    {offer.expiresAt
                      ? `Exp: ${offer.expiresAt.split(' ')[0]}`
                      : 'No Expiry'}
                  </span>
                </div>
              </div>

              {/* Promo Code Display */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-dashed border-slate-700 flex items-center justify-between">
                <span className="font-mono text-base font-black tracking-widest text-amber-300">
                  {offer.code}
                </span>
                <button
                  onClick={() => handleCopy(offer.code)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-emerald-400 bg-slate-800 hover:bg-slate-750 px-2.5 py-1 rounded-lg transition"
                >
                  {copiedCode === offer.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-200">
                  {offer.description}
                </p>
                <p className="text-[11px] text-slate-500">
                  Target: {offer.targetUserId === 'all' ? 'All Registered Users' : offer.targetUserId}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
