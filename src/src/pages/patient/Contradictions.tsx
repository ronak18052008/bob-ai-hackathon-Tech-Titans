import { mockPatient } from '../../data/patientData';
import { FileText, AlertTriangle } from 'lucide-react';

export default function Contradictions() {
  const contradictions = mockPatient.contradictions;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '2rem' }}>
      <div className="page-header" style={{ marginBottom: 0 }}>
        <h1>Consistency Check</h1>
        <p>Possible inconsistencies detected across your uploaded documents.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {contradictions.map((conflict, idx) => (
          <div
            key={idx}
            style={{
              background: 'var(--surface)', border: '1px solid var(--danger-border)',
              borderRadius: 'var(--r-xl)', overflow: 'hidden',
            }}
          >
            {/* Header bar */}
            <div style={{
              padding: '1rem 1.5rem', background: 'var(--danger-bg)',
              borderBottom: '1px solid var(--danger-border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <AlertTriangle size={16} color="var(--danger)" />
                <h3 style={{ fontSize: '0.9375rem', margin: 0, color: 'var(--danger)' }}>
                  Possible Inconsistency: {conflict.title}
                </h3>
              </div>
              <span className="badge badge-danger">Review Required</span>
            </div>

            <div style={{ padding: '1.25rem 1.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                {conflict.desc}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 600, fontFamily: 'Manrope', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Documented values
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                {[
                  { label: 'Document A', doc: conflict.docA },
                  { label: 'Document B', doc: conflict.docB },
                ].map(({ label, doc }, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '1rem 1.25rem', borderRadius: 'var(--r-lg)',
                      background: 'var(--danger-bg)', border: '1px solid var(--danger-border)',
                    }}
                  >
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--danger)', fontFamily: 'Manrope', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      {label}
                    </div>
                    <p style={{ fontFamily: 'Manrope', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--danger)', marginBottom: '0.875rem', lineHeight: 1.5 }}>
                      "{doc.text}"
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="source-ref">
                        <FileText size={11} /> {doc.name}
                      </span>
                      <button className="btn btn-xs btn-secondary">View Document</button>
                    </div>
                  </div>
                ))}
              </div>

              <p style={{
                marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: 'var(--r-md)',
                background: 'var(--surface-3)', fontSize: '0.8125rem', color: 'var(--text-secondary)',
                lineHeight: 1.6,
              }}>
                ⚠️ MedBrief AI surfaces the conflict but <strong>never decides which record is correct</strong>. Please verify against the original documents.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
