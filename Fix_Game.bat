@echo off
cd /d "%~dp0"
title Repairing FinTwitch...

echo ========================================
echo 🛠️ REPAIRING GAME FILES
echo ========================================
echo.
echo 1. Clearing old cache...
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite"
if exist "package-lock.json" del "package-lock.json"

echo.
echo 2. Installing ALL dependencies (React, Vite, Firebase)...
call npm install

echo.
echo ========================================
echo ✅ REPAIR AND UPDATE COMPLETE!
echo ========================================
echo.
echo You can now close this window and run 'start_game.bat'.
pause
