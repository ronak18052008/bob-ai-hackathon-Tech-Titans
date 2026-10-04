import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MedSynapseLogo } from './MedSynapseLogo';
import {
  Send,
  Printer,
  CheckCircle2,
  ShieldAlert,
  FileText,
  UserCheck,
  Building,
} from 'lucide-react';

export const ReferralGeneratorView: React.FC = () => {
  const { selectedPatient, addAuditLog, currentUserRole } = useApp();
  const [recipientSpecialty, setRecipientSpecialty] = useState('Advanced Heart Failure & Electrophysiology');
  const [targetFacility, setTargetFacility] = useState('Apex Tertiary Heart Centre');
  const [isSigned, setIsSigned] = useState(false);

  const handleSignAndExport = () => {
    setIsSigned(true);
    addAuditLog('REFERRAL_GENERATED', `Clinical referral to ${recipientSpecialty} generated for ${selectedPatient.name}`);
    window.print();
  };

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div>
          <div className="text-xs uppercase font-bold tracking-wider text-primary">
            Inter-Institutional Specialty Care
          </div>
          <h1 className="text-xl font-extrabold text-text-primary">
            Smart Referral Generator: {selectedPatient.name}
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Synthesize evidence-grounded referral packages containing complete documented trajectory and unresolved diagnostic gaps.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleSignAndExport}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Sign &amp; Export Referral</span>
          </button>
        </div>
      </div>

      {/* Target Specialty Selector (Interactive Controls) */}
      <div className="p-4 rounded-xl border border-border bg-surface shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4 no-print text-xs">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <Building className="w-4 h-4 text-text-muted" />
          <span className="font-bold text-text-primary">Referring To:</span>
          <input
            type="text"
            value={targetFacility}
            onChange={(e) => setTargetFacility(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-border bg-surface-secondary text-text-primary font-medium focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <UserCheck className="w-4 h-4 text-text-muted" />
          <span className="font-bold text-text-primary">Target Specialty:</span>
          <input
            type="text"
            value={recipientSpecialty}
            onChange={(e) => setRecipientSpecialty(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-border bg-surface-secondary text-text-primary font-medium focus:outline-none"
          />
        </div>
      </div>

      {/* Main Printable Document (Section 83: Professional print-safe light styling) */}
      <div className="max-w-4xl mx-auto p-8 rounded-2xl border border-slate-300 bg-white text-slate-900 shadow-elevation space-y-6 font-sans">
        {/* Banner */}
        <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-center text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center justify-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-amber-700" />
          <span>AI DRAFT — REQUIRES DOCTOR REVIEW &amp; SIGN-OFF</span>
        </div>

        {/* Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
          <MedSynapseLogo variant="compact" size="md" />
          <div className="text-right">
            <h2 className="text-base font-extrabold uppercase text-slate-900">
              Formal Clinical Referral Letter
            </h2>
            <div className="text-xs text-slate-600">
              Department of Cardiology • Metro Heart Institute
            </div>
          </div>
        </div>

        {/* Recipient Block */}
        <div className="text-xs text-slate-800 space-y-1">
          <div><strong>To:</strong> Clinical Director, Department of {recipientSpecialty}</div>
          <div><strong>Facility:</strong> {targetFacility}</div>
          <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
        </div>

        {/* Patient Block */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div><strong>Patient:</strong> {selectedPatient.name}</div>
          <div><strong>MRN:</strong> {selectedPatient.mrn}</div>
          <div><strong>Age/Gender:</strong> {selectedPatient.age}y / {selectedPatient.gender}</div>
          <div><strong>Referring MD:</strong> {selectedPatient.assignedDoctor}</div>
        </div>

        {/* Reason for Referral */}
        <div className="space-y-1 text-xs text-slate-800">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            Reason For Referral:
          </h3>
          <p className="leading-relaxed">
            Urgent tertiary referral for advanced heart failure evaluation, guideline device consultation (CRT-D / ICD), and secondary cardiorenal syndrome optimization following 3 recurrent admissions within 8 months.
          </p>
        </div>

        {/* Relevant Documented History */}
        <div className="space-y-1 text-xs text-slate-800">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            Summary of Documented Clinical Course:
          </h3>
          <p className="leading-relaxed">
            Mr. Kumar is a 62-year-old male with progressive ischemic cardiomyopathy. Baseline LVEF was 42% in Jan 2026, worsening to 36% in May 2026, and estimated at 30-32% during his recent September 2026 hospitalization. Renal function demonstrates cardiorenal deterioration with serum creatinine rising to 1.82 mg/dL (eGFR 38 mL/min). In-hospital telemetry documented asymptomatic non-sustained ventricular tachycardia.
          </p>
        </div>

        {/* Current Documented Medications */}
        <div className="space-y-1 text-xs text-slate-800">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            Current Documented Medication Regimen:
          </h3>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Torsemide 20 mg morning + 10 mg at 2 PM (Split dose)</li>
            <li>Sacubitril/Valsartan 49/51 mg PO twice daily</li>
            <li>Carvedilol 12.5 mg PO twice daily</li>
            <li>Empagliflozin 10 mg PO once daily</li>
            <li>Spironolactone 25 mg PO once daily</li>
          </ul>
        </div>

        {/* Outstanding Documentation Gaps */}
        <div className="p-3 rounded-lg border border-amber-300 bg-amber-50 text-xs text-amber-900 space-y-1">
          <strong className="block text-[11px] uppercase tracking-wide">
            Noted Documentation Discrepancies &amp; Gaps:
          </strong>
          <div>
            1. Official 2D-Echocardiogram diagnostic report from Sep 16, 2026 is pending retrieval from Central Lab archives.
          </div>
          <div>
            2. 24-hr Holter monitor was recommended upon discharge but outpatient booking remains unconfirmed.
          </div>
        </div>

        {/* Signature Box */}
        <div className="pt-6 border-t border-slate-300 flex items-center justify-between text-xs text-slate-600">
          <div>
            <div className="font-bold text-slate-900">{selectedPatient.assignedDoctor}</div>
            <div className="text-[11px]">Senior Consultant, Metro Heart Institute</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] text-slate-400">MedSynapse Authenticated Record</div>
            <div className="text-emerald-700 font-bold text-[11px]">
              {isSigned ? 'Digitally Signed by Physician' : 'Electronic Draft Pending Signature'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReferralGeneratorView;
