import { mockPatient } from '../../data/patientData';
import { FileText, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

const statusConfig: Record<string, { label: string; badgeClass: string; icon: any; color: string }> = {
  'Result Available': { label: 'Result Available', badgeClass: 'badge-success', icon: CheckCircle2, color: 'var(--success)' },
  'Pending':          { label: 'Pending',           badgeClass: 'badge-warning', icon: Clock,          color: 'var(--warning)' },
  'Awaited':          { label: 'Awaited',           badgeClass: 'badge-pending', icon: Clock,          color: 'var(--pending)' },
};

export default function Investigations() {
  const investigations = mockPatient.investigations;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '2rem' }}>
      <div className="page-header" style={{ marginBottom: 0 }}>
        <h1>Documented Follow-ups</h1>
        <p>Investigations and tests mentioned in the uploaded records.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {investigations.map((inv, idx) => {
          const conf = statusConfig[inv.status] || { label: inv.status, badgeClass: 'badge-neutral', icon: AlertTriangle, color: 'var(--text-muted)' };
          const Icon = conf.icon;
          return (
            <div
              key={idx}
              style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--r-xl)', padding: '1.25rem 1.5rem',
                display: 'flex', alignItems: 'center', gap: '1.25rem',
                transition: 'all 0.18s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
            >
              {/* Status icon */}
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: conf.badgeClass === 'badge-success' ? 'var(--success-bg)' : conf.badgeClass === 'badge-warning' ? 'var(--warning-bg)' : 'var(--pending-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={18} color={conf.color} />
              </div>

              {/* Main info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-heading)', marginBottom: '0.175rem' }}>
                  {inv.name}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  {inv.result}
                </div>
              </div>

              {/* Date */}
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                {inv.date}
              </div>

              {/* Status */}
              <span className={`badge ${conf.badgeClass}`} style={{ flexShrink: 0 }}>
                {conf.label}
              </span>

              {/* Source */}
              <span className="source-ref" style={{ flexShrink: 0 }}>
                <FileText size={11} /> {inv.source}
              </span>
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
        <AlertTriangle size={15} color="var(--clinical-blue-text)" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: '0.8375rem', color: 'var(--clinical-blue-text)', margin: 0, lineHeight: 1.6 }}>
          <strong>Note:</strong> Result summaries are extracted from unstructured notes. They may not represent the complete final report. Always view the source document for clinical decisions.
        </p>
      </div>
    </div>
  );
}
