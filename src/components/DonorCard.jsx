import React, { useState } from 'react';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Copy,
  Check,
  ShieldCheck
} from 'lucide-react';

export default function DonorCard({ donor, onOpenRemoval }) {
  const [copied, setCopied] = useState(false);
  const isAvailable = donor.isAvailable;
  
  // Initials from donor name
  const getInitials = (name) => {
    if (!name) return "D";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Pre-filled WhatsApp emergency template
  const getWhatsAppLink = (phone, bloodGroup, name) => {
    const cleanNumber = phone.replace(/[^\d]/g, '');
    const message = encodeURIComponent(
      `Hello ${name || 'Donor'}, I found your contact on Pallimukk Brothers Mynagappally Blood Index regarding an urgent requirement for ${bloodGroup} blood. Could you please let me know if you are currently available to donate? Thank you!`
    );
    return `https://wa.me/${cleanNumber}?text=${message}`;
  };

  const handleCopyPhone = (phone) => {
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-5 border transition-all duration-200 active:scale-[0.99] sm:hover:-translate-y-0.5 sm:hover:shadow-md ${
      isAvailable 
        ? 'border-emerald-200 shadow-xs shadow-emerald-500/5' 
        : 'border-slate-200 shadow-xs opacity-90'
    }`}>
      
      {/* Top Header: Avatar, Name, Blood Group */}
      <div>
        <div className="flex items-start justify-between gap-2.5">
          
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base shrink-0 ${
              isAvailable 
                ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm shadow-emerald-600/20' 
                : 'bg-slate-100 text-slate-700'
            }`}>
              {getInitials(donor.name)}
            </div>

            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight truncate">
                {donor.name}
              </h3>
              
              <div className="flex items-center gap-1 mt-0.5 text-slate-500 text-[11px] sm:text-xs font-medium">
                <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-700 truncate">{donor.district || "Kerala"}</span>
                {donor.currentResidence && donor.currentResidence !== "Kerala" && donor.currentResidence !== donor.district && (
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 px-1 py-0.2 rounded border border-emerald-100 truncate">
                    {donor.currentResidence}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Blood Group Badge */}
          <div className="flex flex-col items-end shrink-0">
            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-xl font-black text-sm sm:text-base tracking-wider bg-emerald-600 text-white shadow-xs font-['Outfit']">
              {donor.bloodGroup}
            </span>
            <span className="text-[9px] text-emerald-700 uppercase tracking-wider font-bold mt-0.5">
              Group
            </span>
          </div>

        </div>

        {/* Status Pill */}
        <div className="mt-3 flex items-center justify-between text-[11px]">
          {isAvailable ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>ലഭ്യമാണ് (Ready)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <Clock className="w-3 h-3 text-amber-600" />
              <span>വിശ്രമത്തിൽ</span>
            </span>
          )}

          <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 text-[10px] sm:text-[11px]">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Consented
          </span>
        </div>
      </div>

      {/* Action Buttons: Phone & WhatsApp - Big Touch Targets for Mobile */}
      <div className="mt-4 pt-3.5 border-t border-slate-100">
        
        <div className="grid grid-cols-2 gap-2">
          
          {/* Call Button */}
          {donor.allowCall && donor.phone ? (
            <a
              href={`tel:${donor.phone}`}
              className="flex items-center justify-center gap-1.5 h-11 px-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 active:scale-95 shadow-xs shadow-emerald-600/20 transition-all cursor-pointer"
              title={`Call ${donor.name}`}
            >
              <Phone className="w-3.5 h-3.5 fill-white" />
              <span>Call Donor</span>
            </a>
          ) : (
            <button
              disabled
              className="flex items-center justify-center gap-1.5 h-11 px-3 rounded-xl font-medium text-xs text-slate-400 bg-slate-100 cursor-not-allowed"
            >
              <Phone className="w-3.5 h-3.5 text-slate-300" />
              <span>Hidden</span>
            </button>
          )}

          {/* WhatsApp Button */}
          {donor.allowWhatsApp && donor.whatsapp ? (
            <a
              href={getWhatsAppLink(donor.whatsapp, donor.bloodGroup, donor.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 h-11 px-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 active:scale-95 shadow-xs shadow-teal-600/20 transition-all cursor-pointer"
              title={`WhatsApp ${donor.name}`}
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp</span>
            </a>
          ) : (
            <div className="flex items-center justify-center h-11 px-2 text-[11px] text-slate-400 text-center font-medium bg-slate-50 rounded-xl">
              No WhatsApp
            </div>
          )}

        </div>

        {/* Copy Phone & Details Bar */}
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-50">
          <div className="flex items-center gap-1.5 min-w-0">
            {donor.phone && (
              <button
                onClick={() => handleCopyPhone(donor.phone)}
                className="flex items-center gap-1 text-slate-500 hover:text-emerald-700 active:text-emerald-800 font-semibold cursor-pointer truncate"
                title="Copy phone number"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600 shrink-0" /> : <Copy className="w-3 h-3 shrink-0" />}
                <span className="truncate">{copied ? "Copied!" : donor.phone}</span>
              </button>
            )}
          </div>

          <button
            onClick={() => onOpenRemoval(donor)}
            className="text-slate-400 hover:text-emerald-700 text-[10px] sm:text-[11px] underline decoration-dotted shrink-0 ml-2 cursor-pointer"
          >
            Update status
          </button>
        </div>

      </div>

    </div>
  );
}
