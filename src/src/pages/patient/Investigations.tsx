import { mockPatient } from '../../data/patientData';
import { ListChecks, FileText } from 'lucide-react';

export default function Investigations() {
  const investigations = mockPatient.investigations;

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-8">
      <header>
        <h1 className="text-3xl mb-2">Investigation Tracker</h1>
        <p className="text-secondary text-lg m-0">Track documented laboratory and imaging studies.</p>
      </header>

      <div className="surface overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border)' }}>
              <th className="p-4 text-xs font-semibold text-secondary uppercase tracking-wider">Investigation</th>
              <th className="p-4 text-xs font-semibold text-secondary uppercase tracking-wider">Date</th>
              <th className="p-4 text-xs font-semibold text-secondary uppercase tracking-wider">Status</th>
              <th className="p-4 text-xs font-semibold text-secondary uppercase tracking-wider">Result Summary</th>
              <th className="p-4 text-xs font-semibold text-secondary uppercase tracking-wider">Source Evidence</th>
            </tr>
          </thead>
          <tbody>
            {investigations.map((inv, idx) => (
              <tr 
                key={idx} 
                className="transition-colors hover:bg-slate-50"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <td className="p-4 font-semibold text-primary">{inv.name}</td>
                <td className="p-4 text-sm text-secondary">{inv.date}</td>
                <td className="p-4">
                  <span className={`badge ${inv.status === 'Result Available' ? 'badge-success' : 'badge-warning'}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="p-4 text-sm font-medium">{inv.result}</td>
                <td className="p-4">
                  <span className="source-evidence inline-flex items-center gap-1 cursor-pointer hover:underline">
                    <FileText className="w-3 h-3" /> {inv.source}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 rounded-md flex gap-3 text-sm items-start" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <ListChecks className="w-5 h-5 text-muted flex-shrink-0" />
        <div className="text-secondary">
          <strong>Note:</strong> Result summaries are extracted from unstructured notes. They may not represent the complete final verified report. Always view the source document for clinical decision-making.
        </div>
      </div>
    </div>
  );
}
