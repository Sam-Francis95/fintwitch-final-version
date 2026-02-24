@echo off
cd /d "%~dp0"
title FinTwitch Local Server

echo ========================================
echo Checking Game Integrity...
echo ========================================

:: Self-Healing: Check for Zustand
if not exist "node_modules\zustand" (
    echo [FIX] Essential component 'zustand' is missing.
    echo Installing it now... (This only happens once)
    call npm install zustand
    echo.
)

echo ========================================
echo Starting FinTwitch...
echo ========================================
echo.
echo Executing 'npm start'...
echo Opening game in your browser...
echo Starting Financial Event Generator (Port 5000)...
start "Financial Event Generator" cmd /k python backend/financial_event_generator.py
timeout /t 2 /nobreak >nul
echo Starting Budget System Backend (Port 5001)...
start "Budget Backend" cmd /k python backend/budget_system.py
timeout /t 2 /nobreak >nul
echo Starting Frontend (Port 5173)...
start "" "http://localhost:5173"
call npm run dev

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Server failed to start.
    pause
)

pause
