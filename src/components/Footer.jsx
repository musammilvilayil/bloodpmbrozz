import React from 'react';
import zenithLogo from '../assets/image.png';
import { 
  Heart, 
  Phone, 
  MapPin,
  Lock,
  Camera,
  Globe
} from 'lucide-react';

export default function Footer({ onOpenAdmin, onOpenRegister }) {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-8 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 pb-6 border-b border-slate-800 text-center md:text-left">
          
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30 shrink-0">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black text-white tracking-tight font-['Outfit']">
                PALLIMUKK <span className="text-emerald-400">BROTHERS</span>
              </span>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Blood Index • പള്ളിമുക്ക് ബ്രദേഴ്സ് മൈനാഗപ്പള്ളി
              </p>
            </div>
          </div>

          {/* Quick CTAs on Mobile */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <a 
              href="tel:108"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 font-semibold transition"
              title="Call Kerala Emergency Medical Helpline 108"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Helpline: <strong>108 / 104</strong></span>
            </a>
            
            <button
              onClick={onOpenRegister}
              className="px-3.5 py-1.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition cursor-pointer"
            >
              Register
            </button>

            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
            >
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Admin</span>
            </button>
          </div>

        </div>

        <div className="mt-5 rounded-2xl border border-slate-700/70 bg-slate-800/70 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <img src={zenithLogo} alt="Zenith Softworks logo" className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-contain bg-slate-950 p-1 shrink-0" loading="lazy" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400 font-semibold">Designed & Developed by</p>
              <a href="https://zenithsoftworks.in" target="_blank" rel="noopener noreferrer" className="font-extrabold text-white hover:text-cyan-300 transition-colors">ZENITH <span className="text-cyan-400">SOFTWORKS</span></a>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="https://www.instagram.com/zenith.softworks/" target="_blank" rel="noopener noreferrer" aria-label="Zenith Softworks Instagram" className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-700/70 text-slate-200 hover:bg-pink-600 hover:text-white transition"><Camera className="w-5 h-5" /></a>
            <a href="https://zenithsoftworks.in" target="_blank" rel="noopener noreferrer" aria-label="Zenith Softworks website" className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-700/70 text-slate-200 hover:bg-cyan-700 hover:text-white transition"><Globe className="w-5 h-5" /></a>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Pallimukk Brothers, Mynagappally. Free community blood index for Mynagappally Pallimukku, Kollam & Kerala.</p>
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
            <span>Mynagappally Pallimukku, Kollam, Kerala</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
