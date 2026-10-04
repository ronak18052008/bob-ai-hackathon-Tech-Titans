import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MedSynapseLogo } from './MedSynapseLogo';
import {
  FileCheck2,
  Printer,
  Download,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Sparkles,
  AlertTriangle,
  FileText,
} from 'lucide-react';

export const HandoffGeneratorView: React.FC = () => {
  const { selectedPatient, currentUserRole, addAuditLog } = useApp();
  const [isApproved, setIsApproved] = useState(false);

  const handlePrint = () => {
    window.print();
    addAuditLog('REPORT_EXPORTED', `Clinical handoff summary printed/exported for ${selectedPatient.name}`);
  };

  const handleApprove = () => {
    setIsApproved(true);
    addAuditLog('HANDOFF_APPROVED', `Clinical handoff formally verified and approved by ${currentUserRole}`);
  };

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div>
          <div className="text-xs uppercase font-bold tracking-wider text-primary">
            Inter-Shift Clinical Continuity
          </div>
          <h1 className="text-xl font-extrabold text-text-primary">
            Synapse Handoff: {selectedPatient.name}
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Evidence-grounded structured handoff summarizing active trajectory, medication titrations, and unresolved gaps.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {!isApproved ? (
            <button
              onClick={handleApprove}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-success hover:bg-success/90 text-white font-bold text-xs shadow-sm transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify &amp; Approve Handoff</span>
            </button>
          ) : (
            <span className="flex items-center space-x-1 text-xs px-3 py-1.5 rounded-xl bg-success-soft text-success border border-success/30 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Doctor Verified &amp; Approved</span>
            </span>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Main Printable Handoff Document (Section 83: Professional print-safe light styling) */}
      <div className="max-w-4xl mx-auto p-8 rounded-2xl border border-slate-300 bg-white text-slate-900 shadow-elevation space-y-6 font-sans">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
          <MedSynapseLogo variant="compact" size="md" />
          <div className="text-right">
            <h2 className="text-base font-extrabold tracking-tight uppercase text-slate-900">
              Longitudinal Clinical Handoff
            </h2>
            <div className="text-xs font-mono text-slate-500">
              Generated: {new Date().toLocaleDateString()} • Verified by MedSynapse AI
            </div>
            <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
              {isApproved ? 'CLINICALLY APPROVED RECORD' : 'AI DRAFT — REQUIRES DOCTOR REVIEW'}
            </div>
          </div>
        </div>

        {/* Section 1: Patient Context */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Patient Name</span>
            <div className="font-bold text-slate-900 text-sm">{selectedPatient.name}</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500">MRN / ABHA</span>
            <div className="font-mono text-slate-900">{selectedPatient.mrn}</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Age / Gender / Blood</span>
            <div className="text-slate-900">{selectedPatient.age}y / {selectedPatient.gender} / {selectedPatient.bloodGroup}</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Attending Physician</span>
            <div className="font-medium text-slate-900">{selectedPatient.assignedDoctor}</div>
          </div>
        </div>

        {/* Section 2: Recent Documented Events & Trajectory */}
        <div className="space-y-2 text-xs">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-sky-700" />
            <span>1. Recent Documented Events &amp; Clinical Course</span>
          </h3>
          <p className="text-slate-700 leading-relaxed">
            Patient discharged on 2026-09-18 following his 3rd admission for acute decompensated heart failure with Type 2 Cardiorenal syndrome. LVEF severely depressed at 32%. Creatinine peaked at 1.82 mg/dL. Diuresis intensified with oral split-dose Torsemide.
          </p>
        </div>

        {/* Section 3: Medication Evolution & Current Regimen */}
        <div className="space-y-2 text-xs">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-indigo-700" />
            <span>2. Current Documented Medications &amp; Evolution</span>
          </h3>
          <ul className="list-disc list-inside space-y-1 text-slate-800">
            <li><strong>Torsemide:</strong> 20 mg morning + 10 mg 2 PM (Escalated from 20mg daily for refractory fluid retention).</li>
            <li><strong>Sacubitril/Valsartan (Entresto):</strong> 49/51 mg PO twice daily (Titrated up from 24/26mg BID).</li>
            <li><strong>Carvedilol:</strong> 12.5 mg PO twice daily (Maintained).</li>
            <li><strong>Spironolactone:</strong> 25 mg PO once daily (Continued).</li>
            <li><strong>Empagliflozin:</strong> 10 mg PO once daily (Quadruple GDMT).</li>
          </ul>
        </div>

        {/* Section 4: Outstanding Items & Documentation Gaps */}
        <div className="p-4 rounded-xl border border-amber-300 bg-amber-50 space-y-2 text-xs">
          <h3 className="font-bold text-sm text-amber-900 uppercase tracking-wider flex items-center space-x-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>3. Outstanding Items &amp; Documentation Gaps (Attention Needed)</span>
          </h3>
          <div className="space-y-1 text-slate-800">
            <div>
              • <strong>Missing Diagnostic Report:</strong> 2D-Echocardiogram conducted in Central Lab on 16-Sep-2026 referenced in notes but missing from chart.
            </div>
            <div>
              • <strong>Unconfirmed Holter Scheduling:</strong> 24-hr Holter monitor requested for 6-beat asymptomatic non-sustained VT on telemetry.
            </div>
          </div>
        </div>

        {/* Section 5: Ground-Truth Evidence Footnote */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Ground truth: Traceable to 4 uploaded hospital records</span>
          <span className="font-semibold text-slate-700">MedSynapse AI Clinical OS</span>
        </div>
      </div>
    </div>
  );
};
export default HandoffGeneratorView;
