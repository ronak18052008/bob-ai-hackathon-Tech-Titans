# MedBrief

## Team: Orion Squad
**Track:** AI  
**Lead:** REPLACE_BEFORE_SUBMISSION  
**Members:** REPLACE_BEFORE_SUBMISSION

## Problem Statement
Doctors spend about two hours per day reading and summarising records for ward rounds, referrals, and discharges. Complex patients may have 50–200 pages across multiple admissions. Important events, medication changes, and pending investigations can be buried in unstructured notes. Referral letters written from memory can omit information and contribute to repeated investigations and avoidable readmissions.

## Solution
MedBrief is a clinical documentation assistant that helps clinicians review a patient record and prepare evidence-linked summaries. It extracts chronological events and highlights critical details, ensuring all generated facts are directly linked to the source documentation for clinician verification.

## Key Features
- **Intelligent Summarisation:** Different output modes for ward-round summaries, referral letters, and discharge summaries.
- **Source Referencing:** Extracted facts are mapped back to their original source document and page.
- **Clinical Timeline:** Automatically chronologizes events from scattered unstructured notes.
- **Medication Tracking:** Identifies medication changes (starts/stops) and outstanding investigations.
- **MCP Integration:** Exposes tools for IBM Bob to perform patient record summarisation seamlessly.

## Tech Stack
- **Frontend:** React, TypeScript, Vite
- **Styling:** Vanilla CSS (Glassmorphism, custom design system)
- **AI / Integration:** Model Context Protocol (MCP) server for IBM Bob integration, ready for watsonx.ai.

## How to Run
See our detailed instructions in [docs/setup-guide.md](docs/setup-guide.md).

## Demo
- **Video:** [demo/demo-video-link.txt](demo/demo-video-link.txt)
- **Live Demo:** [demo/live-demo-url.txt](demo/live-demo-url.txt)
- **Screenshots:** See `demo/screenshots/`

## Known Limitations
- The demo runs in a local deterministic mode using synthetic patient data to ensure no real PHI is exposed.
- The MCP server is implemented and functional as a protocol, but requires valid IBM watsonx.ai credentials to process unseen live files.

## What We're Most Proud Of
We are most proud of our strict adherence to clinical safety principles. Rather than acting as a diagnostic "black box," MedBrief is designed to be a verifiable assistant. It refuses to invent sources, explicitly flags conflicting data, and prioritises clinician review above complete automation.
