@echo off
title FinTwitch - Enhanced Hackathon System
color 0A

echo.
echo ================================================
echo    FinTwitch ENHANCED HACKATHON SYSTEM
echo    Multi-Source Pathway Streaming Edition
echo ================================================
echo.
echo Starting all services...
echo.

REM Start ENHANCED Pathway Streaming Engine via Windows Python (Port 8000) - CRITICAL!
echo [1/4] Starting Pathway Streaming Engine (Port 8000)...
start "Pathway Streaming (Port 8000)" cmd /k "cd /d %~dp0backend && %~dp0.venv\Scripts\python.exe pathway_streaming_enhanced.py"
timeout /t 5 /nobreak >nul

REM Start Financial Event Generator (Port 5000)
echo [2/4] Starting Financial Event Generator...
start "Event Generator (Port 5000)" cmd /k "%~dp0.venv\Scripts\python.exe %~dp0backend\financial_event_generator.py"
timeout /t 2 /nobreak >nul

REM Start Budget Allocation System (Port 5001)
echo [3/4] Starting Budget Allocation System...
start "Budget System (Port 5001)" cmd /k "%~dp0.venv\Scripts\python.exe %~dp0backend\budget_system.py"
timeout /t 2 /nobreak >nul

REM Start Frontend Development Server
echo [4/4] Starting Frontend...
start "Frontend" cmd /k "cd /d %~dp0 && npm run dev"
timeout /t 2 /nobreak >nul

echo.
echo ================================================
echo    All Services Started Successfully!
echo ================================================
echo.
echo Services Running:
echo   - ENHANCED Pathway: http://localhost:8000 ⭐⭐⭐ (HACKATHON EDITION!)
echo   - Event Generator:  http://localhost:5000
echo   - Budget System:    http://localhost:5001
echo   - Frontend:         http://localhost:5173
echo.
echo NEW FEATURES:
echo   ✓ Multi-source stream ingestion
echo   ✓ Advanced analytics (velocity, trends, anomalies)
echo   ✓ Predictive insights (balance depletion forecast)
echo   ✓ Real-time alerts system
echo   ✓ External signals (market/economic data)
echo   ✓ Multi-source data fusion
echo.
echo Navigate to "Pathway Intelligence" page to see new features!
echo.
echo Press any key to open browser...
pause >nul

REM Open browser
start http://localhost:5173

echo.
echo To stop all services, close all terminal windows.
echo.
pause
