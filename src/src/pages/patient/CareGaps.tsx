import { mockPatient } from '../../data/patientData';
import { AlertTriangle, FileText } from 'lucide-react';

export default function CareGaps() {
  const gaps = mockPatient.careGaps;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '2rem' }}>
      <div className="page-header" style={{ marginBottom: 0 }}>
        <h1>Documented Follow-ups</h1>
        <p>Items explicitly mentioned in records that appear pending or outstanding.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {gaps.map((gap, idx) => (
          <div
            key={idx}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--warning-border)',
              borderRadius: 'var(--r-xl)',
              borderLeft: '4px solid var(--warning)',
              padding: '1.375rem 1.625rem',
              transition: 'box-shadow 0.18s',
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>{gap.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--warning)', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Status: {gap.status}
                </p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.875rem' }}>{gap.date}</p>
                <span className="source-ref">
                  <FileText size={11} /> {gap.source} — p.{gap.page}
                </span>
              </div>
              <span className="badge badge-warning" style={{ flexShrink: 0 }}>Attention</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
        padding: '1rem 1.25rem', borderRadius: 'var(--r-md)',
        background: 'var(--clinical-blue)', border: '1px solid var(--clinical-blue-border)',
      }}>
        <AlertTriangle size={15} color="var(--clinical-blue-text)" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: '0.8375rem', color: 'var(--clinical-blue-text)', margin: 0, lineHeight: 1.6 }}>
          <strong>Clinical Note:</strong> This tool only surfaces items explicitly documented as pending or requested. It does not claim something was medically missed or dictate clinical care.
        </p>
      </div>
    </div>
  );
}
