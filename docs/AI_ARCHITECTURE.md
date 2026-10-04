# MedSynapse AI — AI Architecture & Evidence Retrieval Specification

## 1. Core Principles
1. **Zero Extrapolation (Hallucination Guard):** The model is strictly prohibited from inventing medical facts, dates, lab ranges, or diagnoses. If an item is absent, it must be labeled *"Not found in available records"*.
2. **Deterministic Citation Offsets:** Every claim must carry a link to the primary source document ID, page number, and exact quoted text string.
3. **Structured Clinical Output:** Raw text generation is avoided in favor of Pydantic JSON schemas (`StructuredAIClaim`, `EvidenceReference`).

---

## 2. IBM watsonx Foundation Model Pipeline

```text
[Input Clinical Documents]
          │
          ▼
[watsonx Discovery Chunking Engine]
  - Document chunking by paragraph & section
  - Page-level index mapping
          │
          ▼
[IBM Granite-3.0-8b-instruct Foundation Model]
  - Multi-document temporal sequencing
  - Medication evolution extraction (Started, Changed, Stopped)
  - Cross-document gap & conflict evaluation
          │
          ▼
[MedSynapse AI Hallucination Guard]
  - Compares generated assertions against source text
  - Rejects ungrounded claims with safe fallback
          │
          ▼
[Doctor Verification Queue & Synapse View]
```

---

## 3. RAG Pipeline & Coordinate Offsets
The RAG pipeline operates at character and page resolution:
- Scanned PDF pages are segmented with bounding box annotations.
- Search queries use token-level overlap combined with semantic embeddings.
- Clicking an evidence chip in the frontend immediately scrolls the Evidence Rail to the exact page and highlights the source passage.

---

## 4. Second Look Integrity Audit
Before a physician exports an AI-drafted handoff or referral, MedSynapse executes a 5-point audit:
1. Are all clinical claims supported by a document citation?
2. Are medication start/stop reasons documented?
3. Are all referenced diagnostic tests present in the file?
4. Are there any unresolved contradictions between records?
5. Are all timeline events temporally consistent?
