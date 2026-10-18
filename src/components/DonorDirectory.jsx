import React, { useState, useMemo } from 'react';
import { 
  Users, 
  RefreshCw, 
  AlertCircle, 
  ExternalLink,
  Droplet,
  RotateCcw,
  Sparkles,
  Heart,
  Search,
  Share2,
  Copy
} from 'lucide-react';
import DonorCard from './DonorCard';
import WhatsAppStatusShare from './WhatsAppStatusShare';
import { VALID_BLOOD_GROUPS } from '../../api/utils';
import { tactileTap } from '../utils/haptics';

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

  const handleSelectBloodGroup = (bg) => {
    tactileTap('light');
    setSelectedBloodGroup(bg);
  };

  const handleResetBloodGroup = () => {
    tactileTap('medium');
    setSelectedBloodGroup('ALL');
  };

  return (
    <section id="donors-section" className="py-3 sm:py-7 bg-slate-50 border-t border-emerald-100/60">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-3 sm:mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-black uppercase tracking-wider mb-1.5 border border-emerald-200">
              <Droplet className="w-3.5 h-3.5 text-emerald-700 animate-liquid-wave" />
              <span>രക്തഗ്രൂപ്പ് ഫിൽട്ടർ • മൈനാഗപ്പള്ളി പള്ളിമുക്ക്</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit'] tracking-tight">
              Blood Donor Directory
            </h2>
            <p className="mt-1 text-slate-600 text-xs sm:text-sm font-malayalam">
              ആവശ്യമായ രക്തഗ്രൂപ്പ് ടാപ്പ് ചെയ്ത് മൈനാഗപ്പള്ളിയിലെ ഡോണർമാരെ നേരിട്ട് കണ്ടെത്താം.
            </p>
          </div>

          {/* Sync status & Refresh with Haptics */}
          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border border-emerald-200 text-slate-700 text-[11px] font-bold shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${autoSyncEnabled ? 'bg-emerald-400' : 'bg-slate-300'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${autoSyncEnabled ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
              </span>
              <span>15s Live</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700">{secondsAgo === 0 ? "now" : `${secondsAgo}s`}</span>
            </div>

            <button
              onClick={() => {
                tactileTap('medium');
                if (onRefresh) onRefresh();
              }}
              disabled={loading || isSyncing}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 touch-spring text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
            </button>
          </div>
        </div>

        {/* 1. Interactive Liquid Droplets Blood Group Selector */}
        <div className="bg-white rounded-2xl p-2.5 sm:p-4 card-native border border-emerald-100/90 mb-3">
          <div className="flex items-center justify-between mb-2 px-1">
            <label className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
              <Droplet className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span>Select Blood Group (രക്തഗ്രൂപ്പ് തിരഞ്ഞെടുക്കുക):</span>
            </label>
            {selectedBloodGroup !== 'ALL' && (
              <button
                onClick={handleResetBloodGroup}
                className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 touch-spring active:scale-95 cursor-pointer bg-emerald-50 px-2.5 py-1 rounded-xl"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Show All ({donors.length})</span>
              </button>
            )}
          </div>

          <div className="mb-2 flex items-center justify-between gap-2">
            <button type="button" onClick={() => handleSelectBloodGroup('ALL')} className={`rounded-xl px-4 py-2 text-xs font-bold ${selectedBloodGroup === 'ALL' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800'}`}>All donors ({donors.length})</button>
            <span className="text-[10px] sm:text-xs text-slate-500">Tap a group to see names</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-4 xl:grid-cols-8 gap-1.5 sm:gap-3">
            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
              <button type="button" key={bg} onClick={() => handleSelectBloodGroup(bg)} aria-pressed={selectedBloodGroup === bg}
                className={`min-w-0 rounded-xl border px-1 py-2 sm:py-3 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600 ${selectedBloodGroup === bg ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200 text-[#071A2E] hover:border-emerald-400'}`}>
                <span className="block text-lg sm:text-2xl font-black tracking-tight">{bg}</span>
                <span className="block text-sm sm:text-lg font-extrabold mt-0.5">{bloodGroupCounts[bg] || 0}</span>
                <span className={`block text-[9px] sm:text-[11px] ${selectedBloodGroup === bg ? 'text-emerald-50' : 'text-slate-500'}`}>Donors</span>
              </button>
            ))}
          </div>
        </div>

        <div aria-live="polite" className="flex items-center justify-between gap-2 mb-3 rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2.5">
          <div>
            <h3 className="text-sm sm:text-lg font-extrabold text-[#071A2E]">{selectedBloodGroup === 'ALL' ? 'All Registered Donors' : `${selectedBloodGroup} Donors`}</h3>
            <p className="text-xs text-emerald-800">{loading ? 'Loading donor names...' : `${filteredDonors.length} donor${filteredDonors.length === 1 ? '' : 's'} listed below`}</p>
          </div>
          <span className="text-emerald-700 text-xl" aria-hidden="true">↓</span>
        </div>

        {/* Directory Results Counter Bar */}
        <div className="flex items-center justify-between mb-3.5 px-1">
          <p className="text-xs sm:text-sm font-semibold text-slate-700">
            {selectedBloodGroup === 'ALL' ? (
              <>Showing all <strong className="text-emerald-800 font-bold">{filteredDonors.length}</strong> donors in index</>
            ) : (
              <>Showing <strong className="text-emerald-800 font-bold">{filteredDonors.length}</strong> donors with group <strong className="text-emerald-700 px-2 py-0.5 bg-emerald-100 rounded-lg">{selectedBloodGroup}</strong></>
            )}
          </p>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Mynagappally Pallimukku</span>
          </div>
        </div>

        {/* Google Sheet Access Notice if restricted */}
        {sheetStatus === 'RESTRICTED_401' && (
          <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row items-start sm:center justify-between gap-2.5">
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
              <div key={i} className="animate-pulse bg-white rounded-3xl p-5 card-native border border-emerald-100 shadow-xs space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="w-11 h-11 rounded-2xl bg-slate-200"></div>
                    <div className="space-y-1.5">
                      <div className="h-4 w-28 bg-slate-200 rounded"></div>
                      <div className="h-3 w-16 bg-slate-100 rounded"></div>
                    </div>
                  </div>
                  <div className="w-12 h-8 rounded-xl bg-slate-200"></div>
                </div>
                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <div className="h-11 bg-slate-200 rounded-2xl"></div>
                  <div className="h-11 bg-slate-100 rounded-2xl"></div>
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
          <div className="text-center py-10 px-4 bg-white rounded-3xl card-native border border-emerald-100 max-w-sm mx-auto">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Droplet className="w-7 h-7 text-emerald-600 animate-liquid-wave" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 font-['Outfit']">
              No {selectedBloodGroup} Donors Registered Yet
            </h3>
            <p className="text-xs text-slate-600 mb-4 font-malayalam">
              മൈനാഗപ്പള്ളിയിൽ {selectedBloodGroup} രക്തഗ്രൂപ്പുള്ളവർ ഇതുവരെ രജിസ്റ്റർ ചെയ്തിട്ടില്ല. നിങ്ങൾക്കോ സുഹൃത്തുക്കൾക്കോ രജിസ്റ്റർ ചെയ്യാം!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                onClick={handleResetBloodGroup}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 touch-spring shadow-xs cursor-pointer"
              >
                View All Donors
              </button>
              <button
                onClick={() => {
                  tactileTap('light');
                  onOpenRegister();
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 touch-spring cursor-pointer"
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
