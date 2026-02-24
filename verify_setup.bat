@echo off
title FinTwitch - Setup Verification
color 0B

echo.
echo ================================================
echo    FinTwitch Setup Verification
echo ================================================
echo.

echo [1/5] Checking Python installation...
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Python not found. Please install Python from python.org
    pause
    exit /b 1
) else (
    echo ✅ Python installed
)
echo.

echo [2/5] Checking Node.js installation...
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found
    pause
    exit /b 1
) else (
    echo ✅ Node.js installed
)
echo.

echo [3/5] Checking Python dependencies...
cd backend
python -c "import flask, flask_cors, requests, fastapi, uvicorn" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Some Python packages missing. Installing...
    pip install -r requirements.txt
) else (
    echo ✅ Python dependencies OK
)
cd ..
echo.

echo [4/5] Checking Node.js dependencies...
if not exist "node_modules" (
    echo ⚠️  node_modules not found. Installing...
    call npm install
) else (
    echo ✅ Node.js dependencies OK
)
echo.

echo [5/5] Checking backend .env configuration...
if exist "backend\.env" (
    echo ✅ .env file exists
) else (
    echo ⚠️  .env file missing. Please create backend\.env
)
echo.

echo ================================================
echo    Verification Complete!
echo ================================================
echo.
echo Next steps:
echo   1. Double-click: start_all_services.bat
echo   2. Browser will open to: http://localhost:5173
echo.
echo Services will run on:
echo   - Frontend:        http://localhost:5173
echo   - Event Generator: http://localhost:5000
echo   - Budget System:   http://localhost:5001
echo   - Pathway API:     http://localhost:8000
echo.
pause
