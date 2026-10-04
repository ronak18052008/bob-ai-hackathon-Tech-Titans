import { useState } from 'react';
import { Copy, FileDown, Check, Save, Sparkles, FileQuestion } from 'lucide-react';

export default function GenerateBrief() {
  const [activeType, setActiveType] = useState('handover');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const briefs = {
    'handover': `PATIENT: Rahul Mehta (58yo, Male) | ID: RM-8492
    
RELEVANT HISTORY:
- Coronary Artery Disease (Angiogram Mar 2024 - Mild CAD)
- Hypertension

RECENT MAJOR EVENTS:
- 28 Sep 2026: Elective Admission for Right Inguinal Hernia repair. Procedure completed successfully.

CURRENT MEDICATIONS:
- Metoprolol 50mg OD (increased from 25mg on 14 Sep)
- Paracetamol 1g QDS (started 29 Sep)
- Atorvastatin stopped (due to myalgia)

RECENT INVESTIGATIONS:
- Pre-op Bloods (28 Sep): Normal
- Chest X-Ray (28 Sep): Clear
- Post-op Wound Swab (30 Sep): Pending culture

DOCUMENTED PENDING ITEMS:
- Post-op Surgical Follow-up (approx 2 weeks)
- Cardiology review for hypertension mentioned but not booked.

IMPORTANT RECORDS TO REVIEW:
- Op_Note_2026.pdf (Page 2)`,

    'referral': `PATIENT INFORMATION
Name: Rahul Mehta
DOB: 12 Apr 1968 (Age 58)
ID: RM-8492

REASON FOR REFERRAL
Routine Post-Operative Surgical Follow-up and Cardiology Review

RELEVANT DOCUMENTED HISTORY
The patient has a background of hypertension and mild CAD (diagnosed Mar 2024). He was recently admitted on 28 Sep 2026 for an elective right inguinal hernia repair.

RECENT EVENTS
The hernia repair was uncomplicated. During a prior outpatient clinic on 14 Sep 2026, his Metoprolol was increased from 25mg to 50mg for persistent hypertension, and Atorvastatin was discontinued due to myalgia. 

MEDICATION HISTORY
- Metoprolol 50mg OD
- Paracetamol 1g QDS

DOCUMENTED PENDING ITEMS
- Wound swab culture from 30 Sep 2026 is pending.
- A cardiology review was requested but not formally booked.

SOURCE REFERENCES
- Outpatient_Clinic_2026.pdf (Page 3)
- Op_Note_2026.pdf (Page 2)`,

    'discharge': `DISCHARGE SUMMARY

PATIENT INFORMATION
Name: Rahul Mehta
ID: RM-8492
DOB: 12 Apr 1968

ADMISSION DETAILS
Admitted: 28 Sep 2026
Reason: Elective Right Inguinal Hernia Repair

DOCUMENTED CLINICAL COURSE
The patient underwent an uncomplicated right inguinal hernia repair on 29 Sep 2026. Post-operative recovery was standard. 

INVESTIGATIONS
- Pre-op bloods (28 Sep 2026): Normal
- CXR (28 Sep 2026): Clear
- Wound swab (30 Sep 2026): Pending culture

MEDICATION CHANGES
- Paracetamol 1g QDS started post-op.
- Note: Metoprolol was recently increased to 50mg OD on 14 Sep 2026 prior to admission. Atorvastatin remains held.

DOCUMENTED FOLLOW-UP
- Surgical review in 2 weeks.
- Advised to follow up with GP regarding pending cardiology review for hypertension.

OUTSTANDING ITEMS
- Wound swab culture results.`
  };

  return (
    <div className="flex flex-col gap-6 min-h-full pb-8 animate-fade-in">
      <header>
        <h1 className="text-3xl mb-2">Generate Clinical Brief</h1>
        <p className="text-secondary text-lg m-0">Create structured, evidence-grounded drafts for review.</p>
      </header>

      <div className="flex gap-4 mb-2">
        {[
          { id: 'handover', label: '60-Second Handover' },
          { id: 'referral', label: 'Referral Brief' },
          { id: 'discharge', label: 'Discharge Summary' }
        ].map(type => (
          <button
            key={type.id}
            onClick={() => setActiveType(type.id)}
            className="px-5 py-2.5 rounded-md font-medium text-sm transition-all border"
            style={{
              backgroundColor: activeType === type.id ? 'var(--primary-light)' : 'var(--bg-surface)',
              color: activeType === type.id ? 'var(--primary-text)' : 'var(--text-secondary)',
              borderColor: activeType === type.id ? 'var(--primary-light)' : 'var(--border)'
            }}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="surface flex flex-col h-full min-h-[500px]">
        <div className="p-4 border-b flex justify-between items-center bg-slate-50" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue" />
            <span className="badge badge-ai">AI DRAFT</span>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-secondary !py-1.5 !text-sm">
              <Save className="w-4 h-4" /> Save Draft
            </button>
            <button onClick={copyToClipboard} className="btn btn-secondary !py-1.5 !text-sm">
              {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button className="btn btn-secondary !py-1.5 !text-sm">
              <FileDown className="w-4 h-4" /> Export PDF
            </button>
            <button className="btn btn-primary !py-1.5 !text-sm ml-2">
              <Check className="w-4 h-4" /> Approve
            </button>
          </div>
        </div>
        
        <div className="flex-1 p-6 relative">
          <textarea 
            className="w-full h-full p-4 border rounded-md font-mono text-sm leading-relaxed focus:outline-none focus:ring-2"
            style={{ 
              borderColor: 'var(--border)', 
              backgroundColor: '#FAFAFA',
              color: 'var(--text-primary)',
              resize: 'none'
            }}
            defaultValue={briefs[activeType as keyof typeof briefs]}
          />
        </div>
        
        <div className="p-4 border-t bg-slate-50" style={{ borderColor: 'var(--border)' }}>
          <div className="flex gap-3 text-sm items-start p-3 rounded-md" style={{ backgroundColor: 'var(--warning-bg)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <FileQuestion className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#92400E' }} />
            <p className="m-0" style={{ color: '#92400E' }}><strong>Review Required:</strong> This draft was generated by AI from the uploaded documents. Please review and edit for clinical accuracy before formal use or approval.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
