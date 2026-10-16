import React, { useState } from 'react';
import { 
  Activity, 
  Heart, 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  ArrowRight, 
  HelpCircle, 
  UserCheck, 
  Calendar, 
  AlertCircle 
} from 'lucide-react';
import { BLOOD_COMPATIBILITY, DONOR_ELIGIBILITY } from '../data/compatibility';
import { VALID_BLOOD_GROUPS } from '../../api/utils';

export default function BloodGuide() {
  const [selectedGroup, setSelectedGroup] = useState('O+');
  const info = BLOOD_COMPATIBILITY[selectedGroup] || BLOOD_COMPATIBILITY['O+'];

  return (
    <section id="guide-section" className="py-16 bg-white border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Blood Science & Education</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
            Blood Compatibility & Eligibility
          </h2>
          <p className="mt-2 text-slate-600 text-base">
            Understand how blood types match and verify your readiness to save lives safely.
          </p>
        </div>

        {/* 1. Interactive Compatibility Matrix */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-16">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-700/80">
            <div>
              <span className="text-xs font-bold text-red-400 uppercase tracking-widest">
                Interactive Matcher
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-['Outfit'] mt-1">
                Select Your Blood Group
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Click any group to see matching donation & reception rules.
              </p>
            </div>

            {/* Blood Type Selector */}
            <div className="flex flex-wrap gap-2">
              {VALID_BLOOD_GROUPS.map(bg => (
                <button
                  key={bg}
                  onClick={() => setSelectedGroup(bg)}
                  className={`w-12 h-12 rounded-2xl font-black text-sm tracking-wide transition-all transform hover:scale-105 ${
                    selectedGroup === bg
                      ? 'bg-red-600 text-white shadow-lg shadow-red-500/50 scale-110 ring-2 ring-red-400'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          {/* Result Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Can Donate To */}
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/60">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold uppercase tracking-wider text-rose-400">
                  You Can Donate To (Recipients)
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold">
                  {info.give.length} types
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {info.give.map(bg => (
                  <span
                    key={bg}
                    className="px-4 py-2 rounded-xl text-base font-black bg-rose-600 text-white shadow-sm"
                  >
                    {bg}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-400 leading-relaxed">
                When you donate red cells, patients with these blood groups can safely receive your blood.
              </p>
            </div>

            {/* Can Receive From */}
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/60">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold uppercase tracking-wider text-emerald-400">
                  You Can Receive From (Donors)
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                  {info.receive.length} types
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {info.receive.map(bg => (
                  <span
                    key={bg}
                    className="px-4 py-2 rounded-xl text-base font-black bg-emerald-600 text-white shadow-sm"
                  >
                    {bg}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-400 leading-relaxed">
                If you ever require blood, you can safely accept blood transfusions from these donor groups.
              </p>
            </div>

          </div>

          {/* Group Highlights Callout */}
          <div className="mt-8 pt-6 border-t border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-300">
            <div>
              <span className="font-bold text-white text-sm">{selectedGroup}: </span>
              <span>{info.label} — {info.description}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30">
                O- = Universal Donor
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                AB+ = Universal Recipient
              </span>
            </div>
          </div>
        </div>

        {/* 2. Donor Eligibility Checklist */}
        <div id="faq-section" className="mb-14">
          <h3 className="text-2xl font-bold text-slate-900 font-['Outfit'] mb-6 text-center">
            Basic Donor Eligibility Guidelines
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DONOR_ELIGIBILITY.map((item, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-red-200 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-red-100 text-red-600">
                    <Check className="w-5 h-5 font-bold" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">{item.title}</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Mandatory Healthcare / Medical Disclaimer */}
        <div className="bg-amber-50 rounded-3xl p-6 sm:p-8 border border-amber-200/80">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-amber-100 text-amber-700 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-amber-900 mb-1 font-['Outfit']">
                Important Healthcare & Medical Verification Disclaimer
              </h4>
              <p className="text-sm text-amber-800/90 leading-relaxed">
                Blood PM Brozz is an independent community coordination initiative designed to connect voluntary blood donors with individuals in urgent need. 
                <strong> This platform does not provide medical advice, diagnosis, or clinical blood screening.</strong> All blood transfusions, donor health checks, hemoglobin tests, cross-matching, and infectious disease screenings must be performed by certified doctors, authorized hospitals, or government-approved blood banks in accordance with national transfusion safety standards.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-semibold text-amber-900">
                <span>• Government Ambulance: 108</span>
                <span>• National Health Helpline: 104</span>
                <span>• Emergency Blood Helpline Kerala: 0471-2528388</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
