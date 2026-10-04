import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, User, Hash, Calendar, HeartPulse, FileText, ArrowRight } from 'lucide-react';

export default function CreatePatient() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate('/upload');
    }, 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: 680, margin: '0 auto', paddingBottom: '3rem' }} className="animate-fade-in">
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Create New Patient</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 460, margin: '0 auto' }}>
          Enter demographic details to start a new clinical continuity record for this patient.
        </p>
      </div>

      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--r-2xl)', boxShadow: 'var(--shadow-md)', overflow: 'hidden',
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Name & ID row */}
            <div className="grid-2">
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, fontFamily: 'Manrope', color: 'var(--text-heading)', marginBottom: '0.5rem' }}>
                  Patient Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="text" required className="input-field" style={{ paddingLeft: '2.5rem' }} placeholder="e.g. Rahul Mehta" />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, fontFamily: 'Manrope', color: 'var(--text-heading)', marginBottom: '0.5rem' }}>
                  Patient ID (MRN)
                </label>
                <div style={{ position: 'relative' }}>
                  <Hash size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="text" required className="input-field" style={{ paddingLeft: '2.5rem' }} placeholder="e.g. RM-8492" />
                </div>
              </div>
            </div>

            {/* DOB & Gender row */}
            <div className="grid-2">
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, fontFamily: 'Manrope', color: 'var(--text-heading)', marginBottom: '0.5rem' }}>
                  Date of Birth
                </label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="date" required className="input-field" style={{ paddingLeft: '2.5rem' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, fontFamily: 'Manrope', color: 'var(--text-heading)', marginBottom: '0.5rem' }}>
                  Gender
                </label>
                <div style={{ position: 'relative' }}>
                  <HeartPulse size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <select required className="input-field" style={{ paddingLeft: '2.5rem', appearance: 'none' }}>
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Notes */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, fontFamily: 'Manrope', color: 'var(--text-heading)', marginBottom: '0.5rem' }}>
                Initial Clinical Context <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <FileText size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: 14 }} />
                <textarea 
                  rows={3} 
                  className="input-field" 
                  style={{ paddingLeft: '2.5rem', resize: 'vertical' }} 
                  placeholder="Enter any brief context before uploading records..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div style={{ 
            padding: '1.25rem 2.5rem', background: 'var(--surface-2)', 
            borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
          }}>
            <button type="button" onClick={() => navigate('/patients')} className="btn btn-ghost" style={{ padding: '0.5rem 1rem' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.625rem 1.25rem' }}>
              {loading ? (
                'Creating Patient...'
              ) : (
                <>
                  <UserPlus size={16} /> Create Patient <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}
