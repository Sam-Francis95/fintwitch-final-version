@echo off
title Closing Game Servers...
echo ========================================
echo Stopping all running FinTwitch servers...
echo ========================================
echo.

taskkill /F /IM node.exe /T
taskkill /F /IM python.exe /T

echo.
echo ========================================
echo All servers stopped.
echo You can now start fresh on Port 3000.
echo ========================================
echo.
pause
