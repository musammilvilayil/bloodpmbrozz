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

  return (
    <section id="hero" className="relative overflow-hidden pt-5 pb-8 sm:pt-10 sm:pb-14 bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 border-b border-emerald-100/60">
      
      {/* Background Emerald Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[250px] sm:h-[320px] bg-emerald-200/35 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Top Community Badge */}
        <div className="flex justify-center mb-3 sm:mb-4">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white/95 border border-emerald-200 shadow-xs text-emerald-800 text-[11px] sm:text-sm font-bold backdrop-blur-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="truncate">പള്ളിമുക്ക് ബ്രദേഴ്സ് • Pallimukk Brothers</span>
            <span className="text-emerald-300">•</span>
            <span className="text-emerald-700 font-semibold">100% Free</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight font-['Outfit']">
            Blood Index <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">Pallimukk Brothers</span>
          </h1>
          <p className="mt-2 sm:mt-3 text-xs sm:text-base text-slate-600 leading-relaxed font-normal max-w-xl mx-auto">
            അടിയന്തര ഘട്ടങ്ങളിൽ ജീവൻ രക്ഷിക്കാൻ പള്ളിമുക്ക് ബ്രദേഴ്സിന്റെ രക്തദാന സൂചിക. 
            Find ready blood donors across Pallimukku, Kollam & Kerala.
          </p>

          {/* Call to Actions on Mobile: touch-friendly */}
          <div className="mt-4 sm:mt-6 flex flex-col xs:flex-row items-center justify-center gap-2.5">
            <button
              onClick={onScrollToSearch}
              className="w-full xs:w-auto flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 shadow-md shadow-emerald-600/25 transition cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Find Donors Now</span>
            </button>
            <button
              onClick={onOpenRegister}
              className="w-full xs:w-auto flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-emerald-50 active:scale-95 border border-emerald-200 shadow-xs transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-emerald-600" />
              <span>Register as Donor</span>
            </button>
          </div>

          <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[10px] sm:text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Direct Call & WhatsApp contact with voluntary donors</span>
          </div>
        </div>

        {/* Compact Green Stats Grid for Mobile */}
        <div className="mt-6 sm:mt-8 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3.5">
          
          {/* Stat 1: Total */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-emerald-100 shadow-xs">
            <div className="flex items-center gap-1.5 mb-1 text-slate-500">
              <div className="p-1 rounded-md bg-emerald-50 text-emerald-600">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Total Donors</span>
            </div>
            <div className="text-xl sm:text-3xl font-black text-slate-900 font-['Outfit']">
              {totalCount}
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400">Registered</p>
          </div>

          {/* Stat 2: Available Now */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-emerald-200 shadow-xs bg-emerald-50/20">
            <div className="flex items-center gap-1.5 mb-1 text-emerald-700">
              <div className="p-1 rounded-md bg-emerald-100 text-emerald-700">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Available Now</span>
            </div>
            <div className="text-xl sm:text-3xl font-black text-emerald-700 font-['Outfit'] flex items-center gap-1">
              <span>{availableCount}</span>
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[10px] sm:text-[11px] text-emerald-700 font-semibold">നാട്ടിലുണ്ട് (Ready)</p>
          </div>

          {/* Stat 3: Blood Groups */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-emerald-100 shadow-xs">
            <div className="flex items-center gap-1.5 mb-1 text-slate-500">
              <div className="p-1 rounded-md bg-emerald-50 text-emerald-600">
                <Droplet className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Blood Types</span>
            </div>
            <div className="text-xl sm:text-3xl font-black text-slate-900 font-['Outfit']">
              8 Groups
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400">A, B, AB, O (+/-)</p>
          </div>

          {/* Stat 4: Locations */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-emerald-100 shadow-xs">
            <div className="flex items-center gap-1.5 mb-1 text-slate-500">
              <div className="p-1 rounded-md bg-emerald-50 text-emerald-600">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Location</span>
            </div>
            <div className="text-xl sm:text-3xl font-black text-slate-900 font-['Outfit'] truncate">
              Pallimukku
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400">Kollam & Kerala</p>
          </div>

        </div>

      </div>
    </section>
  );
}
