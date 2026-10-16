import React from 'react';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  AlertCircle 
} from 'lucide-react';

export default function DonorCard({ donor, onOpenRemoval }) {
  const isAvailable = donor.isAvailable;
  
  // Create avatar initials from name
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
      `Hello ${name || 'Donor'}, I found your contact on Blood PM Brozz emergency directory regarding an urgent requirement for ${bloodGroup} blood. Could you please let me know if you are currently available to donate? Thank you!`
    );
    return `https://wa.me/${cleanNumber}?text=${message}`;
  };

  return (
    <div className={`relative flex flex-col justify-between rounded-3xl bg-white p-6 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
      isAvailable 
        ? 'border-emerald-200 shadow-sm shadow-emerald-500/5' 
        : 'border-slate-200/80 shadow-sm opacity-95'
    }`}>
      
      {/* Top Header: Avatar, Name, Blood Group */}
      <div>
        <div className="flex items-start justify-between gap-3">
          
          <div className="flex items-center gap-3.5">
            <div className={`flex items-center justify-center w-12 h-12 rounded-2xl font-black text-lg ${
              isAvailable 
                ? 'bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-md shadow-red-500/20' 
                : 'bg-slate-100 text-slate-700'
            }`}>
              {getInitials(donor.name)}
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                {donor.name}
              </h3>
              
              <div className="flex items-center gap-1.5 mt-1 text-slate-500 text-xs font-medium">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{donor.district || "Kerala"}</span>
                {donor.currentResidence && donor.currentResidence !== "Kerala" && (
                  <span className="text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                    ({donor.currentResidence})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Blood Group Badge */}
          <div className="flex flex-col items-end">
            <span className="px-3 py-1 rounded-xl font-black text-base tracking-wider bg-red-600 text-white shadow-sm shadow-red-600/30 font-['Outfit']">
              {donor.bloodGroup}
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">
              Blood Group
            </span>
          </div>

        </div>

        {/* Status Pill */}
        <div className="mt-4 flex items-center justify-between">
          {isAvailable ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Available Now in Kerala
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Resting / Currently Unavailable
            </span>
          )}

          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Consented
          </span>
        </div>
      </div>

      {/* Action Buttons: Phone & WhatsApp */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          
          {/* Call Button */}
          {donor.allowCall && donor.phone ? (
            <a
              href={`tel:${donor.phone}`}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-red-600 hover:bg-red-700 active:bg-red-800 shadow-md shadow-red-600/20 transition-all hover:scale-[1.02]"
              title={`Call ${donor.name}`}
            >
              <Phone className="w-4 h-4 fill-white" />
              <span>Call Donor</span>
            </a>
          ) : (
            <button
              disabled
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-xs text-slate-400 bg-slate-100 cursor-not-allowed"
            >
              <Phone className="w-4 h-4 text-slate-300" />
              <span>Call Hidden</span>
            </button>
          )}

          {/* WhatsApp Button */}
          {donor.allowWhatsApp && donor.whatsapp ? (
            <a
              href={getWhatsAppLink(donor.whatsapp, donor.bloodGroup, donor.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
              title={`WhatsApp ${donor.name}`}
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp</span>
            </a>
          ) : (
            <div className="flex items-center justify-center py-2 px-3 text-xs text-slate-400 text-center font-medium bg-slate-50 rounded-xl">
              WhatsApp not enabled
            </div>
          )}

        </div>

        {/* Footer info & removal request */}
        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
          <span>ID: {donor.id}</span>
          <button
            onClick={() => onOpenRemoval(donor)}
            className="text-slate-400 hover:text-red-600 transition-colors underline decoration-dotted"
          >
            Update or Remove
          </button>
        </div>

      </div>

    </div>
  );
}
