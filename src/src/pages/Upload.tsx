import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, X, CheckCircle2, ShieldCheck, FileText, Check } from 'lucide-react';

const stages = [
  { label: 'Reading documents',            icon: '📄' },
  { label: 'Extracting clinical information', icon: '🔍' },
  { label: 'Building timeline',            icon: '📅' },
  { label: 'Comparing records',            icon: '🔄' },
  { label: 'Checking consistency',         icon: '⚖️' },
  { label: 'Preparing evidence',           icon: '📎' },
  { label: 'Generating clinical brief',    icon: '✨' },
];

export default function Upload() {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const navigate = useNavigate();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files[0]) handleFiles(Array.from(e.dataTransfer.files));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFiles(Array.from(e.target.files));
  };

  const handleFiles = (newFiles: File[]) => {
    const valid = ['application/pdf', 'text/plain', 'image/jpeg', 'image/png',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    setFiles(prev => [...prev, ...newFiles.filter(f => valid.includes(f.type) || f.name.endsWith('.docx'))]);
  };

  const removeFile = (i: number) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  const processFiles = () => {
    if (!files.length) return;
    setIsProcessing(true);
    setCurrentStage(0);
  };

  useEffect(() => {
    if (!isProcessing) return;
    if (currentStage < stages.length) {
      const t = setTimeout(() => setCurrentStage(p => p + 1), 700);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => navigate('/patient/RM-8492/what-changed'), 1200);
      return () => clearTimeout(t);
    }
  }, [isProcessing, currentStage, navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: 760, margin: '0 auto', paddingBottom: '3rem' }} className="animate-fade-in">

      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Bring the patient's records together.</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 520, margin: '0 auto' }}>
          Upload multiple documents and let MedBrief organize the clinical story.
        </p>
      </div>

      {!isProcessing ? (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-2xl)', boxShadow: 'var(--shadow-md)', overflow: 'hidden',
        }}>
          {/* Privacy notice */}
          <div style={{
            padding: '0.875rem 1.5rem',
            background: 'var(--mint)', borderBottom: '1px solid var(--mint-border)',
            display: 'flex', alignItems: 'center', gap: '0.625rem',
          }}>
            <ShieldCheck size={15} color="var(--teal)" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--text-heading)' }}>Privacy first.</strong> Records are processed in memory and are not stored after your session ends.
            </p>
          </div>

          <div style={{ padding: '2rem' }}>
            {/* Drop zone */}
            <div
              onDragEnter={handleDrag} onDragLeave={handleDrag}
              onDragOver={handleDrag} onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragActive ? 'var(--teal)' : 'var(--border)'}`,
                borderRadius: 'var(--r-xl)',
                padding: '3rem 2rem', textAlign: 'center',
                background: dragActive ? 'var(--teal-light)' : 'var(--surface-3)',
                transition: 'all 0.2s var(--ease)',
              }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: dragActive ? 'var(--teal)' : 'var(--surface)',
                border: `1px solid ${dragActive ? 'var(--teal)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.25rem',
                transition: 'all 0.2s',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <UploadCloud size={24} color={dragActive ? '#fff' : 'var(--text-muted)'} />
              </div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.4rem' }}>
                {dragActive ? 'Drop files here' : 'Drag & drop patient records'}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                Supports PDF, JPG, PNG, TXT, DOCX
              </p>
              <input type="file" id="file-upload" multiple accept=".pdf,.txt,.jpg,.png,.docx" style={{ display: 'none' }} onChange={handleChange} />
              <label htmlFor="file-upload" className="btn btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex' }}>
                Browse Files
              </label>
            </div>

            {/* File list */}
            {files.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Manrope', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
                  Ready to process ({files.length})
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', maxHeight: 240, overflowY: 'auto' }}>
                  {files.map((file, idx) => (
                    <div key={idx} style={{
                      display: 'flex', alignItems: 'center', gap: '0.875rem',
                      padding: '0.75rem 1rem', borderRadius: 'var(--r-md)',
                      background: 'var(--surface-3)', border: '1px solid var(--border)',
                    }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FileText size={15} color="var(--teal)" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-heading)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                      </div>
                      <button onClick={() => removeFile(idx)} style={{
                        border: 'none', background: 'transparent', cursor: 'pointer',
                        color: 'var(--text-muted)', padding: '0.25rem', borderRadius: 6,
                        display: 'flex', alignItems: 'center',
                        transition: 'color 0.15s, background 0.15s',
                      }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--danger)'; (e.currentTarget as HTMLElement).style.background = 'var(--danger-bg)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                  <button onClick={processFiles} className="btn btn-primary">
                    <CheckCircle2 size={15} /> Process Records
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Processing state */
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-2xl)', boxShadow: 'var(--shadow-md)',
          padding: '3rem 2rem', textAlign: 'center',
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>Processing Medical Records</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
              MedBrief is reading and organising your patient's clinical story.
            </p>
          </div>

          {/* Progress bar */}
          <div style={{
            height: 4, background: 'var(--surface-3)', borderRadius: 99,
            margin: '0 auto 2.5rem', maxWidth: 480, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', borderRadius: 99, background: 'var(--teal)',
              width: `${Math.min(100, (currentStage / stages.length) * 100)}%`,
              transition: 'width 0.6s var(--ease)',
            }} />
          </div>

          {/* Stage list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 440, margin: '0 auto', textAlign: 'left' }}>
            {stages.map((stage, idx) => {
              const done = idx < currentStage;
              const active = idx === currentStage;
              if (!done && !active) return null;
              return (
                <div key={idx} className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', opacity: done ? 0.7 : 1 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: done ? 'var(--success-bg)' : 'var(--teal-light)',
                    border: `1px solid ${done ? 'var(--success-border)' : 'var(--teal-mid)'}`,
                    fontSize: '0.875rem',
                  }}>
                    {done ? <Check size={15} color="var(--success)" /> : <span>{stage.icon}</span>}
                  </div>
                  <span style={{
                    fontSize: '0.9375rem', fontWeight: active ? 700 : 500,
                    color: active ? 'var(--text-heading)' : 'var(--text-secondary)',
                    fontFamily: active ? 'Manrope' : 'inherit',
                  }}>
                    {stage.label}
                  </span>
                  {active && (
                    <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
                      {[0, 1, 2].map(d => (
                        <div key={d} className="typing-dot" style={{ animationDelay: `${d * 180}ms`, background: 'var(--teal)' }} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {currentStage >= stages.length && (
              <div className="animate-scale-in" style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--success)', fontFamily: 'Manrope', fontWeight: 700, fontSize: '1.0625rem' }}>
                ✓ Your patient's clinical brief is ready!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
