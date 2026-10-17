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
  CheckCircle2 
} from 'lucide-react';
import DonorCard from './DonorCard';
import { VALID_BLOOD_GROUPS, KERALA_DISTRICTS } from '../../api/utils';

export default function DonorDirectory({ 
  donors = [], 
  loading = false, 
  isSyncing = false,
  secondsAgo = 0,
  autoSyncEnabled = true,
  onToggleAutoSync,
  onRefresh, 
  onOpenRemoval,
  onOpenRegister 
}) {
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL'); // 'ALL' | 'AVAILABLE' | 'UNAVAILABLE'
  const [searchQuery, setSearchQuery] = useState('');

  // Filter donors based on user choices
  const filteredDonors = useMemo(() => {
    return donors.filter(donor => {
      // 1. Blood Group
      if (selectedBloodGroup !== 'ALL' && donor.bloodGroup !== selectedBloodGroup) {
        return false;
      }
      
      // 2. District
      if (selectedDistrict !== 'ALL') {
        const donorDist = (donor.district || '').toLowerCase();
        if (!donorDist.includes(selectedDistrict.toLowerCase())) {
          return false;
        }
      }

      // 3. Availability
      if (availabilityFilter === 'AVAILABLE' && !donor.isAvailable) {
        return false;
      }
      if (availabilityFilter === 'UNAVAILABLE' && donor.isAvailable) {
        return false;
      }

      // 4. Search query (matches name or district)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = (donor.name || '').toLowerCase().includes(q);
        const distMatch = (donor.district || '').toLowerCase().includes(q);
        const bgMatch = (donor.bloodGroup || '').toLowerCase().includes(q);
        if (!nameMatch && !distMatch && !bgMatch) {
          return false;
        }
      }

      return true;
    });
  }, [donors, selectedBloodGroup, selectedDistrict, availabilityFilter, searchQuery]);

  // Group counts for the blood group pills
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
  };

  const hasActiveFilters = selectedBloodGroup !== 'ALL' || selectedDistrict !== 'ALL' || availabilityFilter !== 'ALL' || searchQuery !== '';

  return (
    <section id="donors-section" className="py-12 lg:py-16 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Searchable Donor Directory</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
              Find Emergency Donors
            </h2>
            <p className="mt-1 text-slate-600 text-sm sm:text-base">
              Filter by blood group, Kerala district, and real-time availability to reach ready life-savers.
            </p>
          </div>

          {/* Dynamic Real-time Sync Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${autoSyncEnabled ? 'bg-emerald-400' : 'bg-slate-300'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${autoSyncEnabled ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
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
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-red-600/20 transition transform hover:-translate-y-0.5 active:translate-y-0"
              title="Force immediate refresh from Google Sheets"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 mb-8 space-y-6">
          
          {/* 1. Blood Group Selection Pills */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Blood Group:
              </label>
              <span className="text-xs text-slate-400">All 8 Blood Types</span>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              <button
                onClick={() => setSelectedBloodGroup('ALL')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  selectedBloodGroup === 'ALL'
                    ? 'bg-red-600 text-white shadow-md shadow-red-500/25 scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>All Groups</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[11px] ${
                  selectedBloodGroup === 'ALL' ? 'bg-red-700 text-white' : 'bg-white text-slate-600'
                }`}>
                  {bloodGroupCounts.ALL || 0}
                </span>
              </button>

              {VALID_BLOOD_GROUPS.map(bg => {
                const count = bloodGroupCounts[bg] || 0;
                const isSelected = selectedBloodGroup === bg;
                return (
                  <button
                    key={bg}
                    onClick={() => setSelectedBloodGroup(bg)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      isSelected
                        ? 'bg-red-600 text-white shadow-md shadow-red-500/25 scale-105'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{bg}</span>
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                      isSelected ? 'bg-red-700 text-white' : 'bg-white text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Secondary Filters: Search, District, Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            
            {/* Search Input */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Search Donor or Place
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Musammil, Kollam..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all bg-slate-50/50"
                />
              </div>
            </div>

            {/* Kerala District Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                District / Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all bg-slate-50/50 appearance-none"
                >
                  <option value="ALL">All Kerala Districts</option>
                  {KERALA_DISTRICTS.map(dist => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Availability Filter Toggle */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Availability Status
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setAvailabilityFilter('ALL')}
                  className={`py-2 rounded-lg transition-all ${
                    availabilityFilter === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setAvailabilityFilter('AVAILABLE')}
                  className={`py-2 rounded-lg transition-all ${
                    availabilityFilter === 'AVAILABLE' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Available
                </button>
                <button
                  type="button"
                  onClick={() => setAvailabilityFilter('UNAVAILABLE')}
                  className={`py-2 rounded-lg transition-all ${
                    availabilityFilter === 'UNAVAILABLE' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Resting
                </button>
              </div>
            </div>

          </div>

          {/* Active Filter Chips & Reset Bar */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-500">Active filters:</span>
                {selectedBloodGroup !== 'ALL' && (
                  <span className="px-2.5 py-1 rounded-md bg-red-100 text-red-700 font-bold">
                    Group: {selectedBloodGroup}
                  </span>
                )}
                {selectedDistrict !== 'ALL' && (
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                    District: {selectedDistrict}
                  </span>
                )}
                {availabilityFilter !== 'ALL' && (
                  <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                    {availabilityFilter === 'AVAILABLE' ? 'Available Only' : 'Resting Only'}
                  </span>
                )}
                {searchQuery && (
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                    Query: "{searchQuery}"
                  </span>
                )}
              </div>

              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 font-bold text-red-600 hover:text-red-700 hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}

        </div>

        {/* Directory Results Counter */}
        <div className="flex items-center justify-between mb-6 px-1">
          <p className="text-sm font-semibold text-slate-600">
            Showing <span className="font-bold text-slate-900">{filteredDonors.length}</span> of {donors.length} registered donors
          </p>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Real-time Sync Active</span>
            <span className="text-slate-300">•</span>
            <span>Auto-refreshes every 15s</span>
          </div>
        </div>

        {/* Donor Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-200"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-28 bg-slate-200 rounded"></div>
                      <div className="h-3 w-20 bg-slate-100 rounded"></div>
                    </div>
                  </div>
                  <div className="w-12 h-8 rounded-xl bg-slate-200"></div>
                </div>
                <div className="h-4 w-36 bg-slate-100 rounded"></div>
                <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <div className="h-10 bg-slate-200 rounded-xl"></div>
                  <div className="h-10 bg-slate-100 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredDonors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonors.map(donor => (
              <DonorCard 
                key={donor.id} 
                donor={donor} 
                onOpenRemoval={onOpenRemoval}
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-xl mx-auto">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 font-['Outfit']">
              No Donors Found Matching Filter
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
              We couldn't find any donors matching blood group <strong className="text-red-600">{selectedBloodGroup}</strong> {selectedDistrict !== 'ALL' && `in ${selectedDistrict}`}. Try broadening your search or resetting filters.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleResetFilters}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-red-600 hover:bg-red-700 shadow-md"
              >
                Clear All Filters
              </button>
              <button
                onClick={onOpenRegister}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200"
              >
                Be the First {selectedBloodGroup !== 'ALL' ? selectedBloodGroup : ''} Donor
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
