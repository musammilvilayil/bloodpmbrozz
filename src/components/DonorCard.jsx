import React, { useState } from 'react';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Share2,
  Droplet 
} from 'lucide-react';
import { tactileTap } from '../utils/haptics';

export default function DonorCard({ donor, onOpenRemoval }) {
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

  // Only share contact details when the donor has explicitly opted in.
  const canSharePhone = Boolean(donor.allowCall && donor.phone);
  const canShareWhatsApp = Boolean(donor.allowWhatsApp && donor.whatsapp);
  const canShareContact = canSharePhone || canShareWhatsApp;

  const handleShareDonor = () => {
    if (!canShareContact) return;
    tactileTap('light');
    const lines = [
      '🩸 *Blood Donor Contact - Pallimukk Brothers, Mynagappally*',
      `👤 Name: ${donor.name}`,
      `💉 Blood Group: *${donor.bloodGroup}*`,
      `📍 Location: ${donor.district || 'Mynagappally'}`,
      ...(canSharePhone ? [`📞 Phone: ${donor.phone}`] : []),
      ...(canShareWhatsApp ? [`💬 WhatsApp: ${donor.whatsapp}`] : []),
      '🔗 Directory: https://bloodpmbrozz.vercel.app'
    ];
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(lines.join('\\n'))}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`relative flex flex-col justify-between rounded-3xl bg-white p-4 sm:p-5 card-native border transition-all duration-200 touch-spring ${
      isAvailable 
        ? 'border-emerald-200/90 shadow-emerald-500/5 hover:border-emerald-400' 
        : 'border-slate-200/80 opacity-90'
    }`}>
      
      {/* Top Header: Avatar, Name, Blood Group */}
      <div>
        <div className="flex items-start justify-between gap-2.5">
          
          <div className="flex items-center gap-3 min-w-0">
            {/* Native Avatar Tile with Liquid Ring */}
            <div className={`relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl font-black text-sm sm:text-base shrink-0 shadow-sm ${
              isAvailable 
                ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-emerald-600/25 ring-2 ring-emerald-500/20' 
                : 'bg-slate-100 text-slate-700'
            }`}>
              {getInitials(donor.name)}
              {isAvailable && (
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white animate-pulse"></span>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight truncate">
                {donor.name}
              </h3>
              
              <div className="flex items-center gap-1 mt-1 text-slate-500 text-[11px] sm:text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-slate-700 truncate">{donor.district || "Mynagappally"}</span>
                {donor.currentResidence && donor.currentResidence !== "Kerala" && donor.currentResidence !== donor.district && (
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 px-1.5 py-0.2 rounded-md border border-emerald-100 truncate">
                    {donor.currentResidence}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Punchy Liquid Blood Group Capsule */}
          <div className="flex flex-col items-end shrink-0">
            <span className="px-3 py-1 rounded-2xl font-black text-sm sm:text-base tracking-wider bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xs font-['Outfit'] border border-emerald-400/30 flex items-center gap-1">
              <Droplet className="w-3 h-3 fill-white" />
              <span>{donor.bloodGroup}</span>
            </span>
            <span className="text-[9px] text-emerald-700 uppercase tracking-widest font-black mt-0.5 mr-0.5">
              Group
            </span>
          </div>

        </div>

        {/* Status Pill: Luminous Native Badge */}
        <div className="mt-3.5 flex items-center justify-between text-[11px]">
          {isAvailable ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-malayalam">ലഭ്യമാണ് (Ready)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <Clock className="w-3 h-3 text-amber-600" />
              <span className="font-malayalam">വിശ്രമത്തിൽ</span>
            </span>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareDonor}
              disabled={!canShareContact}
              aria-label={canShareContact ? `Share ${donor.name}'s contact via WhatsApp` : 'Contact sharing unavailable'}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-emerald-700 touch-spring p-1 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Share donor contact to WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <span className="inline-flex items-center gap-1 font-bold text-emerald-700 text-[10px] sm:text-[11px]">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Consented
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Phone & WhatsApp - Tactile Big Native Targets */}
      <div className="mt-4 pt-3.5 border-t border-slate-100">
        
        <div className="grid grid-cols-2 gap-2">
          
          {/* Call Button */}
          {donor.allowCall && donor.phone ? (
            <a
              href={`tel:${donor.phone}`}
              onClick={() => tactileTap('medium')}
              className="flex items-center justify-center gap-2 h-11 px-3 rounded-2xl font-black text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 active:scale-95 touch-spring shadow-md shadow-emerald-600/20 transition cursor-pointer"
              title={`Call ${donor.name}`}
            >
              <Phone className="w-3.5 h-3.5 fill-white" />
              <span>Call Donor</span>
            </a>
          ) : (
            <button
              disabled
              className="flex items-center justify-center gap-1.5 h-11 px-3 rounded-2xl font-medium text-xs text-slate-400 bg-slate-100 cursor-not-allowed"
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
              onClick={() => tactileTap('medium')}
              className="flex items-center justify-center gap-2 h-11 px-3 rounded-2xl font-black text-xs sm:text-sm text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 active:scale-95 touch-spring shadow-md shadow-teal-600/20 transition cursor-pointer"
              title={`WhatsApp ${donor.name}`}
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp</span>
            </a>
          ) : (
            <div className="flex items-center justify-center h-11 px-2 text-[11px] text-slate-400 text-center font-medium bg-slate-50 rounded-2xl">
              No WhatsApp
            </div>
          )}

        </div>

        {/* Privacy-first footer: no phone number rendered in the card. */}
        <div className="mt-2.5 flex items-center justify-end text-[11px] text-slate-400 pt-2 border-t border-slate-50">
          <button
            onClick={() => {
              tactileTap('light');
              onOpenRemoval(donor);
            }}
            className="text-slate-400 hover:text-emerald-700 text-[10px] sm:text-[11px] underline decoration-dotted shrink-0 ml-2 cursor-pointer touch-spring font-medium"
          >
            Update status
          </button>
        </div>

      </div>

    </div>
  );
}
