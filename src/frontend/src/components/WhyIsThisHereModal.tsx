import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  HelpCircle,
  FileText,
  CheckCircle2,
  AlertTriangle,
  X,
  ShieldCheck,
  Filter,
} from 'lucide-react';

export const WhyIsThisHereModal: React.FC = () => {
  const { isWhyModalOpen, setIsWhyModalOpen, whyModalData, selectedPatient } = useApp();
  const [activeTab, setActiveTab] = useState<'why-included' | 'why-excluded'>('why-included');

  if (!isWhyModalOpen || !whyModalData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-popover overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-border bg-surface-secondary flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-ai" />
            <h3 className="font-bold text-sm text-text-primary">
              Evidence Attribution &amp; Transparency
            </h3>
          </div>
          <button
            onClick={() => setIsWhyModalOpen(false)}
            className="p-1 rounded-lg hover:bg-surface text-text-muted"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-border px-4 pt-2 space-x-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('why-included')}
            className={`pb-2 transition-colors border-b-2 ${
              activeTab === 'why-included'
                ? 'border-ai text-ai'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            Why is this here?
          </button>
          <button
            onClick={() => setActiveTab('why-excluded')}
            className={`pb-2 transition-colors border-b-2 ${
              activeTab === 'why-excluded'
                ? 'border-ai text-ai'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            Why wasn't something included?
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {activeTab === 'why-included' ? (
            <div className="space-y-4 text-xs">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-text-muted mb-1">
                  Synthesized Clinical Claim
                </div>
                <div className="p-3 rounded-lg bg-surface-secondary border border-border font-medium text-text-primary text-sm">
                  "{whyModalData.claim}"
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-text-muted mb-1">
                  AI Attribution Rationale
                </div>
                <div className="p-3 rounded-lg bg-ai-soft/40 border border-ai/20 text-text-secondary leading-relaxed">
                  {whyModalData.explanation}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-border bg-surface-secondary">
                  <div className="text-[10px] uppercase font-bold text-text-muted">Primary Source</div>
                  <div className="font-semibold text-text-primary mt-1">{whyModalData.source}</div>
                  <div className="text-[11px] text-text-muted mt-0.5">Confidence: 98% (High OCR Quality)</div>
                </div>

                <div className="p-3 rounded-lg border border-border bg-surface-secondary">
                  <div className="text-[10px] uppercase font-bold text-text-muted">Verification State</div>
                  <div className="flex items-center space-x-1.5 font-semibold text-success mt-1">
                    <ShieldCheck className="w-4 h-4 text-success" />
                    <span>SOURCE BACKED</span>
                  </div>
                  <div className="text-[11px] text-text-muted mt-0.5">Doctor Review Pending</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <p className="text-text-secondary">
                MedSynapse AI applies an AI Hallucination Guard and evidence criteria before surfacing clinical items. If an expected data point is omitted, it is due to one of the following documented reasons:
              </p>

              <div className="space-y-2">
                <div className="p-2.5 rounded-lg border border-border bg-surface-secondary flex items-start space-x-2">
                  <Filter className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-text-primary">Temporal Horizon Filter:</span>
                    <span className="text-text-secondary ml-1">
                      Event occurred outside active review window (e.g. prior historical records from &gt; 3 years ago).
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg border border-border bg-surface-secondary flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-text-primary">Low-Confidence OCR Quality (&lt; 70%):</span>
                    <span className="text-text-secondary ml-1">
                      Scanned page contains degraded resolution or unverified handwriting. Clinician must inspect original scan.
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg border border-border bg-surface-secondary flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-text-primary">Semantic Deduplication:</span>
                    <span className="text-text-secondary ml-1">
                      Identical lab report or prescription was uploaded multiple times; duplicate instances merged into single canonical record.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-surface-secondary flex justify-end">
          <button
            onClick={() => setIsWhyModalOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
export default WhyIsThisHereModal;
