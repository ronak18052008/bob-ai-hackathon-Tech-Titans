import { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import {
  Activity, LayoutDashboard, Users, FileUp, Clock,
  RefreshCw, Pill, ListChecks, AlertTriangle, AlertOctagon,
  MessageSquare, FileText, History, Settings, LogOut, User as UserIcon
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import PatientList from './pages/PatientList';
import CreatePatient from './pages/CreatePatient';
import PatientView from './pages/PatientView';
import Login from './pages/Login';
import Signup from './pages/Signup';

interface NavItemLink {
  type: 'link';
  path: string;
  label: string;
  icon: any;
}

interface NavItemDivider {
  type: 'divider';
}

type NavItem = NavItemLink | NavItemDivider;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('auth') === 'true';
  });

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
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // If we are in a patient route, we want to show patient-specific sidebar links
  const isPatientRoute = location.pathname.startsWith('/patient/');
  const patientId = isPatientRoute ? location.pathname.split('/')[2] : null;

  const globalNavItems: NavItemLink[] = [
    { type: 'link', path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { type: 'link', path: '/patients', label: 'Patients', icon: Users },
    { type: 'link', path: '/upload', label: 'Upload Records', icon: FileUp },
  ];

  const patientNavItems: NavItemLink[] = [
    { type: 'link', path: `/patient/${patientId}/timeline`, label: 'Timeline', icon: Clock },
    { type: 'link', path: `/patient/${patientId}/what-changed`, label: 'What Changed?', icon: RefreshCw },
    { type: 'link', path: `/patient/${patientId}/medications`, label: 'Medications', icon: Pill },
    { type: 'link', path: `/patient/${patientId}/investigations`, label: 'Investigations', icon: ListChecks },
    { type: 'link', path: `/patient/${patientId}/care-gaps`, label: 'Care Gaps', icon: AlertTriangle },
    { type: 'link', path: `/patient/${patientId}/contradictions`, label: 'Contradictions', icon: AlertOctagon },
    { type: 'link', path: `/patient/${patientId}/assistant`, label: 'AI Assistant', icon: MessageSquare },
    { type: 'link', path: `/patient/${patientId}/briefs`, label: 'Generate Brief', icon: FileText },
    { type: 'link', path: `/patient/${patientId}/audit`, label: 'Audit / Review', icon: History },
  ];

  const navItems: NavItem[] = isPatientRoute ? [...globalNavItems, { type: 'divider' }, ...patientNavItems] : globalNavItems;

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-main)' }}>
      {/* Sidebar */}
      <aside className="w-64 flex flex-col h-full flex-shrink-0" style={{ backgroundColor: '#FFFFFF', borderRight: '1px solid var(--border)' }}>
        <div className="p-6 flex items-center gap-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--primary-light)' }}>
            <Activity className="w-6 h-6 text-teal" />
          </div>
          <div>
            <h1 className="text-xl font-bold m-0" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>MedBrief AI</h1>
            <p className="text-xs text-secondary font-medium">Clinical Continuity</p>
          </div>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item, idx) => {
            if (item.type === 'divider') {
              return <div key={`div-${idx}`} className="my-2 border-b" style={{ borderColor: 'var(--border)' }}></div>;
            }

            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.endsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-150 text-sm font-medium"
                style={{
                  backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                  color: isActive ? 'var(--primary-text)' : 'var(--text-secondary)',
                  textDecoration: 'none'
                }}
              >
                <Icon className="w-5 h-5" style={{ color: isActive ? 'var(--primary-text)' : 'var(--text-muted)' }} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex flex-col gap-1">
            <Link to="/settings" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-secondary hover:bg-slate-50 transition-colors" style={{ textDecoration: 'none' }}>
              <Settings className="w-4 h-4" /> Settings
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-secondary hover:bg-slate-50 transition-colors border-none bg-transparent cursor-pointer w-full text-left">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top bar */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-8 flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          <div>
            {isPatientRoute && (
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-secondary">Current Patient:</span>
                <span className="text-primary bg-primary-light px-2 py-1 rounded-md" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-text)' }}>Rahul Mehta (ID: RM-8492)</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right text-sm">
              <p className="font-semibold text-primary m-0" style={{ color: 'var(--text-primary)' }}>Dr. Sunita Sharma</p>
              <p className="text-muted text-xs m-0">Cardiology</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border" style={{ borderColor: 'var(--border)' }}>
              <UserIcon className="w-5 h-5 text-secondary" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          <div className="container mx-auto animate-fade-in min-h-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/patients" element={<PatientList />} />
              <Route path="/patients/new" element={<CreatePatient />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/patient/:id/*" element={<PatientView />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
