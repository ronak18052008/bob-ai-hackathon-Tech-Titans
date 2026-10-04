import { mockPatient } from '../../data/patientData';
import { FileText, SplitSquareHorizontal } from 'lucide-react';

export default function Contradictions() {
  const contradictions = mockPatient.contradictions;

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-8">
      <header>
        <h1 className="text-3xl mb-2">Contradiction Detector</h1>
        <p className="text-secondary text-lg m-0">Identifying conflicting clinical information across different documents.</p>
      </header>

      <div className="grid gap-6">
        {contradictions.map((conflict, idx) => (
          <div key={idx} className="surface p-6 flex flex-col gap-4 border-l-4" style={{ borderLeftColor: 'var(--danger)' }}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold m-0" style={{ color: 'var(--danger)' }}>Potential Inconsistency: {conflict.title}</h3>
                <p className="text-sm font-medium mt-1 text-secondary">{conflict.desc}</p>
              </div>
              <span className="badge badge-danger text-xs px-3 py-1 bg-red-100 text-red-700">REVIEW REQUIRED</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mt-2">
              <div className="p-4 rounded-md" style={{ backgroundColor: 'var(--danger-bg)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <h4 className="text-sm font-bold text-danger mb-2 flex items-center gap-2">
                  Document A
                </h4>
                <p className="font-mono text-sm mb-3" style={{ color: '#991B1B' }}>"{conflict.docA.text}"</p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-xs text-danger font-medium"><FileText className="w-3 h-3 inline" /> {conflict.docA.name}</span>
                  <button className="btn btn-secondary !py-1 !px-2 !text-xs">View Document</button>
                </div>
              </div>
              
              <div className="p-4 rounded-md" style={{ backgroundColor: 'var(--danger-bg)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <h4 className="text-sm font-bold text-danger mb-2 flex items-center gap-2">
                  Document B
                </h4>
                <p className="font-mono text-sm mb-3" style={{ color: '#991B1B' }}>"{conflict.docB.text}"</p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-xs text-danger font-medium"><FileText className="w-3 h-3 inline" /> {conflict.docB.name}</span>
                  <button className="btn btn-secondary !py-1 !px-2 !text-xs">View Document</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-md flex gap-3 text-sm items-start" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <SplitSquareHorizontal className="w-5 h-5 text-muted flex-shrink-0" />
        <div className="text-secondary">
          <strong>Important Clinical Note:</strong> The AI identifies potential discrepancies in text but <strong>never</strong> decides which record is correct. Please verify against the original clinical record to determine the ground truth.
        </div>
      </div>
    </div>
  );
}
