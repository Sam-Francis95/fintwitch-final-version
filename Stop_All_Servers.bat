@echo off
title Closing FinTwitch Servers...
color 0C
echo ========================================
echo Stopping all running FinTwitch servers...
echo ========================================
echo.

echo Stopping all Node.js processes (Frontend)...
taskkill /F /IM node.exe /T >nul 2>&1

echo Stopping all Python processes (Backend)...
taskkill /F /IM python.exe /T >nul 2>&1

timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo All servers stopped successfully!
echo ========================================
echo.
echo To restart, double-click: start_all_services.bat
echo Frontend will be on: http://localhost:5173
echo.
pause
