import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PATIENT_A_DETAILS } from '../data/mockPatients';
import { ClinicalEvent, ClinicalDocument } from '../types';
import {
  Calendar,
  Clock,
  FileText,
  ShieldCheck,
  HelpCircle,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
  ZoomIn,
  Copy,
  Printer,
  ChevronLeft,
} from 'lucide-react';

export const SynapseView: React.FC = () => {
  const {
    selectedPatient,
    selectedEvent,
    setSelectedEvent,
    selectedDocument,
    setSelectedDocument,
    activeEvidenceSnippet,
    setActiveEvidenceSnippet,
    openWhyModal,
    addAuditLog,
    language,
  } = useApp();

  const [activeCenterTab, setActiveCenterTab] = useState<'story' | 'changes' | 'gaps'>('story');
  const [filterType, setFilterType] = useState<string>('ALL');

  const events = PATIENT_A_DETAILS.timelineEvents;
  const filteredEvents =
    filterType === 'ALL' ? events : events.filter((e) => e.eventType === filterType);

  const handleSelectEvent = (evt: ClinicalEvent) => {
    setSelectedEvent(evt);
    // Find matching document
    const doc = PATIENT_A_DETAILS.documents.find((d) => d.id === evt.documentId) || PATIENT_A_DETAILS.documents[0];
    setSelectedDocument(doc);
    setActiveEvidenceSnippet({
      title: evt.title,
      text: evt.exactSourceText,
      page: evt.pageNumber,
      docTitle: evt.documentTitle,
      state: evt.evidenceState,
    });
    addAuditLog('EVENT_VIEWED', `Viewed event: ${evt.title} (${evt.eventDate})`);
  };

  const getEvidenceBadge = (state: string) => {
    switch (state) {
      case 'DIRECTLY DOCUMENTED':
        return 'bg-success-soft text-success border-success/30';
      case 'MULTI-SOURCE SUPPORTED':
        return 'bg-primary-soft text-primary border-primary/30';
      case 'INFERRED — REVIEW REQUIRED':
        return 'bg-warning-soft text-warning border-warning/30';
      case 'CONFLICTING':
        return 'bg-error-soft text-error border-error/30';
      default:
        return 'bg-surface-secondary text-text-muted border-border';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-5.5rem)] overflow-hidden">
      {/* Patient Header Bar */}
      <div className="p-3 bg-surface border-b border-border flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
            {selectedPatient.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-sm text-text-primary">{selectedPatient.name}</h2>
              <span className="text-xs text-text-muted">({selectedPatient.age}y / {selectedPatient.gender})</span>
              <span className="text-[10px] font-mono bg-surface-secondary px-1.5 py-0.5 rounded border border-border">
                MRN: {selectedPatient.mrn}
              </span>
            </div>
            <div className="text-xs text-text-secondary truncate mt-0.5">
              {selectedPatient.primaryCondition}
            </div>
          </div>
        </div>

        {/* Sync Status Indicator */}
        <div className="flex items-center space-x-2 text-xs">
          <div className="flex items-center space-x-1.5 text-success font-medium">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span>3-Panel Synapse Synchronized</span>
          </div>
        </div>
      </div>

      {/* Main 3-Panel Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-background">
        {/* PANEL 1 (LEFT): TIMELINE (3 cols) */}
        <div className="lg:col-span-3 border-r border-border bg-surface flex flex-col overflow-hidden">
          <div className="p-3 border-b border-border flex items-center justify-between bg-surface-secondary">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="font-bold text-xs uppercase tracking-wider text-text-primary">
                Synapse Timeline
              </span>
            </div>
            <span className="text-[10px] font-mono bg-surface px-1.5 py-0.5 rounded border border-border text-text-muted">
              {filteredEvents.length} Events
            </span>
          </div>

          {/* Filter Pills */}
          <div className="p-2 border-b border-border flex items-center space-x-1 overflow-x-auto text-[11px] bg-surface">
            {['ALL', 'Admission', 'Medication Change', 'Investigation'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2 py-0.5 rounded-md whitespace-nowrap transition-colors ${
                  filterType === t
                    ? 'bg-primary text-white font-semibold'
                    : 'text-text-muted hover:bg-surface-secondary hover:text-text-primary'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Events Scroll List */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
            {filteredEvents.map((evt) => {
              const isSelected = selectedEvent?.id === evt.id;
              return (
                <div
                  key={evt.id}
                  onClick={() => handleSelectEvent(evt)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary bg-primary-soft/40 shadow-sm ring-1 ring-primary/40'
                      : 'border-border bg-surface hover:bg-surface-hover'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono text-text-muted flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{evt.eventDate}</span>
                    </span>
                    <span
                      className={`text-[9px] uppercase px-1.5 py-0.5 rounded-full border font-semibold ${getEvidenceBadge(
                        evt.evidenceState
                      )}`}
                    >
                      {evt.eventType}
                    </span>
                  </div>

                  <div className="font-bold text-text-primary leading-snug">{evt.title}</div>
                  <div className="text-[11px] text-text-secondary mt-1 line-clamp-2">
                    {evt.description}
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-border flex items-center justify-between text-[10px] text-text-muted">
                    <span className="truncate">{evt.documentTitle} (p. {evt.pageNumber})</span>
                    <ChevronRight className="w-3 h-3 shrink-0 text-text-muted" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PANEL 2 (CENTER): CLINICAL INTELLIGENCE (5 cols) */}
        <div className="lg:col-span-5 border-r border-border bg-surface flex flex-col overflow-hidden">
          <div className="p-2 border-b border-border flex items-center justify-between bg-surface-secondary">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveCenterTab('story')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeCenterTab === 'story'
                    ? 'bg-surface text-primary shadow-subtle border border-border'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Patient Story
              </button>
              <button
                onClick={() => setActiveCenterTab('changes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeCenterTab === 'changes'
                    ? 'bg-surface text-primary shadow-subtle border border-border'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                What Changed?
              </button>
              <button
                onClick={() => setActiveCenterTab('gaps')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeCenterTab === 'gaps'
                    ? 'bg-surface text-primary shadow-subtle border border-border'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Gaps ({PATIENT_A_DETAILS.gaps.length})
              </button>
            </div>

            {selectedEvent && (
              <button
                onClick={() =>
                  openWhyModal({
                    title: selectedEvent.title,
                    claim: selectedEvent.title,
                    explanation: selectedEvent.aiInterpretation,
                    source: `${selectedEvent.documentTitle} (Page ${selectedEvent.pageNumber})`,
                  })
                }
                className="flex items-center space-x-1 text-[11px] text-ai hover:underline font-semibold"
                title="Explain why this insight is synthesized"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Why is this here?</span>
              </button>
            )}
          </div>

          {/* Center Content Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeCenterTab === 'story' && (
              <div className="space-y-4 text-xs">
                {PATIENT_A_DETAILS.patientStory.map((phase) => (
                  <div
                    key={phase.id}
                    className="p-4 rounded-xl border border-border bg-surface-secondary space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-text-primary">{phase.phaseTitle}</h4>
                      <span
                        className={`text-[9px] uppercase px-1.5 py-0.5 rounded-full border font-semibold ${getEvidenceBadge(
                          phase.evidenceState
                        )}`}
                      >
                        {phase.evidenceState}
                      </span>
                    </div>

                    <p className="text-text-secondary leading-relaxed">{phase.content}</p>

                    {/* Evidence Citations */}
                    <div className="pt-2 border-t border-border space-y-1.5">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-text-muted">
                        Supporting Evidence Citations
                      </div>
                      {phase.citations.map((c, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setActiveEvidenceSnippet({
                              title: c.documentTitle,
                              text: c.sourceText,
                              page: c.page,
                              docTitle: c.documentTitle,
                              state: phase.evidenceState,
                            });
                          }}
                          className="p-2 rounded-lg bg-surface border border-border hover:border-primary/40 cursor-pointer transition-colors group flex items-start space-x-2"
                        >
                          <FileText className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <span className="font-semibold text-text-primary group-hover:text-primary">
                              {c.documentTitle} (p. {c.page}, {c.section})
                            </span>
                            <p className="italic text-text-muted text-[11px] truncate mt-0.5">
                              "{c.sourceText}"
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeCenterTab === 'changes' && (
              <div className="space-y-3 text-xs">
                <div className="text-[11px] text-text-muted">
                  Comparison between prior admissions and current documented state:
                </div>
                {PATIENT_A_DETAILS.whatChanged.map((chg) => (
                  <div
                    key={chg.id}
                    className="p-3.5 rounded-xl border border-border bg-surface-secondary space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-text-primary text-xs">{chg.title}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase bg-ai-soft text-ai">
                        {chg.category}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded bg-surface border border-border">
                        <div className="text-[10px] text-text-muted uppercase">Prior State</div>
                        <div className="font-semibold text-text-secondary mt-0.5">{chg.priorState}</div>
                      </div>
                      <div className="p-2 rounded bg-surface border border-border">
                        <div className="text-[10px] text-primary uppercase font-bold">Current State</div>
                        <div className="font-semibold text-text-primary mt-0.5">{chg.currentState}</div>
                      </div>
                    </div>
                    <div className="text-[11px] text-text-secondary">
                      <strong>Documented Reason:</strong> {chg.documentedReason}
                    </div>
                    <div className="text-[10px] text-text-muted flex items-center space-x-1">
                      <FileText className="w-3 h-3 text-text-muted" />
                      <span>{chg.evidenceSource}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeCenterTab === 'gaps' && (
              <div className="space-y-3 text-xs">
                {PATIENT_A_DETAILS.gaps.map((gap) => (
                  <div
                    key={gap.id}
                    className="p-4 rounded-xl border border-warning/40 bg-warning-soft/20 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-warning font-bold text-xs">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{gap.gapType}</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-warning/20 text-warning font-mono">
                        {gap.status}
                      </span>
                    </div>
                    <div className="font-bold text-text-primary text-sm">{gap.title}</div>
                    <p className="text-text-secondary text-xs leading-relaxed">{gap.description}</p>
                    <div className="p-2.5 rounded-lg bg-surface border border-border text-[11px]">
                      <div className="text-[10px] font-bold text-text-muted uppercase">Referenced Text:</div>
                      <div className="italic text-text-primary mt-0.5">"{gap.exactReferenceText}"</div>
                    </div>
                    <div className="text-[11px] text-primary font-semibold">
                      <strong>Clinician Recommended Action:</strong> {gap.doctorAction}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* PANEL 3 (RIGHT): EVIDENCE RAIL & SOURCE VIEWER (4 cols) */}
        {/* Section 80: Document Viewport preserves authentic light paper appearance */}
        <div className="lg:col-span-4 border-l border-border bg-surface flex flex-col overflow-hidden">
          <div className="p-3 border-b border-border flex items-center justify-between bg-surface-secondary">
            <div className="flex items-center space-x-2">
              <FileSearch className="w-4 h-4 text-primary" />
              <span className="font-bold text-xs uppercase tracking-wider text-text-primary">
                Source Evidence Rail
              </span>
            </div>
            <span className="text-[10px] font-mono bg-success-soft text-success px-1.5 py-0.5 rounded border border-success/30 font-semibold">
              OCR 98% Confident
            </span>
          </div>

          {/* Active Highlight Snippet */}
          {activeEvidenceSnippet && (
            <div className="p-3 bg-primary-soft/40 border-b border-primary/20 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-primary">
                <span>Selected Passage</span>
                <span>Page {activeEvidenceSnippet.page}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface border border-primary/30 font-mono text-[11px] text-text-primary shadow-subtle">
                "{activeEvidenceSnippet.text}"
              </div>
              <div className="text-[10px] text-text-muted flex items-center justify-between">
                <span>Doc: {activeEvidenceSnippet.docTitle}</span>
                <span className="text-success font-semibold">DIRECT CITATION</span>
              </div>
            </div>
          )}

          {/* Original Document Viewport (Crisp, High-Contrast Paper Style - Section 80) */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-100 dark:bg-slate-900/60">
            <div className="original-document-viewport p-5 rounded-lg border shadow-sm space-y-3 font-mono text-xs leading-relaxed text-slate-800">
              <div className="border-b border-slate-300 pb-2 text-[11px] text-slate-500 flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider">
                  {selectedDocument?.title || 'Clinical Document'}
                </span>
                <span>{selectedDocument?.dateDocumented}</span>
              </div>

              <div className="whitespace-pre-wrap text-[11px] text-slate-700 leading-relaxed font-sans">
                {selectedDocument?.rawText || 'Loading document source text...'}
              </div>

              <div className="pt-3 border-t border-slate-300 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Metro Heart Institute Records System</span>
                <span>Authentic Record Trace</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SynapseView;
