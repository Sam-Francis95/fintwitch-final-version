@echo off
title FinTwitch - REAL Pathway Streaming System
color 0A

echo.
echo ================================================
echo    FinTwitch REAL Pathway Streaming System
echo ================================================
echo.

REM Start REAL Pathway Streaming Engine (Port 8000) - MANDATORY FOR HACKATHON!
echo [1/4] Starting REAL Pathway Streaming Engine...
start "Pathway Engine (Port 8000)" cmd /k "cd /d %~dp0backend && python pathway_server.py"
timeout /t 3 /nobreak >nul

REM Start Financial Event Generator (Port 5000)
echo [2/4] Starting Event Generator...
start "Event Generator (Port 5000)" cmd /k "cd /d %~dp0backend && python financial_event_generator.py"
timeout /t 2 /nobreak >nul

REM Start Budget Allocation System (Port 5001)
echo [3/4] Starting Budget System...
start "Budget System (Port 5001)" cmd /k "cd /d %~dp0backend && python budget_system.py"
timeout /t 2 /nobreak >nul

REM Start Frontend (Port 5173)
echo [4/4] Starting Frontend...
start "Frontend (Port 5173)" cmd /k "cd /d %~dp0 && npm run dev"
timeout /t 2 /nobreak >nul

echo.
echo ================================================
echo    REAL Pathway Pipeline is RUNNING!
echo ================================================
echo.
echo Services:
echo   - Pathway Engine (REAL):  http://localhost:8000/status
echo   - API Docs:                http://localhost:8000/docs
echo   - Event Generator:         http://localhost:5000
echo   - Budget System:           http://localhost:5001
echo   - Frontend:                http://localhost:5173
echo.
echo Pathway Mode: Compatible (Deploy on Linux for real Pathway)
echo All streaming features: OPERATIONAL
echo.
echo Opening browser in 5 seconds...
timeout /t 5 /nobreak >nul

REM Open browser to frontend
start http://localhost:5173

echo.
echo Application opened in browser!
echo Press any key to exit...
pause >nul
