import React, { useState } from 'react';
import { 
  Heart, 
  Search, 
  UserPlus, 
  Shield, 
  Menu, 
  X, 
  PhoneCall, 
  RefreshCw,
  Sparkles
} from 'lucide-react';

export default function Navbar({ onOpenAdmin, onOpenRegister, autoSyncEnabled = true, secondsAgo = 0, onRefresh, isSyncing = false }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo('hero')}>
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-600/25 transform transition hover:scale-105">
              <Heart className="w-6 h-6 fill-white animate-pulse" />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-['Outfit']">
                  PALLIMUKK <span className="text-emerald-600">BROTHERS</span>
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Blood Index
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 tracking-wide flex items-center gap-1.5">
                <span>പള്ളിമുക്ക് ബ്രദേഴ്സ്</span>
                <span className="text-slate-300">•</span>
                <span>Emergency Blood Registry</span>
              </p>
            </div>
          </div>

          {/* Desktop Navigation & Actions */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Live Auto-Sync Status Badge */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200 text-emerald-900 text-xs font-semibold shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${autoSyncEnabled ? 'bg-emerald-400' : 'bg-slate-300'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${autoSyncEnabled ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
              </span>
              <span>
                {autoSyncEnabled ? 'Live Sync Active (15s)' : 'Sync Paused'}
              </span>
              <span className="text-emerald-300">•</span>
              <span className="text-[11px] text-emerald-700">
                {secondsAgo === 0 ? 'just now' : `${secondsAgo}s ago`}
              </span>
            </div>

            {/* Helpline Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>Helpline: <strong>108 / 104</strong></span>
            </div>

            {/* Admin Portal Button */}
            <button 
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              title="Admin Verification Portal"
            >
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Admin</span>
            </button>

            {/* Register CTA Button */}
            <button
              onClick={onOpenRegister}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/25 transform transition hover:-translate-y-0.5 active:translate-y-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register as Donor</span>
            </button>

          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenRegister}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700"
            >
              Register
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-emerald-100 bg-white/98 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <button 
            onClick={() => scrollTo('donors-section')}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Search className="w-5 h-5 text-emerald-600" />
            <span>Search Blood Donors</span>
          </button>
          <button 
            onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Shield className="w-5 h-5 text-emerald-600" />
            <span>Admin Portal</span>
          </button>
          <div className="pt-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenRegister(); }}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md"
            >
              <UserPlus className="w-5 h-5" />
              <span>Register as Donor (ഗൂഗിൾ ഫോം)</span>
            </button>
          </div>
          <div className="text-center pt-2">
            <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 inline-block">
              Emergency Helpline: 108 / 104
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
