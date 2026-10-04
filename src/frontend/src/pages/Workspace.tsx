import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { SynapseView } from '../components/SynapseView';
import { DashboardView } from '../components/DashboardView';
import { WhatChangedView } from '../components/WhatChangedView';
import { MedicationEvolutionView } from '../components/MedicationEvolutionView';
import { InvestigationTrackerView } from '../components/InvestigationTrackerView';
import { GapRadarView } from '../components/GapRadarView';
import { ConflictDetectorView } from '../components/ConflictDetectorView';
import { JourneyGraphView } from '../components/JourneyGraphView';
import { CarePathwayView } from '../components/CarePathwayView';
import { TimeMachineView } from '../components/TimeMachineView';
import { ReviewQueueView } from '../components/ReviewQueueView';
import { WardRoundView } from '../components/WardRoundView';
import { HandoffGeneratorView } from '../components/HandoffGeneratorView';
import { ReferralGeneratorView } from '../components/ReferralGeneratorView';
import { EmergencySnapshotView } from '../components/EmergencySnapshotView';
import { DocumentInboxView } from '../components/DocumentInboxView';
import { SandboxFhirView } from '../components/SandboxFhirView';
import { IbmIntegrationView } from '../components/IbmIntegrationView';
import { AuditTrailView } from '../components/AuditTrailView';

// Modals
import { ReconstructJourneyModal } from '../components/ReconstructJourneyModal';
import { CommandPalette } from '../components/CommandPalette';
import { WhyIsThisHereModal } from '../components/WhyIsThisHereModal';
import { SecondLookModal } from '../components/SecondLookModal';
import { CopilotDrawer } from '../components/CopilotDrawer';
import { DocumentScannerModal } from '../components/DocumentScannerModal';
import { EditPatientRecordModal } from '../components/EditPatientRecordModal';
import { PatientSwitcherModal } from '../components/PatientSwitcherModal';

export const Workspace: React.FC<{ onReturnToLanding: () => void }> = ({ onReturnToLanding }) => {
  const {
    activeTab,
    isEditPatientModalOpen,
    setIsEditPatientModalOpen,
    isSwitchPatientModalOpen,
    setIsSwitchPatientModalOpen,
  } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
      case 'patients':
        return <DashboardView />;
      case 'synapse':
        return <SynapseView />;
      case 'what-changed':
        return <WhatChangedView />;
      case 'medication':
        return <MedicationEvolutionView />;
      case 'investigations':
        return <InvestigationTrackerView />;
      case 'gaps':
        return <GapRadarView />;
      case 'conflicts':
        return <ConflictDetectorView />;
      case 'graph':
        return <JourneyGraphView />;
      case 'pathway':
        return <CarePathwayView />;
      case 'timemachine':
        return <TimeMachineView />;
      case 'reviews':
        return <ReviewQueueView />;
      case 'ward-round':
        return <WardRoundView />;
      case 'handoff':
        return <HandoffGeneratorView />;
      case 'referral':
        return <ReferralGeneratorView />;
      case 'emergency':
        return <EmergencySnapshotView />;
      case 'documents':
        return <DocumentInboxView />;
      case 'sandbox':
        return <SandboxFhirView />;
      case 'ibm':
        return <IbmIntegrationView />;
      case 'audit':
        return <AuditTrailView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col select-none transition-colors">
      <Navbar
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        onReturnToLanding={onReturnToLanding}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <ReconstructJourneyModal />
      <CommandPalette />
      <WhyIsThisHereModal />
      <SecondLookModal />
      <CopilotDrawer />
      <DocumentScannerModal />
      <EditPatientRecordModal
        isOpen={isEditPatientModalOpen}
        onClose={() => setIsEditPatientModalOpen(false)}
      />
      <PatientSwitcherModal
        isOpen={isSwitchPatientModalOpen}
        onClose={() => setIsSwitchPatientModalOpen(false)}
      />
    </div>
  );
};
export default Workspace;
