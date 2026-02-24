@echo off
REM FinTwitch Enhanced Pathway System - Hackathon Edition
REM Starts the enhanced multi-source streaming backend

echo ========================================
echo FINTWITCH ENHANCED PATHWAY SYSTEM
echo Hackathon Edition - Multi-Source Streaming
echo ========================================
echo.

cd /d "%~dp0backend"

echo Activating Python virtual environment...
call ..\venv\Scripts\activate.bat

echo.
echo Starting Enhanced Pathway Backend (port 8000)...
echo.
echo Features:
echo  - Multi-source stream ingestion
echo  - Advanced streaming transformations
echo  - Predictive analytics
echo  - Real-time alerts
echo  - External signal integration
echo  - Multi-source data fusion
echo.

python pathway_streaming_enhanced.py

pause
