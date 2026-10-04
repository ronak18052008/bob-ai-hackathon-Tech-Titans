import { mockPatient } from '../../data/patientData';
import { FileText } from 'lucide-react';

const typeConfig: Record<string, { color: string; bg: string; label: string }> = {
  'Admission': { color: 'var(--teal)', bg: 'var(--teal-light)', label: 'Admission' },
  'Investigation': { color: 'var(--clinical-blue-text)', bg: 'var(--clinical-blue)', label: 'Investigation' },
  'Procedure': { color: 'var(--pending)', bg: 'var(--pending-bg)', label: 'Procedure' },
  'Outpatient': { color: 'var(--success)', bg: 'var(--success-bg)', label: 'Outpatient' },
  'default': { color: 'var(--text-secondary)', bg: 'var(--surface-3)', label: 'Event' },
};

export default function Timeline() {
  const timeline = mockPatient.timeline;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="page-header">
        <h1>Clinical Timeline</h1>
        <p>Chronological history extracted from uploaded records.</p>
      </div>

      <div style={{ maxWidth: 720, paddingBottom: '2rem' }}>
        <div className="timeline-track">
          {timeline.map((event, idx) => {
            const conf = typeConfig[event.type] || typeConfig['default'];
            return (
              <div key={idx} className="timeline-node">
                <div className="timeline-dot" />
                <div style={{ marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--teal)', fontFamily: 'Manrope', letterSpacing: '0.02em' }}>
                    {event.date}
                  </span>
                </div>
                <div
                  className="card"
                  style={{ padding: '1.25rem 1.5rem', transition: 'all 0.18s', cursor: 'default' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-xs)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.625rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        display: 'inline-block', padding: '0.18rem 0.6rem',
                        background: conf.bg, color: conf.color,
                        borderRadius: 99, fontSize: '0.68rem', fontWeight: 700,
                        fontFamily: 'Manrope', letterSpacing: '0.04em', textTransform: 'uppercase',
                      }}>{event.type}</span>
                      <h3 style={{ fontSize: '1rem', margin: 0 }}>{event.title}</h3>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.875rem', lineHeight: 1.6 }}>
                    {event.desc}
                  </p>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    paddingTop: '0.75rem', borderTop: '1px solid var(--border)',
                  }}>
                    <span className="source-ref">
                      <FileText size={11} /> {event.source} — p.{event.page}
                    </span>
                    <button style={{
                      border: 'none', background: 'transparent', cursor: 'pointer',
                      fontSize: '0.8125rem', fontWeight: 600, color: 'var(--teal)',
                      fontFamily: 'Manrope',
                    }}>
                      View Document →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
