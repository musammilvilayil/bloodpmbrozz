import React from 'react';
import { 
  Heart, 
  Search, 
  UserPlus, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Users, 
  Flame 
} from 'lucide-react';

export default function Hero({ stats, onOpenRegister, onScrollToSearch }) {
  const totalCount = stats?.totalDonors || 1;
  const availableCount = stats?.availableNow || 1;
  const districtCount = Object.keys(stats?.districts || { "Kollam": 1 }).length || 1;
  const groupCount = Object.values(stats?.bloodGroups || {}).filter(c => c > 0).length || 1;

  return (
    <section id="hero" className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-red-50/70 via-white to-slate-50">
      
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-red-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-rose-200/30 rounded-full blur-2xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Emergency Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-red-200 shadow-sm shadow-red-500/5 text-red-700 text-xs sm:text-sm font-bold backdrop-blur-sm">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
            </span>
            <span>Blood PM Brozz • Verified Community Blood Network</span>
            <span className="hidden sm:inline-block text-slate-300">|</span>
            <span className="hidden sm:inline-block text-slate-600 font-medium">Free & Non-Profit</span>
          </div>
        </div>

        {/* Main Headings */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] font-['Outfit']">
            Connecting <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-red-700">Life-Savers</span> in Critical Moments
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
            Find consenting blood donors across Kerala in seconds during medical emergencies. 
            Direct phone and WhatsApp coordination with real-time availability updates.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onScrollToSearch}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-red-600 via-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-xl shadow-red-600/30 transform transition hover:-translate-y-0.5 active:translate-y-0"
            >
              <Search className="w-5 h-5" />
              Find Blood Donors Now
            </button>
            <button
              onClick={onOpenRegister}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-bold text-slate-800 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-red-300 shadow-sm transform transition hover:-translate-y-0.5 active:translate-y-0"
            >
              <UserPlus className="w-5 h-5 text-red-600" />
              Register as a Donor
            </button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Strict privacy: Contact details shown only with donor consent</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-14 max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-red-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 text-red-600 mb-2">
              <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Donors</span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit']">
              {totalCount}
            </div>
            <p className="mt-1 text-xs text-slate-500">Live community registrations</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 text-emerald-600 mb-2">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available Now</span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-700 font-['Outfit'] flex items-center gap-2">
              {availableCount}
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="mt-1 text-xs text-emerald-600 font-medium">Ready in Kerala</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-red-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 text-rose-600 mb-2">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
                <Flame className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Blood Groups</span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit']">
              8 Types
            </div>
            <p className="mt-1 text-xs text-slate-500">A+, A-, B+, B-, AB+, AB-, O+, O-</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-red-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 text-red-600 mb-2">
              <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Districts</span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit']">
              14
            </div>
            <p className="mt-1 text-xs text-slate-500">All districts covered across Kerala</p>
          </div>

        </div>

      </div>
    </section>
  );
}
