# Setup Guide

> **This file is read by the automated evaluation pipeline. Follow these instructions to run the project locally.**

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [x] **Python 3.11+** (Python 3.11, 3.12, 3.13, or 3.14)
- [x] **Node.js 18+** and **npm**
- [x] **Git**
- [x] *(Optional for local OCR)*: **Tesseract OCR** installed on system PATH
- [x] *(Optional for live LLM)*: **IBM Cloud account** with watsonx.ai access

## Environment Variables

Copy `.env.example` to `.env` in the project root:

```bash
cp .env.example .env
```

| Variable | Description | Default / Example | Required |
|---|---|---|---|
| `WATSONX_API_KEY` | IBM watsonx.ai API key | `mock-watsonx-key` (built-in fallback) | No (mock fallback provided) |
| `WATSONX_PROJECT_ID` | IBM watsonx.ai Project ID | `mock-project-id` | No |
| `WATSONX_URL` | IBM Cloud Watson endpoint | `https://us-south.ml.cloud.ibm.com` | No |
| `DATABASE_URL` | SQLAlchemy database URL | `sqlite:///./medsynapse.db` | Yes |
| `APP_PORT` | Backend service port | `8000` | Yes |
| `APP_ENV` | Application environment | `development` | Yes |

## 🚀 Quickstart 1-Click Scripts (Recommended)

### On Windows:
1. **Automated Setup**: Double-click `setup.bat` (checks Python/Node, installs dependencies, creates `.env`, and builds the frontend).
2. **Launch Application**: Double-click `run.bat` (starts server on port 8000 and automatically opens your browser to `http://localhost:8000`).
3. **Hot-Reload Dev Mode**: Double-click `start_dev.bat` for dual backend/frontend live reload.

### On Linux / macOS / WSL:
```bash
chmod +x setup.sh run.sh
./setup.sh
./run.sh
```

---

## Manual Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ronak18052008/bob-ai-hackathon-Tech-Titans.git
cd bob-ai-hackathon-Tech-Titans
```

### 2. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

### 3. Install Frontend Dependencies & Build UI

```bash
npm --prefix src/frontend install
npm --prefix src/frontend run build
```

## Running the Application Manually

### Option A: Complete All-in-One Server (Recommended)

Run the unified production FastAPI server, which automatically serves both the REST API and the bundled React frontend on port `8000`:

```bash
python -m uvicorn src.backend.main:app --host 0.0.0.0 --port 8000
```

Open your browser and navigate to:
👉 **`http://localhost:8000`**

### Option B: Dual Terminal Development Mode

If you wish to run hot-reloading on both frontend and backend concurrently:

**Terminal 1 (Backend API):**
```bash
python -m uvicorn src.backend.main:app --reload --port 8000
```

**Terminal 2 (Frontend Vite Dev Server):**
```bash
npm --prefix src/frontend run dev
```

Open your browser and navigate to:
👉 **`http://localhost:5173`** (proxied to API on port 8000)

## Running Tests

Execute the automated test suite covering OCR parsing, RAG retrieval, hallucination guardrails, and API endpoints:

```bash
python -m pytest tests/ -v
```

Expected output:
```text
======================= 13 passed in ~2.0s =======================
```

## Quick Demo Walkthrough

Once running on `http://localhost:8000`:

1. **Landing Page**: Review the product value proposition, 7-stage interactive pipeline, and clinical intelligence suite.
2. **Doctor Login**: Click **Doctor Login**, then choose **Dr. Ananya Roy, MD, DM, FACC** (1-Click Demo Persona).
3. **Clinical Command Center**: Review the Morning Radar, Acuity Metrics, and 6 diverse synthetic patient cohorts.
4. **Scan & Summarize**: Click **Scan & Summarize** in the top navigation, select or paste a medical document, and watch the 12-stage OCR extraction, entity tagging, and structured summary generation with page citations.
5. **Reconstruct Journey**: Click **Reconstruct Journey** to build the multi-stage longitudinal timeline and interactive relational knowledge graph.
6. **Change Lens & Gap Radar**: Inspect medication escalations (e.g., Metformin 500mg → 1000mg BID) and missing coronary angiogram reports.
7. **Edit Record & Next Patient**: Update patient clinical condition with statutory audit logging, conclude the visit, and switch to the next patient in the cohort.

## Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| `ModuleNotFoundError: No module named 'fastapi'` | Python packages missing | Run `pip install -r requirements.txt` |
| Port 8000 already in use | Another process listening on 8000 | Specify a different port: `python -m uvicorn src.backend.main:app --port 8080` |
| Frontend displays blank page | Frontend bundle not compiled | Run `npm --prefix src/frontend run build` |
| `watsonx.ai 401 error` | Invalid or expired API credentials | Leave variables blank to automatically use MedSynapse's deterministic high-fidelity simulation engine |
