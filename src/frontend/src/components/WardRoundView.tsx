import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Pill,
  Microscope,
  Radar,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const WardRoundView: React.FC = () => {
  const { patients, setSelectedPatient, setActiveTab, addAuditLog } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);

  const patient = patients[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % patients.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + patients.length) % patients.length);
  };

  const handleMarkReviewed = () => {
    addAuditLog('WARD_ROUND_REVIEWED', `Bedside ward round review completed for ${patient.name}`);
    handleNext();
  };

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase font-bold tracking-wider text-primary">
            Bedside Clinical Navigation
          </div>
          <h1 className="text-xl font-extrabold text-text-primary">
            Ward Round Mode (Tablet &amp; Mobile Optimized)
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Rapid patient-by-patient bedside briefing surfacing latest events, medication titrations, and pending tests.
          </p>
        </div>

        {/* Carousel Navigation Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrev}
            className="p-2 rounded-xl bg-surface border border-border hover:bg-surface-secondary text-text-primary shadow-sm"
            title="Previous Patient"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-mono font-bold text-text-muted px-2">
            Patient {currentIndex + 1} of {patients.length}
          </span>
          <button
            onClick={handleNext}
            className="p-2 rounded-xl bg-surface border border-border hover:bg-surface-secondary text-text-primary shadow-sm"
            title="Next Patient"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Ward Round Patient Card (Touch & Tablet friendly) */}
      <div className="max-w-4xl mx-auto p-6 md:p-8 rounded-3xl border border-border bg-surface shadow-elevation space-y-6">
        {/* Top Demographics Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-ai text-white font-extrabold text-xl flex items-center justify-center shadow">
              {patient.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold text-text-primary">{patient.name}</h2>
                <span className="text-xs font-mono bg-surface-secondary px-2 py-0.5 rounded border border-border">
                  {patient.mrn}
                </span>
              </div>
              <div className="text-xs text-text-muted mt-0.5">
                {patient.age} years old • {patient.gender} • Blood Group {patient.bloodGroup} • Assigned: {patient.assignedDoctor}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-primary-soft text-primary font-bold">
              {patient.completenessScore}% Completeness
            </span>
          </div>
        </div>

        {/* Primary Diagnosis */}
        <div className="p-4 rounded-xl bg-surface-secondary border border-border space-y-1">
          <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">
            Primary Documented Diagnosis
          </span>
          <div className="font-bold text-base text-text-primary">{patient.primaryCondition}</div>
        </div>

        {/* Ward Round Highlights Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Latest Documented Event */}
          <div className="p-4 rounded-xl border border-border bg-surface space-y-2">
            <div className="flex items-center space-x-2 text-primary font-bold">
              <Stethoscope className="w-4 h-4" />
              <span>Latest Documented Event</span>
            </div>
            <p className="text-text-secondary leading-relaxed">
              Discharge on 2026-09-18 following cardiorenal syndrome decompensation. Torsemide split dose (20mg + 10mg) and Sacubitril/Valsartan 49/51mg BID prescribed.
            </p>
          </div>

          {/* Pending Investigations */}
          <div className="p-4 rounded-xl border border-warning/40 bg-warning-soft/20 space-y-2">
            <div className="flex items-center space-x-2 text-warning font-bold">
              <Microscope className="w-4 h-4" />
              <span>Pending Investigations &amp; Gaps</span>
            </div>
            <p className="text-text-secondary leading-relaxed">
              Formal 2D-Echo report dated 16-Sep-2026 missing from chart. 24-hr Holter monitor booking unconfirmed.
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            onClick={() => {
              setSelectedPatient(patient);
              setActiveTab('synapse');
            }}
            className="px-5 py-2.5 rounded-xl bg-surface border border-border hover:bg-surface-secondary text-primary font-bold text-xs flex items-center justify-center space-x-2 transition-colors"
          >
            <span>Open Synapse View Workspace</span>
            <ExternalLink className="w-4 h-4" />
          </button>

          <button
            onClick={handleMarkReviewed}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow transition-all hover:scale-[1.02] flex items-center justify-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark Bedside Review Complete &amp; Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default WardRoundView;
