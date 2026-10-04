import React from 'react';
import { useApp } from '../context/AppContext';
import { PATIENT_A_DETAILS } from '../data/mockPatients';
import {
  Microscope,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  FileText,
  AlertOctagon,
} from 'lucide-react';

export const InvestigationTrackerView: React.FC = () => {
  const { selectedPatient, setActiveEvidenceSnippet, setActiveTab } = useApp();
  const tests = PATIENT_A_DETAILS.investigations;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Normal':
        return 'bg-success-soft text-success border-success/30';
      case 'Abnormal':
        return 'bg-warning-soft text-warning border-warning/30';
      case 'Critical':
        return 'bg-error-soft text-error border-error/30 animate-pulse';
      case 'Result unavailable':
        return 'bg-error-soft text-error border-error/30';
      case 'Ordered':
        return 'bg-primary-soft text-primary border-primary/30';
      default:
        return 'bg-surface-secondary text-text-muted border-border';
    }
  };

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase font-bold tracking-wider text-primary">
            Diagnostic Workup &amp; Surveillance
          </div>
          <h1 className="text-xl font-extrabold text-text-primary">
            Investigation Intelligence: {selectedPatient.name}
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Track diagnostic studies through: Ordered → Performed → Result → Follow-up. Surface missing reports and unaddressed results.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="font-semibold text-text-muted">Workflow:</span>
          <span className="px-2 py-0.5 rounded bg-primary-soft text-primary text-[10px] font-bold">Ordered</span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded bg-surface-secondary text-text-primary text-[10px] font-bold">Performed</span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded bg-warning-soft text-warning text-[10px] font-bold">Result</span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded bg-success-soft text-success text-[10px] font-bold">Follow-up</span>
        </div>
      </div>

      {/* Grid of Diagnostic Tests */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tests.map((inv) => (
          <div
            key={inv.id}
            className="p-5 rounded-2xl border border-border bg-surface shadow-subtle flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">
                  {inv.category}
                </span>
                <span
                  className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                    inv.status
                  )}`}
                >
                  {inv.status}
                </span>
              </div>

              <h3 className="font-bold text-sm text-text-primary">{inv.testName}</h3>

              <div className="mt-2 p-2.5 rounded-xl bg-surface-secondary border border-border space-y-1">
                <div className="text-[10px] uppercase font-bold text-text-muted">Result Value</div>
                <div className="font-mono font-bold text-xs text-text-primary">
                  {inv.resultValue || (
                    <span className="text-error italic">Result not found in uploaded chart</span>
                  )}
                </div>
                {inv.referenceRange && (
                  <div className="text-[10px] text-text-muted">Ref: {inv.referenceRange}</div>
                )}
              </div>

              <div className="mt-3 text-xs text-text-secondary">
                <strong>Follow-up Status:</strong>{' '}
                {inv.followUpDocumented ? (
                  <span className="text-success font-medium">Documented in plan</span>
                ) : (
                  <span className="text-warning font-semibold">Follow-up not documented</span>
                )}
                {inv.followUpNotes && (
                  <p className="text-[11px] text-text-muted mt-0.5">{inv.followUpNotes}</p>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-text-muted">
              <span className="font-mono text-[10px]">{inv.resultDate || inv.orderDate}</span>
              <button
                onClick={() => {
                  setActiveEvidenceSnippet({
                    title: inv.testName,
                    text: inv.exactSourceText,
                    page: 2,
                    docTitle: inv.sourceDocumentTitle,
                    state: 'DIRECTLY DOCUMENTED',
                  });
                  setActiveTab('synapse');
                }}
                className="text-primary hover:underline text-[11px] font-semibold flex items-center space-x-1"
              >
                <span>Inspect Source</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default InvestigationTrackerView;
