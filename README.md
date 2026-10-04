# 🚀 MedSynapse AI

> Reconstruct the patient's journey. Surface what matters.
> Advanced Clinical Journey Reconstruction & Evidence Intelligence Operating System

---

## 👥 Team

| Field | Value |
|---|---|
| **Team Name** | Tech Titans |
| **Track** | AI |
| **Team Lead** | Ronak — ronakmarvaniya1805@gmail.com |
| **Members** | Agola Aryan Jitendrabhai, Khamar Vaishvi Bhavinkumar, Koladiya Henil Shantibhai, Joshi Darsh Pravinbhai, Chandrala Khush Sumeshbhai |

### Team Members & Roles
| Name | Email | Responsibility |
|---|---|---|
| **Ronak** (Lead) | `ronakmarvaniya1805@gmail.com` | Full-Stack Architecture, IBM Granite 3.0 & watsonx Pipeline |
| **Agola Aryan Jitendrabhai** | `aryanagola7@gmail.com` | Multimodal OCR Engine & Clinical Entity Extraction |
| **Khamar Vaishvi Bhavinkumar** | `vaishvi.khamar@gmail.com` | Longitudinal Knowledge Graph & Timeline Reconstruction |
| **Koladiya Henil Shantibhai** | `koladiyahenil08@gmail.com` | Documentation Conflict Surveillance & Clinical Gap Radar |
| **Joshi Darsh Pravinbhai** | `250170107047@vgecg.ac.in` | Frontend Synapse Workspace & Clinical Copilot UI |
| **Chandrala Khush Sumeshbhai** | `250170107015@vgecg.ac.in` | Evidence Citation Provenance & Automated Test Suite |

---

## 🎯 Problem Statement

Clinicians spend 15 to 35 minutes per patient encounter manually reviewing dozens of fragmented, unstructured medical documents (prior discharge summaries, outpatient prescriptions, lab panels, and referral slips). Critical medication dosage shifts, missing investigation reports, and contradictory clinical notes frequently go unnoticed, driving severe cognitive overload, redundant repeat testing, and preventable patient harm.

---

## 💡 Solution

MedSynapse AI transforms fragmented medical records into a structured longitudinal patient journey, interactive knowledge graph, evidence-backed clinical summary, medication evolution timeline, and automated documentation gap radar—with 100% of claims anchored to page coordinates without hallucination.

---

## ✨ Key Features

- **Scan & Summarize Engine:** First-class medical document scan & multimodal OCR pipeline with coordinate-level source citations.
- **Longitudinal Patient Journey Reconstruction:** Synthesizes disparate encounters into an interactive timeline and multi-relational knowledge graph.
- **Clinical Change Lens & Medication Evolution:** Chronological tracking of pharmacotherapy shifts (*Started*, *Dose Changed*, *Stopped*) with documented clinical indications.
- **Surveillance Gap Radar & Conflict Detector:** Flags referenced diagnostic tests lacking formal reports and pinpoints contradictory drug dosages or allergy discrepancies across providers.
- **Synchronized 3-Panel Synapse View & Copilot:** Synchronized Timeline, Clinical Intelligence card, and Evidence Rail with pre-export Second Look clinical audit.

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Languages** | Python, TypeScript, SQL |
| **Frameworks** | FastAPI, React 18, Vite, Tailwind CSS, Pydantic |
| **IBM Technologies** | watsonx.ai, IBM Granite 3.0, IBM Bob Agentic Framework |
| **Databases** | SQLite, PostgreSQL-ready, SQLAlchemy ORM |
| **Other** | Tesseract OCR, Pytest, Docker, GitHub Actions, Lucide Icons |

---

## 📁 Repository Structure

```
├── src/                  # All source code (FastAPI backend & React frontend)
├── docs/                 # Written documentation
│   ├── problem-statement.md
│   ├── solution-overview.md
│   ├── architecture.md
│   ├── setup-guide.md
│   └── template-guide.md
├── demo/                 # Demo artifacts
│   ├── screenshots/      # App screenshots (01-home-dashboard.png, etc.)
│   ├── demo-video-link.txt  # Link to demo video
│   └── live-demo-url.txt    # URL to running prototype
├── presentation/         # Slide deck (slides.pdf)
└── submission.yaml       # Structured submission metadata
```

---

## ⚡ How to Run

> **Copy these exact steps from your [`docs/setup-guide.md`](docs/setup-guide.md)**

```bash
# 1. Clone the repo
git clone https://github.com/ronak18052008/bob-ai-hackathon-Tech-Titans.git
cd bob-ai-hackathon-Tech-Titans

# 2. Automated 1-Click Launch (Recommended)
# On Windows:
setup.bat
run.bat

# On Linux / macOS / WSL:
chmod +x setup.sh run.sh
./setup.sh
./run.sh

# 3. Manual Steps:
pip install -r requirements.txt
npm --prefix src/frontend install
npm --prefix src/frontend run build
python -m uvicorn src.backend.main:app --host 0.0.0.0 --port 8000
```

The application will be available at: `http://localhost:8000`

---

## 🖥️ Demo

| Artifact | Link |
|---|---|
| 📹 Demo Video | [See demo/demo-video-link.txt](demo/demo-video-link.txt) |
| 🌐 Live Demo | [See demo/live-demo-url.txt](demo/live-demo-url.txt) |
| 🖼️ Screenshots | [See demo/screenshots/](demo/screenshots/) |
| 📊 Presentation | [See presentation/slides.pdf](presentation/slides.pdf) |

---

## ⚠️ Known Limitations

> Be honest — judges appreciate transparency over overclaiming.

- **Handwritten Prescription Ambiguity:** Severely degraded, cursive handwritten doctor notes trigger an explicit "Low-Confidence Text — Review Required" verification alert rather than guessing ungrounded text.
- **Multi-Language Medical Records:** Current OCR and entity normalization models are optimized for English medical terminology with cross-lingual support for 6 regional Indian languages (Hindi, Gujarati, Marathi, Tamil, Telugu, Bengali).
- **ABDM Milestone Gateway:** The current ABDM FHIR R4 connector runs on synthetic sandbox integration gateways rather than live production hospital networks.

---

## 🏅 What We're Most Proud Of

The synchronized 3-Panel Synapse View and Evidence-First architecture. Every single clinical fact links directly to Document ID, Page Number, and Section Text, preventing AI hallucinations while reconstructing complex multi-encounter patient journeys in under 3 seconds.
