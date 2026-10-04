import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, User, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Signup({ onLogin }: { onLogin: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Conflict: Passwords do not match. Please ensure both passwords are identical.');
      return;
    }

    if (password.length < 8) {
      setError('Conflict: Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    // Simulate API call and validation
    setTimeout(() => {
      if (email === 'admin@medbrief.ai') {
        setError('Conflict: An account with this email already exists.');
        setIsLoading(false);
      } else {
        setIsSuccess(true);
        setTimeout(() => {
          onLogin();
          navigate('/');
        }, 1500);
      }
    }, 1000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bg-main)' }}>
        <div className="max-w-md w-full glass-surface overflow-hidden p-10 text-center animate-scale-in">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Account Created!</h2>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>Welcome aboard, {name}. Taking you to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="max-w-md w-full glass-surface overflow-hidden animate-scale-in">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--primary-light)' }}>
              <Activity className="w-7 h-7 text-teal" style={{ color: 'var(--primary)' }} />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>Create an account</h2>
          <p className="text-center mb-6" style={{ color: 'var(--text-secondary)' }}>Join MedBrief AI today</p>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 flex gap-3 items-start animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 m-0 leading-relaxed font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all bg-white"
                  placeholder="Dr. Sarah Johnson"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all bg-white"
                  placeholder="sarah@hospital.org"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all bg-white"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all bg-white"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white transition-all mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>
        
        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-sm m-0" style={{ color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-bold hover:underline" style={{ color: 'var(--primary)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
