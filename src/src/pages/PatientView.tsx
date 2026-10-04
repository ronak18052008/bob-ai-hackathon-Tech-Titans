import { Routes, Route, Navigate, useParams, Link, useLocation } from 'react-router-dom';
import Timeline from './patient/Timeline';
import WhatChanged from './patient/WhatChanged';
import MedicationRadar from './patient/MedicationRadar';
import Investigations from './patient/Investigations';
import CareGaps from './patient/CareGaps';
import Contradictions from './patient/Contradictions';
import AIAssistant from './patient/AIAssistant';
import GenerateBrief from './patient/GenerateBrief';
import { FileUp, FileText, Clock, RefreshCw, Pill, ListChecks, AlertTriangle, AlertOctagon, MessageSquare } from 'lucide-react';

const subNavItems = [
  { path: 'what-changed', label: 'What Changed', icon: RefreshCw },
  { path: 'timeline',     label: 'Timeline',     icon: Clock },
  { path: 'medications',  label: 'Medications',  icon: Pill },
  { path: 'investigations', label: 'Investigations', icon: ListChecks },
  { path: 'care-gaps',    label: 'Follow-ups',   icon: AlertTriangle },
  { path: 'contradictions', label: 'Consistency', icon: AlertOctagon },
  { path: 'assistant',    label: 'AI Assistant', icon: MessageSquare },
  { path: 'briefs',       label: 'Generate Brief', icon: FileText },
];

export default function PatientView() {
  const { id } = useParams();
  const location = useLocation();

  const getActiveTab = () => {
    const parts = location.pathname.split('/');
    return parts[parts.length - 1];
  };
  const activeTab = getActiveTab();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

      {/* Patient Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, #1A3A5C 100%)',
        borderRadius: 'var(--r-xl)', padding: '1.5rem 2rem',
        marginBottom: '1.5rem', color: '#fff',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Manrope', fontWeight: 800, fontSize: '1.25rem', color: '#fff', flexShrink: 0,
            }}>RM</div>
            <div>
              <h1 style={{ color: '#fff', fontSize: '1.375rem', margin: 0, marginBottom: '0.2rem' }}>Rahul Mehta</h1>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8375rem', color: 'rgba(255,255,255,0.6)' }}>
                <span>58 years</span>
                <span>·</span>
                <span>ID: {id}</span>
                <span>·</span>
                <span>Last updated: Today, 10:42 AM</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
            <Link to="/upload" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.5rem 1rem', borderRadius: 'var(--r-md)',
              background: 'rgba(255,255,255,0.1)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none',
              fontFamily: 'Manrope',
              transition: 'background 0.15s',
            }}>
              <FileUp size={14} /> Upload Records
            </Link>
            <Link to={`/patient/${id}/briefs`} style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.5rem 1rem', borderRadius: 'var(--r-md)',
              background: 'var(--teal)', color: '#fff',
              fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none',
              fontFamily: 'Manrope',
              transition: 'background 0.15s',
            }}>
              <FileText size={14} /> Generate Brief
            </Link>
          </div>
        </div>

        {/* Quick summary badges */}
        <div style={{ display: 'flex', gap: '0.625rem', marginTop: '1.125rem', flexWrap: 'wrap' }}>
          <span style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)', borderRadius: 99, padding: '0.2rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, border: '1px solid rgba(255,255,255,0.15)' }}>14 documents</span>
          <span style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)', borderRadius: 99, padding: '0.2rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, border: '1px solid rgba(255,255,255,0.15)' }}>3 admissions</span>
          <span style={{ background: 'rgba(10,126,126,0.4)', color: 'rgba(255,255,255,0.95)', borderRadius: 99, padding: '0.2rem 0.75rem', fontSize: '0.75rem', fontWeight: 600 }}>3 recent changes</span>
          <span style={{ background: 'rgba(180,83,9,0.35)', color: 'rgba(255,255,255,0.9)', borderRadius: 99, padding: '0.2rem 0.75rem', fontSize: '0.75rem', fontWeight: 600 }}>1 pending review</span>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="tab-list">
        {subNavItems.map(item => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={`/patient/${id}/${item.path}`}
              className={`tab-item ${activeTab === item.path ? 'active' : ''}`}
            >
              <Icon size={14} />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Page routes */}
      <div className="animate-fade-in">
        <Routes>
          <Route path="/" element={<Navigate to="what-changed" replace />} />
          <Route path="timeline"       element={<Timeline />} />
          <Route path="what-changed"   element={<WhatChanged />} />
          <Route path="medications"    element={<MedicationRadar />} />
          <Route path="investigations" element={<Investigations />} />
          <Route path="care-gaps"      element={<CareGaps />} />
          <Route path="contradictions" element={<Contradictions />} />
          <Route path="assistant"      element={<AIAssistant />} />
          <Route path="briefs"         element={<GenerateBrief />} />
          <Route path="audit"          element={<div className="card" style={{ padding: '2rem' }}>Audit logs coming soon.</div>} />
        </Routes>
      </div>
    </div>
  );
}
