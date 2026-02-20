@echo off
title FinTwitch - Complete System Startup
color 0A

echo.
echo ================================================
echo    FinTwitch Complete System Startup
echo ================================================
echo.
echo Starting all services...
echo.

REM Start Financial Event Generator (Port 5000)
echo [1/3] Starting Financial Event Generator...
start "Event Generator (Port 5000)" cmd /k "cd /d %~dp0backend && python financial_event_generator.py"
timeout /t 2 /nobreak >nul

REM Start Budget Allocation System (Port 5001)
echo [2/3] Starting Budget Allocation System...
start "Budget System (Port 5001)" cmd /k "cd /d %~dp0backend && python budget_system.py"
timeout /t 2 /nobreak >nul

REM Start Frontend Development Server (Port 5173)
echo [3/3] Starting Frontend Development Server...
start "Frontend (Port 5173)" cmd /k "cd /d %~dp0 && npm run dev"
timeout /t 2 /nobreak >nul

echo.
echo ================================================
echo    All Services Started Successfully!
echo ================================================
echo.
echo Services Running:
echo   - Event Generator:  http://localhost:5000
echo   - Budget System:    http://localhost:5001
echo   - Frontend:         http://localhost:5173
echo.
echo Press any key to open browser...
pause >nul

REM Open browser
start http://localhost:5173

echo.
echo To stop all services, close all terminal windows.
echo.
pause
