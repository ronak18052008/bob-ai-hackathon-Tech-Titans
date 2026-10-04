import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  History,
  Calendar,
  Pill,
  HeartPulse,
  FileText,
  AlertTriangle,
  Play,
  RotateCcw,
} from 'lucide-react';

export const TimeMachineView: React.FC = () => {
  const { selectedPatient } = useApp();
  const [sliderIndex, setSliderIndex] = useState<number>(3); // 0: Jan, 1: May, 2: Jun, 3: Sep (Current)

  const timepoints = [
    {
      label: 'Jan 22, 2026',
      subtitle: 'Discharge — Admission 1',
      ef: '42%',
      creatinine: '1.28 mg/dL',
      meds: ['Furosemide 40mg QD', 'Ramipril 2.5mg QD', 'Carvedilol 6.25mg BID', 'Metformin 500mg BID'],
      activeDocs: ['Discharge Summary — Admission 1 (22-Jan-2026)'],
      allergies: 'No Known Drug Allergies (NKDA)',
      gaps: 'None',
      summary: 'Patient compensated post initial diuresis. Baseline EF 42% established.',
    },
    {
      label: 'May 10, 2026',
      subtitle: 'Outpatient Follow-up Review',
      ef: '42% (Unchanged)',
      creatinine: '1.30 mg/dL',
      meds: ['Furosemide 40mg QD', 'Ramipril 5mg QD (Titrated up)', 'Carvedilol 6.25mg BID', 'Metformin 500mg BID'],
      activeDocs: [
        'Discharge Summary — Admission 1',
        'Outpatient Cardiology Consultation Note (10-May-2026)',
      ],
      allergies: 'NKDA',
      gaps: 'None',
      summary: 'Stable outpatient compensation. Ramipril titrated up to 5mg daily.',
    },
    {
      label: 'Jun 04, 2026',
      subtitle: 'Discharge — Admission 2 (CCU)',
      ef: '36% (Worsened by 6%)',
      creatinine: '1.45 mg/dL',
      meds: [
        'Torsemide 20mg QD (Replaced Furosemide)',
        'Sacubitril/Valsartan 24/26mg BID (Replaced Ramipril)',
        'Carvedilol 12.5mg BID',
        'Empagliflozin 10mg QD',
        'Spironolactone 25mg QD',
      ],
      activeDocs: [
        'Discharge Summary — Admission 1',
        'Outpatient Cardiology Note (May 2026)',
        'Discharge Summary — Admission 2 (04-Jun-2026)',
      ],
      allergies: 'Trimethoprim/Sulfamethoxazole rash documented in CCU triage',
      gaps: 'None',
      summary: 'Admitted for Diclofenac-induced fluid overload. Switched to quadruple GDMT with Torsemide.',
    },
    {
      label: 'Sep 18, 2026',
      subtitle: 'Discharge — Admission 3 (Current State)',
      ef: '32% (Severely depressed)',
      creatinine: '1.82 mg/dL (Cardiorenal Syndrome)',
      meds: [
        'Torsemide 20mg morning + 10mg 2PM (Split Dose)',
        'Sacubitril/Valsartan 49/51mg BID (Titrated up)',
        'Carvedilol 12.5mg BID',
        'Empagliflozin 10mg QD',
        'Spironolactone 25mg QD',
      ],
      activeDocs: [
        'Discharge Summary — Admission 1',
        'Outpatient Cardiology Note (May 2026)',
        'Discharge Summary — Admission 2',
        'Discharge Summary — Admission 3 (18-Sep-2026)',
      ],
      allergies: 'Documented Sulfa rash vs NKDA contradiction',
      gaps: 'Missing formal Echo report from Sep 16; Holter monitor booking unconfirmed',
      summary: 'Acute cardiorenal syndrome. Diuretic split-dose intensified. Critical documentation gaps flagged.',
    },
  ];

  const current = timepoints[sliderIndex];

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase font-bold tracking-wider text-primary">
            Longitudinal Knowledge State
          </div>
          <h1 className="text-xl font-extrabold text-text-primary">
            Patient Journey Time Machine: {selectedPatient.name}
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Slide through historical time to reconstruct what medical facts and documentation existed at each date.
          </p>
        </div>

        <button
          onClick={() => setSliderIndex(3)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-xs text-text-secondary font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Latest Date</span>
        </button>
      </div>

      {/* Interactive Time Slider */}
      <div className="p-6 rounded-2xl border border-border bg-surface shadow-subtle space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-text-muted">Select Historical Horizon:</span>
          <span className="font-mono text-primary font-bold text-sm">{current.label}</span>
        </div>

        {/* Range Slider */}
        <input
          type="range"
          min="0"
          max="3"
          step="1"
          value={sliderIndex}
          onChange={(e) => setSliderIndex(parseInt(e.target.value))}
          className="w-full h-2 bg-surface-secondary rounded-lg appearance-none cursor-pointer accent-primary border border-border"
        />

        {/* Slider Step Labels */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {timepoints.map((t, idx) => (
            <button
              key={idx}
              onClick={() => setSliderIndex(idx)}
              className={`p-2 rounded-xl border transition-all ${
                sliderIndex === idx
                  ? 'border-primary bg-primary-soft/40 font-bold text-primary shadow-sm'
                  : 'border-transparent text-text-muted hover:text-text-primary hover:bg-surface-secondary'
              }`}
            >
              <div className="text-[11px] font-mono">{t.label.split(',')[0]}</div>
              <div className="text-[10px] text-text-muted truncate mt-0.5">{t.subtitle.split('—')[0]}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Snapshot of Medical Knowledge on Selected Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Clinical Trajectory & Vitals */}
        <div className="p-5 rounded-2xl border border-border bg-surface shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <div className="flex items-center space-x-2">
              <HeartPulse className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-sm text-text-primary">Clinical Trajectory on {current.label}</h3>
            </div>
            <span className="text-[10px] font-mono bg-surface-secondary px-2 py-0.5 rounded border border-border">
              {current.subtitle}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-surface-secondary border border-border">
              <span className="text-[10px] uppercase font-bold text-text-muted">Ejection Fraction (LVEF)</span>
              <div className="font-mono font-bold text-base text-text-primary mt-1">{current.ef}</div>
            </div>

            <div className="p-3 rounded-xl bg-surface-secondary border border-border">
              <span className="text-[10px] uppercase font-bold text-text-muted">Serum Creatinine</span>
              <div className="font-mono font-bold text-base text-text-primary mt-1">{current.creatinine}</div>
            </div>
          </div>

          <div className="text-xs text-text-secondary leading-relaxed">
            <strong>Documented Clinical State:</strong> {current.summary}
          </div>

          <div className="text-xs text-text-muted">
            <strong>Known Allergies on this Date:</strong> {current.allergies}
          </div>
        </div>

        {/* Card 2: Active Medications & Available Documents */}
        <div className="p-5 rounded-2xl border border-border bg-surface shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <div className="flex items-center space-x-2">
              <Pill className="w-5 h-5 text-ai" />
              <h3 className="font-bold text-sm text-text-primary">Active Regimen &amp; Records Archive</h3>
            </div>
            <span className="text-xs font-mono text-primary font-bold">
              {current.meds.length} Active Meds
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="text-[10px] uppercase font-bold tracking-wider text-text-muted">
              Active Prescriptions:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {current.meds.map((m, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-lg bg-surface-secondary border border-border font-medium text-text-primary"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-border space-y-1.5">
            <div className="text-[10px] uppercase font-bold tracking-wider text-text-muted">
              Records Present in Repository on this Date:
            </div>
            <div className="space-y-1 text-xs">
              {current.activeDocs.map((doc, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-text-secondary">
                  <FileText className="w-3.5 h-3.5 text-text-muted" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {current.gaps !== 'None' && (
            <div className="p-2.5 rounded-lg bg-warning-soft/30 border border-warning/30 text-xs text-warning">
              <strong>Outstanding Gaps:</strong> {current.gaps}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default TimeMachineView;
