import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

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
    <div className="flex flex-col gap-6 max-w-2xl mx-auto min-h-full animate-fade-in pb-8">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2 text-primary">Create New Patient</h1>
        <p className="text-secondary text-lg">Enter demographic details to start a new clinical continuity record.</p>
      </header>

      <div className="surface-lg p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-primary">Patient Name</label>
              <input type="text" required className="p-3 rounded-md border text-sm focus:outline-none focus:ring-2" style={{ borderColor: 'var(--border)' }} placeholder="e.g. John Doe" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-primary">Patient ID (MRN)</label>
              <input type="text" required className="p-3 rounded-md border text-sm focus:outline-none focus:ring-2" style={{ borderColor: 'var(--border)' }} placeholder="e.g. HOSP-12345" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-primary">Date of Birth</label>
              <input type="date" required className="p-3 rounded-md border text-sm focus:outline-none focus:ring-2" style={{ borderColor: 'var(--border)' }} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-primary">Gender</label>
              <select required className="p-3 rounded-md border text-sm focus:outline-none focus:ring-2 bg-white" style={{ borderColor: 'var(--border)' }}>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-primary">Optional Notes</label>
            <textarea rows={3} className="p-3 rounded-md border text-sm focus:outline-none focus:ring-2" style={{ borderColor: 'var(--border)' }} placeholder="Enter any initial clinical context..."></textarea>
          </div>

          <div className="pt-6 border-t mt-2 flex justify-end gap-4" style={{ borderColor: 'var(--border)' }}>
            <button type="button" onClick={() => navigate('/patients')} className="btn btn-secondary px-6">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary px-8">
              <UserPlus className="w-4 h-4" /> {loading ? 'Creating...' : 'Create Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
