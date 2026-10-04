#!/usr/bin/env bash
# MedSynapse AI - Production Server Launcher (Linux / macOS / WSL)
set -e

echo "==============================================================================="
echo "           MedSynapse AI Clinical OS - Launching Platform                      "
echo "           Reconstruct the patient's journey. Surface what matters.            "
echo "==============================================================================="
echo ""

if [ ! -f "src/frontend/dist/index.html" ]; then
    echo "[NOTICE] Compiled frontend bundle not found. Building now..."
    npm --prefix src/frontend run build
fi

echo "[*] Starting MedSynapse AI unified server on http://localhost:8000"
echo "[*] REST API Docs: http://localhost:8000/docs"
echo "[*] Interactive Clinical OS: http://localhost:8000"
echo ""

python3 -m uvicorn src.backend.main:app --host 0.0.0.0 --port 8000
