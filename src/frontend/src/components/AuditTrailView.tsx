import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  Lock,
  UserCheck,
  Clock,
  FileText,
  Filter,
  CheckCircle2,
  AlertCircle,
  Building,
} from 'lucide-react';

export const AuditTrailView: React.FC = () => {
  const { auditLogs, selectedPatient } = useApp();
  const [activeTab, setActiveTab] = useState<'audit' | 'consent'>('audit');

  const consents = [
    {
      id: 'con-01',
      patientName: selectedPatient.name,
      abhaId: selectedPatient.abhaId,
      grantedTo: 'Metro Heart Institute (Cardiology Dept)',
      purpose: 'Episode of Inpatient Cardiac Care & Tele-Consultation',
      status: 'ACTIVE',
      grantedAt: '2026-01-16 09:12:00',
      expiresAt: '2027-01-16 23:59:59',
      scope: ['Diagnostic Reports', 'Discharge Summaries', 'Prescriptions'],
    },
    {
      id: 'con-02',
      patientName: selectedPatient.name,
      abhaId: selectedPatient.abhaId,
      grantedTo: 'Apex Tertiary Heart Centre',
      purpose: 'Specialty Tertiary Referral Consultation',
      status: 'ACTIVE',
      grantedAt: '2026-09-19 14:30:00',
      expiresAt: '2026-12-19 23:59:59',
      scope: ['Complete Longitudinal Synapse Record'],
    },
  ];

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase font-bold tracking-wider text-primary">
            Security &amp; Data Governance
          </div>
          <h1 className="text-xl font-extrabold text-text-primary">
            Consent &amp; Immutable Audit Trail
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Non-repudiable audit logging of every document ingestion, AI synthesis, and clinical verification event.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-surface-secondary border border-border p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'audit' ? 'bg-surface text-primary shadow-subtle' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Audit Trail ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('consent')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'consent' ? 'bg-surface text-primary shadow-subtle' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Consent &amp; Access ({consents.length})
          </button>
        </div>
      </div>

      {activeTab === 'audit' ? (
        <div className="p-5 rounded-2xl border border-border bg-surface shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-xs font-semibold text-text-muted">
              Append-Only Tamper-Evident Event Log
            </span>
            <span className="text-[10px] font-mono bg-success-soft text-success px-2 py-0.5 rounded border border-success/30 font-bold">
              Cryptographically Verified
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-[11px] uppercase font-bold text-text-muted">
                  <th className="pb-3 pr-4">Timestamp</th>
                  <th className="pb-3 px-4">Clinician / User</th>
                  <th className="pb-3 px-4">Role</th>
                  <th className="pb-3 px-4">Event Action</th>
                  <th className="pb-3 px-4">Details &amp; Audit Context</th>
                  <th className="pb-3 pl-4 text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-secondary/60 transition-colors">
                    <td className="py-3 pr-4 font-mono text-[11px] text-text-secondary whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4 font-semibold text-text-primary">{log.userName}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-surface-secondary border border-border text-[10px] text-text-muted font-medium">
                        {log.userRole}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-primary font-bold text-[11px]">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 text-text-secondary max-w-sm truncate leading-relaxed">
                      {log.details}
                    </td>
                    <td className="py-3 pl-4 text-right font-mono text-[11px] text-text-muted">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {consents.map((con) => (
            <div
              key={con.id}
              className="p-5 rounded-2xl border border-border bg-surface shadow-subtle space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-2.5">
                <div>
                  <h3 className="font-bold text-base text-text-primary">{con.grantedTo}</h3>
                  <span className="text-xs text-text-muted font-mono">Patient: {con.patientName} (ABHA: {con.abhaId})</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-success-soft text-success border border-success/30 self-start sm:self-auto">
                  {con.status}
                </span>
              </div>

              <div className="text-xs text-text-secondary">
                <strong>Purpose of Consent:</strong> {con.purpose}
              </div>

              <div className="text-xs text-text-muted flex flex-wrap gap-2">
                <span>Scope:</span>
                {con.scope.map((s, idx) => (
                  <span key={idx} className="bg-surface-secondary px-2 py-0.5 rounded border border-border text-text-primary">
                    {s}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] font-mono text-text-muted">
                <span>Granted: {con.grantedAt}</span>
                <span>Expires: {con.expiresAt}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default AuditTrailView;
