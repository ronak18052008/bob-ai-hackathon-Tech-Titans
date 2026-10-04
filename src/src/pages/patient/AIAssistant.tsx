import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, FileText, Shield } from 'lucide-react';

interface Message {
  role: 'ai' | 'user';
  content: string;
  sources: string[];
}

const suggestedPrompts = [
  "What changed during the latest admission?",
  "Which medications were changed?",
  "What investigations are documented?",
  "What follow-ups are still pending?",
  "Are there conflicting medication records?",
];

const aiResponses: Record<string, { content: string; sources: string[] }> = {
  medication: {
    content: "Two medication changes are documented during the latest records. Metoprolol was increased from 25mg to 50mg OD (documented 14 Sep 2026), and Atorvastatin was discontinued due to myalgia. Paracetamol 1g QDS was newly started post-operatively.",
    sources: ['Outpatient_Clinic_2026.pdf — Page 3', 'Surgical_Admit_2026.pdf — Page 1'],
  },
  changed: {
    content: "During the latest elective admission on 28 Sep 2026, the patient underwent a right inguinal hernia repair. Post-operative medications were updated. A chest X-ray and pre-op bloods were completed, both documented as normal.",
    sources: ['Surgical_Admit_2026.pdf — Page 1', 'Op_Note_2026.pdf — Page 2'],
  },
  pending: {
    content: "Two documented pending items were identified: A post-op surgical follow-up (approximately 2 weeks), and a cardiology review for hypertension that was mentioned but not documented as formally booked.",
    sources: ['Discharge_Summary_Draft.pdf — Page 2', 'Outpatient_Clinic_2026.pdf — Page 4'],
  },
  conflict: {
    content: "A documented inconsistency was detected regarding Metoprolol dosage. The Outpatient Clinic note (14 Sep) documents an increase to 50mg OD, while the Surgical Admission note (28 Sep) lists the current dose as 25mg OD. Both values appear in the uploaded records.",
    sources: ['Outpatient_Clinic_2026.pdf — Page 3', 'Surgical_Admit_2026.pdf — Page 2'],
  },
  default: {
    content: "I couldn't find this specific information in the uploaded records for Rahul Mehta. Please try rephrasing your question or check if the relevant document has been uploaded.",
    sources: [],
  },
};

function getResponse(text: string) {
  const t = text.toLowerCase();
  if (t.includes('medication') || t.includes('drug') || t.includes('med')) return aiResponses.medication;
  if (t.includes('changed') || t.includes('admission') || t.includes('latest')) return aiResponses.changed;
  if (t.includes('pending') || t.includes('follow')) return aiResponses.pending;
  if (t.includes('conflict') || t.includes('inconsist') || t.includes('different')) return aiResponses.conflict;
  return aiResponses.default;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: 'Hello, Dr. Sharma. I have processed the uploaded records for Rahul Mehta. What would you like to know about this patient?',
      sources: [],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim() || isTyping) return;
    setMessages(prev => [...prev, { role: 'user', content: text, sources: [] }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const resp = getResponse(text);
      setMessages(prev => [...prev, { role: 'ai', ...resp }]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - 260px)', minHeight: 500, gap: '0' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.25rem', flexShrink: 0 }}>
        <h1 style={{ marginBottom: '0.3rem' }}>Ask About This Patient</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          Answers are grounded strictly in uploaded records for Rahul Mehta.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', flex: 1, minHeight: 0 }}>
        {/* Chat */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0,
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-xl)', overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.role === 'ai' ? (
                  <div style={{
                    background: 'var(--surface-2)', border: '1px solid var(--border)',
                    borderRadius: '0 var(--r-lg) var(--r-lg) var(--r-lg)',
                    padding: '1rem 1.25rem', maxWidth: '78%',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.625rem' }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Sparkles size={12} color="var(--teal)" />
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--teal)', fontFamily: 'Manrope', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        AI Response
                      </span>
                    </div>
                    <p style={{ fontSize: '0.9375rem', lineHeight: 1.65, margin: 0, color: 'var(--text-body)' }}>{msg.content}</p>
                    {msg.sources.length > 0 && (
                      <div style={{ marginTop: '0.875rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Manrope', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Sources</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          {msg.sources.map((src, idx) => (
                            <span key={idx} className="source-ref" style={{ width: 'fit-content' }}>
                              <FileText size={11} /> {src}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="chat-bubble-user">{msg.content}</div>
                )}
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex' }}>
                <div style={{
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                  borderRadius: '0 var(--r-lg) var(--r-lg) var(--r-lg)',
                  padding: '0.875rem 1.25rem', display: 'flex', gap: '5px', alignItems: 'center',
                }}>
                  {[0, 1, 2].map(d => (
                    <div key={d} className="typing-dot" style={{ animationDelay: `${d * 180}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '1rem 1.25rem',
            borderTop: '1px solid var(--border)',
            background: 'var(--surface-3)',
            display: 'flex', gap: '0.625rem', alignItems: 'center',
          }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend(input)}
              placeholder="Ask a clinical question about Rahul Mehta…"
              className="input-field"
              style={{ flex: 1, padding: '0.625rem 0.875rem', fontSize: '0.9375rem' }}
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isTyping}
              className="btn btn-primary btn-sm"
              style={{ flexShrink: 0, padding: '0.625rem 0.875rem' }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{ padding: '1.125rem' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Manrope', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
              Suggested Questions
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {suggestedPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="chat-prompt-chip"
                  style={{ textAlign: 'left' }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div style={{
            padding: '1rem 1.125rem', borderRadius: 'var(--r-md)',
            background: 'var(--mint)', border: '1px solid var(--mint-border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <Shield size={13} color="var(--teal)" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--teal)', fontFamily: 'Manrope', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Safety</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Answers are grounded only in uploaded records. The AI will not invent clinical facts or make diagnostic decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
