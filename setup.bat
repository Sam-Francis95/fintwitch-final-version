@echo off
title FinTwitch City - First Time Setup
color 0A
echo =============================================
echo     FinTwitch City - Auto Setup Script
echo =============================================
echo.

:: Step 1: Install frontend dependencies
echo [1/4] Installing frontend dependencies (npm install)...
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
echo [2/4] Creating Python virtual environment...
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
echo [3/4] Installing Python backend dependencies...
call .venv\Scripts\activate.bat
pip install flask flask-cors requests fastapi uvicorn pydantic google-genai openai python-dotenv httpx
if %errorlevel% neq 0 (
    echo ERROR: pip install failed.
    pause
    exit /b 1
)
echo     Backend dependencies installed successfully.
echo.

:: Step 4: Done
echo [4/4] Setup complete!
echo.
echo =============================================
echo  To start the project, run: start_all_services.bat
echo =============================================
echo.
pause
