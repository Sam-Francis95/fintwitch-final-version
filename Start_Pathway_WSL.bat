@echo off
title Pathway Streaming Engine (WSL) - Port 8000
color 0a

echo ============================================================
echo   FinTwitch - REAL Pathway Streaming Engine via WSL
echo   Python: 3.12 (WSL Ubuntu 24.04)
echo   Pathway: 0.29.1 (REAL)
echo   Port: 8000
echo ============================================================
echo.

:: Check WSL is running
wsl -d Ubuntu -u root -- bash -c "echo WSL OK" >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] WSL Ubuntu is not available.
    echo Run: wsl --install -d Ubuntu --web-download
    pause
    exit /b 1
)

echo [OK] WSL Ubuntu ready

:: Kill any old instance first
echo [..] Killing old Pathway processes...
wsl -d Ubuntu -u root -- pkill -9 -f pathway_streaming_enhanced 2>nul
timeout /t 2 /nobreak >nul

echo [>>] Starting Pathway backend on http://localhost:8000 ...
echo.

:: Build WSL-compatible path dynamically (works on any machine)
for /f "usebackq delims=" %%i in (`wsl -d Ubuntu -u root -- wslpath -u "%~dp0backend\pathway_streaming_enhanced.py"`) do set WSL_SCRIPT=%%i

:: Run the enhanced pathway streaming backend using WSL Python venv
wsl -d Ubuntu -u root -- /root/pw_venv/bin/python3 %WSL_SCRIPT%

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Pathway backend exited with an error.
    echo Check the output above for details.
    pause
)
