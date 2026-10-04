import React from 'react';
import { useApp } from '../context/AppContext';
import { PATIENT_A_DETAILS } from '../data/mockPatients';
import {
  Pill,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileText,
} from 'lucide-react';

export const MedicationEvolutionView: React.FC = () => {
  const { selectedPatient, setActiveEvidenceSnippet, setActiveTab } = useApp();
  const medications = PATIENT_A_DETAILS.medicationEvolution;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Started':
        return 'bg-success-soft text-success border-success/30';
      case 'Dose Changed':
        return 'bg-ai-soft text-ai border-ai/30';
      case 'Continued':
        return 'bg-primary-soft text-primary border-primary/30';
      case 'Stopped':
        return 'bg-error-soft text-error border-error/30';
      case 'Restarted':
        return 'bg-warning-soft text-warning border-warning/30';
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
            Medication Provenance &amp; Lifecycle
          </div>
          <h1 className="text-xl font-extrabold text-text-primary">
            Medication Evolution Engine: {selectedPatient.name}
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Trace medication initiation, titration, discontinuation, and documented clinical reasons across all admissions.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="font-semibold text-text-muted">Lifecycle:</span>
          <span className="px-2 py-0.5 rounded bg-success-soft text-success text-[10px] font-bold">Started</span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded bg-ai-soft text-ai text-[10px] font-bold">Dose Changed</span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded bg-error-soft text-error text-[10px] font-bold">Stopped</span>
        </div>
      </div>

      {/* Medication Timeline Table */}
      <div className="p-5 rounded-2xl border border-border bg-surface shadow-subtle space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-[11px] uppercase font-bold text-text-muted">
                <th className="pb-3 pr-4">Medication &amp; Route</th>
                <th className="pb-3 px-4">Dose &amp; Frequency</th>
                <th className="pb-3 px-4">Evolution State</th>
                <th className="pb-3 px-4">Timeline</th>
                <th className="pb-3 px-4">Documented Rationale</th>
                <th className="pb-3 pl-4 text-right">Source Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {medications.map((med) => (
                <tr key={med.id} className="hover:bg-surface-secondary/60 transition-colors">
                  <td className="py-3.5 pr-4">
                    <div className="font-bold text-text-primary text-sm flex items-center space-x-2">
                      <Pill className="w-4 h-4 text-primary" />
                      <span>{med.drugName}</span>
                    </div>
                    <div className="text-[10px] text-text-muted mt-0.5">{med.route} route</div>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-medium text-text-primary">
                    <div>{med.dose}</div>
                    <div className="text-[10px] text-text-muted font-sans mt-0.5">{med.frequency}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                        med.status
                      )}`}
                    >
                      {med.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-text-secondary">
                    <div>From: {med.startDate}</div>
                    {med.stopDate && <div className="text-error font-semibold">To: {med.stopDate}</div>}
                  </td>

                  <td className="py-3.5 px-4 max-w-xs text-text-secondary leading-relaxed">
                    {med.documentedReason || (
                      <span className="italic text-text-muted">Reason not documented.</span>
                    )}
                  </td>

                  <td className="py-3.5 pl-4 text-right">
                    <button
                      onClick={() => {
                        setActiveEvidenceSnippet({
                          title: med.drugName,
                          text: med.exactSourceText,
                          page: med.pageNumber,
                          docTitle: med.sourceDocumentTitle,
                          state: 'DIRECTLY DOCUMENTED',
                        });
                        setActiveTab('synapse');
                      }}
                      className="inline-flex items-center space-x-1 text-primary hover:underline font-semibold text-[11px]"
                    >
                      <span>{med.sourceDocumentTitle.split('—')[1] || med.sourceDocumentTitle}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <div className="text-[10px] text-text-muted">Page {med.pageNumber}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default MedicationEvolutionView;
