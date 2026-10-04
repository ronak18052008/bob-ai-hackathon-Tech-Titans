import { useState } from 'react';
import { 
  FileText, AlertCircle, Clock, Pill, ListChecks, FileDown, Copy, 
  Check, FileQuestion, Sparkles
} from 'lucide-react';

export default function PatientOverview() {
  const [activeTab, setActiveTab] = useState('summary');
  const [outputMode, setOutputMode] = useState('ward-round');
  const [copied, setCopied] = useState(false);

  // Synthetic demo data
  const patientData = {
    name: 'John Doe (Synthetic)',
    dob: '1954-05-12',
    id: 'HOSP-748923',
    admissionDate: '2023-10-01',
    allergies: ['Penicillin (Anaphylaxis)'],
    events: [
      { date: '2023-10-01', title: 'Admitted via ED', desc: 'Presented with shortness of breath and chest pain.', source: 'ED_Note_01.pdf', page: 2 },
      { date: '2023-10-02', title: 'Cardiology Consult', desc: 'NSTEMI confirmed. Scheduled for angiogram.', source: 'Cardio_Consult.pdf', page: 1 },
      { date: '2023-10-03', title: 'Angiogram Performed', desc: '2 stents placed in LAD.', source: 'Cath_Lab_Report.pdf', page: 3 },
    ],
    medications: [
      { name: 'Aspirin 75mg', status: 'started', date: '2023-10-02', source: 'Med_Chart.pdf' },
      { name: 'Atorvastatin 80mg', status: 'started', date: '2023-10-02', source: 'Med_Chart.pdf' },
      { name: 'Lisinopril 5mg', status: 'stopped', date: '2023-10-01', reason: 'Hypotension on admission', conflict: true },
    ],
    investigations: [
      { name: 'Echocardiogram', status: 'pending', requested: '2023-10-03' },
      { name: 'FBC, U&Es, Trop T', status: 'completed', date: '2023-10-03' }
    ]
  };

  const summaries = {
    'ward-round': `Patient is a 69yo male admitted on 01/10 with NSTEMI. 
- Yesterday: Angiogram performed, 2 stents to LAD. Procedure uncomplicated.
- Current status: Chest pain resolved. Hemodynamically stable.
- Plan: Awaiting formal ECHO today. Plan for discharge tomorrow if stable.`,
    'referral': `Dear Colleague,
Thank you for seeing Mr John Doe (DOB 12/05/1954), who was admitted with an NSTEMI on 01/10/2023.
He underwent angiography on 03/10/2023 with 2 stents placed in his LAD. He is currently stable.
I am referring him to your outpatient cardiac rehab clinic for follow-up.`,
    'discharge': `Diagnosis: Non-ST Elevation Myocardial Infarction (NSTEMI)
Presentation: Admitted 01/10/2023 with acute chest pain and SOB.
Management: Angiography on 03/10/2023 showed LAD occlusion; 2 stents deployed successfully.
Medication Changes: Started on Aspirin and Atorvastatin. Lisinopril held due to initial hypotension.
Follow-up: Cardiac rehab in 4 weeks.`
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summaries[outputMode as keyof typeof summaries]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 h-full pb-8">
      {/* Patient Header */}
      <div className="surface p-5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--primary-text)', border: '1px solid var(--border)' }}>
            JD
          </div>
          <div>
            <h2 className="text-xl m-0 flex items-center gap-3">
              {patientData.name} 
              <span className="badge badge-neutral font-medium">ID: {patientData.id}</span>
            </h2>
            <div className="text-sm text-secondary flex gap-4 mt-1">
              <span>DOB: <strong className="font-medium text-primary">{patientData.dob}</strong> (69yo)</span>
              <span>Admitted: <strong className="font-medium text-primary">{patientData.admissionDate}</strong></span>
            </div>
          </div>
        </div>
        {patientData.allergies.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md" style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-semibold">Allergies: {patientData.allergies.join(', ')}</span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Left Column: Navigation & Meta */}
        <div className="md:col-span-1 flex flex-col gap-5">
          <div className="surface p-3">
            <nav className="flex flex-col gap-1">
              {[
                { id: 'summary', icon: FileText, label: 'AI Summary' },
                { id: 'timeline', icon: Clock, label: 'Clinical Timeline' },
                { id: 'meds', icon: Pill, label: 'Medications' },
                { id: 'investigations', icon: ListChecks, label: 'Investigations' }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-3 px-4 py-3 rounded-md text-left transition-colors font-medium text-sm"
                  style={{
                    backgroundColor: activeTab === tab.id ? 'var(--primary-light)' : 'transparent',
                    color: activeTab === tab.id ? 'var(--primary-text)' : 'var(--text-secondary)'
                  }}
                >
                  <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="surface p-5">
            <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Source Documents</h3>
            <ul className="text-sm flex flex-col gap-3">
              <li className="flex items-center justify-between text-blue cursor-pointer font-medium hover:underline">
                <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> ED_Note_01.pdf</span>
              </li>
              <li className="flex items-center justify-between text-blue cursor-pointer font-medium hover:underline">
                <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> Cardio_Consult.pdf</span>
              </li>
              <li className="flex items-center justify-between text-blue cursor-pointer font-medium hover:underline">
                <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> Cath_Lab_Report.pdf</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Content Area */}
        <div className="md:col-span-3 flex flex-col gap-6">
          
          {activeTab === 'summary' && (
            <div className="surface animate-fade-in flex flex-col h-full border-0 shadow-none bg-transparent">
              <div className="p-4 border-b flex justify-between items-center surface mb-4">
                <div className="flex bg-main p-1 rounded-md" style={{ backgroundColor: 'var(--bg-main)' }}>
                  {['ward-round', 'referral', 'discharge'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => setOutputMode(mode)}
                      className="px-4 py-1.5 text-sm rounded font-medium transition-all"
                      style={{
                        backgroundColor: outputMode === mode ? 'var(--bg-surface)' : 'transparent',
                        color: outputMode === mode ? 'var(--text-primary)' : 'var(--text-secondary)',
                        boxShadow: outputMode === mode ? 'var(--shadow-sm)' : 'none'
                      }}
                    >
                      {mode.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={copyToClipboard} className="btn btn-secondary !py-1.5 !text-sm">
                    {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button className="btn btn-primary !py-1.5 !text-sm">
                    <FileDown className="w-4 h-4" /> Export
                  </button>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="ai-block p-6 mb-4 font-mono text-sm whitespace-pre-wrap leading-relaxed min-h-[250px]" style={{ color: 'var(--text-primary)' }}>
                  <div className="flex items-center gap-2 mb-4 font-sans border-b border-blue-200 pb-2">
                    <Sparkles className="w-4 h-4 text-blue" />
                    <span className="badge badge-ai">AI DRAFT</span>
                    <span className="text-xs text-secondary font-medium">Generated from 3 source documents</span>
                  </div>
                  {summaries[outputMode as keyof typeof summaries]}
                </div>
                
                <div className="flex gap-3 text-sm items-start p-4 rounded-md mt-4" style={{ backgroundColor: 'var(--accent-light)', border: '1px solid #BFDBFE' }}>
                  <FileQuestion className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                  <p style={{ color: '#1E3A8A' }}><strong>Review Required:</strong> This draft was generated by madsynaps AI from the uploaded documents. Please review and edit for clinical accuracy before formal use. Missing information is not automatically filled.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="surface p-8 animate-fade-in">
              <h2 className="text-xl mb-8">Clinical Timeline</h2>
              <div className="relative border-l-2 ml-4 space-y-10" style={{ borderColor: 'var(--border)' }}>
                {patientData.events.map((event, idx) => (
                  <div key={idx} className="relative pl-8">
                    <div className="absolute w-4 h-4 rounded-full -left-[9px] top-1" style={{ backgroundColor: 'var(--bg-surface)', border: '4px solid var(--primary)' }}></div>
                    <div className="text-sm font-bold text-teal mb-2">{event.date}</div>
                    <h3 className="text-lg mb-1">{event.title}</h3>
                    <p className="text-secondary text-sm mb-4">{event.desc}</p>
                    <span className="source-evidence inline-flex items-center gap-1 cursor-pointer hover:underline">
                      <FileText className="w-3 h-3" />
                      Source: {event.source} (p. {event.page})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'meds' && (
            <div className="surface p-8 animate-fade-in">
              <h2 className="text-xl mb-6 flex items-center gap-2"><Pill className="w-5 h-5 text-teal" /> Medication Changes</h2>
              <div className="space-y-4">
                {patientData.medications.map((med, idx) => (
                  <div key={idx} className="p-5 rounded-md flex justify-between items-center" 
                    style={{ 
                      backgroundColor: med.conflict ? 'var(--warning-bg)' : 'var(--bg-surface)', 
                      border: `1px solid ${med.conflict ? '#FDE68A' : 'var(--border)'}` 
                    }}>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`badge ${med.status === 'started' ? 'badge-success' : 'badge-danger'}`}>
                          {med.status.toUpperCase()}
                        </span>
                        <h3 className="text-base m-0 font-semibold">{med.name}</h3>
                      </div>
                      <p className="text-sm text-secondary m-0 mt-1">
                        On {med.date} {med.reason ? ` - Reason: ${med.reason}` : ''}
                      </p>
                      {med.conflict && (
                        <p className="text-xs font-medium mt-2" style={{ color: '#92400E' }}>
                          ⚠️ Conflicting data in notes regarding cessation date.
                        </p>
                      )}
                    </div>
                    {med.source && (
                      <div className="source-evidence cursor-pointer hover:underline flex items-center gap-1">
                        <FileText className="w-3 h-3" /> {med.source}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'investigations' && (
            <div className="surface p-8 animate-fade-in">
              <h2 className="text-xl mb-6 flex items-center gap-2"><ListChecks className="w-5 h-5 text-teal" /> Investigations</h2>
              <div className="space-y-4">
                {patientData.investigations.map((inv, idx) => (
                  <div key={idx} className="p-5 border rounded-md flex justify-between items-center" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}>
                    <div>
                      <h3 className="text-base m-0 font-semibold mb-1">{inv.name}</h3>
                      <p className="text-sm text-secondary m-0">
                        {inv.status === 'pending' ? `Requested: ${inv.requested}` : `Completed: ${inv.date}`}
                      </p>
                    </div>
                    <span className={`badge ${inv.status === 'pending' ? 'badge-warning' : 'badge-success'}`}>
                      {inv.status.toUpperCase()}
                    </span>
                  </div>
                ))}
                <div className="p-5 border rounded-md flex justify-between items-center" style={{ borderColor: 'var(--border)', backgroundColor: '#F8FAFC' }}>
                  <div>
                    <h3 className="text-base m-0 font-semibold mb-1 text-muted">Lipid Profile</h3>
                    <p className="text-sm text-muted m-0">
                      Not documented in recent notes.
                    </p>
                  </div>
                  <span className="badge badge-neutral">UNKNOWN</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
