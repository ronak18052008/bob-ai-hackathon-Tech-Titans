import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ArrowRight, Activity, Shield } from 'lucide-react';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (email === 'admin@medbrief.ai' && password === 'password123') {
        onLogin();
        navigate('/');
      } else {
        const emailMatch = email === 'admin@medbrief.ai';
        if (!emailMatch) {
          setError('No account found with this email address. Try admin@medbrief.ai for the demo.');
        } else {
          setError('Incorrect password. Use password123 for the demo account.');
        }
        setIsLoading(false);
      }
    }, 700);
  };

  return (
    <div style={{
      minHeight: '100dvh', display: 'grid', gridTemplateColumns: '1fr 1fr',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Left panel — brand */}
      <div style={{
        background: 'linear-gradient(145deg, var(--navy) 0%, #1A3A5C 100%)',
        padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        {/* Logo */}
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

        {/* Hero text */}
        <div>
          <h1 style={{
            fontFamily: 'Manrope', color: '#fff',
            fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800,
            lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '1.25rem',
          }}>
            Your patient's story,<br />
            <span style={{ color: 'var(--teal)' }}>in minutes.</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.0625rem', lineHeight: 1.65, maxWidth: 400 }}>
            Turn hundreds of fragmented clinical pages into one clear, evidence-grounded view. Know what changed, what's pending, and where every fact came from.
          </p>

          {/* Visual flow */}
          <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['Fragmented records', 'Clinical timeline', 'Evidence-grounded insights'].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 7,
                  background: i === 2 ? 'var(--teal)' : 'rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  fontSize: '0.75rem', fontWeight: 800, fontFamily: 'Manrope', color: '#fff',
                }}>
                  {i + 1}
                </div>
                <span style={{ color: i === 2 ? '#fff' : 'rgba(255,255,255,0.55)', fontSize: '0.9375rem', fontWeight: i === 2 ? 600 : 400 }}>
                  {step}
                </span>
              </div>
            ))}
          </div>
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
            <h2 style={{ fontSize: '1.625rem', marginBottom: '0.35rem' }}>Sign in</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
              Access your clinical dashboard.
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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-heading)' }}>
                Email address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '2.375rem' }}
                  placeholder="admin@medbrief.ai"
                  required
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-heading)' }}>Password</label>
                <a href="#" style={{ fontSize: '0.8125rem', color: 'var(--teal)', fontWeight: 500 }}>Forgot password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '2.375rem' }}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
            >
              {isLoading ? 'Signing in…' : 'Sign in'}
              {!isLoading && <ArrowRight size={15} />}
            </button>

            <button
              type="button"
              onClick={() => { setEmail('admin@medbrief.ai'); setPassword('password123'); }}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '0.75rem' }}
            >
              Continue with Demo
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', padding: '0.75rem 1rem', background: 'var(--mint)', borderRadius: 'var(--r-md)', border: '1px solid var(--mint-border)' }}>
            <Shield size={14} color="var(--teal)" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>
              <strong style={{ color: 'var(--text-heading)' }}>Privacy first.</strong> Uploaded records are processed in memory and not stored after your session ends.
            </p>
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--teal)', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
