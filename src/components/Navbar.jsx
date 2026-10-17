import React, { useState } from 'react';
import { 
  Heart, 
  Droplet,
  Search, 
  UserPlus, 
  Shield, 
  Menu, 
  X, 
  PhoneCall, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { tactileTap } from '../utils/haptics';

export default function Navbar({ onOpenAdmin, onOpenRegister, autoSyncEnabled = true, secondsAgo = 0, onRefresh, isSyncing = false }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id) => {
    tactileTap('light');
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer min-w-0 touch-spring" onClick={() => scrollTo('hero')}>
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/25 shrink-0">
              <Heart className="w-5 h-5 fill-white animate-pulse" />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
              </span>
            </div>
            
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-2xl font-black tracking-tight text-slate-900 font-['Outfit'] truncate">
                  Life<span className="text-emerald-600">Drop</span>
                </span>
                <span className="hidden xs:inline-flex items-center px-2 py-0.2 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                  Every Drop Matters
                </span>
              </div>
              <p className="text-[10px] sm:text-xs font-semibold text-slate-500 truncate flex items-center gap-1">
                <span>Every Drop Matters. Every Life Counts.</span>
                <span className="text-slate-300">•</span>
                <span>Mynagappally, Kollam</span>
              </p>
            </div>
          </div>

          {/* Desktop Navigation & Actions */}
          <div className="hidden md:flex items-center gap-2.5 lg:gap-3">
            
            {/* Live Auto-Sync Status Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200 text-emerald-900 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${autoSyncEnabled ? 'bg-emerald-400' : 'bg-slate-300'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${autoSyncEnabled ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
              </span>
              <span>
                {autoSyncEnabled ? '15s Live' : 'Paused'}
              </span>
              <span className="text-emerald-300">•</span>
              <span className="text-[11px] text-emerald-700">
                {secondsAgo === 0 ? 'just now' : `${secondsAgo}s`}
              </span>
            </div>

            {/* Helpline Badge */}
            <a 
              href="tel:108" 
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 border border-slate-200 text-slate-700 text-xs font-semibold transition"
              title="Call Kerala Emergency Medical Helpline 108"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>Helpline: <strong>108 / 104</strong></span>
            </a>

            {/* Desktop Sync Now button */}
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isSyncing}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-emerald-200 text-emerald-800 hover:bg-emerald-50 text-xs font-bold transition cursor-pointer"
                title="Force refresh from Google Sheet"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
              </button>
            )}

            {/* Admin Portal Button */}
            <button 
              onClick={onOpenAdmin}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
              title="Admin Portal"
            >
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Admin</span>
            </button>

            {/* Register CTA Button */}
            <button
              onClick={onOpenRegister}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/25 transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register</span>
            </button>

          </div>

          {/* Mobile Actions: Instant Sync + Register + Hamburger */}
          <div className="flex md:hidden items-center gap-1.5">
            
            {/* Quick Sync icon button on mobile */}
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isSyncing}
                className="p-2 rounded-xl text-emerald-700 hover:bg-emerald-50 active:bg-emerald-100 transition cursor-pointer"
                title="Refresh from Google Sheet"
                aria-label="Refresh donors"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
              </button>
            )}

            {/* Mobile Register button */}
            <button
              onClick={onOpenRegister}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition shadow-xs"
            >
              Register
            </button>

            {/* Mobile hamburger menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 active:scale-95"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-emerald-700" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Sheet */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-emerald-100 bg-white/98 backdrop-blur-lg px-4 pt-3 pb-5 space-y-2.5 animate-in slide-in-from-top-2 duration-200">
          
          {/* Status summary pill */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs">
            <div className="flex items-center gap-2 text-emerald-900 font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Live Google Sheet Sync</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">
              {secondsAgo === 0 ? "Synced just now" : `${secondsAgo}s ago`}
            </span>
          </div>

          <button 
            onClick={() => scrollTo('donors-section')}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-left font-semibold text-sm text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 active:bg-emerald-100"
          >
            <Droplet className="w-4 h-4 text-emerald-600" />
            <span>Blood Groups & Donors</span>
          </button>

          <a 
            href="tel:108"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-left font-semibold text-sm text-slate-800 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <span className="flex items-center gap-3">
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <span>Government Ambulance (108)</span>
            </span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
              Call 108
            </span>
          </a>

          <button 
            onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-left font-semibold text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Admin Portal</span>
          </button>

          <div className="pt-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenRegister(); }}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-md"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register as Donor (ഗൂഗിൾ ഫോം)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
