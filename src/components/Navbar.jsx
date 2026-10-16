import React, { useState } from 'react';
import { 
  Heart, 
  Search, 
  UserPlus, 
  Shield, 
  Menu, 
  X, 
  PhoneCall, 
  Activity 
} from 'lucide-react';

export default function Navbar({ onOpenAdmin, onOpenRegister, activeSection }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-red-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo('hero')}>
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-lg shadow-red-500/30 transform transition hover:scale-105">
              <Heart className="w-6 h-6 fill-white animate-pulse" />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-900 font-['Outfit']">
                  BLOOD <span className="text-red-600">PM BROZZ</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                  Kerala
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 tracking-wide">
                Emergency Blood Coordination Network
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button 
              onClick={() => scrollTo('donors-section')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-red-600 hover:bg-red-50/60 transition-colors"
            >
              <Search className="w-4 h-4 text-red-500" />
              Find Donors
            </button>
            <button 
              onClick={() => scrollTo('guide-section')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-red-600 hover:bg-red-50/60 transition-colors"
            >
              <Activity className="w-4 h-4 text-red-500" />
              Compatibility Guide
            </button>
            <button 
              onClick={() => scrollTo('faq-section')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-red-600 hover:bg-red-50/60 transition-colors"
            >
              Rules & Eligibility
            </button>
            <button 
              onClick={onOpenAdmin}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Admin Access Portal"
            >
              <Shield className="w-4 h-4 text-slate-400" />
              Admin
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold">
              <PhoneCall className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
              <span>Helpline: 108 / 104</span>
            </div>
            
            <button
              onClick={onOpenRegister}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-md shadow-red-500/25 transform transition hover:-translate-y-0.5 active:translate-y-0"
            >
              <UserPlus className="w-4 h-4" />
              Register as Donor
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenRegister}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-700"
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
        <div className="md:hidden border-b border-red-100 bg-white/98 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <button 
            onClick={() => scrollTo('donors-section')}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left font-semibold text-slate-800 hover:bg-red-50 hover:text-red-600"
          >
            <Search className="w-5 h-5 text-red-500" />
            Find Blood Donors
          </button>
          <button 
            onClick={() => scrollTo('guide-section')}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left font-semibold text-slate-800 hover:bg-red-50 hover:text-red-600"
          >
            <Activity className="w-5 h-5 text-red-500" />
            Blood Compatibility Guide
          </button>
          <button 
            onClick={() => scrollTo('faq-section')}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left font-semibold text-slate-800 hover:bg-red-50 hover:text-red-600"
          >
            <Heart className="w-5 h-5 text-red-500" />
            Eligibility & FAQs
          </button>
          <button 
            onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left font-medium text-slate-600 hover:bg-slate-100"
          >
            <Shield className="w-5 h-5 text-slate-400" />
            Admin Dashboard
          </button>
          <div className="pt-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenRegister(); }}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-md"
            >
              <UserPlus className="w-5 h-5" />
              Register as Donor
            </button>
          </div>
          <div className="text-center pt-2">
            <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
              Government Ambulance & Blood Helpline: 108 / 104
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
