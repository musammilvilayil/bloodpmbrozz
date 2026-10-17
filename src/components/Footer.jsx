import React from 'react';
import { 
  Heart, 
  Phone, 
  ShieldCheck, 
  ExternalLink, 
  Code, 
  MapPin,
  Lock
} from 'lucide-react';

export default function Footer({ onOpenAdmin, onOpenRegister }) {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-10 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Header in Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
          
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="text-xl font-black text-white tracking-tight font-['Outfit']">
                PALLIMUKK <span className="text-emerald-400">BROTHERS</span>
              </span>
              <p className="text-xs text-slate-400">
                Blood Index • പള്ളിമുക്ക് ബ്രദേഴ്സ് രക്തദാന കൂട്ടായ്മ
              </p>
            </div>
          </div>

          {/* Quick CTAs */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 font-semibold">
              <Phone className="w-3.5 h-3.5" />
              <span>Emergency Helpline: <strong>108 / 104</strong></span>
            </div>
            
            <button
              onClick={onOpenRegister}
              className="px-4 py-2 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition cursor-pointer"
            >
              Register as Donor
            </button>

            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin</span>
            </button>
          </div>

        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Pallimukk Brothers. Community blood donor index for Pallimukku, Kollam & Kerala.</p>
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <MapPin className="w-3 h-3 text-emerald-500" />
            <span>Pallimukku, Kollam, Kerala</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
