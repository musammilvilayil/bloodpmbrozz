import React from 'react';
import { 
  Heart, 
  Search, 
  UserPlus, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Users, 
  Droplet,
  Sparkles
} from 'lucide-react';

export default function Hero({ stats, onOpenRegister, onScrollToSearch }) {
  const totalCount = stats?.totalDonors || 0;
  const availableCount = stats?.availableNow || 0;
  const districtCount = Object.keys(stats?.districts || {}).length || 1;
  const activeBloodTypes = Object.values(stats?.bloodGroups || {}).filter(c => c > 0).length || 1;

  return (
    <section id="hero" className="relative overflow-hidden pt-6 pb-10 sm:pt-10 sm:pb-14 bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 border-b border-emerald-100/60">
      
      {/* Background Emerald Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[320px] bg-emerald-200/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-8 right-8 w-64 h-64 bg-teal-200/30 rounded-full blur-2xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Community Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-emerald-200 shadow-xs text-emerald-800 text-xs sm:text-sm font-bold backdrop-blur-sm">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <span>പള്ളിമുക്ക് ബ്രദേഴ്സ് • Pallimukk Brothers Initiative</span>
            <span className="hidden sm:inline-block text-emerald-300">|</span>
            <span className="hidden sm:inline-block text-emerald-700 font-semibold">100% Free Blood Help</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] font-['Outfit']">
            Blood Index <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">Pallimukk Brothers</span>
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            അടിയന്തര ഘട്ടങ്ങളിൽ ജീവൻ രക്ഷിക്കാൻ പള്ളിമുക്ക് ബ്രദേഴ്സിന്റെ റിയൽ-ടൈം രക്തദാന സൂചിക. 
            Find ready blood donors across Pallimukku, Kollam & Kerala in seconds.
          </p>

          {/* Call to Actions */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onScrollToSearch}
              className="flex items-center justify-center gap-2.5 px-7 py-3 rounded-2xl text-sm sm:text-base font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-600/25 transform transition hover:-translate-y-0.5 active:translate-y-0"
            >
              <Search className="w-4 h-4" />
              <span>Find Donors Now</span>
            </button>
            <button
              onClick={onOpenRegister}
              className="flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl text-sm sm:text-base font-bold text-slate-700 bg-white hover:bg-emerald-50 border-2 border-emerald-200 hover:border-emerald-300 shadow-xs transform transition hover:-translate-y-0.5 active:translate-y-0"
            >
              <UserPlus className="w-4 h-4 text-emerald-600" />
              <span>Register as Donor</span>
            </button>
          </div>

          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Direct Call & WhatsApp access to consenting donors</span>
          </div>
        </div>

        {/* Compact Green Stats Grid */}
        <div className="mt-8 sm:mt-10 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Stat 1: Total */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-emerald-100 shadow-xs hover:border-emerald-300 transition">
            <div className="flex items-center gap-2 mb-1.5 text-slate-500">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Donors</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit']">
              {totalCount}
            </div>
            <p className="mt-0.5 text-[11px] text-slate-500">Registered</p>
          </div>

          {/* Stat 2: Available Now */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-emerald-200 shadow-xs hover:border-emerald-400 transition bg-emerald-50/20">
            <div className="flex items-center gap-2 mb-1.5 text-emerald-700">
              <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider">Available Now</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-['Outfit'] flex items-center gap-1.5">
              <span>{availableCount}</span>
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="mt-0.5 text-[11px] text-emerald-700 font-semibold">നാട്ടിലുണ്ട് (Ready)</p>
          </div>

          {/* Stat 3: Blood Groups */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-emerald-100 shadow-xs hover:border-emerald-300 transition">
            <div className="flex items-center gap-2 mb-1.5 text-slate-500">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <Droplet className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider">Blood Groups</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit']">
              8 Types
            </div>
            <p className="mt-0.5 text-[11px] text-slate-500">A, B, AB, O (+ / -)</p>
          </div>

          {/* Stat 4: Locations */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-emerald-100 shadow-xs hover:border-emerald-300 transition">
            <div className="flex items-center gap-2 mb-1.5 text-slate-500">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider">Location</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit']">
              Pallimukku
            </div>
            <p className="mt-0.5 text-[11px] text-slate-500">Kollam & Kerala</p>
          </div>

        </div>

      </div>
    </section>
  );
}
