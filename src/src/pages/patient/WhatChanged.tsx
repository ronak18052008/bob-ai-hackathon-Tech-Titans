import { mockPatient } from '../../data/patientData';
import { PlusCircle, Activity, CheckCircle, Clock, FileText, AlertTriangle } from 'lucide-react';

export default function WhatChanged() {
  const data = mockPatient.whatChanged;

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-8">
      <header>
        <h1 className="text-3xl mb-2">What Changed Since Previous Records?</h1>
        <p className="text-secondary text-lg m-0">Comparing new uploads with existing patient history.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {/* NEW SECTIONS */}
        <div className="flex flex-col gap-6">
          <section className="surface p-6">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4" style={{ color: 'var(--primary)' }}>
              <PlusCircle className="w-5 h-5" /> New Documented Events & Diagnoses
            </h2>
            <div className="space-y-4">
              {data.newEvents.map((item, i) => (
                <div key={`event-${i}`} className="p-4 rounded-md" style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                  <h3 className="text-base font-semibold m-0">{item.title}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-secondary">{item.date}</span>
                    <span className="source-evidence flex items-center gap-1 cursor-pointer hover:underline">
                      <FileText className="w-3 h-3" /> {item.source}
                    </span>
                  </div>
                </div>
              ))}
              {data.newDiagnoses.map((item, i) => (
                <div key={`diag-${i}`} className="p-4 rounded-md" style={{ backgroundColor: 'var(--primary-light)', border: '1px solid #99F6E4' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge badge-primary">NEW DIAGNOSIS</span>
                  </div>
                  <h3 className="text-base font-semibold m-0" style={{ color: 'var(--primary-text)' }}>{item.title}</h3>
                  <div className="flex justify-end mt-2">
                    <span className="source-evidence flex items-center gap-1 cursor-pointer hover:underline" style={{ backgroundColor: '#FFFFFF' }}>
                      <FileText className="w-3 h-3" /> {item.source}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="surface p-6">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4" style={{ color: 'var(--warning)' }}>
              <Clock className="w-5 h-5" /> Still Documented as Pending
            </h2>
            <div className="space-y-4">
              {data.pending.map((item, i) => (
                <div key={`pend-${i}`} className="p-4 rounded-md" style={{ backgroundColor: 'var(--warning-bg)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <h3 className="text-base font-semibold m-0" style={{ color: '#92400E' }}>{item.title}</h3>
                  <div className="flex justify-end mt-2">
                    <span className="source-evidence flex items-center gap-1 cursor-pointer hover:underline" style={{ backgroundColor: '#FFFFFF', color: '#92400E' }}>
                      <FileText className="w-3 h-3" /> {item.source}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* CHANGED / RESOLVED SECTIONS */}
        <div className="flex flex-col gap-6">
          <section className="surface p-6">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4" style={{ color: 'var(--accent)' }}>
              <Activity className="w-5 h-5" /> Medication & Investigation Changes
            </h2>
            <div className="space-y-4">
              {data.changedMeds.map((item, i) => (
                <div key={`med-${i}`} className="p-4 rounded-md" style={{ backgroundColor: 'var(--accent-light)', border: '1px solid #BFDBFE' }}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-semibold m-0" style={{ color: '#1E3A8A' }}>{item.name}</h3>
                    <span className="badge badge-ai bg-blue text-white">{item.status}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm mb-3" style={{ color: '#1E3A8A' }}>
                    <span className="line-through opacity-70">{item.previous}</span>
                    <span className="font-bold">→</span>
                    <span className="font-bold">{item.current}</span>
                  </div>
                  <div className="flex justify-end">
                    <span className="source-evidence flex items-center gap-1 cursor-pointer hover:underline" style={{ backgroundColor: '#FFFFFF' }}>
                      <FileText className="w-3 h-3" /> {item.source}
                    </span>
                  </div>
                </div>
              ))}
              {data.newMeds.map((item, i) => (
                <div key={`nmed-${i}`} className="p-4 rounded-md" style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-semibold m-0">{item.name}</h3>
                    <span className="badge badge-success">NEW MEDICATION</span>
                  </div>
                  <div className="flex justify-end mt-2">
                    <span className="source-evidence flex items-center gap-1 cursor-pointer hover:underline">
                      <FileText className="w-3 h-3" /> {item.source}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="surface p-6">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4" style={{ color: 'var(--success)' }}>
              <CheckCircle className="w-5 h-5" /> Resolved Items
            </h2>
            <div className="space-y-4">
              {data.resolved.map((item, i) => (
                <div key={`res-${i}`} className="p-4 rounded-md" style={{ backgroundColor: 'var(--success-bg)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                  <h3 className="text-base font-semibold m-0" style={{ color: '#14532D' }}>{item.title}</h3>
                  <p className="text-sm m-0 mt-1" style={{ color: '#14532D' }}>Result: {item.result}</p>
                  <div className="flex justify-end mt-2">
                    <span className="source-evidence flex items-center gap-1 cursor-pointer hover:underline" style={{ backgroundColor: '#FFFFFF', color: '#14532D' }}>
                      <FileText className="w-3 h-3" /> {item.source}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          <div className="p-4 rounded-md flex gap-3 text-sm items-start" style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)' }}>
            <AlertTriangle className="w-5 h-5 text-muted flex-shrink-0" />
            <div className="text-secondary">
              <strong>Unable to determine:</strong> The patient's exact current smoking status is not explicitly documented in the latest records.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
