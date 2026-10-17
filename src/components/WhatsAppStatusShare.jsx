import React, { useState } from 'react';
import { Share2, Check, Copy, MessageCircle, HeartHandshake, Sparkles } from 'lucide-react';
import { tactileTap } from '../utils/haptics';

export default function WhatsAppStatusShare({ selectedBloodGroup = 'ALL' }) {
  const [copied, setCopied] = useState(false);

  const getShareText = () => {
    const isSpecific = selectedBloodGroup && selectedBloodGroup !== 'ALL';
    const groupText = isSpecific ? `*${selectedBloodGroup}* രക്തം ആവശ്യമുണ്ട്!` : 'രക്തം ആവശ്യമുണ്ട്!';

    return `🚨 *അടിയന്തിരം: മൈനാഗപ്പള്ളിയിൽ ${groupText}* 🚨\n\nപള്ളിമുക്ക് ബ്രദേഴ്സിന്റെ രക്തദാന സൂചിക വഴി മൈനാഗപ്പള്ളിയിലെ ഡോണർമാരെ നേരിട്ട് ബന്ധപ്പെടാം.\n\n👇 *ഡോണർമാരെ കാണാൻ ലിങ്കിൽ ക്ലിക്ക് ചെയ്യുക:* \nhttps://bloodpmbrozz.vercel.app\n\n_100% സൗജന്യ സേവനം • പള്ളിമുക്ക് ബ്രദേഴ്സ്, മൈനാഗപ്പള്ളി_`;
  };

  const handleShareToWhatsApp = () => {
    tactileTap('success');
    const text = encodeURIComponent(getShareText());
    const waUrl = `https://api.whatsapp.com/send?text=${text}`;
    window.open(waUrl, '_blank');
  };

  const handleCopyText = () => {
    tactileTap('light');
    navigator.clipboard.writeText(getShareText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 p-4 sm:p-5 text-white border border-emerald-500/20 shadow-lg my-4">
      
      {/* Decorative ambient background blur */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* Left: Message preview & title */}
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 shrink-0">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/30">
                <Sparkles className="w-3 h-3 text-emerald-300" />
                വാട്സാപ്പ് സ്റ്റാറ്റസ്
              </span>
              <span className="text-[11px] text-slate-400 font-medium">1-Tap Share</span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white font-['Outfit'] mt-1 leading-snug">
              {selectedBloodGroup === 'ALL' 
                ? 'മൈനാഗപ്പള്ളിയിലെ ഡോണർ ലിസ്റ്റ് സ്റ്റാറ്റസിലേക്ക് ഷെയർ ചെയ്യാം' 
                : `മൈനാഗപ്പള്ളിയിൽ ${selectedBloodGroup} രക്തം ആവശ്യപ്പെട്ട് സ്റ്റാറ്റസ് ഇടാം`}
            </h4>
            <p className="text-[11px] text-slate-300 font-malayalam mt-0.5 max-w-md line-clamp-1">
              ആവശ്യക്കാർക്ക് നേരിട്ട് ഡോണർമാരെ ലഭിക്കാൻ ഇത് സുഹൃത്തുക്കളിലേക്ക് ഷെയർ ചെയ്യുക.
            </p>
          </div>
        </div>

        {/* Right: Touch-spring action buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            onClick={handleShareToWhatsApp}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-11 px-4 sm:px-5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 touch-spring shadow-md shadow-emerald-600/30 cursor-pointer"
            title="Share to WhatsApp Status or Chats"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Share to Status</span>
          </button>

          <button
            onClick={handleCopyText}
            className="flex items-center justify-center w-11 h-11 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 active:scale-95 touch-spring border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer shrink-0"
            title="Copy message text"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {copied && (
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[11px] text-emerald-400 font-medium flex items-center gap-1.5 animate-in fade-in">
          <Check className="w-3.5 h-3.5" />
          <span>വാട്സാപ്പ് മെസ്സേജ് ക്ലിപ്പ്ബോർഡിലേക്ക് കോപ്പി ചെയ്തു! (Copied to clipboard)</span>
        </div>
      )}

    </div>
  );
}
