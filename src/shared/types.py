"""
MedSynapse AI — Shared Enumerations and Data Transfer Models
"""
from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class UserRole(str, Enum):
    DOCTOR = "Doctor"
    SENIOR_DOCTOR = "Senior Doctor / Reviewer"
    DEPARTMENT_ADMIN = "Department Admin"
    RECORDS_MANAGER = "Records Manager"
    SYSTEM_ADMIN = "System Administrator"

class DocumentTypeEnum(str, Enum):
    DISCHARGE_SUMMARY = "Discharge Summary"
    PRESCRIPTION = "Prescription"
    LAB_REPORT = "Lab Report"
    RADIOLOGY = "Radiology"
    REFERRAL = "Referral"
    CONSULTATION = "Consultation"
    ADMISSION_NOTE = "Admission Note"
    FOLLOW_UP = "Follow-up"
    OTHER = "Other"

class DocumentStatusEnum(str, Enum):
    NEW = "New"
    PROCESSING = "Processing"
    PROCESSED = "Processed"
    NEEDS_REVIEW = "Needs Review"
    VERIFIED = "Verified"
    CONFLICT = "Conflict"
    DUPLICATE = "Duplicate"

class EvidenceStateEnum(str, Enum):
    DIRECTLY_DOCUMENTED = "DIRECTLY DOCUMENTED"
    MULTI_SOURCE_SUPPORTED = "MULTI-SOURCE SUPPORTED"
    INFERRED_REVIEW_REQUIRED = "INFERRED — REVIEW REQUIRED"
    CONFLICTING = "CONFLICTING"
    NOT_FOUND = "NOT FOUND"

class VerificationStateEnum(str, Enum):
    AI_GENERATED = "AI GENERATED"
    SOURCE_BACKED = "SOURCE BACKED"
    DOCTOR_VERIFIED = "DOCTOR VERIFIED"
    FLAGGED = "FLAGGED"
    REJECTED = "REJECTED"

class ConflictTypeEnum(str, Enum):
    MEDICATION_DOSE = "Medication Dose Discrepancy"
    MEDICATION_FREQUENCY = "Medication Frequency Mismatch"
    ALLERGY_MISMATCH = "Documented Allergy Discrepancy"
    DIAGNOSIS_DISCREPANCY = "Diagnosis Coding Inconsistency"
    TEMPORAL_ANOMALY = "Temporal Documentation Anomaly"
    ADMISSION_OVERLAP = "Overlapping Admission Dates"

class GapTypeEnum(str, Enum):
    MISSING_REPORT = "Referenced Report Unavailable"
    RESULT_WITHOUT_FOLLOWUP = "Abnormal Result Lacks Follow-up"
    REFERRAL_OUTCOME_UNAVAILABLE = "Referral Outcome Not Documented"
    MED_CHANGE_WITHOUT_REASON = "Medication Changed Without Documented Reason"
    PREVIOUS_ADMISSION_UNAVAILABLE = "Referenced Prior Admission Record Missing"
    UNRESOLVED_CONFLICT = "Unresolved Source Contradiction"

class EventTypeEnum(str, Enum):
    ADMISSION = "Admission"
    DISCHARGE = "Discharge"
    INVESTIGATION = "Investigation"
    DIAGNOSIS = "Diagnosis"
    TREATMENT = "Treatment"
    MEDICATION_CHANGE = "Medication Change"
    FOLLOW_UP = "Follow-up"
    REFERRAL = "Referral"
    PROCEDURE = "Procedure"

class MedicationStatusEnum(str, Enum):
    STARTED = "Started"
    DOSE_CHANGED = "Dose Changed"
    CONTINUED = "Continued"
    STOPPED = "Stopped"
    RESTARTED = "Restarted"

class EvidenceReference(BaseModel):
    document_id: str
    document_title: str
    document_type: str
    date: str
    page: int
    section: str
    exact_text: str
    evidence_state: EvidenceStateEnum
    ocr_confidence: Optional[float] = 0.98

class StructuredAIClaim(BaseModel):
    claim_id: str
    claim: str
    status: VerificationStateEnum
    evidence_state: EvidenceStateEnum
    evidence: List[EvidenceReference]
    requires_review: bool
    doctor_action_taken: Optional[str] = None
    why_here_explanation: Optional[str] = None
