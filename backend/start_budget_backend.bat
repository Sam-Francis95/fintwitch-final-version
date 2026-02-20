@echo off
title Budget Backend Server - Port 5001
color 0e

echo ========================================
echo   Budget Allocation Backend
echo   Port: 5001
echo ========================================
echo.
echo Starting Flask server...
echo.

python budget_system.py

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Budget backend failed to start.
    echo Make sure Python and Flask are installed.
    echo.
    pause
)
