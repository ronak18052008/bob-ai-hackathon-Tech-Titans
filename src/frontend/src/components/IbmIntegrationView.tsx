import React from 'react';
import {
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Layers,
  ArrowRight,
  ExternalLink,
  Brain,
  Sparkles,
  Database,
  Lock,
} from 'lucide-react';

export const IbmIntegrationView: React.FC = () => {
  const integrations = [
    {
      title: 'IBM watsonx.ai Foundation Models (Granite-3.0-8b-instruct)',
      role: 'Structured Clinical Reasoning & Narrative Synthesis',
      why: 'Granite delivers enterprise-grade medical governance, low latency, and zero data leakage, essential for strict HIPAA/ABDM clinical privacy.',
      where: 'Powers the Patient Story engine, Change Lens, and Second Look evidence audit validation.',
      how: 'FastAPI invokes watsonx.ai REST endpoints with strict JSON Schema constraints. Extrapolations are pruned by MedSynapse Hallucination Guard.',
      status: 'Active Endpoint',
    },
    {
      title: 'IBM watsonx Discovery / Hybrid Vector Pipeline',
      role: 'Ground-Truth Document Chunking & Page-Level Offsets',
      why: 'Clinical records require exact page-and-character-level coordinate retrieval rather than ungrounded approximate nearest-neighbor search.',
      where: 'Powers the 3-panel Evidence Rail and Synapse Copilot citation resolution.',
      how: 'Scanned records and discharge summaries are indexed with bounding box and page metadata for instant synchronization.',
      status: 'Indexed & Ready',
    },
    {
      title: 'IBM Bob Clinical Assist Hooks',
      role: 'Interactive Task & Agentic Orchestration',
      why: 'Facilitates seamless pairing between clinicians and background autonomous audit tasks without latency blocks.',
      where: 'Powers background Gap Radar scanning, duplicate detection, and review queue task distribution.',
      how: 'Asynchronous event triggers notify doctors upon arrival of missing investigation reports or verified conflict resolutions.',
      status: 'Operational',
    },
  ];

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase font-bold tracking-wider text-ai">
            Enterprise AI Architecture
          </div>
          <h1 className="text-xl font-extrabold text-text-primary">
            IBM Technology Integration Architecture
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Transparent documentation of genuine IBM watsonx and enterprise AI components within MedSynapse.
          </p>
        </div>

        <span className="text-xs bg-ai-soft text-ai border border-ai/30 px-3 py-1.5 rounded-xl font-semibold flex items-center space-x-1.5">
          <Cpu className="w-4 h-4" />
          <span>IBM watsonx Core</span>
        </span>
      </div>

      {/* Architecture Pipeline Flow Diagram */}
      <div className="p-6 rounded-2xl border border-border bg-surface shadow-subtle space-y-4">
        <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
          Integrated MedSynapse + IBM Architecture Pipeline
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-surface-secondary border border-border space-y-1">
            <span className="text-[10px] font-mono text-primary font-bold">STAGE 1</span>
            <div className="font-bold text-text-primary">Clinical Ingestion</div>
            <p className="text-text-muted text-[11px]">
              PDF/OCR extraction with confidence scoring and layout detection.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-secondary border border-border space-y-1">
            <span className="text-[10px] font-mono text-ai font-bold">STAGE 2</span>
            <div className="font-bold text-text-primary">watsonx Discovery</div>
            <p className="text-text-muted text-[11px]">
              Hybrid RAG indexing with exact source document page &amp; offset mapping.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-secondary border border-border space-y-1">
            <span className="text-[10px] font-mono text-ai font-bold">STAGE 3</span>
            <div className="font-bold text-text-primary">IBM Granite Model</div>
            <p className="text-text-muted text-[11px]">
              Structured extraction of timelines, medication shifts, and gap detection.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-success-soft/30 border border-success/30 space-y-1">
            <span className="text-[10px] font-mono text-success font-bold">STAGE 4</span>
            <div className="font-bold text-text-primary">Doctor Verification</div>
            <p className="text-text-muted text-[11px]">
              Mandatory human-in-the-loop review queue and Second Look audit.
            </p>
          </div>
        </div>
      </div>

      {/* Integration Component Cards */}
      <div className="space-y-4">
        {integrations.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-border bg-surface shadow-subtle space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-2.5">
              <div>
                <h3 className="font-bold text-base text-text-primary">{item.title}</h3>
                <span className="text-xs text-primary font-semibold">{item.role}</span>
              </div>
              <span className="text-[10px] font-mono bg-success-soft text-success px-2 py-0.5 rounded border border-success/30 font-semibold self-start sm:self-auto">
                {item.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <strong className="text-text-muted uppercase text-[10px] block">Why It Is Used</strong>
                <p className="text-text-secondary mt-1 leading-relaxed">{item.why}</p>
              </div>

              <div>
                <strong className="text-text-muted uppercase text-[10px] block">Where In MedSynapse</strong>
                <p className="text-text-secondary mt-1 leading-relaxed">{item.where}</p>
              </div>

              <div>
                <strong className="text-text-muted uppercase text-[10px] block">How It Is Integrated</strong>
                <p className="text-text-secondary mt-1 leading-relaxed">{item.how}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default IbmIntegrationView;
