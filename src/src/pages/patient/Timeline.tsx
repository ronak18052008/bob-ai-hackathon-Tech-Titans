import { mockPatient } from '../../data/patientData';
import { FileText } from 'lucide-react';

export default function Timeline() {
  const timeline = mockPatient.timeline;

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-8">
      <header>
        <h1 className="text-3xl mb-2">Clinical Timeline</h1>
        <p className="text-secondary text-lg m-0">Chronological history extracted from unstructured records.</p>
      </header>

      <div className="surface p-8 max-w-4xl">
        <div className="relative border-l-2 ml-4 space-y-10" style={{ borderColor: 'var(--border)' }}>
          {timeline.map((event, idx) => (
            <div key={idx} className="relative pl-8 group">
              <div 
                className="absolute w-4 h-4 rounded-full -left-[9px] top-1 transition-transform group-hover:scale-125" 
                style={{ backgroundColor: 'var(--bg-surface)', border: '4px solid var(--primary)' }}
              ></div>
              
              <div className="text-sm font-bold text-teal mb-2">{event.date}</div>
              
              <div className="surface p-5" style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="badge badge-neutral bg-white border">{event.type}</span>
                  <h3 className="text-lg m-0 font-semibold">{event.title}</h3>
                </div>
                
                <p className="text-secondary text-sm mb-4">{event.desc}</p>
                
                <div className="flex justify-between items-center border-t pt-3 mt-3" style={{ borderColor: 'var(--border)' }}>
                  <span className="source-evidence inline-flex items-center gap-1 cursor-pointer hover:underline">
                    <FileText className="w-3 h-3" />
                    Source: {event.source} (Page {event.page})
                  </span>
                  <button className="text-xs font-semibold text-teal hover:underline border-none bg-transparent cursor-pointer">
                    View Document
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
