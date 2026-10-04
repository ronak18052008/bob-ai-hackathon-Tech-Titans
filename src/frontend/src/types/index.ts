export type Role =
  | 'Doctor'
  | 'Senior Doctor / Reviewer'
  | 'Department Admin'
  | 'Records Manager'
  | 'System Administrator';

export type Theme = 'light' | 'dark' | 'system';

export type DocumentType =
  | 'Discharge Summary'
  | 'Prescription'
  | 'Lab Report'
  | 'Radiology'
  | 'Referral'
  | 'Consultation'
  | 'Admission Note'
  | 'Follow-up'
  | 'Other';

export type DocumentStatus =
  | 'New'
  | 'Processing'
  | 'Processed'
  | 'Needs Review'
  | 'Verified'
  | 'Conflict'
  | 'Duplicate';

export type EvidenceState =
  | 'DIRECTLY DOCUMENTED'
  | 'MULTI-SOURCE SUPPORTED'
  | 'INFERRED — REVIEW REQUIRED'
  | 'CONFLICTING'
  | 'NOT FOUND';

export type VerificationState =
  | 'AI GENERATED'
  | 'SOURCE BACKED'
  | 'DOCTOR VERIFIED'
  | 'FLAGGED'
  | 'REJECTED';

export type EventType =
  | 'Admission'
  | 'Discharge'
  | 'Investigation'
  | 'Diagnosis'
  | 'Treatment'
  | 'Medication Change'
  | 'Follow-up'
  | 'Referral'
  | 'Procedure';

export interface EvidenceSource {
  documentId: string;
  documentTitle: string;
  documentType: DocumentType;
  date: string;
  page: number;
  section: string;
  exactText: string;
  ocrConfidence?: number;
  evidenceState: EvidenceState;
}

export interface Patient {
  id: string;
  mrn: string;
  abhaId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  primaryCondition: string;
  archetype: string; // e.g. "Patient A: Multiple Admissions"
  lastDocumentedDate: string;
  completenessScore: number; // 0-100%
  activeConflictsCount: number;
  pendingGapsCount: number;
  unreadNotesCount: number;
  assignedDoctor: string;
  summaryHighlights: string[];
}

export interface ClinicalDocument {
  id: string;
  patientId: string;
  title: string;
  documentType: DocumentType;
  dateDocumented: string;
  uploadDate: string;
  authorInstitution: string;
  status: DocumentStatus;
  ocrConfidence: number;
  fileName: string;
  fileSizeBytes: number;
  version: number;
  isDuplicate?: boolean;
  duplicateOfTitle?: string;
  summary: string;
  rawText: string;
}

export interface ClinicalEvent {
  id: string;
  patientId: string;
  eventDate: string;
  eventType: EventType;
  title: string;
  description: string;
  department: string;
  doctor: string;
  evidenceState: EvidenceState;
  verificationState: VerificationState;
  documentId: string;
  documentTitle: string;
  pageNumber: number;
  sectionName: string;
  exactSourceText: string;
  aiInterpretation: string;
  whyHereExplanation?: string;
}

export interface MedicationEvolutionItem {
  id: string;
  patientId: string;
  drugName: string;
  dose: string;
  frequency: string;
  route: string;
  status: 'Started' | 'Dose Changed' | 'Continued' | 'Stopped' | 'Restarted';
  startDate: string;
  stopDate?: string;
  documentedReason: string;
  sourceDocumentTitle: string;
  pageNumber: number;
  exactSourceText: string;
  verificationState: VerificationState;
}

export interface InvestigationItem {
  id: string;
  patientId: string;
  testName: string;
  category: 'Lab' | 'Radiology' | 'Cardiac' | 'Biopsy';
  orderDate: string;
  resultDate?: string;
  resultValue?: string;
  referenceRange?: string;
  status:
    | 'Ordered'
    | 'Pending'
    | 'Completed'
    | 'Normal'
    | 'Abnormal'
    | 'Critical'
    | 'Follow-up documented'
    | 'Follow-up not documented'
    | 'Result unavailable';
  followUpDocumented: boolean;
  followUpNotes?: string;
  sourceDocumentTitle: string;
  exactSourceText: string;
}

export interface DocumentationConflict {
  id: string;
  patientId: string;
  conflictType: string;
  description: string;
  sourceA: {
    documentTitle: string;
    date: string;
    page: number;
    text: string;
  };
  sourceB: {
    documentTitle: string;
    date: string;
    page: number;
    text: string;
  };
  resolutionStatus: 'Unresolved' | 'Doctor Confirmed' | 'Rejected';
  resolvedBy?: string;
  resolvedAt?: string;
  resolutionNote?: string;
}

export interface DocumentationGap {
  id: string;
  patientId: string;
  gapType: string;
  title: string;
  description: string;
  referencingDocument: string;
  referencingDate: string;
  referencingPage: number;
  exactReferenceText: string;
  missingItem: string;
  evidenceState: EvidenceState;
  doctorAction: string;
  status: 'Open' | 'Acknowledged' | 'Resolved';
}

export interface NarrativeSection {
  id: string;
  phaseTitle: string;
  dateRange: string;
  content: string;
  evidenceState: EvidenceState;
  citations: {
    documentTitle: string;
    page: number;
    section: string;
    sourceText: string;
  }[];
}

export interface ChangeLensItem {
  id: string;
  category: 'NEW' | 'REMOVED' | 'CHANGED' | 'REPEATED' | 'CONFLICTING' | 'UNRESOLVED';
  title: string;
  priorState: string;
  currentState: string;
  documentedReason: string;
  evidenceSource: string;
}

export interface ReviewQueueItem {
  id: string;
  patientId: string;
  patientName: string;
  category:
    | 'Conflicting documents'
    | 'Low OCR confidence'
    | 'Missing evidence'
    | 'Medication conflicts'
    | 'Temporal anomalies'
    | 'Unverified AI insights'
    | 'New documents'
    | 'Referral drafts';
  title: string;
  details: string;
  status: 'Pending' | 'Verified' | 'Rejected' | 'Snoozed';
  assignedTo: string;
  createdAt: string;
  doctorNotes?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userName: string;
  userRole: Role;
  action: string;
  patientId?: string;
  details: string;
  ipAddress: string;
}
