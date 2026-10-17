import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  MapPin, 
  Users, 
  Sparkles, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2,
  ExternalLink,
  ArrowUpDown,
  Clock,
  ShieldCheck,
  Check
} from 'lucide-react';
import DonorCard from './DonorCard';
import { VALID_BLOOD_GROUPS, KERALA_DISTRICTS } from '../../api/utils';

export default function DonorDirectory({ 
  donors = [], 
  loading = false, 
  isSyncing = false,
  secondsAgo = 0,
  autoSyncEnabled = true,
  sheetStatus = "OK",
  onToggleAutoSync,
  onRefresh, 
  onOpenRemoval, 
  onOpenRegister 
}) {
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL'); // 'ALL' | 'AVAILABLE' | 'UNAVAILABLE'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('READY_FIRST'); // 'READY_FIRST' | 'RECENT' | 'NAME_AZ'

  // Filter & sort donors based on user selections
  const filteredAndSortedDonors = useMemo(() => {
    // 1. Filtering
    const list = donors.filter(donor => {
      // Blood Group filter
      if (selectedBloodGroup !== 'ALL' && donor.bloodGroup !== selectedBloodGroup) {
        return false;
      }
      
      // District / Location filter
      if (selectedDistrict !== 'ALL') {
        const donorDist = (donor.district || '').toLowerCase();
        const donorRes = (donor.currentResidence || '').toLowerCase();
        
        if (selectedDistrict === 'PALLIMUKKU_KOLLAM') {
          const match = donorDist.includes('kollam') || 
                        donorDist.includes('pallimukk') || 
                        donorRes.includes('kollam') || 
                        donorRes.includes('pallimukk');
          if (!match) return false;
        } else if (selectedDistrict === 'OUTSIDE') {
          const isOutside = donorDist.includes('outside') || 
                            donorDist.includes('പുറത്ത') || 
                            donorRes.includes('പുറത്ത') ||
                            donorRes.includes('outside') ||
                            donorRes.includes('abroad');
          if (!isOutside) return false;
        } else {
          if (!donorDist.includes(selectedDistrict.toLowerCase())) {
            return false;
          }
        }
      }

      // Availability status filter
      if (availabilityFilter === 'AVAILABLE' && !donor.isAvailable) {
        return false;
      }
      if (availabilityFilter === 'UNAVAILABLE' && donor.isAvailable) {
        return false;
      }

      // Search query (name, phone, district, blood group)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = (donor.name || '').toLowerCase().includes(q);
        const distMatch = (donor.district || '').toLowerCase().includes(q);
        const bgMatch = (donor.bloodGroup || '').toLowerCase().includes(q);
        const phoneMatch = (donor.phone || donor.mobileNumber || '').replace(/[^\d]/g, '').includes(q.replace(/[^\d]/g, ''));
        
        if (!nameMatch && !distMatch && !bgMatch && !phoneMatch) {
          return false;
        }
      }

      return true;
    });

    // 2. Sorting
    return list.sort((a, b) => {
      if (sortBy === 'READY_FIRST') {
        // Available donors first
        if (a.isAvailable !== b.isAvailable) {
          return a.isAvailable ? -1 : 1;
        }
        return (b.rowIndex || 0) - (a.rowIndex || 0); // Newest second
      } else if (sortBy === 'RECENT') {
        return (b.rowIndex || 0) - (a.rowIndex || 0);
      } else if (sortBy === 'NAME_AZ') {
        return (a.name || '').localeCompare(b.name || '');
      }
      return 0;
    });
  }, [donors, selectedBloodGroup, selectedDistrict, availabilityFilter, searchQuery, sortBy]);

  // Group counts for blood group pills
  const bloodGroupCounts = useMemo(() => {
    const counts = { ALL: donors.length };
    VALID_BLOOD_GROUPS.forEach(bg => {
      counts[bg] = donors.filter(d => d.bloodGroup === bg).length;
    });
    return counts;
  }, [donors]);

  const handleResetFilters = () => {
    setSelectedBloodGroup('ALL');
    setSelectedDistrict('ALL');
    setAvailabilityFilter('ALL');
    setSearchQuery('');
    setSortBy('READY_FIRST');
  };

  const hasActiveFilters = selectedBloodGroup !== 'ALL' || 
                           selectedDistrict !== 'ALL' || 
                           availabilityFilter !== 'ALL' || 
                           searchQuery !== '' || 
                           sortBy !== 'READY_FIRST';

  return (
    <section id="donors-section" className="py-8 sm:py-12 bg-slate-50 border-t border-emerald-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5 text-emerald-700" />
              <span>Blood Index • പള്ളിമുക്ക് ബ്രദേഴ്സ്</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
              Emergency Donor Index
            </h2>
            <p className="mt-1 text-slate-600 text-xs sm:text-sm">
              Sort and filter by blood group, real-time availability, and location to connect with ready donors instantly.
            </p>
          </div>

          {/* Real-time Dynamic Sync Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-xs font-semibold text-slate-700 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${autoSyncEnabled ? 'bg-emerald-400' : 'bg-slate-300'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${autoSyncEnabled ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
              </span>
              <span>
                {autoSyncEnabled ? (
                  <>Auto-Sync: <strong className="text-emerald-700">15s Live</strong></>
                ) : (
                  <>Auto-Sync: <strong className="text-slate-500">Paused</strong></>
                )}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] text-slate-500">
                {secondsAgo === 0 ? "Synced just now" : `Synced ${secondsAgo}s ago`}
              </span>
            </div>

            <button
              onClick={onRefresh}
              disabled={loading || isSyncing}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              title="Force immediate refresh from Google Sheets"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Box */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xs border border-emerald-100 mb-6 space-y-5">
          
          {/* 1. Blood Group Sort/Filter Pills */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>Select Blood Group (രക്തഗ്രൂപ്പ്):</span>
              </label>
              <span className="text-xs text-slate-400 font-medium">Click group to filter instantly</span>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {/* ALL */}
              <button
                onClick={() => setSelectedBloodGroup('ALL')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedBloodGroup === 'ALL'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-[1.02]'
                    : 'bg-emerald-50/70 text-slate-700 hover:bg-emerald-100/70 border border-emerald-100'
                }`}
              >
                <span>All Groups</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[11px] ${
                  selectedBloodGroup === 'ALL' ? 'bg-emerald-700 text-white' : 'bg-white text-slate-600'
                }`}>
                  {bloodGroupCounts.ALL || 0}
                </span>
              </button>

              {/* 8 Blood Groups */}
              {VALID_BLOOD_GROUPS.map(bg => {
                const count = bloodGroupCounts[bg] || 0;
                const isSelected = selectedBloodGroup === bg;
                return (
                  <button
                    key={bg}
                    onClick={() => setSelectedBloodGroup(bg)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-[1.02]'
                        : 'bg-emerald-50/70 text-slate-700 hover:bg-emerald-100/70 border border-emerald-100'
                    }`}
                  >
                    <span>{bg}</span>
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                      isSelected ? 'bg-emerald-700 text-white' : 'bg-white text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Secondary Filter Ideas (Search, Location, Availability, Sorter) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-4 border-t border-slate-100">
            
            {/* Filter Idea 1: Search Input */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Search Donor or Phone
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Musammil, Kollam, 9747..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-slate-50/50"
                />
              </div>
            </div>

            {/* Filter Idea 2: Location / District Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Location / District
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full pl-9 pr-7 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-slate-50/50 appearance-none cursor-pointer"
                >
                  <option value="ALL">All Districts / Places</option>
                  <option value="PALLIMUKKU_KOLLAM">📍 Pallimukku & Kollam</option>
                  <option disabled>──────────</option>
                  {KERALA_DISTRICTS.map(dist => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                  <option disabled>──────────</option>
                  <option value="OUTSIDE">Outside Kerala / Abroad</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Filter Idea 3: Availability Status Toggle */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Availability Status
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setAvailabilityFilter('ALL')}
                  className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                    availabilityFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setAvailabilityFilter('AVAILABLE')}
                  className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                    availabilityFilter === 'AVAILABLE' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Available
                </button>
                <button
                  type="button"
                  onClick={() => setAvailabilityFilter('UNAVAILABLE')}
                  className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                    availabilityFilter === 'UNAVAILABLE' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Resting
                </button>
              </div>
            </div>

            {/* Filter Idea 4: Smart Sorter */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Sort Order (ക്രമപ്പെടുത്തുക)
              </label>
              <div className="relative">
                <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-9 pr-7 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-slate-50/50 appearance-none cursor-pointer"
                >
                  <option value="READY_FIRST">🟢 Ready / Available First</option>
                  <option value="RECENT">🕒 Recently Registered</option>
                  <option value="NAME_AZ">🔤 Donor Name (A → Z)</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

          </div>

          {/* Active Filter Chips & Reset Bar */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-semibold text-slate-400">Active filters:</span>
                {selectedBloodGroup !== 'ALL' && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                    Group: {selectedBloodGroup}
                  </span>
                )}
                {selectedDistrict !== 'ALL' && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                    Place: {selectedDistrict === 'PALLIMUKKU_KOLLAM' ? 'Pallimukku & Kollam' : selectedDistrict}
                  </span>
                )}
                {availabilityFilter !== 'ALL' && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                    {availabilityFilter === 'AVAILABLE' ? 'Available Only' : 'Resting Only'}
                  </span>
                )}
                {searchQuery && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                    Search: "{searchQuery}"
                  </span>
                )}
                {sortBy !== 'READY_FIRST' && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                    Sorted by: {sortBy === 'RECENT' ? 'Newest' : 'Name'}
                  </span>
                )}
              </div>

              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            </div>
          )}

        </div>

        {/* Directory Results Counter */}
        <div className="flex items-center justify-between mb-4 px-1">
          <p className="text-xs sm:text-sm font-semibold text-slate-600">
            Showing <strong className="text-emerald-800 font-bold">{filteredAndSortedDonors.length}</strong> of {donors.length} registered donors
          </p>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Pallimukk Brothers Live Sync</span>
          </div>
        </div>

        {/* Google Sheet Access Notice if restricted */}
        {sheetStatus === 'RESTRICTED_401' && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Google Sheet Permission Notice (401 Restricted):</p>
                <p className="text-amber-800/90 mt-0.5 leading-relaxed">
                  Google Sheet access is restricted. Make sure General Access in Google Sheet is set to <strong>"Anyone with the link" (Viewer)</strong> for live updates.
                </p>
              </div>
            </div>
            <a
              href="https://docs.google.com/spreadsheets/d/1zDtsboLMoDs8NMgDqmUFxedtULj5HasnXsCQdSXGVI0/edit"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-3.5 py-1.5 rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-white transition text-xs flex items-center gap-1.5"
            >
              <span>Sheet Settings</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Donor Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-slate-200"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-28 bg-slate-200 rounded"></div>
                      <div className="h-3 w-20 bg-slate-100 rounded"></div>
                    </div>
                  </div>
                  <div className="w-12 h-8 rounded-xl bg-slate-200"></div>
                </div>
                <div className="h-4 w-36 bg-slate-100 rounded"></div>
                <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <div className="h-9 bg-slate-200 rounded-xl"></div>
                  <div className="h-9 bg-slate-100 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedDonors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAndSortedDonors.map(donor => (
              <DonorCard 
                key={donor.id} 
                donor={donor} 
                onOpenRemoval={onOpenRemoval}
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="text-center py-12 px-4 bg-white rounded-3xl border border-emerald-100 shadow-xs max-w-md mx-auto">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1 font-['Outfit']">
              No Donors Found
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xs mx-auto mb-4">
              No donors matching {selectedBloodGroup !== 'ALL' && <strong className="text-emerald-700">{selectedBloodGroup} </strong>}
              with current filters. Try resetting filters or register as a donor!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                onClick={handleResetFilters}
                className="w-full sm:w-auto px-4 py-2 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs cursor-pointer"
              >
                Reset All Filters
              </button>
              <button
                onClick={onOpenRegister}
                className="w-full sm:w-auto px-4 py-2 rounded-xl font-bold text-xs text-slate-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 cursor-pointer"
              >
                Register as Donor
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
