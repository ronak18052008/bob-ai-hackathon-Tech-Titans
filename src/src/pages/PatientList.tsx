import { Link } from 'react-router-dom';
import { Search, Plus, ChevronRight, Clock, FileText, Layers } from 'lucide-react';
import { useState } from 'react';

const patients = [
  {
    id: 'RM-8492', name: 'Rahul Mehta', age: 58,
    records: 14, admissions: 3, lastUpdated: 'Today, 09:42 AM',
    status: 'Review Needed', changes: 3, inconsistencies: 1,
  },
  {
    id: 'SP-9231', name: 'Sunita Patel', age: 72,
    records: 8, admissions: 1, lastUpdated: 'Yesterday, 2:30 PM',
    status: 'Up to date', changes: 0, inconsistencies: 0,
  },
  {
    id: 'DK-1049', name: 'Devendra Kulkarni', age: 45,
    records: 3, admissions: 0, lastUpdated: '12 Sep 2026',
    status: 'Up to date', changes: 0, inconsistencies: 0,
  },
];

export default function PatientList() {
  const [search, setSearch] = useState('');

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade-in">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ marginBottom: '0.3rem' }}>Patients</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Select a patient to review their clinical continuity record.
          </p>
        </div>
        <Link to="/patients/new" className="btn btn-primary" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <Plus size={15} /> New Patient
        </Link>
      </div>

      {/* Search */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)', padding: '0.75rem 1rem',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        boxShadow: 'var(--shadow-xs)',
      }}>
        <Search size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or patient ID…"
          style={{
            border: 'none', outline: 'none', background: 'transparent',
            fontSize: '0.9375rem', color: 'var(--text-body)', flex: 1,
          }}
        />
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{filtered.length} patients</span>
      </div>

      {/* Patient cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {filtered.map((p, i) => (
          <Link
            key={p.id}
            to={`/patient/${p.id}/what-changed`}
            className={`animate-fade-in delay-${i + 1}`}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: '1.5rem', padding: '1.25rem 1.5rem',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-xl)', textDecoration: 'none',
              transition: 'all 0.18s var(--ease)',
              boxShadow: 'var(--shadow-xs)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--teal-mid)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-xs)';
            }}
          >
            {/* Avatar + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
              <div style={{
                width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                background: p.status === 'Review Needed'
                  ? 'linear-gradient(135deg, var(--teal-light) 0%, var(--mint) 100%)'
                  : 'var(--surface-3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Manrope', fontWeight: 800, fontSize: '1rem',
                color: p.status === 'Review Needed' ? 'var(--teal)' : 'var(--text-muted)',
              }}>
                {p.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '1rem', color: 'var(--text-heading)', marginBottom: '0.1rem' }}>
                  {p.name}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  {p.age} yrs · ID: {p.id}
                </div>
              </div>
            </div>

            {/* Meta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexShrink: 0 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '1.125rem', color: 'var(--text-heading)' }}>{p.records}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  <FileText size={10} style={{ display: 'inline', marginRight: 2 }} />Documents
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: '1.125rem', color: 'var(--text-heading)' }}>{p.admissions}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  <Layers size={10} style={{ display: 'inline', marginRight: 2 }} />Admissions
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  <Clock size={12} /> {p.lastUpdated}
                </div>
                <span className={`badge ${p.status === 'Review Needed' ? 'badge-warning' : 'badge-success'}`}>
                  {p.status}
                </span>
              </div>
            </div>

            {/* CTA arrow */}
            <ChevronRight size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          </Link>
        ))}

        {filtered.length === 0 && (
          <div style={{
            padding: '3rem', textAlign: 'center',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-xl)',
          }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>No patients match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
