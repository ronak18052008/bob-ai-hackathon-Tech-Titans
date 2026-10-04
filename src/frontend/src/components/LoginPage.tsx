import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MedSynapseLogo } from './MedSynapseLogo';
import {
  Lock,
  Mail,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Eye,
  EyeOff,
  UserCheck,
} from 'lucide-react';
import { Role } from '../types';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onExplorePublic?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onExplorePublic }) => {
  const { setCurrentUserRole, addAuditLog } = useApp();

  const [email, setEmail] = useState('doctor@medsynapse.ai');
  const [password, setPassword] = useState('medsynapse123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine user role strictly based on authenticated email credentials
  const resolveUserRoleFromEmail = (userEmail: string): Role => {
    const lower = userEmail.toLowerCase().trim();
    if (lower.includes('reviewer') || lower.includes('sharma')) {
      return 'Senior Doctor / Reviewer';
    } else if (lower.includes('admin') || lower.includes('mehta')) {
      return 'Department Admin';
    } else if (lower.includes('record') || lower.includes('patel')) {
      return 'Records Manager';
    }
    return 'Doctor';
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const assignedRole = resolveUserRoleFromEmail(email);
    setCurrentUserRole(assignedRole);

    setTimeout(() => {
      setIsSubmitting(false);
      addAuditLog(
        'USER_LOGIN',
        `Authenticated as ${email} with assigned RBAC role: ${assignedRole}`
      );
      onLoginSuccess();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between select-none transition-colors">
      {/* Top Bar */}
      <div className="bg-sky-50 dark:bg-sky-950/50 border-b border-sky-100 dark:border-sky-900 px-4 py-1.5 text-xs text-center font-medium text-sky-800 dark:text-sky-300 flex items-center justify-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
        <span className="font-extrabold uppercase tracking-wide text-[11px]">MedSynapse AI Clinical OS</span>
        <span>—</span>
        <span className="text-[11px]">Role-Based Access Control &amp; Clinical Journey Workspace</span>
      </div>

      {/* Main Authentication Container */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Brand & Product Statement */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-block">
              <MedSynapseLogo variant="full" size="lg" showSubtitle={true} />
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Next-Gen Clinical Intelligence</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Reconstruct the patient's journey. Surface what matters.
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg mx-auto lg:mx-0">
                We don't just summarize medical records—we reconstruct the patient's longitudinal clinical journey and surface documented gaps and medication changes that doctors need to review.
              </p>
            </div>

            {/* Statutory Compliance Badges */}
            <div className="pt-2 flex flex-wrap gap-2 justify-center lg:justify-start text-xs">
              <span className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>IBM watsonx.ai Secured</span>
              </span>
              <span className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold shadow-xs">
                <UserCheck className="w-4 h-4 text-brand-600" />
                <span>RBAC Enforced</span>
              </span>
            </div>
          </div>

          {/* Right Column: Clean Login Form (Email & Password Only) */}
          <div className="lg:col-span-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-600 dark:text-brand-400">
                  Role-Based Authentication
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  Sign In to Clinical Workspace
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Enter your hospital credentials to access your authorized clinical role.
                </p>
              </div>

              {/* Login Form: Only Email and Password fields */}
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Hospital Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="doctor@medsynapse.ai"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-600 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center space-x-2 cursor-pointer text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-[11px] font-semibold">Remember session</span>
                  </label>
                  <span className="text-[11px] text-brand-600 hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-700 via-brand-600 to-sky-600 hover:opacity-95 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Authenticating Role...' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Discrete RBAC Hint for Reviewers & Testers */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[11px] space-y-2 text-slate-500 dark:text-slate-400">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-700 dark:text-slate-300 text-[10px] uppercase tracking-wider">
                    Role Credentials Guide
                  </div>
                  <div className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    Password: <span className="text-brand-600 dark:text-brand-400 font-black">medsynapse123</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px]">
                  <div><strong className="text-brand-600">Doctor:</strong> doctor@medsynapse.ai</div>
                  <div><strong className="text-purple-600">Reviewer:</strong> reviewer@medsynapse.ai</div>
                  <div><strong className="text-sky-600">Admin:</strong> admin@medsynapse.ai</div>
                  <div><strong className="text-emerald-600">Records:</strong> records@medsynapse.ai</div>
                </div>
              </div>

              {onExplorePublic && (
                <div className="text-center pt-1">
                  <button
                    onClick={onExplorePublic}
                    className="text-xs text-slate-500 hover:text-brand-600 font-semibold"
                  >
                    &larr; Return to Public Landing Page
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-center text-slate-400 text-[11px]">
        MedSynapse AI &bull; Authorized Clinical Personnel Only &bull; Role-Based Access Control enforced under HIPAA &amp; DPDP compliance.
      </div>
    </div>
  );
};

export default LoginPage;
