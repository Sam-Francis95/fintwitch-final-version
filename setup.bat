@echo off
title FinTwitch City - First Time Setup
color 0A
echo =============================================
echo     FinTwitch City - Auto Setup Script
echo =============================================
echo.

:: Step 1: Install frontend dependencies
echo [1/5] Installing frontend dependencies (npm install)...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed. Make sure Node.js is installed.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)
echo     Frontend dependencies installed successfully.
echo.

:: Step 2: Create Python virtual environment
echo [2/5] Creating Python virtual environment...
python -m venv .venv
if %errorlevel% neq 0 (
    echo ERROR: Python venv creation failed. Make sure Python 3.9+ is installed.
    echo Download from: https://www.python.org/downloads/
    pause
    exit /b 1
)
echo     Python virtual environment created.
echo.

:: Step 3: Install Python backend dependencies
echo [3/5] Installing Python backend dependencies...
call .venv\Scripts\activate.bat
pip install flask flask-cors requests fastapi uvicorn pydantic google-genai openai python-dotenv httpx
if %errorlevel% neq 0 (
    echo ERROR: pip install failed.
    pause
    exit /b 1
)
echo     Backend dependencies installed successfully.
echo.

:: Step 4: Setup WSL Pathway (optional - enables real-time streaming engine)
echo [4/5] Checking for WSL Ubuntu (optional - enables REAL Pathway streaming)...
wsl -d Ubuntu -u root -- bash -c "echo WSL_OK" >nul 2>&1
if errorlevel 1 goto NO_WSL_SETUP

echo     [OK] WSL Ubuntu found! Setting up Pathway engine environment...
echo     This may take a few minutes on first run (installing pathway package)...
echo.
wsl -d Ubuntu -u root -- bash -c "python3 -m venv /root/pw_venv 2>/dev/null; /root/pw_venv/bin/pip install --quiet --upgrade pip; /root/pw_venv/bin/pip install --quiet pathway fastapi uvicorn pydantic"
if errorlevel 1 (
    echo     [WARN] WSL Pathway setup encountered issues.
    echo     You can set it up manually:
    echo       1. Open WSL: wsl -d Ubuntu -u root
    echo       2. Run: python3 -m venv /root/pw_venv
    echo       3. Run: /root/pw_venv/bin/pip install pathway fastapi uvicorn
) else (
    echo     [OK] Pathway engine installed in WSL at /root/pw_venv
    echo     You will get REAL live streaming data when you start the project!
)
goto WSL_DONE

:NO_WSL_SETUP
echo     [--] WSL Ubuntu not found - project will run in DEMO mode.
echo     [->] To enable real Pathway streaming, install WSL after setup:
echo          wsl --install -d Ubuntu --web-download
echo     [->] Then re-run this setup script to install Pathway in WSL.

:WSL_DONE
echo.

:: Step 5: Done
echo [5/5] Setup complete!
echo.
echo =============================================
echo  To start the project, run: start_all_services.bat
echo =============================================
echo.
pause
