import { Link } from 'react-router-dom';
import { FileUp, Users, FileText, Clock, AlertTriangle, RefreshCw, ArrowRight, Activity } from 'lucide-react';

const recentPatients = [
  {
    id: 'RM-8492', name: 'Rahul Mehta', age: 58, lastUpdate: 'Today, 10:42 AM',
    records: 14, admissions: 3, status: 'Review Needed',
    changes: 3, medChanges: 2, pending: 1, inconsistencies: 1,
  },
  {
    id: 'SP-9231', name: 'Sunita Patel', age: 72, lastUpdate: 'Yesterday, 2:30 PM',
    records: 8, admissions: 1, status: 'Up to date',
    changes: 0, medChanges: 0, pending: 0, inconsistencies: 0,
  },
];

const activityFeed = [
  { time: '10:42 AM', event: 'New discharge summary processed', type: 'doc', patient: 'Rahul Mehta' },
  { time: '10:38 AM', event: 'Medication change detected', type: 'med', patient: 'Rahul Mehta' },
  { time: '10:31 AM', event: 'Potential inconsistency flagged', type: 'flag', patient: 'Rahul Mehta' },
  { time: '10:20 AM', event: 'New investigation result extracted', type: 'lab', patient: 'Rahul Mehta' },
];

const activityColor: Record<string, string> = {
  doc: 'var(--teal)',
  med: 'var(--clinical-blue-text)',
  flag: 'var(--warning)',
  lab: 'var(--success)',
};
const activityBg: Record<string, string> = {
  doc: 'var(--teal-light)',
  med: 'var(--clinical-blue)',
  flag: 'var(--warning-bg)',
  lab: 'var(--success-bg)',
};

const stats = [
  { label: 'Total Patients', value: '1,248', icon: Users, color: 'var(--teal)', bg: 'var(--teal-light)' },
  { label: 'Documents Processed', value: '3,842', icon: FileText, color: 'var(--clinical-blue-text)', bg: 'var(--clinical-blue)' },
  { label: 'Active Reviews', value: '4', icon: Clock, color: 'var(--warning)', bg: 'var(--warning-bg)' },
  { label: 'Pending Items', value: '12', icon: AlertTriangle, color: 'var(--danger)', bg: 'var(--danger-bg)' },
];

export default function Dashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Header */}
      <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '0.35rem' }}>
            Good morning, Dr. Sharma.
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Here's what needs your attention today.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
          <Link to="/patient/RM-8492/what-changed" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
            Open Demo Patient
          </Link>
          <Link to="/upload" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
            <FileUp size={15} /> Upload Records
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid-4 animate-fade-in delay-1">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <s.icon size={18} color={s.color} />
            </div>
            <div>
              <div className="stat-number">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main content row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>

        {/* Patient Intelligence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '1.125rem', marginBottom: '0.15rem' }}>Patient Intelligence</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>Patients with recent activity</p>
            </div>
            <Link to="/patients" style={{
              display: 'flex', alignItems: 'center', gap: '0.25rem',
              fontSize: '0.875rem', fontWeight: 600, color: 'var(--teal)', textDecoration: 'none'
            }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {recentPatients.map((p, i) => (
            <Link
              key={p.id}
              to={`/patient/${p.id}/what-changed`}
              className={`patient-card animate-fade-in delay-${i + 2}`}
              style={{ textDecoration: 'none' }}
            >
              {/* Top row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: 'linear-gradient(135deg, var(--teal-light) 0%, var(--mint) 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    fontFamily: 'Manrope', fontWeight: 800, fontSize: '1.125rem', color: 'var(--teal)',
                  }}>
                    {p.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '1rem', color: 'var(--text-heading)' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                      {p.age} yrs · ID: {p.id}
                    </div>
                  </div>
                </div>
                <span className={`badge ${p.status === 'Review Needed' ? 'badge-warning' : 'badge-success'}`}>
                  {p.status}
                </span>
              </div>

              {/* Metrics row */}
              {p.changes > 0 && (
                <div style={{
                  display: 'flex', gap: '0.625rem', flexWrap: 'wrap',
                  paddingTop: '0.875rem', borderTop: '1px solid var(--border)',
                }}>
                  <span className="badge badge-teal">{p.changes} changes</span>
                  <span className="badge badge-pending">{p.medChanges} med changes</span>
                  {p.pending > 0 && <span className="badge badge-warning">{p.pending} pending</span>}
                  {p.inconsistencies > 0 && <span className="badge badge-danger">{p.inconsistencies} inconsistency</span>}
                </div>
              )}

              {/* Bottom row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Clock size={12} /> Last updated {p.lastUpdate}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--teal)' }}>
                  Review <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}

          <Link to="/patients/new" className="btn btn-secondary" style={{ textDecoration: 'none', alignSelf: 'flex-start' }}>
            <Users size={15} /> Add New Patient
          </Link>
        </div>

        {/* Activity Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.125rem', marginBottom: '0.15rem' }}>Activity Feed</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>Today's processing log</p>
          </div>

          <div className="card animate-fade-in delay-3" style={{ padding: '1.25rem', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {activityFeed.map((a, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '0.875rem', alignItems: 'flex-start',
                  padding: '0.875rem 0',
                  borderBottom: i < activityFeed.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', paddingTop: '2px' }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: activityColor[a.type], flexShrink: 0,
                    }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-body)', marginBottom: '0.15rem' }}>
                      {a.event}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {a.time} · {a.patient}
                    </div>
                  </div>
                  <div style={{
                    flexShrink: 0, width: 28, height: 28, borderRadius: 7,
                    background: activityBg[a.type],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Activity size={13} color={activityColor[a.type]} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick summary */}
          <div className="card animate-fade-in delay-4" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
              <div style={{
                width: 24, height: 24, borderRadius: 6,
                background: 'var(--teal-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <RefreshCw size={12} color="var(--teal)" />
              </div>
              <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-heading)' }}>
                Latest Brief Ready
              </span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '0.875rem', lineHeight: 1.55 }}>
              Rahul Mehta's clinical brief has been updated with 3 new changes from the latest admission.
            </p>
            <Link to="/patient/RM-8492/briefs" className="btn btn-sm btn-primary" style={{ textDecoration: 'none', width: '100%' }}>
              View Brief
            </Link>
          </div>
        </div>
      </div>

      {/* How it works strip */}
      <div className="animate-fade-in delay-5" style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-80) 100%)',
        borderRadius: 'var(--r-xl)', padding: '2rem 2.5rem', color: '#fff',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', flexWrap: 'wrap',
        marginTop: '0.5rem',
      }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.4rem' }}>
            Turn fragmented records into one clinical story.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', margin: 0 }}>
            Upload documents → Extract insights → Review evidence → Generate brief.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/upload" className="btn btn-sm" style={{
            background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', textDecoration: 'none'
          }}>
            <FileUp size={14} /> Upload Records
          </Link>
          <Link to="/patient/RM-8492/what-changed" className="btn btn-sm" style={{
            background: 'var(--teal)', color: '#fff', textDecoration: 'none'
          }}>
            Open Demo Patient
          </Link>
        </div>
      </div>

    </div>
  );
}
