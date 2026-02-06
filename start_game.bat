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
start "" "http://localhost:3000"
call npm start

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Server failed to start.
    pause
)

pause
