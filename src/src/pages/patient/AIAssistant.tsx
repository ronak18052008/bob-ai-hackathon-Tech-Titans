import { useState } from 'react';
import { MessageSquare, Send, Sparkles, FileText } from 'lucide-react';

interface Message {
  role: string;
  content: string;
  sources: string[];
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: 'Hello, Dr. Sharma. I have processed the uploaded records for Rahul Mehta. What would you like to know about this patient?',
      sources: []
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestedQuestions = [
    "What changed during the latest admission?",
    "Which medications were changed?",
    "What investigations were documented?",
    "Which items are still pending?",
    "Why does the record show different medication doses?"
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: text, sources: [] }]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response based on the demo requirements
    setTimeout(() => {
      let aiResponse = "I could not find this information in the uploaded records.";
      let sources: string[] = [];

      if (text.toLowerCase().includes('medication')) {
        aiResponse = "The latest records document two medication changes. Metoprolol was increased from 25mg to 50mg, and Atorvastatin was discontinued due to myalgia. Paracetamol was newly documented as 1g QDS.";
        sources = ['Outpatient_Clinic_2026.pdf - Page 3', 'Surgical_Admit_2026.pdf - Page 1'];
      } else if (text.toLowerCase().includes('changed') || text.toLowerCase().includes('admission')) {
        aiResponse = "During the latest elective admission on 28 Sep 2026, the patient underwent a right inguinal hernia repair. Post-operative medications were updated, and a chest X-Ray and pre-op bloods were completed.";
        sources = ['Surgical_Admit_2026.pdf - Page 1', 'Op_Note_2026.pdf - Page 2'];
      } else if (text.toLowerCase().includes('pending')) {
        aiResponse = "I found two documented pending items: A post-op surgical follow-up due in approximately 2 weeks, and a cardiology review for hypertension that was mentioned but not documented as booked.";
        sources = ['Discharge_Summary_Draft.pdf - Page 2', 'Outpatient_Clinic_2026.pdf - Page 4'];
      } else if (text.toLowerCase().includes('different medication doses') || text.toLowerCase().includes('contradiction')) {
        aiResponse = "I detected a contradiction regarding Metoprolol. The Outpatient Clinic note from 14 Sep states to increase the dose to 50mg OD, while the Surgical Admission note from 28 Sep lists the current medication as 25mg OD.";
        sources = ['Outpatient_Clinic_2026.pdf - Page 3', 'Surgical_Admit_2026.pdf - Page 2'];
      }

      setMessages(prev => [...prev, { role: 'ai', content: aiResponse, sources }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <header className="mb-6 flex-shrink-0">
        <h1 className="text-3xl mb-2">Ask About This Patient</h1>
        <p className="text-secondary text-lg m-0">Evidence-based chat grounded strictly in uploaded records.</p>
      </header>

      <div className="flex gap-6 h-full min-h-0">
        {/* Chat Area */}
        <div className="flex-1 surface flex flex-col min-h-0 border">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-4 ${msg.role === 'user' ? 'bg-teal-600 text-white' : 'ai-block'}`} style={msg.role === 'user' ? { backgroundColor: 'var(--primary)' } : {}}>
                  {msg.role === 'ai' && (
                    <div className="flex items-center gap-2 mb-2 font-sans border-b border-blue-200 pb-2">
                      <Sparkles className="w-4 h-4 text-blue" />
                      <span className="badge badge-ai">AI RESPONSE</span>
                    </div>
                  )}
                  <p className="m-0 text-sm leading-relaxed" style={{ color: msg.role === 'user' ? '#fff' : 'var(--text-primary)' }}>{msg.content}</p>
                  
                  {msg.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t" style={{ borderColor: 'rgba(96, 165, 250, 0.2)' }}>
                      <p className="text-xs font-semibold mb-2" style={{ color: 'var(--accent-text)' }}>SOURCES:</p>
                      <ul className="flex flex-col gap-1">
                        {msg.sources.map((src, idx) => (
                          <li key={idx} className="source-evidence inline-flex items-center gap-1 cursor-pointer hover:underline w-fit">
                            <FileText className="w-3 h-3" /> {src}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="ai-block p-4 rounded-lg flex gap-1 items-center h-10">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t bg-slate-50" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-main)' }}>
            <div className="relative">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend(input)}
                placeholder="Ask a clinical question about Rahul Mehta..."
                className="w-full pl-4 pr-12 py-3 rounded-md border text-sm"
                style={{ borderColor: 'var(--border)' }}
              />
              <button 
                onClick={() => handleSend(input)}
                disabled={!input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded text-white disabled:opacity-50 transition-colors border-none cursor-pointer"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Suggested Questions */}
        <div className="w-72 flex-shrink-0 flex flex-col gap-4">
          <div className="surface p-5 h-full">
            <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Suggested Questions
            </h3>
            <div className="flex flex-col gap-2">
              {suggestedQuestions.map((q, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="text-left text-sm p-3 rounded-md border hover:bg-slate-50 transition-colors text-primary bg-white cursor-pointer"
                  style={{ borderColor: 'var(--border)' }}
                >
                  {q}
                </button>
              ))}
            </div>
            
            <div className="mt-8 p-4 rounded-md text-xs text-secondary" style={{ backgroundColor: 'var(--warning-bg)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <strong>AI Safety:</strong> Answers are based ONLY on available records. The AI will never hallucinate or invent clinical facts. Every answer includes evidence references.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
