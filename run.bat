@echo off
setlocal enabledelayedexpansion
title MedSynapse AI - Production Server

echo ===============================================================================
echo            MedSynapse AI Clinical OS - Launching Platform
echo            Reconstruct the patient's journey. Surface what matters.
echo ===============================================================================
echo.

:: Check if frontend is built
if not exist "src\frontend\dist\index.html" (
    echo [NOTICE] Compiled frontend bundle not found. Building now...
    call npm --prefix src/frontend run build
    if %errorlevel% neq 0 (
        echo [ERROR] Frontend compilation failed! Run setup.bat first.
        pause
        exit /b 1
    )
)

echo [*] Starting MedSynapse AI unified server on http://localhost:8000
echo [*] REST API Docs: http://localhost:8000/docs
echo [*] Interactive Clinical OS: http://localhost:8000
echo.
echo Opening browser in 2 seconds...
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:8000"

python -m uvicorn src.backend.main:app --host 0.0.0.0 --port 8000

echo.
pause
