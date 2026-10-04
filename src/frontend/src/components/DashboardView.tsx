import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  FileText,
  AlertTriangle,
  Pill,
  Microscope,
  AlertOctagon,
  Radar,
  CheckSquare,
  Sparkles,
  ArrowRight,
  Clock,
  Calendar,
  ShieldCheck,
  Stethoscope,
  TrendingUp,
  FileCheck2,
  Flame,
  Activity,
  Layers,
  ChevronRight,
  Search,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    patients,
    setSelectedPatient,
    setActiveTab,
    startJourneyReconstruction,
    reviewQueue,
    currentUserRole,
    setIsScannerOpen,
  } = useApp();

  const [activeDepartment, setActiveDepartment] = useState<'cardio' | 'nephro' | 'surgery' | 'icu'>('cardio');

  const morningBriefItems = [
    {
      patientName: 'Rajesh Kumar',
      patientId: 'pat-001',
      mrn: 'SYN-MRN-9021',
      type: 'Investigation Gap',
      text: 'Discharge Summary 3 references an Echocardiogram conducted on Sep 16 (LVEF 32%), but the formal diagnostic report is missing from the repository.',
      tag: 'MISSING RECORD',
      tagColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200',
      action: 'Retrieve Echo',
    },
    {
      patientName: 'Amit Patel',
      patientId: 'pat-003',
      mrn: 'SYN-MRN-9023',
      type: 'Medication Conflict',
      text: 'Critical dosage mismatch: Discharge summary records Atorvastatin 40mg daily, while OPD consultation prescribed Atorvastatin 20mg daily.',
      tag: 'CONFLICT DETECTED',
      tagColor: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300 border-rose-200',
      action: 'Resolve Dosage',
    },
    {
      patientName: 'Sarah Jenkins',
      patientId: 'pat-002',
      mrn: 'SYN-MRN-9022',
      type: 'Therapy Evolution',
      text: 'Prednisolone successfully tapered and discontinued; Dupilumab 300mg Q2W initiated; Eosinophil count normalized to 120/μL.',
      tag: 'THERAPY EVOLUTION',
      tagColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-200',
      action: 'Review Step-Up',
    },
    {
      patientName: 'Maria Rodriguez',
      patientId: 'pat-004',
      mrn: 'SYN-MRN-9024',
      type: 'Pending Imaging',
      text: 'Post-laparoscopic cholecystectomy histopathology report pending upload from central surgical pathology repository.',
      tag: 'PENDING ACTION',
      tagColor: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300 border-sky-200',
      action: 'Request Biopsy',
    },
  ];

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
      {/* AIC PORTAL COMMAND CENTER HERO BANNER */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 transition-colors">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-black rounded-full border border-brand-200 uppercase tracking-wide flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-brand-600" />
                Clinical Command &amp; Oversight Hub
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                Omni-Encounter Governance Active
              </span>
              <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full border border-purple-200">
                IBM watsonx.ai Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Longitudinal Clinical Intelligence Workspace
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Transform fragmented medical records into unified, traceable patient journeys. Surface medication changes, objective lab trends, and documentation gaps with complete evidence verification.
            </p>
          </div>

          {/* QUICK COMMAND ACTION BAR (AIC Style) */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              onClick={() => startJourneyReconstruction('pat-001')}
              className="px-4 py-2.5 bg-gradient-to-r from-brand-700 via-brand-600 to-sky-600 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Reconstruct Patient Journey</span>
            </button>

            <button
              onClick={() => setIsScannerOpen(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Scan &amp; Summarize Record</span>
            </button>

            <button
              onClick={() => setActiveTab('emergency')}
              className="px-3.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              title="Open Emergency Care Snapshot"
            >
              <Flame className="w-4 h-4" />
              <span className="hidden sm:inline">Emergency Snapshot</span>
            </button>
          </div>
        </div>

        {/* AIC-STYLE METRIC STAT CARDS (8 Key Indicators) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-2">
          {[
            { label: 'Active Cohort', val: '6 Patients', icon: Users, color: 'text-brand-600', bg: 'bg-brand-50 dark:bg-brand-950/50' },
            { label: 'Sourced Docs', val: '24 Files', icon: FileText, color: 'text-slate-600', bg: 'bg-slate-100 dark:bg-slate-800' },
            { label: 'Med Shifts', val: '14 Titrations', icon: Pill, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/50' },
            { label: 'Tracked Labs', val: '18 Studies', icon: Microscope, color: 'text-sky-600', bg: 'bg-sky-50 dark:bg-sky-950/50' },
            { label: 'Active Conflicts', val: '4 Flagged', icon: AlertOctagon, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-950/50' },
            { label: 'Surfaced Gaps', val: '6 Alerts', icon: Radar, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/50' },
            { label: 'Review Queue', val: `${reviewQueue.length} Pending`, icon: CheckSquare, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/50' },
            { label: 'Integrity Score', val: '100% Grounded', icon: ShieldCheck, color: 'text-brand-600', bg: 'bg-brand-50 dark:bg-brand-950/50' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-7 h-7 rounded-lg ${item.bg} ${item.color} flex items-center justify-center`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 truncate">{item.label}</div>
                  <div className="text-xs font-black text-slate-900 dark:text-white truncate">{item.val}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DEPARTMENT / SERVICE LINE TABS (AIC Portal Style) */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center space-x-2">
          {[
            { id: 'cardio', label: 'Cardiology & CCU', count: 2 },
            { id: 'nephro', label: 'Nephrology & Renal', count: 1 },
            { id: 'surgery', label: 'General Surgery', count: 1 },
            { id: 'icu', label: 'Critical Care / ICU', count: 2 },
          ].map((dept) => (
            <button
              key={dept.id}
              onClick={() => setActiveDepartment(dept.id as any)}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeDepartment === dept.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              <span>{dept.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeDepartment === dept.id
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                }`}
              >
                {dept.count}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setActiveTab('graph')}
          className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-1"
        >
          <span>Open Full Journey Graph</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* MORNING CLINICAL BRIEF & VERIFICATION QUEUE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Morning Clinical Briefing Feed */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Morning Clinical Radar &amp; High-Priority Findings
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700">
              Live Feed
            </span>
          </div>

          <div className="space-y-3">
            {morningBriefItems.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 hover:border-brand-400 transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-xs text-slate-900 dark:text-white">{item.patientName}</span>
                    <span className="text-[10px] font-mono text-slate-400">{item.mrn}</span>
                  </div>
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${item.tagColor}`}
                  >
                    {item.tag}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.text}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700/60 text-xs">
                  <span className="text-[11px] font-medium text-slate-400">{item.type}</span>
                  <button
                    onClick={() => {
                      const p = patients.find((pat) => pat.id === item.patientId);
                      if (p) setSelectedPatient(p);
                      setActiveTab('synapse');
                    }}
                    className="font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center space-x-1 text-[11px]"
                  >
                    <span>{item.action}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Patient Cohort Quick Selector */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Patient Cohort Registry
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400">{patients.length} Active Cases</span>
            </div>

            <div className="space-y-2 mt-3 max-h-[360px] overflow-y-auto pr-1">
              {patients.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedPatient(p);
                    setActiveTab('synapse');
                  }}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 hover:border-brand-500 hover:bg-brand-50/20 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="space-y-0.5 truncate mr-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-black text-xs text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                        {p.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{p.age}y/{p.gender[0]}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{p.primaryCondition}</div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {p.activeConflictsCount > 0 && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700">
                        {p.activeConflictsCount} Discrepancies
                      </span>
                    )}
                    <span className="text-[10px] font-mono font-black text-brand-600">
                      {p.completenessScore}%
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('patients')}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all text-center"
            >
              Manage Full Patient Cohort
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
