import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Users,
  Sparkles,
  GitBranch,
  Activity,
  AlertOctagon,
  Radar,
  FileCheck2,
  Send,
  Sun,
  Moon,
  Laptop,
  UploadCloud,
  CheckSquare,
  Microscope,
  Workflow,
  X,
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    patients,
    setSelectedPatient,
    setActiveTab,
    startJourneyReconstruction,
    setTheme,
    setIsSecondLookOpen,
    setIsScannerOpen,
  } = useApp();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const actions = [
    {
      group: 'Patient Cohort',
      items: patients.map((p) => ({
        id: `pat-${p.id}`,
        title: `Open Patient: ${p.name}`,
        subtitle: `${p.mrn} • ${p.archetype}`,
        icon: Users,
        action: () => {
          setSelectedPatient(p);
          setActiveTab('synapse');
          setIsCommandPaletteOpen(false);
        },
      })),
    },
    {
      group: 'Clinical Journey & Actions',
      items: [
        {
          id: 'action-scan',
          title: 'Scan & Summarize Clinical Document',
          subtitle: 'Multimodal OCR, entity extraction, medication reconciliation & gap radar',
          icon: FileCheck2,
          action: () => {
            setIsCommandPaletteOpen(false);
            setIsScannerOpen(true);
          },
        },
        {
          id: 'action-reconstruct',
          title: 'Reconstruct Patient Journey',
          subtitle: 'Execute full multimodal longitudinal synthesis with evidence mapping',
          icon: Sparkles,
          action: () => {
            setIsCommandPaletteOpen(false);
            startJourneyReconstruction();
          },
        },
        {
          id: 'action-synapse',
          title: 'Open Synapse View Workspace',
          subtitle: 'Synchronized Timeline, Clinical Intelligence, and Evidence panels',
          icon: GitBranch,
          action: () => {
            setActiveTab('synapse');
            setIsCommandPaletteOpen(false);
          },
        },
        {
          id: 'action-what-changed',
          title: 'Open Change Lens (What Changed?)',
          subtitle: 'Compare admissions, medication shifts, and diagnostic trajectories',
          icon: Activity,
          action: () => {
            setActiveTab('what-changed');
            setIsCommandPaletteOpen(false);
          },
        },
        {
          id: 'action-conflicts',
          title: 'Review Documentation Conflicts',
          subtitle: 'Inspect contradictions and discrepancies across records',
          icon: AlertOctagon,
          action: () => {
            setActiveTab('conflicts');
            setIsCommandPaletteOpen(false);
          },
        },
        {
          id: 'action-gaps',
          title: 'Clinical Gap Radar',
          subtitle: 'Inspect referenced missing reports and unresolved follow-ups',
          icon: Radar,
          action: () => {
            setActiveTab('gaps');
            setIsCommandPaletteOpen(false);
          },
        },
        {
          id: 'action-second-look',
          title: 'Execute Second Look Evidence Audit',
          subtitle: 'Pre-export clinical audit verifying source backing for all claims',
          icon: FileCheck2,
          action: () => {
            setIsCommandPaletteOpen(false);
            setIsSecondLookOpen(true);
          },
        },
        {
          id: 'action-referral',
          title: 'Generate Smart Referral Letter',
          subtitle: 'Draft evidence-grounded referral for specialty handoff',
          icon: Send,
          action: () => {
            setActiveTab('referral');
            setIsCommandPaletteOpen(false);
          },
        },
        {
          id: 'action-upload',
          title: 'Upload New Clinical Document',
          subtitle: 'Ingest PDF, scanned records, prescriptions, or discharge summaries',
          icon: UploadCloud,
          action: () => {
            setActiveTab('documents');
            setIsCommandPaletteOpen(false);
          },
        },
      ],
    },
    {
      group: 'Appearance & System',
      items: [
        {
          id: 'theme-light',
          title: 'Switch to Light Theme',
          subtitle: 'Clean clinical light mode with high readability',
          icon: Sun,
          action: () => {
            setTheme('light');
            setIsCommandPaletteOpen(false);
          },
        },
        {
          id: 'theme-dark',
          title: 'Switch to Dark Theme',
          subtitle: 'Focused dark mode with restrained high-contrast tokens',
          icon: Moon,
          action: () => {
            setTheme('dark');
            setIsCommandPaletteOpen(false);
          },
        },
        {
          id: 'theme-system',
          title: 'Follow System Appearance',
          subtitle: 'Match operating system color scheme preference',
          icon: Laptop,
          action: () => {
            setTheme('system');
            setIsCommandPaletteOpen(false);
          },
        },
      ],
    },
  ];

  // Filter items based on query
  const filteredGroups = actions
    .map((g) => ({
      ...g,
      items: g.items.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase())
      ),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-surface border border-border rounded-xl shadow-popover overflow-hidden flex flex-col max-h-[70vh]">
        {/* Search Input */}
        <div className="p-3 border-b border-border flex items-center space-x-3 bg-surface-secondary">
          <Search className="w-4 h-4 text-text-muted shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search patient (e.g. 'Rajesh', 'Conflict', 'Referral')..."
            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 rounded hover:bg-surface text-text-muted"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-3">
          {filteredGroups.length === 0 ? (
            <div className="p-8 text-center text-xs text-text-muted">
              No matching clinical actions or patients found.
            </div>
          ) : (
            filteredGroups.map((g) => (
              <div key={g.group} className="space-y-1">
                <div className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-text-muted">
                  {g.group}
                </div>
                {g.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      className="w-full text-left p-2.5 rounded-lg hover:bg-surface-hover flex items-start space-x-3 transition-colors group"
                    >
                      <div className="p-1.5 rounded-md bg-surface-secondary group-hover:bg-primary/10 group-hover:text-primary transition-colors text-text-muted">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-text-primary group-hover:text-primary transition-colors">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-text-muted truncate mt-0.5">
                          {item.subtitle}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-3 py-2 border-t border-border bg-surface-secondary text-[11px] text-text-muted flex items-center justify-between">
          <span>Navigate with arrows or click</span>
          <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-mono">
            ESC to close
          </kbd>
        </div>
      </div>
    </div>
  );
};
export default CommandPalette;
