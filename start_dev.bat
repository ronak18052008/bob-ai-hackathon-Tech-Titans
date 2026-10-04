@echo off
title MedSynapse AI - Development Dual Runner

echo ===============================================================================
echo            MedSynapse AI Clinical OS - Hot-Reloading Development Mode
echo ===============================================================================
echo.
echo Launching Backend API server (Port 8000 with reload)...
start "MedSynapse Backend" cmd /k "python -m uvicorn src.backend.main:app --reload --port 8000"

echo Launching Frontend Vite dev server (Port 5173 with HMR)...
start "MedSynapse Frontend" cmd /k "npm --prefix src/frontend run dev"

echo.
echo Both servers are starting!
echo - Frontend UI: http://localhost:5173
echo - Backend API: http://localhost:8000
echo - Swagger Docs: http://localhost:8000/docs
echo.
pause
