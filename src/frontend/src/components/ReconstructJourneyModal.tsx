import React from 'react';
import { useApp } from '../context/AppContext';
import { MedSynapseLogo } from './MedSynapseLogo';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileText,
  Clock,
  Radar,
  HelpCircle,
} from 'lucide-react';
import { PATIENT_A_DETAILS } from '../data/mockPatients';

export const ReconstructJourneyModal: React.FC = () => {
  const {
    isReconstructModalOpen,
    closeReconstructionModal,
    isReconstructing,
    reconstructionStage,
    selectedPatient,
  } = useApp();

  if (!isReconstructModalOpen) return null;

  const stages = [
    { title: 'Ingesting Clinical Records', desc: '4 documents identified across 3 admissions' },
    { title: 'Multimodal OCR & Layout Detection', desc: 'Scanned tables, forms, and clinical notes parsed' },
    { title: 'Temporal Event Sequence Extraction', desc: '10 clinical events chronologically anchored' },
    { title: 'Cross-Document Evidence Mapping', desc: 'Exact citations mapped to source pages and sections' },
    { title: 'Constructing Longitudinal Graph', desc: '18 graph nodes and 24 relationship edges established' },
    { title: 'Clinical Gap Radar Scanning', desc: '2 documentation gaps identified (Missing Echo report, Holter follow-up)' },
    { title: 'Documentation Conflict Detection', desc: '1 allergy discrepancy flagged for doctor review' },
    { title: 'Synthesis & Patient Story Generation', desc: 'Evidence-grounded journey reconstruction complete' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-surface border border-border rounded-2xl shadow-popover overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-border bg-gradient-to-r from-primary/10 via-surface to-ai/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MedSynapseLogo variant="icon" size="sm" />
            <div>
              <div className="text-xs uppercase font-bold tracking-wider text-primary">
                MedSynapse Clinical OS
              </div>
              <h2 className="text-lg font-bold text-text-primary">
                Reconstruct Patient Journey: {selectedPatient.name}
              </h2>
            </div>
          </div>
          <span className="text-xs font-mono bg-surface-secondary px-2.5 py-1 rounded border border-border text-text-secondary">
            {selectedPatient.mrn}
          </span>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Active Pipeline Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-text-muted">
                {isReconstructing ? 'Reconstruction Pipeline in Progress...' : 'Reconstruction Completed'}
              </span>
              <span className="font-mono text-primary font-bold">
                {Math.min(100, Math.round(((reconstructionStage + 1) / stages.length) * 100))}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-surface-secondary rounded-full overflow-hidden border border-border">
              <div
                className="h-full bg-gradient-to-r from-primary to-ai transition-all duration-300 rounded-full"
                style={{
                  width: `${Math.min(100, Math.round(((reconstructionStage + 1) / stages.length) * 100))}%`,
                }}
              />
            </div>

            {/* Stages List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
              {stages.map((st, idx) => {
                const isPassed = reconstructionStage > idx || !isReconstructing;
                const isCurrent = reconstructionStage === idx && isReconstructing;
                return (
                  <div
                    key={st.title}
                    className={`p-2.5 rounded-lg border text-xs flex items-start space-x-2.5 transition-all ${
                      isPassed
                        ? 'border-success/30 bg-success-soft/30 text-text-primary'
                        : isCurrent
                        ? 'border-primary/50 bg-primary-soft/40 shadow-sm animate-pulse'
                        : 'border-border bg-surface-secondary/40 opacity-40'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      ) : isCurrent ? (
                        <Sparkles className="w-4 h-4 text-primary animate-spin" />
                      ) : (
                        <Clock className="w-4 h-4 text-text-muted" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-text-primary">{st.title}</div>
                      <div className="text-[11px] text-text-muted leading-tight mt-0.5">{st.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 74: WHAT HAPPENED, WHAT CHANGED, WHAT IS MISSING, WHAT CONFLICTS */}
          {!isReconstructing && (
            <div className="space-y-4 pt-4 border-t border-border animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="text-xs uppercase font-bold tracking-wider text-text-muted flex items-center justify-between">
                <span>Executive Synthesis</span>
                <span className="text-[11px] text-primary font-medium">Ground-truth verified</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* WHAT HAPPENED */}
                <div className="p-3.5 rounded-xl border border-border bg-surface-secondary space-y-1.5">
                  <div className="flex items-center space-x-2 text-xs font-bold text-text-primary">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>WHAT HAPPENED</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Patient has 3 documented hospitalizations across 8 months for acute decompensated heart failure, with LVEF declining from 42% to 32% and developing Type 2 Cardiorenal syndrome.
                  </p>
                </div>

                {/* WHAT CHANGED */}
                <div className="p-3.5 rounded-xl border border-border bg-surface-secondary space-y-1.5">
                  <div className="flex items-center space-x-2 text-xs font-bold text-text-primary">
                    <Sparkles className="w-4 h-4 text-ai" />
                    <span>WHAT CHANGED</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Switched from Furosemide to split-dose Torsemide (20mg + 10mg); upgraded from Ramipril to Sacubitril/Valsartan 49/51mg BID; Empagliflozin 10mg and Spironolactone added.
                  </p>
                </div>

                {/* WHAT IS MISSING */}
                <div className="p-3.5 rounded-xl border border-warning/40 bg-warning-soft/30 space-y-1.5">
                  <div className="flex items-center space-x-2 text-xs font-bold text-warning">
                    <Radar className="w-4 h-4 text-warning" />
                    <span>WHAT IS MISSING (GAP RADAR)</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Formal 2D-Echocardiogram report dated 16-Sep-2026 is cited in clinical notes but missing from chart; 24-hr Holter monitor follow-up remains unscheduled.
                  </p>
                </div>

                {/* WHAT CONFLICTS */}
                <div className="p-3.5 rounded-xl border border-error/40 bg-error-soft/30 space-y-1.5">
                  <div className="flex items-center space-x-2 text-xs font-bold text-error">
                    <AlertTriangle className="w-4 h-4 text-error" />
                    <span>WHAT CONFLICTS</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Discharge Summary 1 recorded "No Known Drug Allergies", while CCU admission triage documented a past rash to Sulfa antibiotics.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-surface-secondary flex items-center justify-between">
          <div className="text-xs text-text-muted flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span>Traceable to 4 source records</span>
          </div>

          <button
            onClick={closeReconstructionModal}
            disabled={isReconstructing}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            <span>Open Synapse View Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ReconstructJourneyModal;
