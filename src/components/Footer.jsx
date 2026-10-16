import React from 'react';
import { 
  Heart, 
  Phone, 
  ShieldCheck, 
  ExternalLink, 
  Code, 
  Mail, 
  AlertTriangle 
} from 'lucide-react';

export default function Footer({ onOpenAdmin, onOpenRegister }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Purpose */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-red-600 text-white shadow-md shadow-red-600/30">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tight font-['Outfit']">
                BLOOD <span className="text-red-500">PM BROZZ</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              A community blood donor directory for Kerala. Dedicated to connecting willing voluntary life-savers with patients in critical emergencies.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>100% Free & Community Driven</span>
            </div>
          </div>

          {/* Emergency Helplines */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-['Outfit']">
              Emergency Hotlines (Kerala)
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-red-500" />
                <span className="text-white font-bold">108:</span>
                <span>Government Emergency Ambulance</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-red-500" />
                <span className="text-white font-bold">104:</span>
                <span>National Health Helpline</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-red-500" />
                <span className="text-white font-bold">112:</span>
                <span>All-in-one Emergency Number</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-red-500" />
                <span className="text-white font-bold">0471-2528388:</span>
                <span>Kerala Blood Bank Coordination</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-['Outfit']">
              Directory Navigation
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => scrollTo('donors-section')} className="hover:text-white transition">
                  Find Emergency Donors
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('guide-section')} className="hover:text-white transition">
                  Compatibility Matrix
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('faq-section')} className="hover:text-white transition">
                  Eligibility Guidelines
                </button>
              </li>
              <li>
                <button onClick={onOpenRegister} className="hover:text-white transition font-semibold text-red-400">
                  Register as a Donor
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="hover:text-white transition">
                  Admin Verification Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Data Transparency & Source */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-['Outfit']">
              Data & Transparency
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Donor data is securely synced from the official Google Form & Google Sheet responses. 
              Only consent-approved phone and WhatsApp contacts are displayed publicly.
            </p>
            <div className="pt-2">
              <a
                href="https://github.com/musammilvilayil/bloodpmbrozz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition"
              >
                <Code className="w-4 h-4 text-slate-400" />
                <span>GitHub Source</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Legal, Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <p>© {new Date().getFullYear()} Blood PM Brozz Community. Built with care for emergency health coordination.</p>
            <p className="mt-1 text-[11px] text-slate-600">
              Medical Disclaimer: Blood PM Brozz does not conduct clinical testing. Donors and recipients must undergo professional medical screening at approved blood banks.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button onClick={onOpenAdmin} className="text-slate-400 hover:text-white transition">
              Admin Login
            </button>
            <span>•</span>
            <span className="text-slate-500">Kerala, India</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
