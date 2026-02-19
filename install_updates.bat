@echo off
cd /d "%~dp0"
title Installing Updates

echo ========================================
echo Installing new game components...
echo ========================================
echo.
echo Installing 'zustand'...
call npm install zustand

echo.
echo ========================================
echo Update Complete!
echo ========================================
echo.
echo Please close this window and RESTART 'start_game.bat'.
pause
