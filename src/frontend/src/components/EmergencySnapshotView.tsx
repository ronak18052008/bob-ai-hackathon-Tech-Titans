import React from 'react';
import { useApp } from '../context/AppContext';
import { PATIENT_A_DETAILS } from '../data/mockPatients';
import {
  Flame,
  AlertTriangle,
  Pill,
  ShieldAlert,
  HeartPulse,
  Clock,
  Printer,
  FileText,
} from 'lucide-react';

export const EmergencySnapshotView: React.FC = () => {
  const { selectedPatient } = useApp();

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div>
          <div className="text-xs uppercase font-bold tracking-wider text-error">
            Rapid Access Documented Triage
          </div>
          <h1 className="text-xl font-extrabold text-text-primary">
            Emergency Snapshot: {selectedPatient.name}
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Rapid-glance documented medical facts for acute care environments. Not a diagnostic engine.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-surface border border-border hover:bg-surface-secondary text-text-primary text-xs font-bold shadow-sm transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print Emergency Sheet</span>
        </button>
      </div>

      {/* Mandatory Clinical Disclaimer Banner (Section 54 & 58) */}
      <div className="p-4 rounded-xl border border-error/50 bg-error-soft/30 flex items-center space-x-3 text-error">
        <ShieldAlert className="w-6 h-6 shrink-0" />
        <div className="text-xs">
          <strong className="font-extrabold uppercase tracking-wide block">
            VERIFY AGAINST SOURCE RECORDS BEFORE CLINICAL ACTION
          </strong>
          <span>
            This snapshot extracts documented facts from scanned records. It does not replace clinical evaluation or real-time vital monitoring.
          </span>
        </div>
      </div>

      {/* 4-Box Grid: Allergies, Current Meds, Recent Events, Conflicts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Allergies Box */}
        <div className="p-5 rounded-2xl border border-error/40 bg-surface shadow-subtle space-y-2">
          <div className="flex items-center space-x-2 text-error font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Documented Allergies &amp; Sensitivities</span>
          </div>
          <div className="p-3 rounded-xl bg-error-soft/20 border border-error/30 text-xs text-error font-medium space-y-1">
            <div>• Trimethoprim/Sulfamethoxazole (Documented rash in CCU admission triage 2026-05-29)</div>
            <div className="text-text-muted italic">• Note: Discharge Summary 1 marked NKDA (Documentation Discrepancy logged)</div>
          </div>
        </div>

        {/* Current Active Regimen */}
        <div className="p-5 rounded-2xl border border-border bg-surface shadow-subtle space-y-2">
          <div className="flex items-center space-x-2 text-primary font-bold text-sm">
            <Pill className="w-4 h-4" />
            <span>Current Documented Medications</span>
          </div>
          <ul className="text-xs space-y-1 text-text-secondary list-disc list-inside">
            <li><strong>Torsemide:</strong> 20 mg morning + 10 mg 2 PM (Oral split-dose)</li>
            <li><strong>Sacubitril/Valsartan:</strong> 49/51 mg BID</li>
            <li><strong>Carvedilol:</strong> 12.5 mg BID</li>
            <li><strong>Spironolactone:</strong> 25 mg QD</li>
            <li><strong>Empagliflozin:</strong> 10 mg QD</li>
          </ul>
        </div>

        {/* Baseline Vitals & Organ Function */}
        <div className="p-5 rounded-2xl border border-border bg-surface shadow-subtle space-y-2">
          <div className="flex items-center space-x-2 text-ai font-bold text-sm">
            <HeartPulse className="w-4 h-4" />
            <span>Last Documented Labs &amp; Functional Status</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-surface-secondary border border-border">
              <span className="text-[10px] text-text-muted uppercase">Ejection Fraction (LVEF)</span>
              <div className="font-bold font-mono text-text-primary text-sm mt-0.5">32% (Depressed)</div>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-secondary border border-border">
              <span className="text-[10px] text-text-muted uppercase">Serum Creatinine</span>
              <div className="font-bold font-mono text-text-primary text-sm mt-0.5">1.82 mg/dL (eGFR 38)</div>
            </div>
          </div>
          <div className="text-[11px] text-text-muted">
            Last measured on 2026-09-18 at Metro Heart Institute
          </div>
        </div>

        {/* Active Documentation Conflicts & Gaps */}
        <div className="p-5 rounded-2xl border border-warning/40 bg-surface shadow-subtle space-y-2">
          <div className="flex items-center space-x-2 text-warning font-bold text-sm">
            <Clock className="w-4 h-4" />
            <span>Active Record Gaps &amp; Discrepancies</span>
          </div>
          <div className="text-xs text-text-secondary space-y-1">
            <div>• <strong>Echo Report Missing:</strong> Formal report for Sep 16 Echo cited in note is missing from file.</div>
            <div>• <strong>Arrhythmia:</strong> Telemetry documented 6-beat non-sustained VT during last CCU stay.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EmergencySnapshotView;
