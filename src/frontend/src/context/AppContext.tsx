import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Patient,
  Role,
  Theme,
  ClinicalEvent,
  ClinicalDocument,
  DocumentationConflict,
  DocumentationGap,
  ReviewQueueItem,
  AuditLogEntry,
} from '../types';
import {
  SYNTHETIC_PATIENTS,
  PATIENT_A_DETAILS,
  MOCK_REVIEW_QUEUE,
  MOCK_AUDIT_LOG,
} from '../data/mockPatients';

interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  currentUserRole: Role;
  setCurrentUserRole: (role: Role) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  patients: Patient[];
  selectedPatient: Patient;
  setSelectedPatient: (patient: Patient) => void;
  selectedEvent: ClinicalEvent | null;
  setSelectedEvent: (event: ClinicalEvent | null) => void;
  selectedDocument: ClinicalDocument | null;
  setSelectedDocument: (doc: ClinicalDocument | null) => void;
  activeEvidenceSnippet: {
    title: string;
    text: string;
    page: number;
    docTitle: string;
    state: string;
  } | null;
  setActiveEvidenceSnippet: (snippet: any) => void;
  isReconstructing: boolean;
  reconstructionStage: number; // 0 to 7
  startJourneyReconstruction: (patientId?: string) => void;
  closeReconstructionModal: () => void;
  isReconstructModalOpen: boolean;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isWhyModalOpen: boolean;
  setIsWhyModalOpen: (open: boolean) => void;
  whyModalData: { title: string; explanation: string; claim: string; source: string } | null;
  openWhyModal: (data: { title: string; explanation: string; claim: string; source: string }) => void;
  isSecondLookOpen: boolean;
  setIsSecondLookOpen: (open: boolean) => void;
  reviewQueue: ReviewQueueItem[];
  setReviewQueue: React.Dispatch<React.SetStateAction<ReviewQueueItem[]>>;
  auditLogs: AuditLogEntry[];
  addAuditLog: (action: string, details: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;
  isScannerOpen: boolean;
  setIsScannerOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  logout: () => void;
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  isEditPatientModalOpen: boolean;
  setIsEditPatientModalOpen: (open: boolean) => void;
  isSwitchPatientModalOpen: boolean;
  setIsSwitchPatientModalOpen: (open: boolean) => void;
  resolveConflict: (conflictId: string, resolution: string) => void;
  resolveGap: (gapId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state with local storage persistence and system preference
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('medsynapse_theme') as Theme;
    return saved || 'system';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('medsynapse_theme', newTheme);
  };

  useEffect(() => {
    const root = document.documentElement;
    const applyDark = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (theme === 'dark') {
      applyDark(true);
    } else if (theme === 'light') {
      applyDark(false);
    } else {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyDark(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => applyDark(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  // Demo user role
  const [currentUserRole, setCurrentUserRole] = useState<Role>('Doctor');

  // Navigation tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Patients
  const [patients, setPatients] = useState<Patient[]>(SYNTHETIC_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<Patient>(SYNTHETIC_PATIENTS[0]);

  // Selected event and synchronized document/evidence
  const [selectedEvent, setSelectedEvent] = useState<ClinicalEvent | null>(PATIENT_A_DETAILS.timelineEvents[0]);
  const [selectedDocument, setSelectedDocument] = useState<ClinicalDocument | null>(PATIENT_A_DETAILS.documents[0]);
  const [activeEvidenceSnippet, setActiveEvidenceSnippet] = useState<{
    title: string;
    text: string;
    page: number;
    docTitle: string;
    state: string;
  } | null>({
    title: PATIENT_A_DETAILS.timelineEvents[0].title,
    text: PATIENT_A_DETAILS.timelineEvents[0].exactSourceText,
    page: PATIENT_A_DETAILS.timelineEvents[0].pageNumber,
    docTitle: PATIENT_A_DETAILS.timelineEvents[0].documentTitle,
    state: PATIENT_A_DETAILS.timelineEvents[0].evidenceState,
  });

  // Reconstruct Journey Modal & Flow
  const [isReconstructModalOpen, setIsReconstructModalOpen] = useState(false);
  const [isReconstructing, setIsReconstructing] = useState(false);
  const [reconstructionStage, setReconstructionStage] = useState(0);

  const startJourneyReconstruction = (patientId?: string) => {
    if (patientId) {
      const target = patients.find((p) => p.id === patientId);
      if (target) setSelectedPatient(target);
    }
    setIsReconstructModalOpen(true);
    setIsReconstructing(true);
    setReconstructionStage(0);

    const stages = [
      'Ingesting source clinical documents...',
      'Running multimodal layout & entity extraction...',
      'Resolving temporal sequence & event dependencies...',
      'Mapping evidence links & cross-references...',
      'Constructing longitudinal patient journey graph...',
      'Detecting documentation gaps & missing records...',
      'Evaluating cross-record conflicts & discrepancies...',
      'Patient Journey Reconstructed Successfully!',
    ];

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setReconstructionStage(current);
      if (current >= stages.length - 1) {
        clearInterval(interval);
        setIsReconstructing(false);
        addAuditLog(
          'PATIENT_JOURNEY_RECONSTRUCTED',
          `Full clinical journey reconstruction executed for ${selectedPatient.name}`
        );
      }
    }, 450);
  };

  const closeReconstructionModal = () => {
    setIsReconstructModalOpen(false);
    setIsReconstructing(false);
    setReconstructionStage(0);
    setActiveTab('synapse'); // Navigate directly to Synapse View!
  };

  // Command Palette
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Keyboard shortcut for Command Palette (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Why is this here modal
  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);
  const [whyModalData, setWhyModalData] = useState<{
    title: string;
    explanation: string;
    claim: string;
    source: string;
  } | null>(null);

  const openWhyModal = (data: { title: string; explanation: string; claim: string; source: string }) => {
    setWhyModalData(data);
    setIsWhyModalOpen(true);
  };

  // Second Look modal
  const [isSecondLookOpen, setIsSecondLookOpen] = useState(false);

  // Review Queue
  const [reviewQueue, setReviewQueue] = useState<ReviewQueueItem[]>(MOCK_REVIEW_QUEUE);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOG);

  const addAuditLog = (action: string, details: string) => {
    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
      2,
      '0'
    )}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newEntry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: formatted,
      userName: currentUserRole === 'Doctor' ? 'Dr. Ananya Roy' : currentUserRole,
      userRole: currentUserRole,
      action,
      patientId: selectedPatient.id,
      details,
      ipAddress: '192.168.1.104',
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // Multilingual state
  const [language, setLanguage] = useState<string>('en');

  // Copilot drawer state
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // Document Scanner & Summarizer modal state
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Authentication State (defaults to false so login page appears first!)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('medsynapse_auth') === 'true';
  });

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('medsynapse_auth');
    addAuditLog('USER_LOGOUT', 'User logged out of MedSynapse Clinical OS');
  };

  // Doctor Patient Management Modals
  const [isEditPatientModalOpen, setIsEditPatientModalOpen] = useState(false);
  const [isSwitchPatientModalOpen, setIsSwitchPatientModalOpen] = useState(false);

  // Resolve Conflict action
  const resolveConflict = (conflictId: string, resolution: string) => {
    addAuditLog('DOCUMENT_CONFLICT_REVIEWED', `Conflict ${conflictId} resolved: ${resolution}`);
    // decrement active conflict count
    setPatients((prev) =>
      prev.map((p) =>
        p.id === selectedPatient.id
          ? { ...p, activeConflictsCount: Math.max(0, p.activeConflictsCount - 1) }
          : p
      )
    );
    setSelectedPatient((prev) => ({
      ...prev,
      activeConflictsCount: Math.max(0, prev.activeConflictsCount - 1),
    }));
  };

  // Resolve Gap action
  const resolveGap = (gapId: string) => {
    addAuditLog('DOCUMENTATION_GAP_ADDRESSED', `Gap ${gapId} marked resolved by clinician`);
    setPatients((prev) =>
      prev.map((p) =>
        p.id === selectedPatient.id
          ? { ...p, pendingGapsCount: Math.max(0, p.pendingGapsCount - 1) }
          : p
      )
    );
    setSelectedPatient((prev) => ({
      ...prev,
      pendingGapsCount: Math.max(0, prev.pendingGapsCount - 1),
    }));
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        currentUserRole,
        setCurrentUserRole,
        activeTab,
        setActiveTab,
        patients,
        selectedPatient,
        setSelectedPatient,
        selectedEvent,
        setSelectedEvent,
        selectedDocument,
        setSelectedDocument,
        activeEvidenceSnippet,
        setActiveEvidenceSnippet,
        isReconstructing,
        reconstructionStage,
        startJourneyReconstruction,
        closeReconstructionModal,
        isReconstructModalOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isWhyModalOpen,
        setIsWhyModalOpen,
        whyModalData,
        openWhyModal,
        isSecondLookOpen,
        setIsSecondLookOpen,
        reviewQueue,
        setReviewQueue,
        auditLogs,
        addAuditLog,
        language,
        setLanguage,
        isCopilotOpen,
        setIsCopilotOpen,
        isScannerOpen,
        setIsScannerOpen,
        isAuthenticated,
        setIsAuthenticated,
        logout,
        setPatients,
        isEditPatientModalOpen,
        setIsEditPatientModalOpen,
        isSwitchPatientModalOpen,
        setIsSwitchPatientModalOpen,
        resolveConflict,
        resolveGap,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
