import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  GitBranch,
  Users,
  FileText,
  Activity,
  Pill,
  Microscope,
  Radar,
  AlertOctagon,
  Share2,
  Workflow,
  History,
  CheckSquare,
  Stethoscope,
  Send,
  FileCheck2,
  Flame,
  ChevronRight,
  CheckCircle2,
  FileEdit,
  ArrowRightLeft,
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const {
    activeTab,
    setActiveTab,
    selectedPatient,
    reviewQueue,
    currentUserRole,
    setIsScannerOpen,
    setIsEditPatientModalOpen,
    setIsSwitchPatientModalOpen,
  } = useApp();

  // Role Profile Details
  const roleCardInfo = {
    'Doctor': {
      name: 'Dr. Ananya Roy',
      role: 'Attending Cardiologist',
      dept: 'Metro Heart Institute',
      initials: 'AR',
      bgColor: 'bg-brand-800',
    },
    'Senior Doctor / Reviewer': {
      name: 'Dr. Vikram Sharma',
      role: 'Chief Medical Reviewer',
      dept: 'Internal Medicine Review',
      initials: 'VS',
      bgColor: 'bg-purple-800',
    },
    'Department Admin': {
      name: 'Dr. Priya Mehta',
      role: 'Department Administrator',
      dept: 'Operations & Access',
      initials: 'PM',
      bgColor: 'bg-sky-800',
    },
    'Records Manager': {
      name: 'Ramesh Patel',
      role: 'Medical Records Custodian',
      dept: 'Health Info Mgmt (HIM)',
      initials: 'RP',
      bgColor: 'bg-emerald-800',
    },
    'System Administrator': {
      name: 'Platform Administrator',
      role: 'Platform Administrator',
      dept: 'Infrastructure & SecOps',
      initials: 'SA',
      bgColor: 'bg-slate-800',
    },
  };
  const currentCard = roleCardInfo[currentUserRole] || roleCardInfo['Doctor'];

  // RBAC Navigation Groups (Interoperability & Governance removed per request)
  const getNavGroupsForRole = () => {
    if (currentUserRole === 'Senior Doctor / Reviewer') {
      return [
        {
          group: 'Review & Oversight',
          items: [
            {
              id: 'reviews',
              label: 'Review Queue',
              icon: CheckSquare,
              badge: `${reviewQueue.filter((r) => r.status === 'Pending').length}`,
              badgeColor: 'bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300',
            },
            { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
            { id: 'synapse', label: 'Synapse View', icon: GitBranch },
            { id: 'patients', label: 'Patient Cohort', icon: Users },
          ],
        },
        {
          group: 'Clinical Intelligence',
          items: [
            {
              id: 'graph',
              label: 'Journey Graph',
              icon: Share2,
              badge: 'Interactive',
              badgeColor: 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300',
            },
            { id: 'what-changed', label: 'Change Lens', icon: Activity },
            {
              id: 'gaps',
              label: 'Gap Radar',
              icon: Radar,
              badge: `${selectedPatient.pendingGapsCount}`,
              badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
            },
            {
              id: 'conflicts',
              label: 'Conflict Detector',
              icon: AlertOctagon,
              badge: `${selectedPatient.activeConflictsCount}`,
              badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
            },
          ],
        },
        {
          group: 'Clinical Workflows',
          items: [
            { id: 'handoff', label: 'Synapse Handoff', icon: FileCheck2 },
            { id: 'emergency', label: 'Emergency Snapshot', icon: Flame },
          ],
        },
      ];
    } else if (currentUserRole === 'Department Admin') {
      return [
        {
          group: 'Department Administration',
          items: [
            { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
            { id: 'patients', label: 'Patient Cohort', icon: Users },
            { id: 'documents', label: 'Document Ingestion', icon: FileText },
            { id: 'reviews', label: 'Review Oversight', icon: CheckSquare },
          ],
        },
        {
          group: 'Surveillance & Quality',
          items: [
            { id: 'graph', label: 'Journey Graph', icon: Share2 },
            {
              id: 'gaps',
              label: 'Gap Radar',
              icon: Radar,
              badge: `${selectedPatient.pendingGapsCount}`,
              badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
            },
            {
              id: 'conflicts',
              label: 'Conflict Detector',
              icon: AlertOctagon,
              badge: `${selectedPatient.activeConflictsCount}`,
              badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
            },
          ],
        },
      ];
    } else if (currentUserRole === 'Records Manager') {
      return [
        {
          group: 'Records & Ingestion',
          items: [
            {
              id: 'scan-modal',
              label: 'Scan & Summarize',
              icon: FileCheck2,
              badge: 'AI OCR',
              badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
              isAction: true,
            },
            { id: 'documents', label: 'Document Inbox', icon: FileText },
            { id: 'patients', label: 'Patient Cohort', icon: Users },
            { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
          ],
        },
      ];
    } else if (currentUserRole === 'System Administrator') {
      return [
        {
          group: 'Platform Administration',
          items: [
            { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
            { id: 'patients', label: 'Patient Cohort', icon: Users },
            { id: 'documents', label: 'Document Ingestion', icon: FileText },
            { id: 'reviews', label: 'Review Oversight', icon: CheckSquare },
          ],
        },
        {
          group: 'Surveillance & Quality',
          items: [
            { id: 'graph', label: 'Journey Graph', icon: Share2 },
            {
              id: 'conflicts',
              label: 'Conflict Detector',
              icon: AlertOctagon,
              badge: `${selectedPatient.activeConflictsCount}`,
              badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
            },
          ],
        },
      ];
    }

    // Default: 'Doctor'
    return [
      {
        group: 'Clinical Core',
        items: [
          { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
          {
            id: 'synapse',
            label: 'Synapse View',
            icon: GitBranch,
            badge: 'Signature',
            badgeColor: 'bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300',
          },
          {
            id: 'scan-modal',
            label: 'Scan & Summarize',
            icon: FileCheck2,
            badge: 'AI OCR',
            badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
            isAction: true,
          },
          { id: 'patients', label: 'Patient Cohort', icon: Users },
          { id: 'documents', label: 'Document Inbox', icon: FileText },
        ],
      },
      {
        group: 'Clinical Intelligence',
        items: [
          {
            id: 'graph',
            label: 'Journey Graph',
            icon: Share2,
            badge: 'Interactive',
            badgeColor: 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300',
          },
          { id: 'what-changed', label: 'Change Lens', icon: Activity },
          { id: 'medication', label: 'Medication Evolution', icon: Pill },
          { id: 'investigations', label: 'Investigation Tracker', icon: Microscope },
          {
            id: 'gaps',
            label: 'Gap Radar',
            icon: Radar,
            badge: `${selectedPatient.pendingGapsCount}`,
            badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
          },
          {
            id: 'conflicts',
            label: 'Conflict Detector',
            icon: AlertOctagon,
            badge: `${selectedPatient.activeConflictsCount}`,
            badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
          },
          { id: 'pathway', label: 'Care Pathway Trace', icon: Workflow },
          { id: 'timemachine', label: 'Time Machine', icon: History },
        ],
      },
      {
        group: 'Clinical Workflows',
        items: [
          {
            id: 'reviews',
            label: 'Review Queue',
            icon: CheckSquare,
            badge: `${reviewQueue.filter((r) => r.status === 'Pending').length}`,
            badgeColor: 'bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300',
          },
          { id: 'ward-round', label: 'Ward Round Mode', icon: Stethoscope },
          { id: 'handoff', label: 'Synapse Handoff', icon: FileCheck2 },
          { id: 'referral', label: 'Smart Referral', icon: Send },
          { id: 'emergency', label: 'Emergency Snapshot', icon: Flame },
        ],
      },
    ];
  };

  const navGroups = getNavGroupsForRole();

  return (
    <aside
      className={`h-[calc(100vh-4rem)] sticky top-16 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between overflow-y-auto transition-all duration-300 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="py-3 px-2.5 space-y-4">
        {/* Dynamic RBAC Profile Card */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full ${currentCard.bgColor} text-white flex items-center justify-center font-black text-xs shadow-sm border-2 border-brand-400 shrink-0`}>
            {currentCard.initials}
          </div>
          {!collapsed && (
            <div className="overflow-hidden leading-tight flex-1">
              <div className="flex items-center space-x-1">
                <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">{currentCard.name}</h4>
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
              </div>
              <p className="text-[11px] font-bold text-brand-600 dark:text-brand-400 truncate">{currentCard.role}</p>
              <p className="text-[10px] text-slate-400 truncate">{currentCard.dept}</p>
            </div>
          )}
        </div>

        {/* Active Patient Summary Widget (Visible to Clinical Roles) */}
        {!collapsed && currentUserRole !== 'Records Manager' && (
          <div className="px-3 py-3 rounded-2xl bg-gradient-to-br from-brand-50/60 to-sky-50/30 dark:from-slate-800/60 dark:to-slate-800/30 border border-brand-100 dark:border-slate-700">
            <div className="text-[10px] uppercase font-black tracking-wider text-brand-700 dark:text-brand-300 mb-1 flex items-center justify-between">
              <span>Active Case</span>
              <span className="font-mono text-[9px] bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded-md border border-brand-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                {selectedPatient.mrn}
              </span>
            </div>
            <div className="font-black text-slate-900 dark:text-white text-sm truncate">{selectedPatient.name}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5">{selectedPatient.primaryCondition}</div>

            {/* Progress bar */}
            <div className="mt-2.5 pt-2 border-t border-brand-100 dark:border-slate-700">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-500 font-medium">Record Completeness</span>
                <span className="font-black text-brand-600 dark:text-brand-400 font-mono">{selectedPatient.completenessScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-600 dark:bg-brand-400 rounded-full transition-all duration-500"
                  style={{ width: `${selectedPatient.completenessScore}%` }}
                />
              </div>

              {/* Quick Case Actions */}
              <div className="grid grid-cols-2 gap-1.5 mt-2.5">
                <button
                  onClick={() => setIsEditPatientModalOpen(true)}
                  className="flex items-center justify-center space-x-1 py-1 px-2 rounded-lg bg-white dark:bg-slate-700/80 hover:bg-brand-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-[11px] font-bold text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
                  title="Edit diagnoses, condition, archetype or attending notes"
                >
                  <FileEdit className="w-3 h-3 text-brand-600 dark:text-brand-400" />
                  <span>Edit Case</span>
                </button>
                <button
                  onClick={() => setIsSwitchPatientModalOpen(true)}
                  className="flex items-center justify-center space-x-1 py-1 px-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 transition-colors shadow-xs"
                  title="Conclude visit and switch patient"
                >
                  <ArrowRightLeft className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Next Case</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Groups filtered by RBAC */}
        {navGroups.map((g) => (
          <div key={g.group} className="space-y-1">
            {!collapsed && (
              <div className="px-3 text-[10px] uppercase font-black tracking-wider text-slate-400">
                {g.group}
              </div>
            )}
            <div className="space-y-0.5">
              {g.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if ((item as any).isAction) {
                        setIsScannerOpen(true);
                      } else {
                        setActiveTab(item.id);
                      }
                    }}
                    className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {!collapsed && (
                      <div className="flex-1 flex items-center justify-between overflow-hidden">
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : item.badgeColor || 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Role Badge */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-center">
        {!collapsed ? (
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Role: <strong className="text-brand-600">{currentUserRole}</strong></span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active Session" />
          </div>
        ) : (
          <span className="w-2 h-2 rounded-full bg-emerald-500 mx-auto block" title="Active Session" />
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
