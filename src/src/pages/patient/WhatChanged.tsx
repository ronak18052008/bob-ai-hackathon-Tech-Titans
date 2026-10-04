import { useState } from 'react';
import { mockPatient } from '../../data/patientData';
import { PlusCircle, Activity, CheckCircle2, Clock, FileText, AlertTriangle } from 'lucide-react';

type TabId = 'new' | 'changed' | 'resolved' | 'pending';

const tabs: { id: TabId; label: string; icon: any; color: string }[] = [
  { id: 'new',      label: 'New',             icon: PlusCircle,   color: 'var(--teal)' },
  { id: 'changed',  label: 'Changed',         icon: Activity,     color: 'var(--clinical-blue-text)' },
  { id: 'resolved', label: 'Resolved',        icon: CheckCircle2, color: 'var(--success)' },
  { id: 'pending',  label: 'Still Pending',   icon: Clock,        color: 'var(--warning)' },
];

export default function WhatChanged() {
  const [activeTab, setActiveTab] = useState<TabId>('new');
  const data = mockPatient.whatChanged;

  const counts: Record<TabId, number> = {
    new:      data.newEvents.length + data.newDiagnoses.length,
    changed:  data.changedMeds.length + data.newMeds.length,
    resolved: data.resolved.length,
    pending:  data.pending.length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

      {/* Header */}
      <div className="page-header" style={{ marginBottom: '0' }}>
        <h1>What Changed?</h1>
        <p>Comparing the latest records with the patient's previous history.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.6rem 1.125rem', borderRadius: 'var(--r-md)',
                border: `1px solid ${isActive ? tab.color : 'var(--border)'}`,
                background: isActive ? `color-mix(in srgb, ${tab.color} 10%, white)` : 'var(--surface)',
                color: isActive ? tab.color : 'var(--text-secondary)',
                fontFamily: 'Manrope', fontWeight: 600, fontSize: '0.875rem',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              <Icon size={14} />
              {tab.label}
              {counts[tab.id] > 0 && (
                <span style={{
                  background: isActive ? tab.color : 'var(--surface-3)',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  borderRadius: 99, padding: '0 6px',
                  fontSize: '0.7rem', fontWeight: 700, fontFamily: 'Manrope',
                }}>{counts[tab.id]}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="animate-fade-in" key={activeTab} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', paddingBottom: '2rem' }}>

        {/* NEW */}
        {activeTab === 'new' && (
          <>
            {[...data.newEvents.map(e => ({ ...e, kind: 'event' })), ...data.newDiagnoses.map(e => ({ ...e, kind: 'diagnosis' }))].map((item, i) => (
              <div key={i} className="change-card change-card-new">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={item.kind === 'diagnosis' ? 'badge badge-teal' : 'badge badge-neutral'}>
                      {item.kind === 'diagnosis' ? 'New Diagnosis' : 'New Event'}
                    </span>
                    <h3 style={{ fontSize: '0.9375rem', margin: 0 }}>{item.title}</h3>
                  </div>
                  {'date' in item && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{(item as any).date}</span>}
                </div>
                <span className="source-ref">
                  <FileText size={11} /> {item.source}
                </span>
              </div>
            ))}
          </>
        )}

        {/* CHANGED */}
        {activeTab === 'changed' && (
          <>
            {data.changedMeds.map((item, i) => (
              <div key={i} className="change-card change-card-changed">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.625rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                      <span className="badge badge-ai">{item.status}</span>
                      <h3 style={{ fontSize: '0.9375rem', margin: 0 }}>{item.name}</h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                      <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through' }}>{item.previous}</span>
                      <span style={{ color: 'var(--text-muted)' }}>→</span>
                      <span style={{ fontWeight: 700, color: 'var(--text-heading)' }}>{item.current}</span>
                    </div>
                  </div>
                </div>
                <span className="source-ref"><FileText size={11} /> {item.source}</span>
              </div>
            ))}
            {data.newMeds.map((item, i) => (
              <div key={`nm-${i}`} className="change-card change-card-new">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span className="badge badge-teal">New Medication</span>
                  <h3 style={{ fontSize: '0.9375rem', margin: 0 }}>{item.name}</h3>
                </div>
                <span className="source-ref"><FileText size={11} /> {item.source}</span>
              </div>
            ))}
          </>
        )}

        {/* RESOLVED */}
        {activeTab === 'resolved' && (
          <>
            {data.resolved.map((item, i) => (
              <div key={i} className="change-card change-card-resolved">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '0.9375rem', margin: 0, color: 'var(--success)' }}>{item.title}</h3>
                  <span className="badge badge-success">Resolved</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.625rem' }}>
                  Result: {item.result}
                </p>
                <span className="source-ref"><FileText size={11} /> {item.source}</span>
              </div>
            ))}
          </>
        )}

        {/* PENDING */}
        {activeTab === 'pending' && (
          <>
            {data.pending.map((item, i) => (
              <div key={i} className="change-card change-card-pending">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '0.9375rem', margin: 0 }}>{item.title}</h3>
                  <span className="badge badge-warning">Pending</span>
                </div>
                <span className="source-ref"><FileText size={11} /> {item.source}</span>
              </div>
            ))}

            {/* Undetermined notice */}
            <div style={{
              display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
              padding: '1rem 1.25rem', borderRadius: 'var(--r-md)',
              background: 'var(--surface-3)', border: '1px solid var(--border)',
            }}>
              <AlertTriangle size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                <strong>Could not determine:</strong> The patient's exact current smoking status is not explicitly documented in the latest records.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
