import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Sparkles,
  Send,
  X,
  Volume2,
  FileText,
  ShieldCheck,
  CornerDownLeft,
  Bot,
  User,
  Mic,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: {
    documentTitle: string;
    page: number;
    quote: string;
  }[];
}

export const CopilotDrawer: React.FC = () => {
  const {
    isCopilotOpen,
    setIsCopilotOpen,
    selectedPatient,
    setActiveEvidenceSnippet,
    setActiveTab,
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-01',
      sender: 'assistant',
      text: `Hello Doctor. I am Synapse Copilot, anchored strictly in the ground-truth documented medical records for ${selectedPatient.name} (${selectedPatient.mrn}). I do not invent or extrapolate clinical facts. How can I assist with this patient's longitudinal reconstruction?`,
      timestamp: '10:00 AM',
    },
  ]);

  const quickQuestions = [
    'What changed since the previous admission?',
    'Show documented medication changes.',
    'Which investigations are pending?',
    'Which records conflict?',
    'What is missing from this story?',
    'Give me a 30-second handoff summary.',
  ];

  const handleSend = (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    // Generate evidence-grounded response
    setTimeout(() => {
      let botResponse = '';
      let botCitations: any[] = [];

      const lower = q.toLowerCase();
      if (lower.includes('what changed') || lower.includes('previous admission')) {
        botResponse =
          'Between Admission 2 (May 2026) and Admission 3 (Sep 2026), documented changes include: 1) LVEF declined from 36% to 32%; 2) Torsemide escalated from 20mg daily to a split dose (20mg morning + 10mg afternoon); 3) Sacubitril/Valsartan titrated to 49/51mg BID; 4) Serum Creatinine rose from 1.45 to 1.82 mg/dL indicating cardiorenal syndrome.';
        botCitations = [
          {
            documentTitle: 'Discharge Summary — Admission 3',
            page: 1,
            quote: 'Acute decompensated HFrEF (LVEF 32%) with Type 2 Cardiorenal syndrome.',
          },
          {
            documentTitle: 'Discharge Summary — Admission 3',
            page: 3,
            quote: 'Tab Torsemide 20 mg morning + 10 mg at 2 PM. Tab Sacubitril/Valsartan 49/51 mg BID.',
          },
        ];
      } else if (lower.includes('medication')) {
        botResponse =
          'Documented medication changes show: Furosemide was stopped on 2026-06-04 due to diuretic resistance and replaced by Torsemide 20mg (subsequently split-dosed on Sep 18). Ramipril was discontinued in June and switched to Sacubitril/Valsartan. Empagliflozin 10mg and Spironolactone 25mg were initiated during the second admission as quadruple GDMT.';
        botCitations = [
          {
            documentTitle: 'Discharge Summary — Admission 2',
            page: 3,
            quote: 'Tab Torsemide 20 mg PO once daily (Replaces Furosemide). Reason: Diuretic resistance.',
          },
        ];
      } else if (lower.includes('pending') || lower.includes('investigation') || lower.includes('missing')) {
        botResponse =
          'CRITICAL GAPS: 1) A formal 2D-Echocardiogram conducted in the Central Lab on 16-Sep-2026 is cited in the discharge note, but the formal report is missing from the chart. 2) A 24-hour ambulatory Holter monitor was ordered for non-sustained VT, but the outpatient booking status is unconfirmed.';
        botCitations = [
          {
            documentTitle: 'Discharge Summary — Admission 3',
            page: 2,
            quote: 'formal 2D-Echocardiogram performed on 16-Sep-2026 in Central Lab (formal report pending upload).',
          },
        ];
      } else if (lower.includes('conflict')) {
        botResponse =
          'One active conflict detected: Admission 1 record states "No Known Drug Allergies", whereas Admission 2 records a documented adverse skin rash to Trimethoprim/Sulfamethoxazole in 2021.';
        botCitations = [
          {
            documentTitle: 'Discharge Summary — Admission 1',
            page: 1,
            quote: 'Allergies: NKDA (No Known Drug Allergies).',
          },
          {
            documentTitle: 'Discharge Summary — Admission 2',
            page: 1,
            quote: 'Documented adverse skin rash to Trimethoprim/Sulfamethoxazole.',
          },
        ];
      } else if (lower.includes('handoff')) {
        botResponse =
          '30-Second Handoff: Rajesh Kumar, 62M, with 3 admissions for HFrEF now presenting with worsening LVEF at 32% and cardiorenal syndrome (Cr 1.82). Current regimen: Torsemide 20mg+10mg, Entresto 49/51mg BID, Carvedilol 12.5mg BID, Spironolactone 25mg, and Empagliflozin 10mg. Outstanding actions: track missing formal Echo report from Sep 16 and confirm Holter monitor scheduling.';
        botCitations = [
          {
            documentTitle: 'Discharge Summary — Admission 3',
            page: 1,
            quote: 'Summary of clinical status and discharge plan.',
          },
        ];
      } else {
        botResponse = `Based on the 4 documented clinical records for ${selectedPatient.name}, this patient is managed for ${selectedPatient.primaryCondition}. All insights are strictly evidence-backed without extrapolation.`;
        botCitations = [
          {
            documentTitle: 'Discharge Summary — Admission 3',
            page: 1,
            quote: 'Patient clinical record file.',
          },
        ];
      }

      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: botCitations,
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 400);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!isCopilotOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-[440px] bg-surface border-l border-border shadow-popover flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-ai-soft/50 via-surface to-primary-soft/30 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-ai text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-ai">
              Context-Aware AI
            </div>
            <h3 className="font-bold text-sm text-text-primary">Synapse Copilot</h3>
          </div>
        </div>
        <button
          onClick={() => setIsCopilotOpen(false)}
          className="p-1 rounded-lg hover:bg-surface-secondary text-text-muted"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Patient Anchor Ribbon */}
      <div className="px-4 py-2 bg-surface-secondary border-b border-border text-[11px] text-text-secondary flex items-center justify-between">
        <span className="truncate">
          Anchored on: <strong className="text-text-primary">{selectedPatient.name}</strong>
        </span>
        <span className="font-mono text-[10px] bg-surface px-1.5 py-0.5 rounded border border-border">
          {selectedPatient.mrn}
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col space-y-1.5 ${
              m.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-center space-x-1.5 text-[10px] text-text-muted">
              {m.sender === 'user' ? (
                <>
                  <span>You (Doctor)</span>
                  <User className="w-3 h-3" />
                </>
              ) : (
                <>
                  <Bot className="w-3 h-3 text-ai" />
                  <span className="font-semibold text-ai">Synapse Copilot</span>
                </>
              )}
              <span>•</span>
              <span>{m.timestamp}</span>
            </div>

            <div
              className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[92%] shadow-subtle ${
                m.sender === 'user'
                  ? 'bg-primary text-white rounded-tr-none'
                  : 'bg-surface-secondary text-text-primary border border-border rounded-tl-none'
              }`}
            >
              {m.text}

              {/* Citations & Evidence Chips (Section 46) */}
              {m.citations && m.citations.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-border space-y-1.5">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-text-muted flex items-center justify-between">
                    <span>Ground-Truth Evidence</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-success" />
                  </div>
                  {m.citations.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveEvidenceSnippet({
                          title: c.documentTitle,
                          text: c.quote,
                          page: c.page,
                          docTitle: c.documentTitle,
                          state: 'DIRECTLY DOCUMENTED',
                        });
                        setActiveTab('synapse');
                      }}
                      className="w-full text-left p-2 rounded-lg bg-surface hover:bg-surface-hover border border-border transition-colors group flex items-start space-x-2"
                      title="Inspect source document in Evidence Rail"
                    >
                      <FileText className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-semibold text-primary group-hover:underline truncate">
                          {c.documentTitle} (p. {c.page})
                        </div>
                        <div className="text-[10px] text-text-secondary italic truncate mt-0.5">
                          "{c.quote}"
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {m.sender === 'assistant' && (
              <button
                onClick={() => handleSpeak(m.text)}
                className="text-[10px] text-text-muted hover:text-primary flex items-center space-x-1 px-1"
                title="Listen to audio reading"
              >
                <Volume2 className="w-3 h-3" />
                <span>{isSpeaking ? 'Stop Audio' : 'Read Out Loud'}</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Suggested Quick Questions */}
      <div className="p-3 border-t border-border bg-surface-secondary/50 space-y-1.5">
        <div className="text-[10px] uppercase font-bold tracking-wider text-text-muted">
          Suggested Clinical Queries
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-surface border border-border hover:border-primary/50 text-text-secondary hover:text-text-primary transition-colors text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-border bg-surface flex items-center space-x-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask about ${selectedPatient.name.split(' ')[0]}'s journey...`}
          className="flex-1 bg-surface-secondary border border-border rounded-xl px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputQuery.trim()}
          className="p-2 rounded-xl bg-primary hover:bg-primary-hover text-white disabled:opacity-40 transition-colors shadow-sm"
          title="Send query"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
export default CopilotDrawer;
