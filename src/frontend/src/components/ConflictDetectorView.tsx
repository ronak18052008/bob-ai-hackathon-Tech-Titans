import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PATIENT_A_DETAILS } from '../data/mockPatients';
import {
  AlertOctagon,
  CheckCircle2,
  XCircle,
  FileText,
  AlertTriangle,
  MessageSquare,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const ConflictDetectorView: React.FC = () => {
  const { selectedPatient, resolveConflict, setActiveEvidenceSnippet, setActiveTab } = useApp();
  const [resolutionNotes, setResolutionNotes] = useState<{ [key: string]: string }>({});

  const conflicts = PATIENT_A_DETAILS.conflicts;

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase font-bold tracking-wider text-error">
            Documentation Contradiction Engine
          </div>
          <h1 className="text-xl font-extrabold text-text-primary">
            Documentation Conflict Detector: {selectedPatient.name}
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Identify direct contradictions between discharge orders, clinic notes, and pharmacy records before clinical errors occur.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs bg-error-soft border border-error/30 px-3 py-1.5 rounded-xl text-error font-semibold">
          <AlertOctagon className="w-4 h-4 animate-bounce" />
          <span>{conflicts.length} Cross-Document Discrepancy Flagged</span>
        </div>
      </div>

      {/* Conflict Cards */}
      <div className="space-y-5">
        {conflicts.map((cnf) => (
          <div
            key={cnf.id}
            className="p-5 rounded-2xl border border-error/40 bg-surface shadow-subtle space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-error-soft text-error">
                  <ShieldAlert className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[10px] uppercase font-bold text-error tracking-wider">
                    {cnf.conflictType}
                  </span>
                  <h3 className="font-bold text-base text-text-primary">{cnf.description}</h3>
                </div>
              </div>
              <span className="text-xs font-mono bg-error-soft text-error px-2 py-0.5 rounded border border-error/30 font-semibold">
                Status: {cnf.resolutionStatus}
              </span>
            </div>

            {/* Side-by-side exact statement evidence */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Source A */}
              <div className="p-4 rounded-xl bg-surface-secondary border border-border space-y-2">
                <div className="flex items-center justify-between border-b border-border pb-1.5">
                  <span className="font-bold text-text-primary text-xs">
                    Source A: {cnf.sourceA.documentTitle}
                  </span>
                  <span className="text-[10px] font-mono text-text-muted">
                    Page {cnf.sourceA.page} • {cnf.sourceA.date}
                  </span>
                </div>
                <div className="font-mono text-[11px] p-2.5 rounded bg-surface border border-border text-text-primary">
                  "{cnf.sourceA.text}"
                </div>
                <button
                  onClick={() => {
                    setActiveEvidenceSnippet({
                      title: cnf.sourceA.documentTitle,
                      text: cnf.sourceA.text,
                      page: cnf.sourceA.page,
                      docTitle: cnf.sourceA.documentTitle,
                      state: 'CONFLICTING',
                    });
                    setActiveTab('synapse');
                  }}
                  className="text-primary hover:underline text-[11px] font-semibold flex items-center space-x-1"
                >
                  <span>View Source A in Evidence Rail</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Source B */}
              <div className="p-4 rounded-xl bg-error-soft/20 border border-error/30 space-y-2">
                <div className="flex items-center justify-between border-b border-error/20 pb-1.5">
                  <span className="font-bold text-error text-xs">
                    Source B: {cnf.sourceB.documentTitle}
                  </span>
                  <span className="text-[10px] font-mono text-text-muted">
                    Page {cnf.sourceB.page} • {cnf.sourceB.date}
                  </span>
                </div>
                <div className="font-mono text-[11px] p-2.5 rounded bg-surface border border-error/30 text-text-primary">
                  "{cnf.sourceB.text}"
                </div>
                <button
                  onClick={() => {
                    setActiveEvidenceSnippet({
                      title: cnf.sourceB.documentTitle,
                      text: cnf.sourceB.text,
                      page: cnf.sourceB.page,
                      docTitle: cnf.sourceB.documentTitle,
                      state: 'CONFLICTING',
                    });
                    setActiveTab('synapse');
                  }}
                  className="text-error hover:underline text-[11px] font-semibold flex items-center space-x-1"
                >
                  <span>View Source B in Evidence Rail</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Doctor Resolution Panel */}
            <div className="p-3.5 rounded-xl bg-surface-secondary border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-text-secondary">
                <span className="font-bold text-text-primary">Doctor Action Required:</span> Confirm true clinical state and log resolution note in patient audit history.
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => resolveConflict(cnf.id, 'Confirmed Source B (Sulfa allergy confirmed by clinician)')}
                  className="px-3 py-1.5 rounded-lg bg-success hover:bg-success/90 text-white text-xs font-bold transition-colors flex items-center space-x-1 shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm Source B</span>
                </button>

                <button
                  onClick={() => resolveConflict(cnf.id, 'Dismissed discrepancy (Non-allergic reaction)')}
                  className="px-3 py-1.5 rounded-lg bg-surface border border-border hover:bg-surface-hover text-text-secondary text-xs font-semibold transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ConflictDetectorView;
