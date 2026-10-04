import { mockPatient } from '../../data/patientData';
import { Pill, FileText, AlertTriangle } from 'lucide-react';

const changeTypeStyle: Record<string, { badge: string; badgeClass: string }> = {
  'Dose Increased': { badge: 'Dose Increased', badgeClass: 'badge-warning' },
  'Discontinued':   { badge: 'Discontinued',   badgeClass: 'badge-danger' },
  'New':            { badge: 'Newly Added',     badgeClass: 'badge-teal' },
  'No change':      { badge: 'No Change',       badgeClass: 'badge-neutral' },
};

export default function MedicationRadar() {
  const medications = mockPatient.medications;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '2rem' }}>
      <div className="page-header" style={{ marginBottom: 0 }}>
        <h1>Medication Changes</h1>
        <p>Changes in medication documentation detected across uploaded records.</p>
      </div>

      {/* Medication cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {medications.map((med, idx) => {
          const style = changeTypeStyle[med.change] || { badge: med.change, badgeClass: 'badge-neutral' };
          return (
            <div
              key={idx}
              style={{
                background: 'var(--surface)',
                border: `1px solid ${med.conflict ? 'var(--warning-border)' : 'var(--border)'}`,
                borderRadius: 'var(--r-xl)',
                padding: '1.375rem 1.625rem',
                borderLeft: `4px solid ${med.conflict ? 'var(--warning)' : med.change === 'Discontinued' ? 'var(--danger)' : med.change === 'New' ? 'var(--teal)' : 'var(--clinical-blue-text)'}`,
                transition: 'box-shadow 0.18s',
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                {/* Left: name + before/after */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: 'var(--teal-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Pill size={15} color="var(--teal)" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', margin: 0 }}>{med.name}</h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{med.date}</span>
                    </div>
                  </div>

                  {/* Before → After */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.375rem' }}>
                    <div style={{
                      padding: '0.375rem 0.875rem', borderRadius: 'var(--r-sm)',
                      background: 'var(--surface-3)', border: '1px solid var(--border)',
                    }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.1rem' }}>PREVIOUS</div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-secondary)', textDecoration: med.change !== 'No change' ? 'line-through' : 'none' }}>{med.previous}</div>
                    </div>
                    {med.change !== 'No change' && (
                      <>
                        <span style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}>→</span>
                        <div style={{
                          padding: '0.375rem 0.875rem', borderRadius: 'var(--r-sm)',
                          background: 'var(--teal-light)', border: '1px solid var(--teal-mid)',
                        }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--teal)', fontWeight: 600, marginBottom: '0.1rem' }}>CURRENT</div>
                          <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--teal)' }}>{med.current}</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Right: badge + source */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem', flexShrink: 0 }}>
                  <span className={`badge ${style.badgeClass}`}>{style.badge}</span>
                  <span className="source-ref">
                    <FileText size={11} /> {med.source}
                  </span>
                </div>
              </div>

              {/* Conflict warning */}
              {med.conflict && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  marginTop: '0.875rem', padding: '0.625rem 0.875rem',
                  background: 'var(--warning-bg)', border: '1px solid var(--warning-border)',
                  borderRadius: 'var(--r-sm)', fontSize: '0.8125rem', color: 'var(--warning)',
                }}>
                  <AlertTriangle size={13} />
                  <strong>Inconsistency detected:</strong> Different values appear in two records. Please verify.
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div style={{
        display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
        padding: '1rem 1.25rem', borderRadius: 'var(--r-md)',
        background: 'var(--clinical-blue)', border: '1px solid var(--clinical-blue-border)',
      }}>
        <Pill size={15} color="var(--clinical-blue-text)" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: '0.8375rem', color: 'var(--clinical-blue-text)', margin: 0, lineHeight: 1.6 }}>
          <strong>Documentation only.</strong> MedBrief AI reports what is documented and does not interpret whether a medication change is clinically appropriate. Always verify against the original source.
        </p>
      </div>
    </div>
  );
}
