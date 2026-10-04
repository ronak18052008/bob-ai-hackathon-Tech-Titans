import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  X,
  ArrowRight,
} from 'lucide-react';

export const SecondLookModal: React.FC = () => {
  const { isSecondLookOpen, setIsSecondLookOpen, selectedPatient, setActiveTab } = useApp();

  if (!isSecondLookOpen) return null;

  const auditItems = [
    {
      title: 'Major Clinical Claims Sourced',
      status: 'pass',
      details: 'All 10 documented events and diagnoses are linked to verified source documents.',
      actionable: false,
    },
    {
      title: 'Medication Evolution Provenance',
      status: 'pass',
      details: 'Dose titrations (Torsemide, Entresto, Spironolactone) have documented clinical reasons.',
      actionable: false,
    },
    {
      title: 'Referenced Diagnostic Study Missing',
      status: 'warning',
      details: 'Formal 2D-Echocardiogram dated 16-Sep-2026 cited in notes but report document not in repository.',
      actionable: true,
      actionTab: 'gaps',
      actionLabel: 'View in Gap Radar',
    },
    {
      title: 'Unresolved Documentation Conflict',
      status: 'warning',
      details: 'Penicillin/Sulfa allergy documentation discrepancy across Admission 1 and Admission 2 records.',
      actionable: true,
      actionTab: 'conflicts',
      actionLabel: 'Resolve Conflict',
    },
    {
      title: 'Temporal Sequencing Consistency',
      status: 'pass',
      details: 'No overlapping admission dates or out-of-order medication start/stops detected.',
      actionable: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-popover overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-border bg-gradient-to-r from-success-soft via-surface to-primary-soft flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-success/10 text-success">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-success">
                Pre-Export Evidence Audit
              </div>
              <h3 className="text-base font-bold text-text-primary">
                Second Look: {selectedPatient.name}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setIsSecondLookOpen(false)}
            className="p-1 rounded-lg hover:bg-surface text-text-muted"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          <p className="text-xs text-text-secondary leading-relaxed">
            Before exporting clinical summaries, handoffs, or referral letters, MedSynapse AI performs a rigorous second-look evidence audit to guarantee that every claim is anchored in ground-truth medical documentation.
          </p>

          <div className="space-y-2.5">
            {auditItems.map((item, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-xs flex items-start justify-between space-x-3 transition-colors ${
                  item.status === 'pass'
                    ? 'border-success/30 bg-success-soft/20'
                    : 'border-warning/30 bg-warning-soft/20'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {item.status === 'pass' ? (
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold text-text-primary">{item.title}</div>
                    <div className="text-[11px] text-text-secondary mt-0.5">{item.details}</div>
                  </div>
                </div>

                {item.actionable && item.actionTab && (
                  <button
                    onClick={() => {
                      setIsSecondLookOpen(false);
                      setActiveTab(item.actionTab);
                    }}
                    className="shrink-0 px-2.5 py-1 rounded-lg bg-surface border border-border hover:bg-surface-secondary text-primary font-semibold text-[11px] flex items-center space-x-1"
                  >
                    <span>{item.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface-secondary flex items-center justify-between">
          <div className="text-xs text-text-muted">
            <span className="font-semibold text-text-primary">3 Passed</span> •{' '}
            <span className="font-semibold text-warning">2 Attention Points</span>
          </div>

          <button
            onClick={() => setIsSecondLookOpen(false)}
            className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-sm"
          >
            Acknowledge &amp; Proceed
          </button>
        </div>
      </div>
    </div>
  );
};
export default SecondLookModal;
