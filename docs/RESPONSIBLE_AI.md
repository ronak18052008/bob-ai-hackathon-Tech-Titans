# MedSynapse AI — Responsible AI & Clinical Safety Framework

## 1. Assistive Operating System, Not Autonomous Decision Maker
MedSynapse AI is built on one foundational axiom:
> **MedSynapse AI organizes, reconstructs, and surfaces documented clinical facts. It does NOT independently diagnose, prescribe, or decide patient therapy.**

All treatment choices and clinical actions remain solely within the professional judgment of qualified healthcare providers.

---

## 2. Guardrails Against Hallucination & Extrapolation
- **Strict Evidence Anchoring:** Every clinical assertion presented in the patient story, timeline, and handoff must be accompanied by an exact quotation from an ingested source document.
- **Explicit Unknowns:** If an expected data point (such as the rationale for stopping a medication or the result of a referenced scan) is absent from the file, the system explicitly prints:
  `Reason not documented.` or `Not found in available records.`
- **Mandatory Human-in-the-Loop Review:** Flagged documentation conflicts, unverified AI assertions, and missing records are routed to the Doctor Review Queue for explicit clinician confirmation.

---

## 3. Transparency & Interpretability
- **"Why is this here?":** Clinicians can inspect any synthesized statement to view its extraction chain, underlying document page, and OCR confidence level.
- **"Why wasn't this included?":** Explains whether a record was excluded due to low image clarity, duplicate status, or temporal window filtering.
