@echo off
setlocal enabledelayedexpansion
title MedSynapse AI - Environment Setup

echo ===============================================================================
echo            MedSynapse AI Clinical OS - Automated Environment Setup
echo            Tech Titans - IBM Clinical AI Hackathon
echo ===============================================================================
echo.

:: 1. Check Python
echo [1/5] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python 3.11+ from https://www.python.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('python --version') do echo   Found: %%i

:: 2. Check Node & npm
echo.
echo [2/5] Checking Node.js and npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js / npm is not installed or not in PATH!
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do echo   Found Node: %%i
for /f "tokens=*" %%i in ('npm --version') do echo   Found npm: v%%i

:: 3. Install Python Dependencies
echo.
echo [3/5] Installing backend Python dependencies...
python -m pip install --upgrade pip >nul 2>&1
python -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Python dependencies.
    pause
    exit /b 1
)
echo   Backend dependencies installed successfully.

:: 4. Setup Environment Config
echo.
echo [4/5] Checking environment configuration...
if not exist ".env" (
    if exist "src\.env.example" (
        copy "src\.env.example" ".env" >nul
        echo   Created .env from src/.env.example
    ) else if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo   Created .env from .env.example
    )
) else (
    echo   Found existing .env file.
)

:: 5. Install Frontend Dependencies & Build Production Bundle
echo.
echo [5/5] Installing frontend packages and compiling production bundle...
call npm --prefix src/frontend install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend packages.
    pause
    exit /b 1
)

echo   Compiling Vite production build...
call npm --prefix src/frontend run build
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed!
    pause
    exit /b 1
)

:: Run Quick Test Suite
echo.
echo [Verification] Running automated test suite...
python -m pytest tests/ -v -q
if %errorlevel% equ 0 (
    echo.
    echo ===============================================================================
    echo   SUCCESS! MedSynapse AI setup completed successfully.
    echo   All tests passed.
    echo.
    echo   To launch the platform, double-click or run:
    echo     run.bat
    echo.
    echo   Or for dual live hot-reloading development:
    echo     start_dev.bat
    echo ===============================================================================
) else (
    echo [WARNING] Some tests did not pass. You can still try launching run.bat
)

echo.
pause
