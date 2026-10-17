import React, { useEffect } from 'react';
import { 
  Heart, 
  Bell, 
  X, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  AlertCircle 
} from 'lucide-react';

export default function LiveToast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 6000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isNewDonor = toast.type === 'new_donor';
  const isStatusChange = toast.type === 'status_change';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className={`relative overflow-hidden rounded-2xl p-4 shadow-2xl border backdrop-blur-md ${
        isNewDonor 
          ? 'bg-slate-900/95 text-white border-emerald-500/40 ring-1 ring-emerald-500/30' 
          : 'bg-white/95 text-slate-900 border-slate-200 ring-1 ring-emerald-500/20'
      }`}>
        
        {/* Subtle accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${
          isNewDonor 
            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 animate-pulse' 
            : 'bg-emerald-500'
        }`} />

        <div className="flex items-start gap-3 mt-1">
          <div className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${
            isNewDonor 
              ? 'bg-emerald-600/30 text-emerald-400' 
              : 'bg-emerald-100 text-emerald-700'
          }`}>
            {isNewDonor ? (
              <Heart className="w-5 h-5 fill-emerald-500 text-emerald-500 animate-pulse" />
            ) : (
              <RefreshCw className="w-5 h-5 text-emerald-600 animate-spin" />
            )}
          </div>

          <div className="flex-1 pr-2">
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isNewDonor ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {toast.badge || "Live Update"}
              </span>
              <span className="text-[11px] text-slate-400">Just now</span>
            </div>

            <h4 className="text-sm font-bold mt-1 leading-snug">
              {toast.title}
            </h4>
            
            <p className={`text-xs mt-0.5 leading-relaxed ${
              isNewDonor ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {toast.message}
            </p>
          </div>

          <button
            onClick={onDismiss}
            className={`p-1.5 rounded-lg transition shrink-0 ${
              isNewDonor 
                ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
            }`}
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
