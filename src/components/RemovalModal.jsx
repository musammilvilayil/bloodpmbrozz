import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  MessageSquare, 
  CheckCircle2, 
  UserX, 
  Clock 
} from 'lucide-react';

export default function RemovalModal({ isOpen, onClose, donor }) {
  const [requestType, setRequestType] = useState('resting'); // 'resting' | 'update' | 'delete'
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !donor) return null;

  const handleSendRequest = () => {
    // Generate pre-filled WhatsApp support message
    let actionText = "temporarily mark my availability as Resting / Unavailable";
    if (requestType === 'update') actionText = "update my contact details";
    if (requestType === 'delete') actionText = "permanently delete my donor listing";

    const msg = encodeURIComponent(
      `Hello Blood PM Brozz Admin, I am registered as a donor (ID: ${donor.id}, Name: ${donor.name}, Blood Group: ${donor.bloodGroup}). I would like to request to ${actionText}. Thank you.`
    );
    
    // Fallback WhatsApp coordinator or submit notification
    const waUrl = `https://wa.me/916282135504?text=${msg}`;
    window.open(waUrl, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-800">
              <ShieldAlert className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-['Outfit']">
                Update or Remove Listing
              </h3>
              <p className="text-xs text-slate-400">
                Donor Privacy & Availability Management
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Target donor pill */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <div>
              <span className="font-bold text-slate-900">{donor.name}</span>
              <span className="text-slate-500 ml-2">({donor.district})</span>
            </div>
            <span className="px-2 py-0.5 rounded font-black bg-red-100 text-red-700">
              {donor.bloodGroup}
            </span>
          </div>

          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-slate-900 text-base">Request Submitted</h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Your request has been routed to the community administrator for verification and execution.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white"
              >
                Close Window
              </button>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  What would you like to do?
                </label>

                <div className="space-y-2.5">
                  <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                    requestType === 'resting' ? 'border-amber-500 bg-amber-50/40' : 'border-slate-200 hover:bg-slate-50'
                  }`}>
                    <input
                      type="radio"
                      name="requestType"
                      value="resting"
                      checked={requestType === 'resting'}
                      onChange={() => setRequestType('resting')}
                      className="mt-0.5 text-red-600"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        Temporarily mark as Resting / Unavailable
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Recommended if you recently donated blood, are unwell, or traveling outside Kerala.
                      </p>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                    requestType === 'update' ? 'border-blue-500 bg-blue-50/40' : 'border-slate-200 hover:bg-slate-50'
                  }`}>
                    <input
                      type="radio"
                      name="requestType"
                      value="update"
                      checked={requestType === 'update'}
                      onChange={() => setRequestType('update')}
                      className="mt-0.5 text-red-600"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        Update Contact Number or District
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Change phone number, WhatsApp preference, or registered location.
                      </p>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                    requestType === 'delete' ? 'border-red-500 bg-red-50/40' : 'border-slate-200 hover:bg-slate-50'
                  }`}>
                    <input
                      type="radio"
                      name="requestType"
                      value="delete"
                      checked={requestType === 'delete'}
                      onChange={() => setRequestType('delete')}
                      className="mt-0.5 text-red-600"
                    />
                    <div>
                      <div className="text-xs font-bold text-red-600 flex items-center gap-1.5">
                        <UserX className="w-3.5 h-3.5" />
                        Permanently Delete My Directory Listing
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Exercise your right to be forgotten. All public contact details will be removed immediately.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSendRequest}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white bg-red-600 hover:bg-red-700 shadow-md transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Notify Admin via WhatsApp</span>
                </button>
              </div>
            </>
          )}

        </div>

      </div>

    </div>
  );
}
