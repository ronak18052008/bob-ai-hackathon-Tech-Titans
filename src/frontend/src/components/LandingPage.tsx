import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MedSynapseLogo } from './MedSynapseLogo';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  GitBranch,
  Radar,
  AlertOctagon,
  Activity,
  Cpu,
  Database,
  Lock,
  CheckCircle2,
  FileText,
  Clock,
  ExternalLink,
  Sun,
  Moon,
  Laptop,
  Menu,
  X,
  FileSearch,
  ScanLine,
  Microscope,
  Pill,
  Workflow,
  Eye,
  FileCheck2,
  Shield,
  Stethoscope,
  ChevronRight,
  Layers,
  Sparkle,
} from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onExplore: () => void;
  onScanAndSummarize?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLogin,
  onExplore,
  onScanAndSummarize,
}) => {
  const { theme, setTheme } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePipelineStep, setActivePipelineStep] = useState(2);

  const pipelineSteps = [
    { label: 'Medical Documents', desc: 'Discharge summaries, PDFs & handwritten prescriptions' },
    { label: 'Multimodal OCR', desc: 'Tesseract & computer vision character recognition' },
    { label: 'Clinical Information', desc: 'Entities, SNOMED & RxNorm medication tagging' },
    { label: 'Clinical Events', desc: 'Admissions, symptoms, procedures & drug changes' },
    { label: 'Patient Journey', desc: 'Longitudinal chronological graph reconstruction' },
    { label: 'Evidence Graph', desc: 'Page & coordinate-grounded source linking' },
    { label: 'Doctor Review', desc: 'Clinician verification, referral & audit sign-off' },
  ];

  const handleScanClick = () => {
    if (onScanAndSummarize) {
      onScanAndSummarize();
    } else {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-brand-500/20 selection:text-brand-600 font-sans transition-colors duration-200">
      {/* Statutory Clinical Context Banner */}
      <div className="bg-brand-900 text-white px-4 py-2 text-xs text-center font-medium flex items-center justify-center space-x-2 border-b border-brand-800">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
        <span className="font-extrabold uppercase tracking-wider text-[11px] text-cyan-300">
          MedSynapse AI v4.0
        </span>
        <span className="text-brand-400 hidden sm:inline">•</span>
        <span className="text-slate-200 text-[11px] sm:text-xs">
          Advanced Clinical Journey Reconstruction &amp; Evidence Intelligence Operating System
        </span>
      </div>

      {/* Primary Navigation Bar (Section 5) */}
      <header className="px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
        <div className="flex items-center space-x-6">
          <MedSynapseLogo variant="compact" size="md" showSubtitle={true} />

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-5 text-xs font-bold text-slate-600 dark:text-slate-300">
            <a href="#platform" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Platform
            </a>
            <a href="#how-it-works" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              How It Works
            </a>
            <a href="#clinical-intelligence" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Clinical Intelligence
            </a>
            <a href="#evidence" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Evidence-First
            </a>
            <a href="#security" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Security &amp; AI
            </a>
          </nav>
        </div>

        {/* Right Actions: Theme Selector + Auth CTAs */}
        <div className="flex items-center space-x-3">
          {/* Theme Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                theme === 'light' ? 'bg-white text-amber-500 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Light Mode"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                theme === 'dark' ? 'bg-slate-700 text-brand-400 shadow-xs' : 'text-slate-500 hover:text-white'
              }`}
              title="Dark Mode"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                theme === 'system' ? 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-xs' : 'text-slate-500'
              }`}
              title="System Mode"
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onLogin}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all"
          >
            Doctor Login
          </button>

          <button
            onClick={onExplore}
            className="hidden sm:flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-700 hover:to-sky-700 text-white text-xs font-extrabold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>Explore Platform</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 space-y-3 animate-fadeIn">
          <nav className="flex flex-col space-y-2 text-sm font-bold text-slate-700 dark:text-slate-300">
            <a
              href="#platform"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-brand-600"
            >
              Platform
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-brand-600"
            >
              How It Works
            </a>
            <a
              href="#clinical-intelligence"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-brand-600"
            >
              Clinical Intelligence
            </a>
            <a
              href="#evidence"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-brand-600"
            >
              Evidence-First
            </a>
            <a
              href="#security"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-brand-600"
            >
              Security &amp; AI
            </a>
          </nav>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogin();
              }}
              className="w-full py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs"
            >
              Login to Clinical Workspace
            </button>
          </div>
        </div>
      )}

      {/* SECTION 6: HERO SECTION */}
      <section className="relative overflow-hidden pt-12 sm:pt-16 pb-20 px-4 sm:px-8 flex flex-col items-center justify-center text-center">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-brand-500/10 via-cyan-500/10 to-indigo-500/5 blur-3xl opacity-80" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto space-y-6">
          {/* Canonical Official Brand Logo as Anchor */}
          <div className="flex justify-center mb-2">
            <MedSynapseLogo variant="full" size="hero" showSubtitle={false} animated={true} />
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-extrabold uppercase tracking-wider">
              <Sparkle className="w-3.5 h-3.5 text-cyan-500" />
              <span>Evidence-Grounded Clinical Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Reconstruct the patient's journey.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-cyan-500 to-indigo-600 dark:from-brand-400 dark:via-cyan-400 dark:to-indigo-400">
                Surface what matters.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
              MedSynapse AI transforms fragmented medical records into a structured clinical journey, evidence-backed summaries, medication evolution, investigation intelligence, and actionable documentation insights.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
            <button
              onClick={handleScanClick}
              className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-700 hover:to-sky-700 text-white font-extrabold text-sm shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <ScanLine className="w-5 h-5 text-cyan-200" />
              <span>Scan &amp; Summarize Document</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={onExplore}
              className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-sm shadow-xs hover:scale-[1.02] transition-all"
            >
              <Layers className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Explore Platform Cohort</span>
            </button>
          </div>

          {/* HERO VISUALIZATION: The 7-Stage Pipeline (Section 6) */}
          <div id="how-it-works" className="pt-12 max-w-4xl mx-auto">
            <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-left">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Live Longitudinal Reconstruction Pipeline
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-brand-600 dark:text-brand-400">
                  Interactive Stages
                </span>
              </div>

              {/* Responsive Flow Swimlane */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {pipelineSteps.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePipelineStep(idx)}
                    className={`p-2.5 rounded-2xl border text-left transition-all ${
                      activePipelineStep === idx
                        ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-[10px] font-black text-slate-400 mb-1">
                      0{idx + 1}
                    </div>
                    <div
                      className={`text-xs font-black leading-tight ${
                        activePipelineStep === idx
                          ? 'text-brand-700 dark:text-brand-300'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {step.label}
                    </div>
                  </button>
                ))}
              </div>

              {/* Active Stage Detail */}
              <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase text-brand-600 dark:text-brand-400">
                    Stage 0{activePipelineStep + 1} Capabilities
                  </span>
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    {pipelineSteps[activePipelineStep].label}:{' '}
                    <span className="font-normal text-slate-600 dark:text-slate-400">
                      {pipelineSteps[activePipelineStep].desc}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onExplore}
                  className="inline-flex items-center space-x-1 font-bold text-brand-600 dark:text-brand-400 hover:underline shrink-0 text-xs"
                >
                  <span>See in workspace</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 13 & 14: SCAN & SUMMARIZE SHOWCASE */}
      <section id="scan-and-summarize" className="py-16 px-4 sm:px-8 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <div className="text-xs font-black uppercase tracking-wider text-brand-600 dark:text-brand-400">
              First-Class Clinical Capability
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Scan &amp; Summarize: From Paper to Grounded Evidence
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Scan multi-page discharge summaries, camera snaps of prescriptions, or lab panels. MedSynapse extracts text, detects clinical entities, and generates an evidence-anchored summary in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Input Side: Document / Camera Scan */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                    Input: Medical Record Scan
                  </span>
                  <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full font-mono font-bold">
                    PDF / JPG / Camera
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 space-y-3 font-mono text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center justify-between border-b pb-2 text-[11px] border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-white">METRO HEART INSTITUTE</span>
                    <span>DISCHARGE SUMMARY</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    "Patient: Rajesh Sharma, 58/M. Admitted with acute chest pain and SOB. Diagnosed with NSTEMI. Echo EF 35%. Started on Ticagrelor 90mg BID, Atorvastatin 80mg. Metformin escalated from 500mg to 1000mg BID due to HbA1c 8.4%."
                  </p>
                  <div className="text-[10px] text-brand-600 dark:text-brand-400 font-sans font-bold flex items-center space-x-1">
                    <ScanLine className="w-3.5 h-3.5" />
                    <span>OCR Confidence: 98.4% (Direct Text Stream)</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div className="font-black text-brand-600">34</div>
                    <div className="text-[10px] text-slate-500">Entities</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div className="font-black text-emerald-600">12</div>
                    <div className="text-[10px] text-slate-500">Timeline Events</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div className="font-black text-amber-600">2</div>
                    <div className="text-[10px] text-slate-500">Gaps Detected</div>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={handleScanClick}
                  className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm flex items-center justify-center space-x-2 transition-all"
                >
                  <ScanLine className="w-4 h-4 text-cyan-200" />
                  <span>Launch Scanner in Workspace</span>
                </button>
              </div>
            </div>

            {/* Output Side: AI Structured Summary with Citations */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-brand-200 dark:border-brand-900/60 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-brand-700 dark:text-brand-300 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                    <span>AI Clinical Summary &amp; Grounding</span>
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                    Evidence Linked
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="font-black text-slate-900 dark:text-white flex items-center justify-between">
                      <span>Primary Diagnosis</span>
                      <span className="text-[10px] font-mono text-slate-400">ICD-10 I21.4</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-xs">
                      Acute Non-ST Elevation Myocardial Infarction (NSTEMI) with reduced ejection fraction (EF 35%).
                    </p>
                    <div className="text-[10px] text-brand-600 font-bold">
                      Source: Discharge Summary · Page 1 · Par. 2
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="font-black text-slate-900 dark:text-white flex items-center justify-between">
                      <span>Pharmacotherapy Evolution</span>
                      <span className="text-[10px] bg-amber-50 dark:bg-amber-950/40 text-amber-700 px-1.5 py-0.5 rounded font-bold">Dose Changed</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-xs">
                      Metformin increased: <span className="line-through text-slate-400">500 mg</span> → <strong className="text-slate-900 dark:text-white">1000 mg BID</strong>. Indication: HbA1c 8.4%.
                    </p>
                    <div className="text-[10px] text-brand-600 font-bold">
                      Source: Medication Chart · Page 4
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-1">
                    <div className="font-black text-amber-900 dark:text-amber-200 flex items-center space-x-1">
                      <AlertOctagon className="w-3.5 h-3.5 text-amber-600" />
                      <span>Documentation Gap Detected</span>
                    </div>
                    <p className="text-amber-800 dark:text-amber-300 text-xs">
                      Coronary Angiography ordered on Day 2, but formal angiogram report is absent from uploaded file set.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Requires Clinician Review</span>
                <span className="text-brand-600 dark:text-brand-400">100% Traceable Citations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: CLINICAL INTELLIGENCE SUITE */}
      <section id="clinical-intelligence" className="py-16 px-4 sm:px-8 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <div className="text-xs font-black uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Longitudinal Intelligence
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Built for High-Stakes Clinical Review
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Doctors make split-second decisions with incomplete records. MedSynapse AI turns folders of PDFs into a coordinated intelligence suite.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            {[
              {
                title: 'Patient Journey Reconstruction',
                desc: 'Transforms fragmented admissions and records into a unified chronological story with evidence citations.',
                icon: GitBranch,
                color: 'text-brand-600 dark:text-brand-400',
              },
              {
                title: 'Change Lens (What Changed?)',
                desc: 'Instantly compares hospitalizations and medication regimens to highlight new, removed, and shifted therapies.',
                icon: Activity,
                color: 'text-indigo-600 dark:text-indigo-400',
              },
              {
                title: 'Clinical Gap Radar',
                desc: 'Detects diagnostic tests cited in clinical notes whose formal reports are missing from the chart.',
                icon: Radar,
                color: 'text-amber-600 dark:text-amber-400',
              },
              {
                title: 'Documentation Conflict Detector',
                desc: 'Pinpoints contradictory drug dosages, allergy discrepancies, and temporal anomalies across records.',
                icon: AlertOctagon,
                color: 'text-rose-600 dark:text-rose-400',
              },
              {
                title: 'Synapse View (3-Panel Workspace)',
                desc: 'Synchronizes the Timeline, Clinical Intelligence, and Evidence Rail whenever any event is clicked.',
                icon: FileText,
                color: 'text-cyan-600 dark:text-cyan-400',
              },
              {
                title: 'Second Look Pre-Export Audit',
                desc: 'Automated evidence integrity audit verifying that 100% of claims are anchored in source documents before handoff.',
                icon: ShieldCheck,
                color: 'text-emerald-600 dark:text-emerald-400',
              },
            ].map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500/50 transition-all shadow-xs space-y-2.5"
                >
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${cap.color}`} />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{cap.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{cap.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION: EVIDENCE-FIRST AI & TRACEABILITY */}
      <section id="evidence" className="py-16 px-4 sm:px-8 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="text-xs font-black uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Evidence-First Architecture
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                Zero AI Hallucinations. Every Claim Grounded in Documented Source.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Conventional LLMs summarize by guessing omitted context. MedSynapse AI enforces the strict Evidence Chain: every medical fact links directly to Document → Page → Section → Extracted Snippet.
              </p>
              <div className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>DIRECTLY DOCUMENTED — 100% character span matches</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>SUPPORTED BY MULTIPLE SOURCES — Cross-encounter confirmation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>INFERRED — Explicitly flagged for doctor verification</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>NOT FOUND IN RECORDS — Prevents false assumptions of non-existence</span>
                </div>
              </div>
            </div>

            {/* Evidence Inspector Interactive Card */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-md space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-brand-600" />
                  <span className="font-black text-slate-900 dark:text-white">Evidence Inspector Rail</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold">
                  Verified
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-400">Claim to Verify</span>
                <div className="font-bold text-slate-900 dark:text-white">
                  "Patient initiated on Sacubitril / Valsartan 24/26 mg BID after stabilization"
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between text-brand-700 dark:text-brand-300 font-bold">
                  <span>DISCHARGE_SUMMARY_2025_03.PDF</span>
                  <span>PAGE 3, LN 42</span>
                </div>
                <div className="text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2 rounded-xl border border-brand-100 dark:border-slate-800 text-[11px]">
                  "...prior to discharge, patient initiated on Entresto 24/26mg bid; monitored for hypotension; tolerated well..."
                </div>
              </div>

              <button
                onClick={onExplore}
                className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-opacity flex items-center justify-center space-x-1.5"
              >
                <span>Inspect in Clinical Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: SECURITY & RESPONSIBLE AI */}
      <section id="security" className="py-16 px-4 sm:px-8 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Clinical Governance &amp; Safety
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Responsible AI: Assisting Clinicians, Never Autonomously Diagnosing
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                MedSynapse AI strictly adheres to the principle of human-in-the-loop medicine. The platform never prescribes treatments or renders final diagnoses without explicit physician sign-off.
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <Shield className="w-4 h-4 text-brand-600" />
                  <div className="font-bold text-slate-900 dark:text-white">Organization RBAC</div>
                  <div className="text-[11px] text-slate-500">Doctor, Org Admin &amp; Platform Admin isolation</div>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <Database className="w-4 h-4 text-purple-600" />
                  <div className="font-bold text-slate-900 dark:text-white">Statutory Audit Log</div>
                  <div className="text-[11px] text-slate-500">Immutable ledger of every view, edit &amp; export</div>
                </div>
              </div>
            </div>

            {/* IBM watsonx Integration Architecture */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-purple-600" />
                  <span className="font-black text-slate-900 dark:text-white">Enterprise AI Engine</span>
                </div>
                <span className="font-mono text-purple-600 font-black text-xs">
                  IBM watsonx.ai
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Engineered with IBM Granite foundation models for medical entity extraction, character-offset RAG retrieval, and ABDM / FHIR R4 interoperability mappings.
              </p>
              <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 text-purple-900 dark:text-purple-300 font-mono text-[11px] space-y-1">
                <div>Model: ibm/granite-13b-chat-v2</div>
                <div>Parameters: Temp 0.1 · Top_P 0.95 · Strict Schema</div>
                <div>Guardrail: Zero unsupported extrapolation</div>
              </div>

              <button
                onClick={onLogin}
                className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-1"
              >
                <span>Enter Doctor Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (Section 4) */}
      <footer className="py-10 px-4 sm:px-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center text-xs text-slate-500 space-y-4">
        <div className="flex justify-center">
          <MedSynapseLogo variant="compact" size="sm" />
        </div>
        <p className="font-medium text-slate-600 dark:text-slate-400">
          MedSynapse AI — Reconstruct the patient's journey. Surface what matters.
        </p>
        <div className="text-[11px] text-slate-400">
          Synthetic Development Environment • Built for IBM Clinical AI Hackathon • All Rights Reserved
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
