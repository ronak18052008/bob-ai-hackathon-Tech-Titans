import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MedSynapseLogo } from './MedSynapseLogo';
import {
  Sun,
  Moon,
  Laptop,
  Search,
  Sparkles,
  ShieldCheck,
  Globe,
  FileCheck2,
  PanelLeft,
  CheckCircle2,
  ChevronDown,
  LogOut,
} from 'lucide-react';
import { Role } from '../types';

interface NavbarProps {
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  onReturnToLanding?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  sidebarCollapsed = false,
  onToggleSidebar,
  onReturnToLanding,
}) => {
  const {
    theme,
    setTheme,
    currentUserRole,
    setIsCommandPaletteOpen,
    setIsSecondLookOpen,
    setIsCopilotOpen,
    language,
    setLanguage,
    setIsScannerOpen,
    logout,
  } = useApp();

  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  // Role profiles (Role cannot be changed manually by the user from profile)
  const roleProfiles: Record<Role, { name: string; shortName: string; title: string; initials: string; dept: string }> = {
    'Doctor': {
      name: 'Dr. Ananya Roy, MD, DM, FACC',
      shortName: 'Dr. Roy',
      title: 'Attending Cardiologist',
      initials: 'AR',
      dept: 'Metro Heart Institute • CCU Ward',
    },
    'Senior Doctor / Reviewer': {
      name: 'Dr. Vikram Sharma, MD',
      shortName: 'Dr. Sharma',
      title: 'Chief Medical Reviewer',
      initials: 'VS',
      dept: 'Internal Medicine Review',
    },
    'Department Admin': {
      name: 'Dr. Priya Mehta, MHA',
      shortName: 'Dr. Mehta',
      title: 'Department Administrator',
      initials: 'PM',
      dept: 'Hospital Operations & Access',
    },
    'Records Manager': {
      name: 'Ramesh Patel, HIM',
      shortName: 'R. Patel',
      title: 'Medical Records Custodian',
      initials: 'RP',
      dept: 'Health Information Management (HIM)',
    },
    'System Administrator': {
      name: 'Platform Administrator',
      shortName: 'SysAdmin',
      title: 'System Administrator',
      initials: 'SA',
      dept: 'Platform Infrastructure & SecOps',
    },
  };

  const currentProfile = roleProfiles[currentUserRole] || roleProfiles['Doctor'];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
    { code: 'bn', label: 'বাংলা (Bengali)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-2xs transition-colors select-none">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Left: Sidebar Toggle + Canonical Brand Logo */}
        <div className="flex items-center space-x-3 shrink-0">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-xl text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              <PanelLeft className="w-5 h-5" />
            </button>
          )}

          <MedSynapseLogo variant="compact" size="md" showSubtitle={true} />
        </div>

        {/* Center: Clean Search / Command Palette Bar + Primary Scan CTA */}
        <div className="flex items-center space-x-3 flex-1 max-w-xl mx-4 lg:mx-8">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-400 text-xs transition-colors group shadow-2xs"
            title="Search patients, records, commands (Ctrl+K)"
          >
            <div className="flex items-center space-x-2.5 truncate">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" />
              <span className="truncate">Search patients, records, commands...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-slate-500 shadow-2xs">
              Ctrl+K
            </kbd>
          </button>

          {/* Primary Scan & Summarize Action */}
          <button
            onClick={() => setIsScannerOpen(true)}
            className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-700 via-brand-600 to-sky-600 hover:from-brand-800 hover:to-sky-700 text-white font-extrabold text-xs shadow-sm hover:shadow transition-all shrink-0 active:scale-[0.98]"
            title="Scan, OCR, and summarize medical documents with evidence extraction"
          >
            <FileCheck2 className="w-4 h-4 text-cyan-200" />
            <span>Scan &amp; Summarize</span>
          </button>
        </div>

        {/* Right: Second Look Audit, Copilot, Lang, Theme, Doctor Profile */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Second Look Pre-Export Audit Button */}
          <button
            onClick={() => setIsSecondLookOpen(true)}
            className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:text-slate-400 dark:hover:text-emerald-400 dark:hover:bg-emerald-950/40 border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800 transition-all"
            title="Second Look — Pre-Handoff Evidence Integrity Audit"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

          {/* Synapse Copilot Drawer Button */}
          <button
            onClick={() => setIsCopilotOpen(true)}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/40 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold transition-all"
            title="Open Synapse Copilot AI Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="hidden xl:inline">Copilot</span>
          </button>

          {/* Multilingual Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowThemeMenu(false);
                setShowRoleMenu(false);
              }}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs transition-colors flex items-center space-x-1"
              title="Select Language"
            >
              <Globe className="w-4 h-4" />
              <span className="text-[11px] uppercase font-bold">{language}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-48 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50">
                <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 border-b border-slate-100 dark:border-slate-700 uppercase">
                  Language Preference
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 ${
                      language === l.code ? 'text-brand-600 font-bold bg-brand-50/50' : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span>{l.label}</span>
                    {language === l.code && <span className="text-brand-600 text-xs">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Adaptive Theme System */}
          <div className="relative">
            <button
              onClick={() => {
                setShowThemeMenu(!showThemeMenu);
                setShowRoleMenu(false);
                setShowLangMenu(false);
              }}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
              title={`Theme: ${theme}`}
            >
              {theme === 'light' ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : theme === 'dark' ? (
                <Moon className="w-4 h-4 text-brand-400" />
              ) : (
                <Laptop className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {showThemeMenu && (
              <div className="absolute right-0 mt-2 w-36 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50">
                <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 border-b border-slate-100 dark:border-slate-700 uppercase">
                  Appearance
                </div>
                <button
                  onClick={() => {
                    setTheme('light');
                    setShowThemeMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center space-x-2 hover:bg-slate-50 dark:hover:bg-slate-700 ${
                    theme === 'light' ? 'text-brand-600 font-bold bg-brand-50/50' : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Light</span>
                </button>
                <button
                  onClick={() => {
                    setTheme('dark');
                    setShowThemeMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center space-x-2 hover:bg-slate-50 dark:hover:bg-slate-700 ${
                    theme === 'dark' ? 'text-brand-600 font-bold bg-brand-50/50' : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-brand-400" />
                  <span>Dark</span>
                </button>
                <button
                  onClick={() => {
                    setTheme('system');
                    setShowThemeMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center space-x-2 hover:bg-slate-50 dark:hover:bg-slate-700 ${
                    theme === 'system' ? 'text-brand-600 font-bold bg-brand-50/50' : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5 text-slate-400" />
                  <span>System</span>
                </button>
              </div>
            )}
          </div>

          {/* AIC-Style User Profile (Role Locked to RBAC Session) */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleMenu(!showRoleMenu);
                setShowThemeMenu(false);
                setShowLangMenu(false);
              }}
              className="flex items-center space-x-2.5 p-1.5 pl-2 pr-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left"
              title="User Profile & RBAC Role"
            >
              <div className="w-8 h-8 rounded-full bg-brand-700 text-white flex items-center justify-center font-black text-xs shadow-sm border border-brand-400">
                {currentProfile.initials}
              </div>
              <div className="hidden sm:block leading-tight">
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-black text-slate-900 dark:text-white">{currentProfile.shortName}</span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                </div>
                <span className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold block">
                  {currentProfile.title}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 animate-fadeIn">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                  <div className="text-xs font-black text-slate-900 dark:text-white">{currentProfile.name}</div>
                  <div className="text-[11px] text-brand-600 dark:text-brand-400 font-bold">{currentProfile.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{currentProfile.dept}</div>
                </div>

                {/* Locked RBAC Session Info */}
                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/60 my-2 mx-2 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Assigned Role:</span>
                    <span className="font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/80 px-2 py-0.5 rounded-md border border-brand-200 dark:border-brand-800">
                      {currentUserRole}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Role Modification:</span>
                    <span className="font-semibold text-slate-500">Locked by RBAC Policy</span>
                  </div>
                </div>

                <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-700 px-1 space-y-1">
                  {onReturnToLanding && (
                    <button
                      onClick={() => {
                        setShowRoleMenu(false);
                        onReturnToLanding();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl flex items-center space-x-2 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5 text-brand-600" />
                      <span>Public Landing &amp; Overview</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowRoleMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl flex items-center space-x-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-600" />
                    <span>Sign Out / Lock Workspace</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
