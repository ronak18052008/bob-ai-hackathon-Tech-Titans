# MedSynapse AI — IBM Technology Integration Architecture

This document explicitly details where, why, and how IBM technology is genuinely used in MedSynapse AI according to Section 72.

---

## 1. Component 1: IBM watsonx.ai Foundation Models

### Where It Is Used
- **Patient Story Engine:** Chronological narrative construction.
- **Change Lens:** Multi-admission delta extraction.
- **Second Look Evidence Audit:** Pre-export claim integrity verification.

### Why It Is Used
IBM Granite models (`ibm/granite-3-8b-instruct`) provide enterprise-grade safety guardrails, low-latency instruction following, and rigorous adherence to JSON Schema constraints without data leakage.

### How It Is Integrated
The FastAPI backend invokes watsonx.ai endpoints with Pydantic JSON schemas. Prompts enforce strict extraction rules:
```text
Every statement must cite an exact source document and page number.
Never extrapolate ungrounded findings.
```

---

## 2. Component 2: IBM watsonx Discovery & Hybrid RAG

### Where It Is Used
- **Synapse View Evidence Rail:** Direct character-level and page-level snippet linking.
- **Synapse Copilot:** Grounded conversational answers with citation chips.

### Why It Is Used
Standard vector embeddings lose exact document coordinate fidelity. watsonx Discovery retains page numbers, section headers, and bounding box offsets.

### How It Is Integrated
Ingested documents are indexed into chunk structures storing document title, page index, and exact source text. When a clinician clicks any claim, the UI scrolls to the verified source coordinate.

---

## 3. Component 3: IBM Bob Clinical Assist Hooks

### Where It Is Used
- **Background Gap Radar Scanning:** Asynchronous triggers detecting missing diagnostic reports upon discharge.
- **Review Queue Orchestration:** Notification routing to attending clinicians.
