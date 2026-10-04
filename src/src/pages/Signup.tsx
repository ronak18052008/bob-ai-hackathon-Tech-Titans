import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, ArrowRight, Activity, Shield, CheckCircle2 } from 'lucide-react';

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
      setError('Passwords do not match. Please ensure both fields are identical.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (email === 'admin@medbrief.ai') {
      setError('An account with this email already exists. Try signing in instead.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsSuccess(true);
      setTimeout(() => { onLogin(); navigate('/'); }, 1400);
    }, 900);
  };

  if (isSuccess) {
    return (
      <div style={{
        minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg)',
      }}>
        <div className="animate-scale-in" style={{ textAlign: 'center', maxWidth: 360 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: 'var(--success-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
          }}>
            <CheckCircle2 size={30} color="var(--success)" />
          </div>
          <h2 style={{ marginBottom: '0.5rem' }}>Welcome, {name.split(' ')[0]}!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Your account is ready. Taking you to the dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100dvh', display: 'grid', gridTemplateColumns: '1fr 1fr',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Left panel */}
      <div style={{
        background: 'linear-gradient(145deg, var(--navy) 0%, #1A3A5C 100%)',
        padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9,
            background: 'linear-gradient(135deg, var(--teal) 0%, #0D9EA0 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Activity size={19} color="#fff" strokeWidth={2.5} />
          </div>
          <div style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: '1.125rem', color: '#fff' }}>MedBrief <span style={{ color: 'var(--teal)' }}>AI</span></div>
        </div>

        <div>
          <h1 style={{
            fontFamily: 'Manrope', color: '#fff',
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800,
            lineHeight: 1.2, letterSpacing: '-0.03em', marginBottom: '1.25rem',
          }}>
            Clinical continuity,<br />
            <span style={{ color: 'var(--teal)' }}>finally clear.</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.65, maxWidth: 360 }}>
            Join MedBrief AI and start turning your patient's scattered records into a single, evidence-grounded clinical view.
          </p>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>
          © 2026 MedBrief AI. For demonstration purposes only.
        </p>
      </div>

      {/* Right panel — form */}
      <div style={{
        background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }} className="animate-scale-in">
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.625rem', marginBottom: '0.35rem' }}>Create an account</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
              Start your MedBrief AI journey today.
            </p>
          </div>

          {error && (
            <div className="animate-fade-in" style={{
              display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
              padding: '0.875rem 1rem', borderRadius: 'var(--r-md)',
              background: 'var(--danger-bg)', border: '1px solid var(--danger-border)',
              marginBottom: '1.25rem',
            }}>
              <AlertCircle size={16} color="var(--danger)" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: '0.875rem', color: 'var(--danger)', margin: 0, lineHeight: 1.5 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-heading)' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field" style={{ paddingLeft: '2.375rem' }} placeholder="Dr. Sarah Johnson" required />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-heading)' }}>Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" style={{ paddingLeft: '2.375rem' }} placeholder="sarah@hospital.org" required />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-heading)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" style={{ paddingLeft: '2.375rem' }} placeholder="Min 8 characters" required />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-heading)' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="input-field" style={{ paddingLeft: '2.375rem' }} placeholder="••••••••" required />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}>
              {isLoading ? 'Creating account…' : 'Create account'}
              {!isLoading && <ArrowRight size={15} />}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', padding: '0.75rem 1rem', background: 'var(--mint)', borderRadius: 'var(--r-md)', border: '1px solid var(--mint-border)' }}>
            <Shield size={14} color="var(--teal)" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>
              <strong style={{ color: 'var(--text-heading)' }}>Privacy first.</strong> No identifiable health data is stored beyond your session.
            </p>
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--teal)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
