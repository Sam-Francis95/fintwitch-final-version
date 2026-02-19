@echo off
echo ========================================
echo   FinTwitch Pathway Backend Starter
echo ========================================
echo.

cd /d "%~dp0"

echo [1/2] Activating virtual environment...
call .venv\Scripts\activate.bat

echo [2/2] Starting FastAPI server on port 8000...
echo.
echo Backend will be available at: http://localhost:8000
echo API Documentation at: http://localhost:8000/docs
echo.
echo Press CTRL+C to stop the server
echo ========================================
echo.

python main.py

pause
