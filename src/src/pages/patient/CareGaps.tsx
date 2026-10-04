import { mockPatient } from '../../data/patientData';
import { AlertTriangle, FileText } from 'lucide-react';

export default function CareGaps() {
  const gaps = mockPatient.careGaps;

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-8">
      <header>
        <h1 className="text-3xl mb-2">Documented Follow-up & Outstanding Items</h1>
        <p className="text-secondary text-lg m-0">Items explicitly mentioned in records that appear pending.</p>
      </header>

      <div className="grid gap-4">
        {gaps.map((gap, idx) => (
          <div key={idx} className="surface p-6 flex flex-col gap-4 border-l-4" style={{ borderLeftColor: 'var(--warning)' }}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold m-0" style={{ color: 'var(--text-primary)' }}>{gap.title}</h3>
                <p className="text-sm font-medium mt-1" style={{ color: '#92400E' }}>Status: {gap.status}</p>
                <p className="text-sm text-secondary m-0">{gap.date}</p>
              </div>
              <span className="badge badge-warning">ATTENTION</span>
            </div>
            
            <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <span className="source-evidence inline-flex items-center gap-1 cursor-pointer hover:underline">
                <FileText className="w-3 h-3" /> Source: {gap.source} (Page {gap.page})
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-md flex gap-3 text-sm items-start" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <AlertTriangle className="w-5 h-5 text-muted flex-shrink-0" />
        <div className="text-secondary">
          <strong>Important Clinical Note:</strong> This tool only detects items explicitly documented as pending, requested, or awaited. It does not claim something was medically missed or dictate clinical care. 
        </div>
      </div>
    </div>
  );
}
