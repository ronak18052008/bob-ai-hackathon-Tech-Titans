import { mockPatient } from '../../data/patientData';
import { Pill, FileText, AlertTriangle } from 'lucide-react';

export default function MedicationRadar() {
  const medications = mockPatient.medications;

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-8">
      <header>
        <h1 className="text-3xl mb-2">Medication Change Radar</h1>
        <p className="text-secondary text-lg m-0">Detected changes in medication documentation.</p>
      </header>

      <div className="surface overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border)' }}>
              <th className="p-4 text-xs font-semibold text-secondary uppercase tracking-wider">Medication</th>
              <th className="p-4 text-xs font-semibold text-secondary uppercase tracking-wider">Previous</th>
              <th className="p-4 text-xs font-semibold text-secondary uppercase tracking-wider">Current</th>
              <th className="p-4 text-xs font-semibold text-secondary uppercase tracking-wider">Change</th>
              <th className="p-4 text-xs font-semibold text-secondary uppercase tracking-wider">Date</th>
              <th className="p-4 text-xs font-semibold text-secondary uppercase tracking-wider">Source Evidence</th>
            </tr>
          </thead>
          <tbody>
            {medications.map((med, idx) => (
              <tr 
                key={idx} 
                className="transition-colors group hover:bg-slate-50"
                style={{ 
                  borderBottom: '1px solid var(--border)',
                  backgroundColor: med.conflict ? 'var(--warning-bg)' : 'transparent'
                }}
              >
                <td className="p-4 font-semibold text-primary">
                  {med.name}
                  {med.conflict && (
                    <div className="flex items-center gap-1 text-xs mt-1" style={{ color: '#92400E' }}>
                      <AlertTriangle className="w-3 h-3" /> Conflict detected
                    </div>
                  )}
                </td>
                <td className="p-4 text-sm text-secondary">{med.previous}</td>
                <td className="p-4 text-sm font-medium text-teal">{med.current}</td>
                <td className="p-4 text-sm font-medium">{med.change}</td>
                <td className="p-4 text-sm text-muted">{med.date}</td>
                <td className="p-4">
                  <span className="source-evidence inline-flex items-center gap-1 cursor-pointer hover:underline">
                    <FileText className="w-3 h-3" /> {med.source}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 rounded-md flex gap-3 text-sm items-start" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <Pill className="w-5 h-5 text-muted flex-shrink-0" />
        <div className="text-secondary">
          <strong>Important:</strong> MedBrief AI only reports what is documented. It does not interpret whether a medication change is medically appropriate. Always verify against primary sources.
        </div>
      </div>
    </div>
  );
}
