import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, File, X, CheckCircle, ShieldCheck, Check } from 'lucide-react';

export default function Upload() {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const navigate = useNavigate();

  const stages = [
    "Upload received",
    "Extracting text",
    "Processing OCR",
    "Detecting clinical entities",
    "Extracting dates and events",
    "Identifying medications",
    "Identifying investigations",
    "Building patient timeline",
    "Comparing previous records",
    "Generating evidence-grounded brief"
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const validTypes = ['application/pdf', 'text/plain', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const validFiles = newFiles.filter(file => validTypes.includes(file.type) || file.name.endsWith('.docx'));
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processFiles = () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setCurrentStage(0);
  };

  useEffect(() => {
    if (isProcessing && currentStage < stages.length) {
      const timer = setTimeout(() => {
        setCurrentStage(prev => prev + 1);
      }, 600); // 600ms per stage for demo purposes
      return () => clearTimeout(timer);
    } else if (isProcessing && currentStage >= stages.length) {
      const timer = setTimeout(() => {
        navigate('/patient/RM-8492/what-changed'); 
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isProcessing, currentStage, navigate, stages.length]);

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto min-h-full animate-fade-in pb-8">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2 text-primary">Upload Patient Records</h1>
        <p className="text-secondary text-lg">Add previous admissions, discharge summaries, lab reports, referral letters, and clinical notes.</p>
      </header>

      {!isProcessing ? (
        <div className="surface-lg p-8 relative">
          <div className="mb-8 p-4 rounded-md text-sm flex gap-3 items-start" style={{ backgroundColor: 'var(--success-bg)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
            <ShieldCheck className="w-5 h-5 text-success flex-shrink-0" />
            <div style={{ color: '#14532d' }}>
              <strong>Privacy First:</strong> Uploaded records are processed in memory and are not persisted to disk. No identifiable health information is stored after your session ends.
            </div>
          </div>

          <div 
            className="rounded-xl p-10 flex flex-col items-center justify-center text-center transition-all"
            style={{ 
              border: `2px dashed ${dragActive ? 'var(--primary)' : 'var(--border)'}`, 
              backgroundColor: dragActive ? 'var(--primary-light)' : 'var(--bg-main)' 
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <UploadCloud className="w-16 h-16 mb-4" style={{ color: dragActive ? 'var(--primary)' : 'var(--text-muted)' }} />
            <h3 className="text-xl mb-2 text-primary font-semibold">Drag & drop files here</h3>
            <p className="text-secondary text-sm mb-6 font-medium">Supported formats: PDF, JPG, PNG, TXT, DOCX</p>
            
            <input type="file" id="file-upload" multiple accept=".pdf,.txt,.jpg,.png,.docx" className="hidden" onChange={handleChange} />
            <label htmlFor="file-upload" className="btn btn-secondary cursor-pointer bg-white">
              Browse Files
            </label>
          </div>

          {files.length > 0 && (
            <div className="mt-8 animate-fade-in">
              <h4 className="text-sm font-semibold text-secondary mb-3 uppercase tracking-wider">Ready to process ({files.length})</h4>
              <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-2">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-md" style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md" style={{ backgroundColor: 'var(--primary-light)' }}>
                        <File className="w-5 h-5 text-teal" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary m-0">{file.name}</p>
                        <p className="text-xs text-muted m-0 mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB &middot; Ready</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFile(idx)}
                      className="p-2 text-muted rounded-md transition-colors bg-transparent border-none cursor-pointer"
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.backgroundColor = 'var(--danger-bg)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <button onClick={processFiles} className="btn btn-primary px-8">
                  <CheckCircle className="w-4 h-4" /> Process Records
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="surface-lg p-10 flex flex-col items-center justify-center animate-fade-in min-h-[400px]">
          <h2 className="text-2xl font-bold mb-8 text-primary">Processing Medical Records</h2>
          
          <div className="w-full max-w-md flex flex-col gap-4">
            {stages.map((stage, idx) => (
              <div 
                key={idx} 
                className={`flex items-center gap-4 transition-all duration-300 ${
                  idx < currentStage ? 'opacity-100 translate-y-0' : 
                  idx === currentStage ? 'opacity-100 translate-y-0' : 
                  'opacity-0 translate-y-4 hidden'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${
                  idx < currentStage ? 'bg-green-100 text-green-600' : 
                  'bg-blue-100 text-blue-600 border-2 border-blue-600 border-r-transparent animate-spin'
                }`}
                style={idx < currentStage ? { backgroundColor: 'var(--success-bg)', color: 'var(--success)' } : {}}
                >
                  {idx < currentStage ? <Check className="w-5 h-5" /> : <div className="w-full h-full rounded-full border-2 border-accent border-r-transparent animate-spin"></div>}
                </div>
                <span className={`text-sm font-medium ${idx < currentStage ? 'text-secondary' : 'text-primary font-bold'}`}>
                  {stage}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
