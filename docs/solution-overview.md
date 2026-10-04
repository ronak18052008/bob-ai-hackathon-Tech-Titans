# Solution Overview

## Core Mechanism
MedBrief is a clinical documentation assistant designed to synthesise unstructured patient notes into safe, reviewable summaries. 

Clinicians upload or select a patient record. MedBrief processes the text and extracts a chronological timeline of events, medication changes, and pending investigations. Crucially, it then generates targeted draft summaries (Ward Round, Referral, Discharge) where every extracted fact is heavily linked to its source document and page number.

## Differentiation
Unlike naive AI chatbots that simply ingest text and output an unverified answer, MedBrief treats the AI as a draft assistant. It is built on a **verifiable-first** design. If dates or medications conflict, MedBrief surfaces the conflict. It will not silently invent data to fill gaps.

## Key Design Decisions
1. **Source Traceability:** The UI dedicates space to source documents, making it trivial for a doctor to click an extracted fact and verify the original clinical note.
2. **Contextual Outputs:** We provide separate output modes (Ward Round vs. Discharge) because what matters for a handover is entirely different from what matters to a GP post-discharge.
3. **No-Persist Privacy:** Uploaded documents are processed in memory and never persisted to a database, ensuring no stray PHI is left behind after the session ends.

## User Experience
The clinician is greeted by a calm, modern, and accessible dashboard. They drag and drop PDF notes into the import zone. Once extracted, they view a "Patient Overview" dashboard containing the generated draft. They can toggle between the clinical timeline, medication changes, and the raw source documents before copying the final, verified text to their EHR.
