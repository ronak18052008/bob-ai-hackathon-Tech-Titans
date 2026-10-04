# MedSynapse AI — Security & Data Governance Architecture

## 1. Zero-Trust Access & Authentication
- **Role-Based Access Control (RBAC):** Five distinct roles (Doctor, Senior Doctor / Reviewer, Department Admin, Records Manager, System Administrator) with principle of least privilege.
- **Organization Isolation:** Multi-tenant architecture preventing cross-hospital data leakage.
- **Session Handling:** Stateless cryptographic JWT tokens with configurable expiration and cryptographic signing.

---

## 2. Immutable Non-Repudiable Audit Trail
Every read, AI reconstruction, conflict review, document upload, and export event is committed to the `audit_events` ledger:
- Records user ID, clinician name, clinical role, action code, timestamp, and client IP address.
- Normal audit events are strictly non-editable and append-only.

---

## 3. Data Protection & Privacy Compliance
- **No Real Patient Data:** The demo environment utilizes exclusively synthetic fictional records.
- **Environment Isolation:** Secrets, API keys, and database connection strings are managed via `.env` and never hardcoded in source control.
- **Document Viewing Integrity:** Original clinical document scans retain authentic formatting; OCR confidence scores are prominently displayed when image quality degrades.
