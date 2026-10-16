import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  ShieldCheck, 
  FileText, 
  Heart, 
  CheckCircle, 
  HelpCircle 
} from 'lucide-react';
import { GOOGLE_FORM_URL } from '../../api/utils';

export default function RegisterModal({ isOpen, onClose }) {
  const [embedMode, setEmbedMode] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-red-600 to-rose-600 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-['Outfit']">
                Register as Blood Donor
              </h3>
              <p className="text-xs text-red-100 font-medium">
                Official Blood PM Brozz Community Registration
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Explanation Box */}
          <div className="bg-red-50/80 rounded-2xl p-5 border border-red-100">
            <h4 className="font-bold text-red-950 text-sm mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-600" />
              How the Registration Works
            </h4>
            <ol className="text-xs text-red-900/90 space-y-2 list-decimal list-inside leading-relaxed">
              <li>
                <strong>Official Google Form:</strong> You will submit your details using the official Blood PM Brozz Google Form.
              </li>
              <li>
                <strong>Synchronized to Google Sheet:</strong> Your responses are automatically stored in the protected community spreadsheet.
              </li>
              <li>
                <strong>Privacy & Explicit Consent:</strong> Your phone number is only listed if you give explicit consent to be contacted for emergency blood donation.
              </li>
              <li>
                <strong>Availability Control:</strong> You can request to toggle your availability (e.g. when resting between donations) at any time.
              </li>
            </ol>
          </div>

          {/* Direct CTA */}
          <div className="text-center py-4 space-y-4">
            <p className="text-sm text-slate-600">
              Click below to complete the short 2-minute registration form:
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/30 transition transform hover:-translate-y-0.5"
              >
                <FileText className="w-4 h-4" />
                <span>Open Registration Form</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => setEmbedMode(!embedMode)}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                {embedMode ? "Hide Embedded Form" : "Fill Inside Website"}
              </button>
            </div>
          </div>

          {/* Embedded Google Form if requested */}
          {embedMode && (
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-inner">
              <div className="bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-500 border-b">
                Embedded Google Form
              </div>
              <iframe
                src={GOOGLE_FORM_URL}
                width="100%"
                height="500"
                frameBorder="0"
                marginHeight="0"
                marginWidth="0"
                title="Register Blood Donor Google Form"
                className="w-full"
              >
                Loading…
              </iframe>
            </div>
          )}

          {/* Privacy Note */}
          <div className="text-xs text-slate-500 border-t border-slate-100 pt-4 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p>
              Privacy Notice: Your information is handled responsibly. We never sell or share contact details with advertisers. For record correction or immediate removal, message a WhatsApp group admin with your name and phone.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition"
          >
            Close
          </button>
        </div>

      </div>

    </div>
  );
}
