@echo off
echo ================================================
echo   Starting FinTwitch Backend with Gemini AI
echo ================================================
echo.

cd backend

echo Starting Pathway Streaming Engine...
echo Backend will run on: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.

python pathway_streaming_real.py

pause
