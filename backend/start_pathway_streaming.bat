@echo off
title Pathway Streaming Engine - Port 8000
color 0d

echo ========================================
echo   Pathway Real-Time Streaming Engine
echo   Port: 8000
echo ========================================
echo.
echo Starting Pathway + FastAPI server...
echo.

python pathway_streaming.py

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Pathway streaming engine failed to start.
    echo Make sure Python, Pathway, and FastAPI are installed.
    echo Run: pip install -r requirements.txt
    echo.
    pause
)
