# Slide Deck Content (TODO: Export to PDF)

Since we cannot generate a binary PDF natively here, below is the content outline for the required slides. A team member must assemble this into a slide deck and save it as `slides.pdf` or `slides.pptx` in this directory before final submission.

---

## Slide 1: Title
**MedBrief**
*Clinical documentation summarisation, built on verifiable evidence.*
Team: Orion Squad
Track: AI

## Slide 2: The Problem
- **Time Sink:** Doctors spend 2+ hours daily reading and summarising notes.
- **Data Fragmentation:** Critical events and medication changes are buried across 50-200 pages.
- **Risk:** Manual summaries written from memory omit facts, leading to avoidable readmissions.
- **Current AI gap:** Generative AI hallucinates and lacks source traceability, making it unsafe for medical use.

## Slide 3: The Solution
- **MedBrief:** An AI documentation assistant designed for clinical safety.
- **Chronological Extraction:** Automatically builds a timeline of clinical events from unstructured text.
- **Contextual Drafts:** Generates specific summaries for Ward Rounds, Referrals, and Discharges.
- **Verifiable First:** Every extracted fact is directly linked to the source document and page number. No black boxes.

## Slide 4: Demo / Architecture
- **Demo:** [Link to Demo Video]
- **Frontend:** React application built with a modern glassmorphism UI.
- **Backend/AI:** Local deterministic simulation for privacy, supported by a Node.js MCP Server.
- **Data Flow:** Clinician uploads -> Text Extracted -> MCP formats request -> Verified Draft Displayed.

## Slide 5: IBM Technology Integration
- **Model Context Protocol (MCP):** Implemented an MCP Server in `src/mcp-server/`.
- **IBM Bob Integration:** The MCP server exposes `summarize_record` and `extract_timeline` tools.
- **Future State:** Designed to connect directly to IBM watsonx.ai for secure, enterprise-grade LLM inference.
*(Note: Current integration is at the protocol level. Real watsonx integration requires valid credentials).*

## Slide 6: Potential Impact
- **Efficiency:** Returns valuable hours to direct patient care.
- **Safety:** Reduces medication errors and handover omissions by surfacing hidden data.
- **Scale:** Can be extended to automate outpatient clinic prep and nursing handovers.
