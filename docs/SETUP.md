# MedSynapse AI — Setup and Installation Guide

## 1. System Requirements
- **OS:** Windows 10/11, macOS, or Linux
- **Node.js:** v20.18.0 or newer
- **Python:** 3.10 to 3.14
- **Memory:** 4GB RAM minimum (8GB recommended)

---

## 2. Step-by-Step Installation

### Clone / Navigate to Repository
```bash
cd C:\Users\Dell\Downloads\IBM
```

### Install Frontend Dependencies & Compile Bundle
```bash
npm --prefix src/frontend install
npm --prefix src/frontend run build
```

### Install Backend Dependencies (If in fresh virtual environment)
The required Python dependencies (`fastapi`, `uvicorn`, `sqlalchemy`, `pydantic`, `pytest`, `requests`, `reportlab`, `pillow`) are standard wheels:
```bash
pip install fastapi uvicorn sqlalchemy pydantic pytest requests reportlab pillow
```

### Seed the Synthetic Database
Seed the 6 canonical patient journeys:
```bash
python -m src.database.seed
```

---

## 3. Launching the Platform

### Option A: Unified Full-Stack Server (Recommended)
FastAPI will serve the API endpoints and the compiled React frontend on port 8000:
```bash
python -m uvicorn src.backend.main:app --reload --port 8000
```
Open **`http://localhost:8000`** in your browser.

### Option B: Frontend Hot-Reload Development Server
Run Vite with live reloading on port 3000:
```bash
npm --prefix src/frontend run dev
```
Open **`http://localhost:3000`**.

---

## 4. Running the Automated Test Suite
Execute the 10 unit and integration tests:
```bash
python -m pytest tests/ -v
```
Expected output: `10 passed in ~1.8s`.
