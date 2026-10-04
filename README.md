# 🚀 MedBrief AI

## 👥 Team

| Field | Value |
|---|---|
| **Team Name** | Tech Titans |
| **Track** | AI |
| **Team Lead** | Ronak Marvaniya — 250170107078@vgecg.ac.in |
| **Members** | Henil Koladiya, Darsh Joshi, Vaishvi Khamar, Aryan Agola, Khush Chandrala |

---

## 🎯 Problem Statement

Doctors spend about two hours per day reading and summarising records for ward rounds, referrals, and discharges. Complex patients may have 50–200 pages across multiple admissions. Important events, medication changes, and pending investigations can be buried in unstructured notes. Referral letters written from memory can omit information and contribute to repeated investigations and avoidable readmissions.

---

## 💡 Solution

MedBrief is a clinical documentation assistant that helps clinicians review a patient record and prepare evidence-linked summaries. It extracts chronological events and highlights critical details, ensuring all generated facts are directly linked to the source documentation for clinician verification.
---

## ✨ Key Features

- **Intelligent Summarisation:** Different output modes for ward-round summaries, referral letters, and discharge summaries. 
- **Source Referencing:** Extracted facts are mapped back to their original source document and page.
- **Clinical Timeline:** Automatically chronologizes events from scattered unstructured notes.
- **Medication Tracking:** Identifies medication changes (starts/stops) and outstanding investigations.
- **MCP Integration:** Exposes tools for IBM Bob to perform patient record summarisation seamlessly.
---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Languages** | [e.g., Python, TypeScript] |
| **Frameworks** | [e.g., FastAPI, React] |
| **IBM Technologies** | [e.g., watsonx.ai, IBM Bob, IBM Cloud] |
| **Databases** | [e.g., PostgreSQL, Redis] |
| **Other** | [e.g., Docker, GitHub Actions] |

---

## 📁 Repository Structure

```
├── src/                  # All source code
├── docs/                 # Written documentation
│   ├── problem-statement.md
│   ├── solution-overview.md
│   ├── architecture.md
│   └── setup-guide.md
├── demo/                 # Demo artifacts
│   ├── screenshots/      # App screenshots
│   └── demo-video-link.txt  # Link to demo video
├── presentation/         # Slide deck
└── submission.yaml       # Structured submission metadata
```

---

## ⚡ How to Run

> **Copy these exact steps from your [`docs/setup-guide.md`](docs/setup-guide.md)**

```bash
# 1. Clone the repo
git clone https://github.com/[your-repo].git
cd [your-repo]

# 2. Install dependencies
[your install command here]

# 3. Configure environment
cp .env.example .env
# Edit .env with your values

# 4. Run the project
[your run command here]
```

---

## 🖥️ Demo

| Artifact | Link |
|---|---|
| 📹 Demo Video | [See demo/demo-video-link.txt](demo/demo-video-link.txt) |
| 🌐 Live Demo | [See demo/live-demo-url.txt](demo/live-demo-url.txt) |
| 🖼️ Screenshots | [See demo/screenshots/](demo/screenshots/) |
| 📊 Presentation | [See presentation/slides.pdf](presentation/) |

---

## ⚠️ Known Limitations

The demo runs in a local deterministic mode using synthetic patient data to ensure no real PHI is exposed. 
- The MCP server is implemented and functional as a protocol, but requires valid IBM watsonx.ai credentials to process unseen live files. 

---

## 🏅 What We're Most Proud Of

We are most proud of our strict adherence to clinical safety principles. Rather than acting as a diagnostic "black box," MedBrief is designed to be a verifiable assistant. It refuses to invent sources, explicitly flags conflicting data, and prioritises clinician review above complete automation.

---
