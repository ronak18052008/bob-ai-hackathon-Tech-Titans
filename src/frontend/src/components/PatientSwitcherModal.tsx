import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  X,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRightLeft,
  Calendar,
  AlertTriangle,
  Stethoscope,
  ChevronRight,
  FileCheck2,
} from 'lucide-react';
import { Patient } from '../types';

interface PatientSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PatientSwitcherModal: React.FC<PatientSwitcherModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    patients,
    selectedPatient,
    setSelectedPatient,
    addAuditLog,
    setActiveTab,
  } = useApp();

  const [visitNotes, setVisitNotes] = useState(
    'Ward round and clinical journey evaluation completed. Medication titration verified. Stable for ongoing step-down monitoring.'
  );
  const [concludingPatient, setConcludingPatient] = useState(false);

  if (!isOpen) return null;

  const PATIENT_LOCATIONS: Record<string, { ward: string; bed: string; status: string; statusColor: string }> = {
    'pat-001': { ward: 'Coronary Care Unit', bed: 'Bed 12', status: 'Inpatient (Active)', statusColor: 'bg-brand-50 text-brand-700 border-brand-200' },
    'pat-002': { ward: 'Pulmonary Ward', bed: 'Room 204', status: 'Post-Step-Up Observation', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    'pat-003': { ward: 'Step-Down Cardiac', bed: 'Bed 06', status: 'Medication Conflict Review', statusColor: 'bg-rose-50 text-rose-700 border-rose-200' },
    'pat-004': { ward: 'Surgical Ward 4B', bed: 'Bed 18', status: 'Post-Op Day #2', statusColor: 'bg-sky-50 text-sky-700 border-sky-200' },
    'pat-005': { ward: 'Nephrology Ward', bed: 'Room 108', status: 'Cardiorenal Surveillance', statusColor: 'bg-purple-50 text-purple-700 border-purple-200' },
    'pat-006': { ward: 'Outpatient Clinic', bed: 'OPD-3', status: 'Scheduled Follow-Up', statusColor: 'bg-amber-50 text-amber-700 border-amber-200' },
  };

  const handleSwitchPatient = (targetPatient: Patient) => {
    setConcludingPatient(true);

    // 1. Log visit conclusion for previous patient
    addAuditLog(
      'PATIENT_VISIT_CONCLUDED',
      `Dr. Ananya Roy concluded clinical encounter for ${selectedPatient.name} (${selectedPatient.mrn}). Summary: "${visitNotes}"`
    );

    // 2. Log switch to new patient
    addAuditLog(
      'PATIENT_SWITCHED',
      `Doctor initiated clinical encounter for next patient: ${targetPatient.name} (${targetPatient.mrn})`
    );

    // 3. Update active patient
    setTimeout(() => {
      setSelectedPatient(targetPatient);
      setConcludingPatient(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-all flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                Complete Encounter &amp; Switch Patient
              </h2>
              <p className="text-xs text-slate-500">
                Current Active Encounter: <span className="font-bold text-slate-800 dark:text-slate-200">{selectedPatient.name}</span> ({selectedPatient.mrn})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Current Visit Wrap-Up Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Stethoscope className="w-4 h-4 text-brand-600" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Encounter Wrap-Up Notes for {selectedPatient.name}
                </h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Ready to Conclude
              </span>
            </div>

            <textarea
              rows={2}
              value={visitNotes}
              onChange={(e) => setVisitNotes(e.target.value)}
              placeholder="Enter brief round/visit notes before transitioning to next patient..."
              className="w-full text-xs p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Next Patient Cohort List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-brand-600" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Select Next Patient in Inpatient / OPD Cohort
                </h4>
              </div>
              <span className="text-[11px] text-slate-400">Click a patient to switch immediately</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {patients.map((p) => {
                const isCurrent = p.id === selectedPatient.id;
                const loc = PATIENT_LOCATIONS[p.id] || {
                  ward: 'General Ward',
                  bed: 'Bed 01',
                  status: 'Admitted',
                  statusColor: 'bg-slate-100 text-slate-700',
                };

                return (
                  <div
                    key={p.id}
                    onClick={() => !isCurrent && handleSwitchPatient(p)}
                    className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between space-y-3 ${
                      isCurrent
                        ? 'bg-brand-50/50 dark:bg-brand-950/20 border-brand-300 dark:border-brand-800 opacity-70 cursor-default'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:shadow-md cursor-pointer group'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono text-slate-400 font-bold">{p.mrn}</span>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${loc.statusColor}`}
                        >
                          {loc.status}
                        </span>
                      </div>

                      <h5 className="font-black text-sm text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                        {p.name}
                      </h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {p.primaryCondition}
                      </p>

                      <div className="flex items-center space-x-3 mt-2 text-[11px] text-slate-400">
                        <span>
                          {p.age}y • {p.gender}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-slate-600 dark:text-slate-300">
                          {loc.ward} ({loc.bed})
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                      {isCurrent ? (
                        <span className="text-[11px] font-bold text-brand-600 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Currently Active</span>
                        </span>
                      ) : (
                        <span className="font-bold text-brand-600 dark:text-brand-400 group-hover:underline flex items-center space-x-1">
                          <span>{concludingPatient ? 'Switching...' : 'Switch to Patient'}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}

                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {p.completenessScore}% Complete
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 flex items-center justify-between text-xs text-slate-400">
          <span>All patient transitions automatically logged in the audit trail.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientSwitcherModal;
