# MedSynapse AI — ABDM / ABHA Integration Architecture

## 1. Architectural Integration Layer
MedSynapse AI implements an integration abstraction designed to connect to the Ayushman Bharat Digital Mission (ABDM) ecosystem:

```text
MedSynapse AI
      │
      ▼
Health Data Integration Layer (HIP / HIU Abstraction)
      │
      ▼
Authorized ABDM Gateway Connector (Synthetic M1-M3 Gateway)
      │
      ▼
Hospital EMR / Longitudinal Electronic Health Record
```

---

## 2. ABDM Milestones Supported in Sandbox
- **Milestone 1 (M1):** Creation and verification of synthetic ABHA IDs (Ayushman Bharat Health Account numbers, e.g. `91-4402-8819-2041`).
- **Milestone 2 (M2):** Health Information Provider (HIP) bundle generation conforming to NDHM FHIR profiles.
- **Milestone 3 (M3):** Health Information User (HIU) consent artifact logging with designated purpose and time-bound validity.

*Security Notice: The application does NOT scrape ABHA portals, does NOT store real Aadhaar/ABHA credentials, and operates on synthetic sandbox connectors.*
