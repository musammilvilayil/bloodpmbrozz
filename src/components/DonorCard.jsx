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
      `Hello ${name || 'Donor'}, I found your contact on Pallimukk Brothers Blood Index regarding an urgent requirement for ${bloodGroup} blood. Could you please let me know if you are currently available to donate? Thank you!`
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
    <div className={`relative flex flex-col justify-between rounded-3xl bg-white p-5 sm:p-6 border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
      isAvailable 
        ? 'border-emerald-200/90 shadow-xs shadow-emerald-500/5' 
        : 'border-slate-200 shadow-xs opacity-90'
    }`}>
      
      {/* Top Header: Avatar, Name, Blood Group */}
      <div>
        <div className="flex items-start justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl font-black text-base sm:text-lg ${
              isAvailable 
                ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/20' 
                : 'bg-slate-100 text-slate-700'
            }`}>
              {getInitials(donor.name)}
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {donor.name}
              </h3>
              
              <div className="flex items-center gap-1.5 mt-1 text-slate-500 text-xs font-medium">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-700">{donor.district || "Kerala"}</span>
                {donor.currentResidence && donor.currentResidence !== "Kerala" && donor.currentResidence !== donor.district && (
                  <span className="text-[11px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-100">
                    {donor.currentResidence}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Blood Group Badge */}
          <div className="flex flex-col items-end">
            <span className="px-3 py-1 rounded-xl font-black text-base tracking-wider bg-emerald-600 text-white shadow-xs shadow-emerald-600/25 font-['Outfit']">
              {donor.bloodGroup}
            </span>
            <span className="text-[9px] text-emerald-700 uppercase tracking-wider font-bold mt-0.5">
              Blood Group
            </span>
          </div>

        </div>

        {/* Status Pill */}
        <div className="mt-3.5 flex items-center justify-between">
          {isAvailable ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              ലഭ്യമാണ് (Available Now)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <Clock className="w-3 h-3 text-amber-600" />
              വിശ്രമത്തിൽ (Resting)
            </span>
          )}

          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Consented
          </span>
        </div>
      </div>

      {/* Action Buttons: Phone & WhatsApp */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        
        <div className="grid grid-cols-2 gap-2">
          
          {/* Call Button */}
          {donor.allowCall && donor.phone ? (
            <a
              href={`tel:${donor.phone}`}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-sm shadow-emerald-600/20 transition-all hover:scale-[1.01]"
              title={`Call ${donor.name}`}
            >
              <Phone className="w-3.5 h-3.5 fill-white" />
              <span>Call Donor</span>
            </a>
          ) : (
            <button
              disabled
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-medium text-xs text-slate-400 bg-slate-100 cursor-not-allowed"
            >
              <Phone className="w-3.5 h-3.5 text-slate-300" />
              <span>Call Hidden</span>
            </button>
          )}

          {/* WhatsApp Button */}
          {donor.allowWhatsApp && donor.whatsapp ? (
            <a
              href={getWhatsAppLink(donor.whatsapp, donor.bloodGroup, donor.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 shadow-sm shadow-teal-600/20 transition-all hover:scale-[1.01]"
              title={`WhatsApp ${donor.name}`}
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp</span>
            </a>
          ) : (
            <div className="flex items-center justify-center py-2 px-2 text-[11px] text-slate-400 text-center font-medium bg-slate-50 rounded-xl">
              WhatsApp not enabled
            </div>
          )}

        </div>

        {/* Copy Phone & Details Bar */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-50">
          <div className="flex items-center gap-2">
            <span>ID: {donor.id}</span>
            {donor.phone && (
              <button
                onClick={() => handleCopyPhone(donor.phone)}
                className="flex items-center gap-1 text-slate-500 hover:text-emerald-700 font-semibold cursor-pointer"
                title="Copy mobile number"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Copied!" : donor.phone}</span>
              </button>
            )}
          </div>

          <button
            onClick={() => onOpenRemoval(donor)}
            className="text-slate-400 hover:text-emerald-700 transition-colors underline decoration-dotted cursor-pointer"
          >
            Update status
          </button>
        </div>

      </div>

    </div>
  );
}
