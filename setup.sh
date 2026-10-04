#!/usr/bin/env bash
# MedSynapse AI - Environment Setup Script (Linux / macOS / WSL)
set -e

echo "==============================================================================="
echo "           MedSynapse AI Clinical OS - Automated Environment Setup             "
echo "           Tech Titans - IBM Clinical AI Hackathon                             "
echo "==============================================================================="
echo ""

# 1. Check Python
echo "[1/5] Checking Python..."
if ! command -v python3 &> /dev/null; then
    echo "ERROR: python3 could not be found. Please install Python 3.11+."
    exit 1
fi
python3 --version

# 2. Check Node & npm
echo ""
echo "[2/5] Checking Node.js and npm..."
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm could not be found. Please install Node.js 18+."
    exit 1
fi
node --version
npm --version

# 3. Install Python dependencies
echo ""
echo "[3/5] Installing Python dependencies..."
python3 -m pip install --upgrade pip > /dev/null 2>&1 || true
python3 -m pip install -r requirements.txt

# 4. Check Environment Config
echo ""
echo "[4/5] Checking .env file..."
if [ ! -f ".env" ]; then
    if [ -f "src/.env.example" ]; then
        cp src/.env.example .env
        echo "  Created .env from src/.env.example"
    elif [ -f ".env.example" ]; then
        cp .env.example .env
        echo "  Created .env from .env.example"
    fi
else
    echo "  Found existing .env file."
fi

# 5. Install Frontend Packages & Build
echo ""
echo "[5/5] Installing frontend dependencies and compiling production bundle..."
npm --prefix src/frontend install
npm --prefix src/frontend run build

# Make run scripts executable
chmod +x run.sh || true

echo ""
echo "[Verification] Running automated test suite..."
python3 -m pytest tests/ -v -q

echo ""
echo "==============================================================================="
echo "  SUCCESS! MedSynapse AI setup completed successfully."
echo "  To launch the platform, execute:"
echo "    ./run.sh"
echo "==============================================================================="
