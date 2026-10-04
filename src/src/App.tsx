import { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, FileUp, Clock,
  RefreshCw, Pill, ListChecks, AlertTriangle, AlertOctagon,
  MessageSquare, FileText, LogOut, User as UserIcon,
  Activity, ChevronRight
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import PatientList from './pages/PatientList';
import CreatePatient from './pages/CreatePatient';
import PatientView from './pages/PatientView';
import Login from './pages/Login';
import Signup from './pages/Signup';

interface NavItemLink { type: 'link'; path: string; label: string; icon: any; badge?: string; }
interface NavItemDivider { type: 'divider'; label?: string; }
type NavItem = NavItemLink | NavItemDivider;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('auth') === 'true');

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('auth');
  };

  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login"  element={<Login  onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const isPatientRoute = location.pathname.startsWith('/patient/');
  const patientId = isPatientRoute ? location.pathname.split('/')[2] : null;

  const globalNavItems: NavItem[] = [
    { type: 'link', path: '/',         label: 'Overview',        icon: LayoutDashboard },
    { type: 'link', path: '/patients', label: 'Patients',        icon: Users },
    { type: 'link', path: '/upload',   label: 'Upload Records',  icon: FileUp },
  ];

  const patientNavItems: NavItem[] = [
    { type: 'divider', label: 'Patient View' },
    { type: 'link', path: `/patient/${patientId}/timeline`,       label: 'Timeline',         icon: Clock },
    { type: 'link', path: `/patient/${patientId}/what-changed`,   label: 'What Changed',     icon: RefreshCw, badge: '3' },
    { type: 'link', path: `/patient/${patientId}/medications`,    label: 'Medications',      icon: Pill },
    { type: 'link', path: `/patient/${patientId}/investigations`, label: 'Investigations',   icon: ListChecks },
    { type: 'link', path: `/patient/${patientId}/care-gaps`,      label: 'Follow-ups',       icon: AlertTriangle },
    { type: 'link', path: `/patient/${patientId}/contradictions`, label: 'Consistency',      icon: AlertOctagon },
    { type: 'link', path: `/patient/${patientId}/assistant`,      label: 'AI Assistant',     icon: MessageSquare },
    { type: 'link', path: `/patient/${patientId}/briefs`,         label: 'Generate Brief',   icon: FileText },
  ];

  const navItems: NavItem[] = isPatientRoute
    ? [...globalNavItems, ...patientNavItems]
    : globalNavItems;

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo-area">
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, var(--teal) 0%, #0D9EA0 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Activity size={17} color="#fff" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: '1rem', color: '#fff', lineHeight: 1.1 }}>MedBrief</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', fontWeight: 600, letterSpacing: '0.04em' }}>AI</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {navItems.map((item, idx) => {
            if (item.type === 'divider') {
              return (
                <div key={`div-${idx}`}>
                  <div className="sidebar-divider" />
                  {item.label && <div className="sidebar-section-label">{item.label}</div>}
                </div>
              );
            }
            const Icon = item.icon;
            const isActive = location.pathname === item.path
              || (item.path !== '/' && item.path !== '/patients' && item.path !== '/upload' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{
                    background: 'var(--teal)', color: '#fff',
                    fontSize: '0.65rem', fontWeight: 700,
                    padding: '1px 6px', borderRadius: 99,
                    fontFamily: 'Manrope'
                  }}>{item.badge}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem', padding: '0.5rem 0.875rem' }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <UserIcon size={15} color="rgba(255,255,255,0.7)" />
            </div>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', lineHeight: 1.2 }}>Dr. Sunita Sharma</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Cardiology</div>
            </div>
          </div>
          <button onClick={handleLogout} className="sidebar-link" style={{ width: '100%' }}>
            <LogOut size={15} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            {isPatientRoute && (
              <>
                <span>Patients</span>
                <ChevronRight size={14} />
                <span style={{ color: 'var(--text-body)', fontWeight: 600 }}>Rahul Mehta (ID: {patientId})</span>
              </>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/upload" className="btn btn-sm btn-primary" style={{ textDecoration: 'none' }}>
              <FileUp size={14} />
              Upload Records
            </Link>
          </div>
        </header>

        {/* Page content */}
        <div className="page-content">
          <div style={{ padding: '2rem 2.5rem', maxWidth: 1280, margin: '0 auto' }}>
            <Routes>
              <Route path="/"             element={<Dashboard />} />
              <Route path="/patients"     element={<PatientList />} />
              <Route path="/patients/new" element={<CreatePatient />} />
              <Route path="/upload"       element={<Upload />} />
              <Route path="/patient/:id/*" element={<PatientView />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
