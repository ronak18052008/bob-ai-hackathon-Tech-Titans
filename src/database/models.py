"""
MedSynapse AI — Database Models (SQLAlchemy ORM)
Covers all entities specified in Section 88 of the build specification.
"""
from datetime import datetime
import json
from sqlalchemy import (
    Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Float
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Organization(Base):
    __tablename__ = "organizations"
    id = Column(String(50), primary_key=True)
    name = Column(String(100), nullable=False)
    facility_code = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship("User", back_populates="organization")
    patients = relationship("Patient", back_populates="organization")

class Department(Base):
    __tablename__ = "departments"
    id = Column(String(50), primary_key=True)
    name = Column(String(100), nullable=False)
    code = Column(String(20))
    organization_id = Column(String(50), ForeignKey("organizations.id"))

class User(Base):
    __tablename__ = "users"
    id = Column(String(50), primary_key=True)
    email = Column(String(100), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    role = Column(String(50), nullable=False) # Doctor, Senior Doctor, Admin, Records Manager
    organization_id = Column(String(50), ForeignKey("organizations.id"))
    hashed_password = Column(String(255), nullable=False)
    department = Column(String(100))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    organization = relationship("Organization", back_populates="users")

class Patient(Base):
    __tablename__ = "patients"
    id = Column(String(50), primary_key=True)
    mrn = Column(String(50), unique=True, nullable=False)
    abha_id = Column(String(50), nullable=True) # Synthetic ABHA for ABDM readiness
    name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False)
    blood_group = Column(String(10))
    primary_condition = Column(String(200))
    archetype = Column(String(50)) # e.g. "Patient A: Multiple Admissions", "Patient C: Documentation Conflicts"
    organization_id = Column(String(50), ForeignKey("organizations.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    organization = relationship("Organization", back_populates="patients")
    admissions = relationship("Admission", back_populates="patient", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="patient", cascade="all, delete-orphan")
    events = relationship("ClinicalEvent", back_populates="patient", cascade="all, delete-orphan")
    medications = relationship("Medication", back_populates="patient", cascade="all, delete-orphan")
    investigations = relationship("Investigation", back_populates="patient", cascade="all, delete-orphan")
    conflicts = relationship("Conflict", back_populates="patient", cascade="all, delete-orphan")
    gaps = relationship("Gap", back_populates="patient", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="patient", cascade="all, delete-orphan")

class Admission(Base):
    __tablename__ = "admissions"
    id = Column(String(50), primary_key=True)
    patient_id = Column(String(50), ForeignKey("patients.id"), nullable=False)
    admission_number = Column(String(50))
    admission_date = Column(DateTime, nullable=False)
    discharge_date = Column(DateTime, nullable=True)
    department = Column(String(100))
    attending_physician = Column(String(100))
    primary_diagnosis = Column(String(255))
    discharge_disposition = Column(String(100))
    summary = Column(Text)

    patient = relationship("Patient", back_populates="admissions")

class Document(Base):
    __tablename__ = "documents"
    id = Column(String(50), primary_key=True)
    patient_id = Column(String(50), ForeignKey("patients.id"), nullable=False)
    title = Column(String(200), nullable=False)
    document_type = Column(String(50), nullable=False) # Discharge Summary, Prescription, Lab Report, etc.
    status = Column(String(50), default="Processed")
    file_name = Column(String(255))
    file_size_bytes = Column(Integer, default=0)
    file_hash = Column(String(64)) # Duplicate detection
    date_documented = Column(DateTime)
    upload_date = Column(DateTime, default=datetime.utcnow)
    uploaded_by = Column(String(100))
    author_institution = Column(String(150))
    ocr_confidence = Column(Float, default=0.98)
    ocr_text = Column(Text)
    raw_content = Column(Text)
    version = Column(Integer, default=1)
    is_duplicate = Column(Boolean, default=False)
    duplicate_of_id = Column(String(50), nullable=True)

    patient = relationship("Patient", back_populates="documents")
    versions = relationship("DocumentVersion", back_populates="document", cascade="all, delete-orphan")

class DocumentVersion(Base):
    __tablename__ = "document_versions"
    id = Column(String(50), primary_key=True)
    document_id = Column(String(50), ForeignKey("documents.id"), nullable=False)
    version_number = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    source_attribution = Column(String(100))
    diff_summary = Column(Text)

    document = relationship("Document", back_populates="versions")

class ClinicalEvent(Base):
    __tablename__ = "clinical_events"
    id = Column(String(50), primary_key=True)
    patient_id = Column(String(50), ForeignKey("patients.id"), nullable=False)
    event_date = Column(DateTime, nullable=False)
    event_type = Column(String(50), nullable=False) # Admission, Investigation, Diagnosis, Treatment, etc.
    title = Column(String(200), nullable=False)
    description = Column(Text)
    department = Column(String(100))
    doctor = Column(String(100))
    evidence_state = Column(String(50), default="DIRECTLY DOCUMENTED")
    verification_state = Column(String(50), default="SOURCE BACKED")
    document_id = Column(String(50), ForeignKey("documents.id"), nullable=True)
    page_number = Column(Integer, default=1)
    section_name = Column(String(100), default="Clinical Notes")
    exact_source_text = Column(Text)
    ai_interpretation = Column(Text)

    patient = relationship("Patient", back_populates="events")

class Medication(Base):
    __tablename__ = "medications"
    id = Column(String(50), primary_key=True)
    patient_id = Column(String(50), ForeignKey("patients.id"), nullable=False)
    drug_name = Column(String(150), nullable=False)
    dose = Column(String(50), nullable=False)
    frequency = Column(String(50), nullable=False)
    route = Column(String(50), default="Oral")
    status = Column(String(50), nullable=False) # Started, Dose Changed, Continued, Stopped, Restarted
    start_date = Column(DateTime)
    stop_date = Column(DateTime, nullable=True)
    documented_reason = Column(String(255))
    source_document_id = Column(String(50), ForeignKey("documents.id"), nullable=True)
    source_document_title = Column(String(150))
    page_number = Column(Integer, default=1)
    exact_source_text = Column(Text)
    verification_state = Column(String(50), default="SOURCE BACKED")

    patient = relationship("Patient", back_populates="medications")

class Investigation(Base):
    __tablename__ = "investigations"
    id = Column(String(50), primary_key=True)
    patient_id = Column(String(50), ForeignKey("patients.id"), nullable=False)
    test_name = Column(String(150), nullable=False)
    category = Column(String(50)) # Lab, Radiology, Cardiac, Pathology
    order_date = Column(DateTime)
    result_date = Column(DateTime, nullable=True)
    result_value = Column(String(100))
    reference_range = Column(String(100))
    status = Column(String(50), nullable=False) # Ordered, Pending, Completed, Abnormal, Critical
    follow_up_documented = Column(Boolean, default=False)
    follow_up_notes = Column(Text)
    source_document_id = Column(String(50), ForeignKey("documents.id"), nullable=True)
    exact_source_text = Column(Text)

    patient = relationship("Patient", back_populates="investigations")

class Conflict(Base):
    __tablename__ = "conflicts"
    id = Column(String(50), primary_key=True)
    patient_id = Column(String(50), ForeignKey("patients.id"), nullable=False)
    conflict_type = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    source_a_document = Column(String(150))
    source_a_date = Column(DateTime)
    source_a_page = Column(Integer)
    source_a_text = Column(Text)
    source_b_document = Column(String(150))
    source_b_date = Column(DateTime)
    source_b_page = Column(Integer)
    source_b_text = Column(Text)
    resolution_status = Column(String(50), default="Unresolved") # Unresolved, Doctor Confirmed, Rejected
    resolved_by = Column(String(100), nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    resolution_note = Column(Text, nullable=True)

    patient = relationship("Patient", back_populates="conflicts")

class Gap(Base):
    __tablename__ = "gaps"
    id = Column(String(50), primary_key=True)
    patient_id = Column(String(50), ForeignKey("patients.id"), nullable=False)
    gap_type = Column(String(100), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    referencing_document = Column(String(150))
    referencing_date = Column(DateTime)
    referencing_page = Column(Integer)
    exact_reference_text = Column(Text)
    missing_item = Column(String(200))
    evidence_state = Column(String(50), default="NOT FOUND")
    doctor_action = Column(String(200))
    status = Column(String(50), default="Open") # Open, Acknowledged, Resolved

    patient = relationship("Patient", back_populates="gaps")

class Review(Base):
    __tablename__ = "reviews"
    id = Column(String(50), primary_key=True)
    patient_id = Column(String(50), ForeignKey("patients.id"), nullable=False)
    category = Column(String(100), nullable=False) # Conflicting documents, Low OCR, Unverified AI, Medication conflicts
    title = Column(String(200), nullable=False)
    details = Column(Text)
    status = Column(String(50), default="Pending") # Pending, Verified, Rejected, Snoozed
    assigned_to = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    reviewed_at = Column(DateTime, nullable=True)
    doctor_notes = Column(Text)

    patient = relationship("Patient", back_populates="reviews")

class AuditEvent(Base):
    __tablename__ = "audit_events"
    id = Column(String(50), primary_key=True)
    user_id = Column(String(50))
    user_name = Column(String(100))
    user_role = Column(String(50))
    action = Column(String(100), nullable=False) # LOGIN, DOCUMENT_UPLOADED, AI_SUMMARY_GENERATED, etc.
    patient_id = Column(String(50), nullable=True)
    details = Column(Text)
    ip_address = Column(String(50), default="127.0.0.1")
    timestamp = Column(DateTime, default=datetime.utcnow)

class Consent(Base):
    __tablename__ = "consents"
    id = Column(String(50), primary_key=True)
    patient_id = Column(String(50), nullable=False)
    granted_to_organization = Column(String(100))
    purpose = Column(String(200))
    consent_status = Column(String(50), default="ACTIVE")
    granted_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)
