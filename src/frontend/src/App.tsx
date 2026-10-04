import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './components/LoginPage';
import { LandingPage } from './components/LandingPage';
import { Workspace } from './pages/Workspace';

export const AppContent: React.FC = () => {
  const { isAuthenticated, setIsAuthenticated, setIsScannerOpen } = useApp();
  // Primary flow: LANDING PAGE -> LOGIN -> ROLE-BASED WORKSPACE (DOCTOR DASHBOARD)
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'workspace'>('landing');

  // If user navigates to Landing Page
  if (currentView === 'landing') {
    return (
      <LandingPage
        onLogin={() => {
          if (isAuthenticated) {
            setCurrentView('workspace');
          } else {
            setCurrentView('login');
          }
        }}
        onExplore={() => {
          if (isAuthenticated) {
            setCurrentView('workspace');
          } else {
            setCurrentView('login');
          }
        }}
        onScanAndSummarize={() => {
          if (isAuthenticated) {
            setCurrentView('workspace');
            setIsScannerOpen(true);
          } else {
            setCurrentView('login');
          }
        }}
      />
    );
  }

  // If user is at Login Page
  if (currentView === 'login' || !isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={() => {
          setIsAuthenticated(true);
          localStorage.setItem('medsynapse_auth', 'true');
          setCurrentView('workspace');
        }}
        onExplorePublic={() => setCurrentView('landing')}
      />
    );
  }

  // If authenticated and in Workspace: Doctor Clinical Command Center
  return (
    <Workspace
      onReturnToLanding={() => setCurrentView('landing')}
    />
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
