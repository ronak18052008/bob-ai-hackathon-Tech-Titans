import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PATIENT_A_DETAILS } from '../data/mockPatients';
import {
  Activity,
  ArrowRight,
  GitCompare,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export const WhatChangedView: React.FC = () => {
  const { selectedPatient, openWhyModal } = useApp();
  const [activeTab, setActiveTab] = useState<'lens' | 'admission-compare'>('lens');

  const changes = PATIENT_A_DETAILS.whatChanged;

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase font-bold tracking-wider text-primary">
            Longitudinal Change Intelligence
          </div>
          <h1 className="text-xl font-extrabold text-text-primary">
            Change Lens: {selectedPatient.name}
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Surface what changed between hospitalizations, medication lists, and diagnostic tests.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex bg-surface-secondary border border-border p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('lens')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'lens' ? 'bg-surface text-primary shadow-subtle' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Change Lens
          </button>
          <button
            onClick={() => setActiveTab('admission-compare')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'admission-compare'
                ? 'bg-surface text-primary shadow-subtle'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Admission Comparison
          </button>
        </div>
      </div>

      {activeTab === 'lens' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {changes.map((chg) => (
              <div
                key={chg.id}
                className="p-5 rounded-2xl border border-border bg-surface shadow-subtle space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-primary" />
                    <h3 className="font-bold text-sm text-text-primary">{chg.title}</h3>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-ai-soft text-ai">
                    {chg.category}
                  </span>
                </div>

                {/* Side by side state transition */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-surface-secondary border border-border">
                    <div className="text-[10px] uppercase font-bold text-text-muted">Previous State</div>
                    <div className="font-semibold text-text-secondary mt-1">{chg.priorState}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-primary-soft/30 border border-primary/30">
                    <div className="text-[10px] uppercase font-bold text-primary">Current Documented State</div>
                    <div className="font-semibold text-text-primary mt-1">{chg.currentState}</div>
                  </div>
                </div>

                <div className="text-xs text-text-secondary">
                  <strong>Documented Rationale:</strong> {chg.documentedReason}
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-text-muted">
                  <span className="flex items-center space-x-1 truncate">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{chg.evidenceSource}</span>
                  </span>
                  <button
                    onClick={() =>
                      openWhyModal({
                        title: chg.title,
                        claim: `${chg.priorState} changed to ${chg.currentState}`,
                        explanation: chg.documentedReason,
                        source: chg.evidenceSource,
                      })
                    }
                    className="text-ai hover:underline text-[11px] font-semibold shrink-0"
                  >
                    Why is this here?
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Section 31: Side-by-side Admission Comparison */
        <div className="p-5 rounded-2xl border border-border bg-surface shadow-subtle space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="text-base font-bold text-text-primary">Admission Comparison Matrix</h2>
              <p className="text-xs text-text-muted">
                Side-by-side evaluation of Admission 2 (May 2026) vs. Admission 3 (Sep 2026)
              </p>
            </div>
            <GitCompare className="w-5 h-5 text-primary" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1: Admission 2 */}
            <div className="p-4 rounded-xl border border-border bg-surface-secondary space-y-4">
              <div className="border-b border-border pb-2">
                <span className="text-[10px] uppercase font-bold text-text-muted">Previous Admission</span>
                <h3 className="font-bold text-sm text-text-primary">Admission 2 — Coronary Care Unit</h3>
                <span className="text-xs font-mono text-text-muted">29-May-2026 to 04-Jun-2026</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <strong className="text-text-muted block text-[10px] uppercase">Primary Diagnosis</strong>
                  <span className="text-text-primary font-medium">Acute Decompensated Heart Failure (NSAID triggered)</span>
                </div>
                <div>
                  <strong className="text-text-muted block text-[10px] uppercase">Echocardiography (LVEF)</strong>
                  <span className="text-text-primary font-medium">LVEF 36%, Moderate Mitral Regurgitation</span>
                </div>
                <div>
                  <strong className="text-text-muted block text-[10px] uppercase">Renal Function</strong>
                  <span className="text-text-primary font-medium">Creatinine 1.45 mg/dL (eGFR 51 mL/min)</span>
                </div>
                <div>
                  <strong className="text-text-muted block text-[10px] uppercase">Diuretic Regimen</strong>
                  <span className="text-text-primary font-medium">Torsemide 20 mg PO once daily</span>
                </div>
                <div>
                  <strong className="text-text-muted block text-[10px] uppercase">Neurohormonal Therapy</strong>
                  <span className="text-text-primary font-medium">Sacubitril/Valsartan 24/26 mg BID + Carvedilol 12.5mg BID</span>
                </div>
              </div>
            </div>

            {/* Column 2: Admission 3 */}
            <div className="p-4 rounded-xl border border-primary/40 bg-primary-soft/20 space-y-4">
              <div className="border-b border-primary/20 pb-2">
                <span className="text-[10px] uppercase font-bold text-primary">Current / Latest Admission</span>
                <h3 className="font-bold text-sm text-text-primary">Admission 3 — Advanced Heart Failure Unit</h3>
                <span className="text-xs font-mono text-text-muted">11-Sep-2026 to 18-Sep-2026</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <strong className="text-text-muted block text-[10px] uppercase">Primary Diagnosis</strong>
                  <span className="text-text-primary font-bold text-error">Type 2 Cardiorenal Syndrome &amp; HFrEF Exacerbation</span>
                </div>
                <div>
                  <strong className="text-text-muted block text-[10px] uppercase">Echocardiography (LVEF)</strong>
                  <span className="text-text-primary font-bold text-error">Estimated LVEF 32% (Formal Echo report missing!)</span>
                </div>
                <div>
                  <strong className="text-text-muted block text-[10px] uppercase">Renal Function</strong>
                  <span className="text-text-primary font-bold text-error">Creatinine 1.82 mg/dL (eGFR 38 mL/min) — WORSENED</span>
                </div>
                <div>
                  <strong className="text-text-muted block text-[10px] uppercase">Diuretic Regimen</strong>
                  <span className="text-text-primary font-bold text-primary">Torsemide 20 mg morning + 10 mg at 2 PM (Split dose)</span>
                </div>
                <div>
                  <strong className="text-text-muted block text-[10px] uppercase">Neurohormonal Therapy</strong>
                  <span className="text-text-primary font-bold text-primary">Sacubitril/Valsartan 49/51 mg BID (TITRATED UP)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default WhatChangedView;
