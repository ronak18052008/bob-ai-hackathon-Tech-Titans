import React from 'react';
import { useApp } from '../context/AppContext';
import { PATIENT_A_DETAILS } from '../data/mockPatients';
import {
  Radar,
  AlertTriangle,
  FileQuestion,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  FileText,
} from 'lucide-react';

export const GapRadarView: React.FC = () => {
  const { selectedPatient, resolveGap, setActiveEvidenceSnippet, setActiveTab } = useApp();
  const gaps = PATIENT_A_DETAILS.gaps;

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase font-bold tracking-wider text-warning">
            Documentation Surveillance
          </div>
          <h1 className="text-xl font-extrabold text-text-primary">
            Clinical Gap Radar: {selectedPatient.name}
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Surfacing referenced clinical items that lack supporting documentation in the medical chart.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs bg-warning-soft border border-warning/30 px-3 py-1.5 rounded-xl text-warning font-semibold">
          <Radar className="w-4 h-4 animate-pulse" />
          <span>{gaps.length} Active Documentation Gaps Flagged</span>
        </div>
      </div>

      {/* Section 35: MISSING FROM THE STORY HIGHLIGHT BOX */}
      <div className="p-5 rounded-2xl border border-warning/40 bg-gradient-to-r from-warning-soft/40 via-surface to-warning-soft/20 shadow-subtle space-y-3">
        <div className="flex items-center space-x-2 text-warning font-bold text-sm">
          <FileQuestion className="w-5 h-5 text-warning" />
          <span>What appears to be missing from this documented journey?</span>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          MedSynapse AI cross-referenced all discharge summaries, consultation notes, and orders. The following critical items were referenced by clinicians in narrative text but do not have an official source report in the chart:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-surface border border-border text-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-error">Missing Diagnostic Study</span>
            <div className="font-bold text-text-primary">Formal 2D-Echocardiogram (Sep 16, 2026)</div>
            <p className="text-[11px] text-text-muted">
              Cited as basis for assessing severe LV dysfunction (30-32%) in Discharge Summary 3, but Central Lab report was not attached.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-surface border border-border text-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-warning">Unconfirmed Outpatient Booking</span>
            <div className="font-bold text-text-primary">24-Hour Ambulatory Holter Monitor</div>
            <p className="text-[11px] text-text-muted">
              Ordered for non-sustained ventricular tachycardia documented on telemetry; booking status unconfirmed in record.
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Gaps Cards */}
      <div className="space-y-4">
        <div className="text-xs uppercase font-bold tracking-wider text-text-muted">
          Detailed Documentation Gaps &amp; Clinical Actions
        </div>

        <div className="grid grid-cols-1 gap-4">
          {gaps.map((gap) => (
            <div
              key={gap.id}
              className="p-5 rounded-2xl border border-border bg-surface shadow-subtle flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div className="space-y-2.5 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-warning-soft text-warning border border-warning/30">
                    {gap.gapType}
                  </span>
                  <span className="text-xs font-mono text-text-muted">Status: {gap.status}</span>
                </div>

                <h3 className="font-bold text-base text-text-primary">{gap.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{gap.description}</p>

                {/* Ground Truth Citation */}
                <div className="p-3 rounded-xl bg-surface-secondary border border-border space-y-1 text-xs">
                  <div className="text-[10px] uppercase font-bold text-text-muted">
                    Exact Statement in Record ({gap.referencingDocument}, p. {gap.referencingPage}):
                  </div>
                  <div className="italic font-mono text-text-primary">
                    "{gap.exactReferenceText}"
                  </div>
                </div>

                <div className="text-xs text-primary font-semibold">
                  <strong>Recommended Clinician Action:</strong> {gap.doctorAction}
                </div>
              </div>

              <div className="flex flex-col space-y-2 shrink-0 md:w-48">
                <button
                  onClick={() => resolveGap(gap.id)}
                  className="w-full px-3 py-2 rounded-xl bg-success hover:bg-success/90 text-white text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Resolved</span>
                </button>

                <button
                  onClick={() => {
                    setActiveEvidenceSnippet({
                      title: gap.title,
                      text: gap.exactReferenceText,
                      page: gap.referencingPage,
                      docTitle: gap.referencingDocument,
                      state: 'NOT FOUND',
                    });
                    setActiveTab('synapse');
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-border hover:bg-surface-secondary text-text-primary text-xs font-semibold transition-colors flex items-center justify-center space-x-1"
                >
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span>Inspect Source</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default GapRadarView;
