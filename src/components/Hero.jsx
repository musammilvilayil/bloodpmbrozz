import React from 'react';
import { 
  Droplet, 
  UserPlus, 
  Users, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  PhoneCall,
  Activity
} from 'lucide-react';
import { tactileTap } from '../utils/haptics';

export default function Hero({ stats, onOpenRegister, onScrollToSearch }) {
  const totalCount = stats?.totalDonors || 0;
  const availableCount = stats?.availableNow || 0;

  return (
    <section id="hero" className="relative overflow-hidden pt-4 pb-6 sm:pt-10 sm:pb-12 bg-gradient-to-b from-emerald-50/80 via-white to-slate-50 border-b border-emerald-100/70">
      
      {/* Background Emerald Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[340px] sm:w-[640px] h-[220px] sm:h-[300px] bg-gradient-to-b from-emerald-200/40 via-teal-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Top Community Badge */}
        <div className="flex justify-center mb-3 sm:mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white/95 border border-emerald-200 shadow-xs text-emerald-900 text-[11px] sm:text-xs font-black backdrop-blur-md">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <span className="truncate font-malayalam">പള്ളിമുക്ക് ബ്രദേഴ്സ്, മൈനാഗപ്പള്ളി</span>
            <span className="text-emerald-300">•</span>
            <span className="text-emerald-700 font-bold uppercase tracking-wider text-[10px]">100% Voluntary</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight font-['Outfit']">
            Blood Index <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">Pallimukk Brothers</span>
          </h1>
          <p className="mt-2 text-xs sm:text-base text-slate-600 leading-relaxed font-normal max-w-xl mx-auto font-malayalam">
            അടിയന്തര ഘട്ടങ്ങളിൽ ജീവൻ രക്ഷിക്കാൻ പള്ളിമുക്ക് ബ്രദേഴ്സ് മൈനാഗപ്പള്ളിയുടെ രക്തദാന സൂചിക. 
            Find ready blood donors across Mynagappally, Kollam & Kerala.
          </p>

          {/* Call to Actions on Mobile: touch-spring buttons */}
          <div className="mt-4 sm:mt-6 flex flex-col xs:flex-row items-center justify-center gap-2.5 max-w-md mx-auto">
            <button
              onClick={() => {
                tactileTap('medium');
                onScrollToSearch();
              }}
              className="w-full xs:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 touch-spring shadow-md shadow-emerald-600/25 transition cursor-pointer"
            >
              <Droplet className="w-4 h-4 fill-white animate-liquid-wave" />
              <span>View Blood Groups</span>
            </button>
            
            <button
              onClick={() => {
                tactileTap('light');
                onOpenRegister();
              }}
              className="w-full xs:w-auto flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black text-slate-800 bg-white hover:bg-emerald-50 active:scale-95 touch-spring border border-emerald-200 shadow-xs transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-emerald-600" />
              <span>Register as Donor</span>
            </button>
          </div>

          <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Direct Call & WhatsApp contact with voluntary donors</span>
          </div>
        </div>

        {/* Punchy Segmented Native Stats Strip */}
        <div className="mt-5 sm:mt-8 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3.5">
          
          {/* Stat 1: Total Donors */}
          <div 
            onClick={() => {
              tactileTap('light');
              onScrollToSearch();
            }}
            className="bg-white/95 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 card-native border border-slate-200/80 hover:border-emerald-300 transition touch-spring cursor-pointer"
          >
            <div className="flex items-center gap-1.5 mb-1 text-slate-500">
              <div className="p-1 rounded-lg bg-emerald-50 text-emerald-600">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider">Total Donors</span>
            </div>
            <div className="text-xl sm:text-3xl font-black text-slate-900 font-['Outfit']">
              {totalCount}
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Verified in Sheet</p>
          </div>

          {/* Stat 2: Available Now (Highlighted) */}
          <div 
            onClick={() => {
              tactileTap('light');
              onScrollToSearch();
            }}
            className="bg-emerald-50/70 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 card-native border border-emerald-300/80 shadow-xs hover:border-emerald-400 transition touch-spring cursor-pointer"
          >
            <div className="flex items-center gap-1.5 mb-1 text-emerald-800">
              <div className="p-1 rounded-lg bg-emerald-600 text-white">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider">Available Now</span>
            </div>
            <div className="text-xl sm:text-3xl font-black text-emerald-700 font-['Outfit'] flex items-center gap-1.5">
              <span>{availableCount}</span>
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[10px] sm:text-[11px] text-emerald-800 font-bold font-malayalam">നാട്ടിലുണ്ട് (Ready)</p>
          </div>

          {/* Stat 3: Blood Groups */}
          <div 
            onClick={() => {
              tactileTap('light');
              onScrollToSearch();
            }}
            className="bg-white/95 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 card-native border border-slate-200/80 hover:border-emerald-300 transition touch-spring cursor-pointer"
          >
            <div className="flex items-center gap-1.5 mb-1 text-slate-500">
              <div className="p-1 rounded-lg bg-emerald-50 text-emerald-600">
                <Droplet className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider">Blood Types</span>
            </div>
            <div className="text-xl sm:text-3xl font-black text-slate-900 font-['Outfit']">
              8 Groups
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">A, B, AB, O (+/-)</p>
          </div>

          {/* Stat 4: Location */}
          <div className="bg-white/95 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 card-native border border-slate-200/80">
            <div className="flex items-center gap-1.5 mb-1 text-slate-500">
              <div className="p-1 rounded-lg bg-emerald-50 text-emerald-600">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider">Location</span>
            </div>
            <div className="text-xl sm:text-3xl font-black text-slate-900 font-['Outfit'] truncate">
              Mynagappally
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-bold">Pallimukku, Kollam</p>
          </div>

        </div>

      </div>
    </section>
  );
}
