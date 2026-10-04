import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PATIENT_A_DETAILS } from '../data/mockPatients';
import { ClinicalDocument } from '../types';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Clock,
  ArrowRight,
  Filter,
  FileCheck2,
  ShieldCheck,
  Search,
} from 'lucide-react';

export const DocumentInboxView: React.FC = () => {
  const { selectedPatient, setActiveEvidenceSnippet, setSelectedDocument, setActiveTab, addAuditLog, setIsScannerOpen } = useApp();
  const [documents, setDocuments] = useState<ClinicalDocument[]>(PATIENT_A_DETAILS.documents);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          // Append synthetic uploaded doc
          const newDoc: ClinicalDocument = {
            id: `doc-${Date.now()}`,
            patientId: selectedPatient.id,
            title: 'Diagnostic Echocardiography Report — Central Echo Lab',
            documentType: 'Radiology',
            dateDocumented: '2026-09-16',
            uploadDate: '2026-10-03',
            authorInstitution: 'Metro Central Echocardiography Lab',
            status: 'Verified',
            ocrConfidence: 0.99,
            fileName: 'Formal_Echo_CentralLab_Sep16.pdf',
            fileSizeBytes: 1840000,
            version: 1,
            summary: 'Transthoracic 2D Echo confirms LVEF 31%, global hypokinesis, moderate MR, and elevated pulmonary pressures. Successfully resolves open documentation gap.',
            rawText: `METRO CENTRAL ECHOCARDIOGRAPHY LAB
FORMAL TRANSTHORACIC ECHOCARDIOGRAM REPORT
Date: 16-Sep-2026 | Operator: Dr. S. K. Deshmukh, FASE
Patient: Rajesh Kumar | MRN: SYN-MRN-9021

MEASUREMENTS:
- Left Ventricular Internal Diameter End-Diastole (LVIDd): 6.2 cm (Dilated)
- Left Ventricular Ejection Fraction (LVEF): 31% (Biplane Simpson method)
- Mitral Valve: Moderate functional regurgitation (regurgitant jet area 6.4 cm2)
- Tricuspid Regurgitation: Peak velocity 3.4 m/s (Estimated PASP 48 mmHg)
CONCLUSION: Severely depressed global left ventricular systolic function with secondary pulmonary hypertension.`,
          };
          setDocuments((prev) => [newDoc, ...prev]);
          addAuditLog('DOCUMENT_UPLOADED', `Uploaded and parsed formal Echo report: ${newDoc.title}`);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'bg-success-soft text-success border-success/30';
      case 'Needs Review':
        return 'bg-warning-soft text-warning border-warning/30';
      case 'Conflict':
        return 'bg-error-soft text-error border-error/30';
      case 'Duplicate':
        return 'bg-surface-secondary text-text-muted border-border';
      default:
        return 'bg-primary-soft text-primary border-primary/30';
    }
  };

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase font-bold tracking-wider text-primary">
            Multimodal Document Pipeline &amp; Ingestion
          </div>
          <h1 className="text-xl font-extrabold text-text-primary">
            Smart Document Inbox: {selectedPatient.name}
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Automated classification, layout analysis, duplicate detection, and version control for incoming medical records.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setIsScannerOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-white text-xs font-bold shadow transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <FileCheck2 className="w-4 h-4 text-cyan-200" />
            <span>Scan &amp; Summarize Document</span>
          </button>

          <button
            onClick={simulateUpload}
            disabled={isUploading}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-text-primary text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            <UploadCloud className="w-4 h-4 text-primary" />
            <span>{isUploading ? `Extracting (${uploadProgress}%)...` : 'Quick Upload'}</span>
          </button>
        </div>
      </div>

      {/* Upload Zone / Pipeline Display */}
      {isUploading && (
        <div className="p-4 rounded-xl border border-primary/40 bg-primary-soft/30 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between text-xs font-semibold text-primary">
            <span>OCR Extraction &amp; Entity Classification in Progress</span>
            <span className="font-mono">{uploadProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Documents Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-text-muted">
          <span>{documents.length} Clinical Documents Ingested</span>
          <span className="text-[11px] font-mono">Archive: Metro Heart Central EMR</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-2xl border border-border bg-surface shadow-subtle flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">
                    {doc.documentType}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono text-text-muted">
                      OCR: {Math.round(doc.ocrConfidence * 100)}%
                    </span>
                    <span
                      className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                        doc.status
                      )}`}
                    >
                      {doc.status}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-text-primary">{doc.title}</h3>
                <div className="text-[11px] text-text-muted font-medium mt-0.5">
                  {doc.authorInstitution} • {doc.dateDocumented}
                </div>

                <p className="text-xs text-text-secondary mt-2 line-clamp-3 leading-relaxed">
                  {doc.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono text-text-muted">
                  Version {doc.version} • {(doc.fileSizeBytes / 1000000).toFixed(1)} MB
                </span>

                <button
                  onClick={() => {
                    setSelectedDocument(doc);
                    setActiveEvidenceSnippet({
                      title: doc.title,
                      text: doc.summary,
                      page: 1,
                      docTitle: doc.title,
                      state: 'DIRECTLY DOCUMENTED',
                    });
                    setActiveTab('synapse');
                  }}
                  className="text-primary hover:underline text-xs font-bold flex items-center space-x-1"
                >
                  <span>Open in Synapse View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default DocumentInboxView;
