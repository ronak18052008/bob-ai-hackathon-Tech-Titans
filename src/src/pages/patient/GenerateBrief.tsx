import { useState } from 'react';
import { Copy, FileDown, Check, Save, Sparkles, AlertTriangle, FileText } from 'lucide-react';

const briefTypes = [
  { id: 'handover',  label: '60-Second Handover' },
  { id: 'referral',  label: 'Referral Brief' },
  { id: 'discharge', label: 'Discharge Summary' },
];

const briefs: Record<string, string> = {
  handover: `PATIENT: Rahul Mehta (58yo, Male) | ID: RM-8492

RELEVANT HISTORY:
- Coronary Artery Disease (Angiogram Mar 2024 – Mild CAD)
- Hypertension

RECENT MAJOR EVENTS:
- 28 Sep 2026: Elective Admission for Right Inguinal Hernia repair.
  Procedure completed successfully.

CURRENT MEDICATIONS:
- Metoprolol 50mg OD (increased from 25mg on 14 Sep)
- Paracetamol 1g QDS (started 29 Sep)
- Atorvastatin STOPPED (due to myalgia)

RECENT INVESTIGATIONS:
- Pre-op Bloods (28 Sep): Normal
- Chest X-Ray (28 Sep): Clear
- Post-op Wound Swab (30 Sep): Pending culture

DOCUMENTED PENDING ITEMS:
- Post-op Surgical Follow-up (approx 2 weeks)
- Cardiology review for hypertension – mentioned but not booked

IMPORTANT RECORDS TO REVIEW:
- Op_Note_2026.pdf (Page 2)`,

  referral: `PATIENT INFORMATION
Name: Rahul Mehta
DOB: 12 Apr 1968 (Age 58)
ID: RM-8492

REASON FOR REFERRAL
Routine post-operative surgical follow-up and cardiology review.

RELEVANT DOCUMENTED HISTORY
Background of hypertension and mild CAD (diagnosed Mar 2024).
Recently admitted 28 Sep 2026 for elective right inguinal hernia repair.

RECENT EVENTS
Uncomplicated hernia repair. Metoprolol increased from 25mg to 50mg OD
(14 Sep 2026) for persistent hypertension. Atorvastatin discontinued.

MEDICATION HISTORY
- Metoprolol 50mg OD
- Paracetamol 1g QDS

DOCUMENTED PENDING ITEMS
- Wound swab culture (30 Sep 2026): Pending
- Cardiology review: Requested, not formally booked

SOURCE REFERENCES
- Outpatient_Clinic_2026.pdf (Page 3)
- Op_Note_2026.pdf (Page 2)`,

  discharge: `DISCHARGE SUMMARY

PATIENT INFORMATION
Name: Rahul Mehta | ID: RM-8492 | DOB: 12 Apr 1968

ADMISSION DETAILS
Admitted: 28 Sep 2026
Reason: Elective Right Inguinal Hernia Repair

DOCUMENTED CLINICAL COURSE
Uncomplicated right inguinal hernia repair on 29 Sep 2026.
Post-operative recovery was standard.

INVESTIGATIONS
- Pre-op bloods (28 Sep 2026): Normal
- CXR (28 Sep 2026): Clear
- Wound swab (30 Sep 2026): Pending culture

MEDICATION CHANGES
- Paracetamol 1g QDS started post-op
- Metoprolol recently increased to 50mg OD (14 Sep 2026)
- Atorvastatin remains held

DOCUMENTED FOLLOW-UP
- Surgical review in 2 weeks
- GP follow-up for cardiology review re: hypertension

OUTSTANDING ITEMS
- Wound swab culture results pending`,
};

export default function GenerateBrief() {
  const [activeType, setActiveType] = useState('handover');
  const [content, setContent] = useState(briefs[activeType]);
  const [copied, setCopied] = useState(false);
  const [approved, setApproved] = useState(false);

  const handleTabChange = (id: string) => {
    setActiveType(id);
    setContent(briefs[id]);
    setApproved(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>

      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <h1>Generate Clinical Brief</h1>
        <p>Create structured, evidence-grounded drafts. Review and approve before use.</p>
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {briefTypes.map(t => (
          <button
            key={t.id}
            onClick={() => handleTabChange(t.id)}
            style={{
              padding: '0.5625rem 1.125rem', borderRadius: 'var(--r-md)',
              border: `1px solid ${activeType === t.id ? 'var(--teal)' : 'var(--border)'}`,
              background: activeType === t.id ? 'var(--teal-light)' : 'var(--surface)',
              color: activeType === t.id ? 'var(--teal)' : 'var(--text-secondary)',
              fontFamily: 'Manrope', fontWeight: 600, fontSize: '0.875rem',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Editor + toolbar */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--r-xl)', overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}>
        {/* Toolbar */}
        <div style={{
          padding: '0.875rem 1.25rem', background: 'var(--surface-3)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={13} color="var(--teal)" />
            </div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'Manrope' }}>
              AI Draft · {approved ? 'Approved' : 'Awaiting Review'}
            </span>
            {approved && <span className="badge badge-success"><Check size={10} /> Approved</span>}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button className="btn btn-sm btn-secondary" onClick={handleCopy}>
              {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
            </button>
            <button className="btn btn-sm btn-secondary">
              <Save size={13} /> Save Draft
            </button>
            <button className="btn btn-sm btn-secondary">
              <FileDown size={13} /> Export PDF
            </button>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => setApproved(true)}
              style={{ background: approved ? 'var(--success)' : 'var(--teal)' }}
            >
              <Check size={13} /> {approved ? 'Approved' : 'Approve'}
            </button>
          </div>
        </div>

        {/* Text area */}
        <div style={{ padding: '1.5rem' }}>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            style={{
              width: '100%', minHeight: 420, resize: 'vertical',
              border: '1px solid var(--border)', borderRadius: 'var(--r-md)',
              padding: '1.25rem', fontFamily: "'DM Mono', 'Fira Code', monospace",
              fontSize: '0.875rem', lineHeight: 1.8,
              color: 'var(--text-body)', background: 'var(--surface-2)',
              outline: 'none', transition: 'border-color 0.15s',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--teal)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>

        {/* Disclaimer */}
        <div style={{
          margin: '0 1.5rem 1.5rem', padding: '0.875rem 1.125rem',
          background: 'var(--warning-bg)', border: '1px solid var(--warning-border)',
          borderRadius: 'var(--r-md)', display: 'flex', gap: '0.625rem', alignItems: 'flex-start',
        }}>
          <AlertTriangle size={15} color="var(--warning)" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: '0.8125rem', color: 'var(--warning)', margin: 0, lineHeight: 1.6 }}>
            <strong>Review Required:</strong> This draft was generated by AI from uploaded documents. Please review and edit for clinical accuracy before formal use or approval.
          </p>
        </div>

        {/* Source references */}
        <div style={{
          margin: '0 1.5rem 1.5rem', padding: '0.875rem 1.125rem',
          background: 'var(--clinical-blue)', border: '1px solid var(--clinical-blue-border)',
          borderRadius: 'var(--r-md)',
        }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--clinical-blue-text)', fontFamily: 'Manrope', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
            Source Documents Used
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['Surgical_Admit_2026.pdf', 'Outpatient_Clinic_2026.pdf', 'Op_Note_2026.pdf', 'Discharge_Summary_Draft.pdf'].map(src => (
              <span key={src} className="source-ref">
                <FileText size={11} /> {src}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
