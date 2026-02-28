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

REM === STEP 1: Detect WSL Ubuntu for Real Pathway ===
echo [1/4] Checking for WSL Ubuntu (Real Pathway Engine)...
wsl -d Ubuntu -u root -- bash -c "echo WSL_OK" >nul 2>&1
if errorlevel 1 goto NO_WSL

:HAS_WSL
echo        [OK] WSL Ubuntu detected - Starting REAL Pathway Engine on port 8000...
for /f "usebackq delims=" %%i in (`wsl -d Ubuntu -u root -- wslpath -u "%~dp0backend\pathway_streaming_enhanced.py"`) do set WSL_SCRIPT=%%i
start "Pathway Streaming - WSL REAL (Port 8000)" cmd /k "wsl -d Ubuntu -u root -- /root/pw_venv/bin/python3 %WSL_SCRIPT%"
set PATHWAY_MODE=REAL
timeout /t 5 /nobreak >nul
goto CONTINUE

:NO_WSL
echo        [!!] WSL Ubuntu NOT found.
echo        [->] Pathway backend will not start - UI will use built-in mock data.
set PATHWAY_MODE=MOCK

:CONTINUE
REM === STEP 2: Financial Event Generator (Port 5000) ===
echo [2/4] Starting Financial Event Generator...
start "Event Generator (Port 5000)" cmd /k "%~dp0.venv\Scripts\python.exe %~dp0backend\financial_event_generator.py"
timeout /t 2 /nobreak >nul

REM === STEP 3: Budget Allocation System (Port 5001) ===
echo [3/4] Starting Budget Allocation System...
start "Budget System (Port 5001)" cmd /k "%~dp0.venv\Scripts\python.exe %~dp0backend\budget_system.py"
timeout /t 2 /nobreak >nul

REM === STEP 4: Frontend ===
echo [4/4] Starting Frontend...
start "Frontend" cmd /k "cd /d %~dp0 && npm run dev"
timeout /t 2 /nobreak >nul

echo.
echo ================================================
echo    All Services Started!
echo ================================================
echo.
echo Services Running:
if "%PATHWAY_MODE%"=="REAL" goto SHOW_REAL_SUMMARY
echo   - Pathway Engine:   [NOT RUNNING - UI uses built-in mock data]
goto SHOW_REST
:SHOW_REAL_SUMMARY
echo   - Pathway Engine:   http://localhost:8000  [REAL - WSL Ubuntu]
:SHOW_REST
echo   - Event Generator:  http://localhost:5000
echo   - Budget System:    http://localhost:5001
echo   - Frontend:         http://localhost:5173
echo.
if "%PATHWAY_MODE%"=="REAL" goto SHOW_REAL_MODE
echo   Pathway Mode: DEMO  ^(No WSL Ubuntu found - install WSL for live data^)
echo   To install WSL: wsl --install -d Ubuntu --web-download
goto OPEN_BROWSER
:SHOW_REAL_MODE
echo   Pathway Mode: REAL  ^(WSL Ubuntu + Pathway 0.29^)
:OPEN_BROWSER
echo.
echo Press any key to open browser...
pause >nul

start http://localhost:5173

echo.
echo To stop all services, close all terminal windows.
echo.
pause
