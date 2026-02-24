@echo off
title Starting Pathway API (Port 8000)
color 0D

echo.
echo ================================================
echo    QUICK FIX: Starting Pathway API
echo ================================================
echo.
echo This will fix the "Error: Failed to fetch" issue!
echo.

cd /d "%~dp0backend"
echo Starting Pathway Streaming Engine v2 on Port 8000...
echo (Using advanced mock - works without real Pathway!)
python pathway_streaming_v2.py

pause
