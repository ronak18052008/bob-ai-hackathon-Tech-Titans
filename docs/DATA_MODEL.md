# MedSynapse AI — Data Model Specification

Covers the complete relational entity schema implemented in SQLAlchemy models according to Section 88.

## 1. Entity Relationship Overview

| Entity | Table Name | Purpose |
| :--- | :--- | :--- |
| **Organization** | `organizations` | Multi-tenant hospital or clinic network |
| **Department** | `departments` | Specialty units (Cardiology, CCU, Pulmonology, Surgery) |
| **User** | `users` | Role-based clinical actors (Doctor, Senior Doctor, Admin, Records) |
| **Patient** | `patients` | Core patient profile (MRN, synthetic ABHA, demographics) |
| **Admission** | `admissions` | Inpatient hospitalizations with admission/discharge dates |
| **Document** | `documents` | Ingested PDF, scan, or note with OCR confidence & version |
| **DocumentVersion** | `document_versions` | Version lineage tracking edits and updates |
| **ClinicalEvent** | `clinical_events` | Granular timeline milestones with exact page citations |
| **Medication** | `medications` | Drugs with Started/Dose Changed/Stopped lifecycle tracking |
| **Investigation** | `investigations` | Diagnostic studies with Ordered/Result/Follow-up states |
| **Conflict** | `conflicts` | Contradictory statements between document pairs |
| **Gap** | `gaps` | Clinical items referenced in notes but missing from chart |
| **Review** | `reviews` | Clinical verification tasks for doctor sign-off |
| **AuditEvent** | `audit_events` | Immutable non-repudiable log of all system interactions |
| **Consent** | `consents` | ABDM patient consent records with scopes and expiry |

---

## 2. Key Foreign Key Relationships
- `patients.organization_id` → `organizations.id`
- `documents.patient_id` → `patients.id`
- `clinical_events.patient_id` → `patients.id`
- `clinical_events.document_id` → `documents.id`
- `medications.patient_id` → `patients.id`
- `conflicts.patient_id` → `patients.id`
- `gaps.patient_id` → `patients.id`
- `audit_events.patient_id` → `patients.id`
