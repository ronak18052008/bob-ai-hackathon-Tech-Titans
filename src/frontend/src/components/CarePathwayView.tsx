import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Workflow,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Send,
  UserCheck,
  Microscope,
  Pill,
  CalendarCheck,
} from 'lucide-react';

export const CarePathwayView: React.FC = () => {
  const { selectedPatient } = useApp();

  const pathwaySteps = [
    {
      step: 1,
      title: 'Initial Primary Care Referral',
      date: '15-Jan-2026',
      icon: Send,
      state: 'COMPLETED',
      stateColor: 'bg-success-soft text-success border-success/30',
      details: 'Referred by Dr. S. Rao (Primary Health Centre) for progressive orthopnea and refractory lower limb swelling.',
      evidence: 'Referral Slip Ref-4091 attached to Admission 1 record.',
    },
    {
      step: 2,
      title: 'Specialty Consultation (Emergency Triage)',
      date: '16-Jan-2026',
      icon: UserCheck,
      state: 'COMPLETED',
      stateColor: 'bg-success-soft text-success border-success/30',
      details: 'Triaged by Cardiology CCU team; classified as NYHA Class III acute decompensation.',
      evidence: 'Admission Note 1, Metro Heart Institute.',
    },
    {
      step: 3,
      title: 'Diagnostic Workup (Echocardiography & Labs)',
      date: '18-Jan-2026',
      icon: Microscope,
      state: 'COMPLETED',
      stateColor: 'bg-success-soft text-success border-success/30',
      details: 'Transthoracic Echo confirmed LVEF 42%; serum BNP 1,420 pg/mL.',
      evidence: 'Formal Echocardiogram Diagnostic Report Echo-1.',
    },
    {
      step: 4,
      title: 'Acute In-Hospital Decongestion & GDMT Initiation',
      date: '22-Jan-2026',
      icon: Pill,
      state: 'COMPLETED',
      stateColor: 'bg-success-soft text-success border-success/30',
      details: '4.5kg diuresed; discharged on triple GDMT (Furosemide, Ramipril, Carvedilol).',
      evidence: 'Discharge Summary 1.',
    },
    {
      step: 5,
      title: 'Outpatient Surveillance & Drug Escalation',
      date: '04-Jun-2026',
      icon: CalendarCheck,
      state: 'COMPLETED',
      stateColor: 'bg-success-soft text-success border-success/30',
      details: 'Switched to Torsemide + Entresto + Empagliflozin + Spironolactone.',
      evidence: 'Discharge Summary 2.',
    },
    {
      step: 6,
      title: 'Surveillance Diagnostic Study (Central Lab Echo)',
      date: '16-Sep-2026',
      icon: Microscope,
      state: 'NOT FOUND',
      stateColor: 'bg-warning-soft text-warning border-warning/30 animate-pulse',
      details: 'Cited in clinical discharge notes but official diagnostic report not attached in repository.',
      evidence: 'Discharge Summary 3 (Text citation only; report missing).',
    },
    {
      step: 7,
      title: 'Arrhythmia Surveillance (24-Hr Holter Monitor)',
      date: 'Pending',
      icon: Clock,
      state: 'PENDING',
      stateColor: 'bg-primary-soft text-primary border-primary/30',
      details: 'Requested following documented episode of non-sustained ventricular tachycardia.',
      evidence: 'Discharge Recommendation 3 (Outpatient status unconfirmed).',
    },
  ];

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase font-bold tracking-wider text-primary">
            Clinical Care Pathway Tracking
          </div>
          <h1 className="text-xl font-extrabold text-text-primary">
            Care Pathway Trace: {selectedPatient.name}
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Visualize the documented clinical sequence: Referral → Consultation → Investigation → Treatment → Follow-up.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="font-semibold text-text-muted">Status:</span>
          <span className="px-2 py-0.5 rounded bg-success-soft text-success text-[10px] font-bold">Completed</span>
          <span className="px-2 py-0.5 rounded bg-primary-soft text-primary text-[10px] font-bold">Pending</span>
          <span className="px-2 py-0.5 rounded bg-warning-soft text-warning text-[10px] font-bold">Not Found</span>
        </div>
      </div>

      {/* Pathway Timeline */}
      <div className="p-5 rounded-2xl border border-border bg-surface shadow-subtle space-y-6">
        <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-border before:z-0">
          {pathwaySteps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="relative z-10 flex items-start space-x-4 group">
                {/* Step Circle */}
                <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center shadow-subtle shrink-0 group-hover:border-primary transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>

                {/* Content Card */}
                <div className="flex-1 p-4 rounded-xl border border-border bg-surface-secondary space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-text-muted font-mono">Step {step.step}:</span>
                      <h3 className="font-bold text-sm text-text-primary">{step.title}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-mono text-text-muted">{step.date}</span>
                      <span
                        className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${step.stateColor}`}
                      >
                        {step.state}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed">{step.details}</p>

                  <div className="pt-2 border-t border-border text-[11px] text-text-muted flex items-center space-x-1.5">
                    <strong>Evidence:</strong>
                    <span>{step.evidence}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default CarePathwayView;
