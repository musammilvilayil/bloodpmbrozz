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
  const [searchTerm, setSearchTerm] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);

  // Filter donors strictly by selected blood group
  const filteredDonors = useMemo(() => {
    let list = donors;
    if (selectedBloodGroup !== 'ALL') {
      list = donors.filter(d => d.bloodGroup === selectedBloodGroup);
    }

    if (searchTerm.trim()) list = list.filter(d => [d.name, d.district, d.currentResidence].some(v => String(v || '').toLowerCase().includes(searchTerm.trim().toLowerCase())));
    if (availableOnly) list = list.filter(d => d.isAvailable);
    // Sort available donors first for emergency convenience
    return [...list].sort((a, b) => {
      if (a.isAvailable !== b.isAvailable) {
        return a.isAvailable ? -1 : 1;
      }
      return (b.rowIndex || 0) - (a.rowIndex || 0);
    });
  }, [donors, selectedBloodGroup, searchTerm, availableOnly]);


  const consentedDonors = filteredDonors.filter(d => (d.allowCall && d.phone) || (d.allowWhatsApp && d.whatsapp));
  const chosenDonors = consentedDonors.filter(d => selectedContacts.includes(String(d.id)));
  const shareList = [
    '🩸 *Pallimukk Brothers — Blood Donor Contacts*',
    ...chosenDonors.map((d, i) => [
      `${i + 1}. *${d.name}* (${d.bloodGroup})`,
      `📍 ${d.district || 'Mynagappally'}`,
      ...(d.allowCall && d.phone ? [`📞 ${d.phone}`] : []),
      ...(d.allowWhatsApp && d.whatsapp ? [`💬 WhatsApp: ${d.whatsapp}`] : [])
    ].join('\\n')),
    'https://bloodpmbrozz.vercel.app'
  ].join('\\n\\n');
  const toggleContact = id => setSelectedContacts(current => current.includes(String(id)) ? current.filter(x => x !== String(id)) : [...current, String(id)]);
  const shareContacts = () => {
    if (!chosenDonors.length) return;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareList)}`, '_blank', 'noopener,noreferrer');
  };
  const copyContacts = async () => {
    if (!chosenDonors.length) return;
    try { await navigator.clipboard.writeText(shareList); } catch { /* Clipboard permission denied */ }
  };

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
    <section id="donors-section" className="py-6 sm:py-10 bg-slate-50 border-t border-emerald-100/60">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4 sm:mb-6">
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
        <div className="bg-white rounded-3xl p-3.5 sm:p-5 card-native border border-emerald-100/90 mb-4">
          <div className="flex items-center justify-between mb-3 px-1">
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

          {/* Liquid Blood Droplets Bar (Horizontal momentum scroll on mobile, wrapped on desktop) */}
          <div className="flex flex-nowrap sm:flex-wrap items-center gap-2.5 overflow-x-auto no-scrollbar -mx-3.5 px-3.5 sm:mx-0 sm:px-0 py-1.5 touch-pan-x">
            
            {/* ALL Capsule */}
            <button
              onClick={() => handleSelectBloodGroup('ALL')}
              className={`relative overflow-hidden shrink-0 flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-2xl font-black transition-all cursor-pointer touch-spring ${
                selectedBloodGroup === 'ALL'
                  ? 'bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500/50 scale-[1.03]'
                  : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 border border-slate-200/90'
              }`}
            >
              {/* Subtle liquid meniscus indicator */}
              {selectedBloodGroup === 'ALL' && (
                <div className="absolute inset-x-0 bottom-0 h-1 bg-white/40 animate-pulse"></div>
              )}
              <span className="text-xs sm:text-sm">All Donors</span>
              <span className={`px-2 py-0.5 rounded-xl text-xs font-black ${
                selectedBloodGroup === 'ALL' ? 'bg-white/20 text-white backdrop-blur-xs' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {bloodGroupCounts.ALL || 0}
              </span>
            </button>

            {/* 8 Liquid Droplet Capsules: A+, A-, B+, B-, AB+, AB-, O+, O- */}
            {VALID_BLOOD_GROUPS.map(bg => {
              const count = bloodGroupCounts[bg] || 0;
              const isSelected = selectedBloodGroup === bg;
              return (
                <button
                  key={bg}
                  onClick={() => handleSelectBloodGroup(bg)}
                  className={`relative overflow-hidden shrink-0 flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-2xl font-black transition-all cursor-pointer touch-spring ${
                    isSelected
                      ? 'bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500/50 scale-[1.03]'
                      : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 border border-slate-200/90'
                  }`}
                >
                  {/* Liquid drop visual glow when selected */}
                  {isSelected && (
                    <>
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-white/40 animate-pulse"></div>
                      <Droplet className="w-3.5 h-3.5 fill-white text-white animate-liquid-wave" />
                    </>
                  )}
                  
                  <span className="text-sm sm:text-base font-['Outfit'] tracking-wide">{bg}</span>
                  
                  <span className={`px-2 py-0.5 rounded-xl text-xs font-black ${
                    isSelected ? 'bg-white/20 text-white backdrop-blur-xs' : 'bg-emerald-100/90 text-emerald-800'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}

          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-emerald-100 shadow-sm mb-4">
          <label htmlFor="donor-search" className="block text-sm font-extrabold text-slate-900 mb-2">Search donors by name or location</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" aria-hidden="true" />
            <input id="donor-search" type="search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              placeholder="Name, town or district" className="w-full h-12 pl-10 pr-4 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900" />
          </div>
          <label className="flex items-center gap-2 mt-3 text-sm font-semibold text-slate-700">
            <input type="checkbox" checked={availableOnly} onChange={e => setAvailableOnly(e.target.checked)} className="w-4 h-4 accent-emerald-600" />
            Available donors only
          </label>
          <p className="text-xs text-slate-500 mt-2">{filteredDonors.length} matching donors</p>
        </div>

        <div className="rounded-3xl bg-emerald-950 text-white p-4 sm:p-5 mb-4">
          <h3 className="font-extrabold flex items-center gap-2"><Share2 className="w-4 h-4" /> Share selected donors</h3>
          <p className="text-xs text-emerald-100 mt-1">Select donor cards below to share their permitted contact details.</p>
          <div className="flex items-center gap-2 mt-3">
            <button type="button" onClick={() => setSelectedContacts(consentedDonors.map(d => String(d.id)))} className="px-3 py-2 rounded-xl bg-white/15 text-xs font-bold">Select all ({consentedDonors.length})</button>
            <button type="button" onClick={() => setSelectedContacts([])} className="px-3 py-2 rounded-xl bg-white/10 text-xs font-bold">Clear</button>
            <span className="ml-auto text-xs font-bold">{chosenDonors.length} selected</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button type="button" disabled={!chosenDonors.length} onClick={shareContacts} className="h-11 rounded-xl bg-emerald-500 text-emerald-950 font-extrabold text-xs sm:text-sm disabled:opacity-40">WhatsApp Share</button>
            <button type="button" disabled={!chosenDonors.length} onClick={copyContacts} className="h-11 rounded-xl bg-white/15 text-white font-bold text-xs sm:text-sm disabled:opacity-40 flex justify-center items-center gap-2"><Copy className="w-4 h-4" /> Copy List</button>
          </div>
        </div>
        {/* 2. One-Tap Share to WhatsApp Status & Groups Component */}
        <WhatsAppStatusShare selectedBloodGroup={selectedBloodGroup} />

        {/* Directory Results Counter Bar */}
        <div className="flex items-center justify-between mb-3.5 px-1">
          <p className="text-xs sm:text-sm font-semibold text-slate-700">
            {selectedBloodGroup === 'ALL' ? (
              <>Showing all <strong className="text-emerald-800 font-bold">{filteredDonors.length}</strong> donors in index</>
            ) : (
              <>Showing <strong className="text-emerald-800 font-bold">{filteredDonors.length}</strong> donors with group <strong className="text-emerald-700 px-2 py-0.5 bg-emerald-100 rounded-lg">{selectedBloodGroup}</strong></>
            )}
          </p>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold">
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
