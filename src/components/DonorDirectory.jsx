import React, { useState, useMemo } from 'react';
import { 
  Users, 
  RefreshCw, 
  AlertCircle, 
  ExternalLink,
  Droplet,
  RotateCcw
} from 'lucide-react';
import DonorCard from './DonorCard';
import { VALID_BLOOD_GROUPS } from '../../api/utils';

export default function DonorDirectory({ 
  donors = [], 
  loading = false, 
  isSyncing = false, 
  secondsAgo = 0, 
  autoSyncEnabled = true, 
  sheetStatus = "OK",
  onRefresh, 
  onOpenRemoval, 
  onOpenRegister 
}) {
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('ALL');

  // Filter donors strictly by selected blood group
  const filteredDonors = useMemo(() => {
    let list = donors;
    if (selectedBloodGroup !== 'ALL') {
      list = donors.filter(d => d.bloodGroup === selectedBloodGroup);
    }

    // Sort available donors first for emergency convenience
    return [...list].sort((a, b) => {
      if (a.isAvailable !== b.isAvailable) {
        return a.isAvailable ? -1 : 1;
      }
      return (b.rowIndex || 0) - (a.rowIndex || 0);
    });
  }, [donors, selectedBloodGroup]);

  // Group counts for blood group pills
  const bloodGroupCounts = useMemo(() => {
    const counts = { ALL: donors.length };
    VALID_BLOOD_GROUPS.forEach(bg => {
      counts[bg] = donors.filter(d => d.bloodGroup === bg).length;
    });
    return counts;
  }, [donors]);

  return (
    <section id="donors-section" className="py-6 sm:py-10 bg-slate-50 border-t border-emerald-100/60">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-1.5">
              <Droplet className="w-3.5 h-3.5 text-emerald-700" />
              <span>Blood Group Filter • രക്തഗ്രൂപ്പ് തിരഞ്ഞെടുക്കുക</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
              Blood Donor Directory
            </h2>
            <p className="mt-0.5 text-slate-600 text-xs sm:text-sm">
              താഴെ നൽകിയിട്ടുള്ള രക്തഗ്രൂപ്പിൽ ക്ലിക്ക് ചെയ്ത് ആവശ്യമായ ഡോണർമാരെ നേരിട്ട് കണ്ടെത്താം.
            </p>
          </div>

          {/* Sync status & Refresh */}
          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-emerald-200 text-slate-700 text-[11px] font-semibold">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${autoSyncEnabled ? 'bg-emerald-400' : 'bg-slate-300'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${autoSyncEnabled ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
              </span>
              <span>15s Live</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">{secondsAgo === 0 ? "now" : `${secondsAgo}s`}</span>
            </div>

            <button
              onClick={onRefresh}
              disabled={loading || isSyncing}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>
        </div>

        {/* 1. Dedicated Blood Group Filter Box (ONLY Blood Group Filtering) */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-xs border border-emerald-100 mb-5">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>Select Blood Group:</span>
            </label>
            {selectedBloodGroup !== 'ALL' && (
              <button
                onClick={() => setSelectedBloodGroup('ALL')}
                className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Show All Groups ({donors.length})</span>
              </button>
            )}
          </div>

          {/* Blood Group Pills Grid (Swipeable on mobile, wrapped on desktop) */}
          <div className="flex flex-nowrap sm:flex-wrap items-center gap-2 overflow-x-auto no-scrollbar -mx-3.5 px-3.5 sm:mx-0 sm:px-0 pb-1 touch-pan-x">
            {/* ALL */}
            <button
              onClick={() => setSelectedBloodGroup('ALL')}
              className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer active:scale-95 ${
                selectedBloodGroup === 'ALL'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-[1.02]'
                  : 'bg-emerald-50/80 text-slate-700 hover:bg-emerald-100/80 border border-emerald-200'
              }`}
            >
              <span>All Groups</span>
              <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                selectedBloodGroup === 'ALL' ? 'bg-emerald-700 text-white' : 'bg-white text-slate-600'
              }`}>
                {bloodGroupCounts.ALL || 0}
              </span>
            </button>

            {/* 8 Blood Groups: A+, A-, B+, B-, AB+, AB-, O+, O- */}
            {VALID_BLOOD_GROUPS.map(bg => {
              const count = bloodGroupCounts[bg] || 0;
              const isSelected = selectedBloodGroup === bg;
              return (
                <button
                  key={bg}
                  onClick={() => setSelectedBloodGroup(bg)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-[1.02]'
                      : 'bg-emerald-50/80 text-slate-700 hover:bg-emerald-100/80 border border-emerald-200'
                  }`}
                >
                  <span className="text-sm sm:text-base font-['Outfit']">{bg}</span>
                  <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                    isSelected ? 'bg-emerald-700 text-white' : 'bg-white text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Directory Results Counter */}
        <div className="flex items-center justify-between mb-3.5 px-1">
          <p className="text-xs sm:text-sm font-semibold text-slate-700">
            {selectedBloodGroup === 'ALL' ? (
              <>Showing all <strong className="text-emerald-800 font-bold">{filteredDonors.length}</strong> donors</>
            ) : (
              <>Showing <strong className="text-emerald-800 font-bold">{filteredDonors.length}</strong> donors with blood group <strong className="text-emerald-700 px-1.5 py-0.5 bg-emerald-100 rounded-md">{selectedBloodGroup}</strong></>
            )}
          </p>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Pallimukk Brothers</span>
          </div>
        </div>

        {/* Google Sheet Access Notice if restricted */}
        {sheetStatus === 'RESTRICTED_401' && (
          <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-amber-800/90 text-xs">
                Google Sheet access is restricted. Make sure General Access in Google Sheet is set to <strong>"Anyone with the link" (Viewer)</strong>.
              </p>
            </div>
            <a
              href="https://docs.google.com/spreadsheets/d/1zDtsboLMoDs8NMgDqmUFxedtULj5HasnXsCQdSXGVI0/edit"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-3 py-1.5 rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-white text-xs flex items-center gap-1"
            >
              <span>Sheet Settings</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Donor Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
            {[1, 2].map(i => (
              <div key={i} className="animate-pulse bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-emerald-100 shadow-xs space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-200"></div>
                    <div className="space-y-1.5">
                      <div className="h-4 w-24 bg-slate-200 rounded"></div>
                      <div className="h-3 w-16 bg-slate-100 rounded"></div>
                    </div>
                  </div>
                  <div className="w-10 h-7 rounded-lg bg-slate-200"></div>
                </div>
                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <div className="h-10 bg-slate-200 rounded-xl"></div>
                  <div className="h-10 bg-slate-100 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredDonors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
            {filteredDonors.map(donor => (
              <DonorCard 
                key={donor.id} 
                donor={donor} 
                onOpenRemoval={onOpenRemoval}
              />
            ))}
          </div>
        ) : (
          /* Empty Blood Group State */
          <div className="text-center py-10 px-4 bg-white rounded-2xl sm:rounded-3xl border border-emerald-100 shadow-xs max-w-sm mx-auto">
            <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1 font-['Outfit']">
              No {selectedBloodGroup} Donors Registered Yet
            </h3>
            <p className="text-xs text-slate-600 mb-3.5">
              Currently there are no donors registered with blood group <strong>{selectedBloodGroup}</strong>.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                onClick={() => setSelectedBloodGroup('ALL')}
                className="w-full sm:w-auto px-4 py-2 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs cursor-pointer"
              >
                View All Donors
              </button>
              <button
                onClick={onOpenRegister}
                className="w-full sm:w-auto px-4 py-2 rounded-xl font-bold text-xs text-slate-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 cursor-pointer"
              >
                Be First {selectedBloodGroup} Donor
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
