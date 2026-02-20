@echo off
echo ================================================
echo   FinTwitch v3.0 - Quick Setup for Windows
echo   Real Pathway + Gemini AI Integration
echo ================================================
echo.

echo [1/5] Checking Python...
python --version
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Python not found. Install from python.org
    pause
    exit /b 1
)
echo OK: Python found
echo.

echo [2/5] Installing Python dependencies...
cd backend
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install Python packages
    cd ..
    pause
    exit /b 1
)
cd ..
echo OK: Python packages installed
echo.

echo [3/5] Checking if .env exists...
if exist "backend\.env" (
    echo OK: .env file already exists
) else (
    echo Creating .env from template...
    copy "backend\.env.example" "backend\.env"
    echo.
    echo IMPORTANT: Edit backend\.env to add your Gemini API key
    echo Get FREE key at: https://aistudio.google.com/app/apikey
    echo.
)
echo.

echo [4/5] Installing Node.js dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Node.js packages failed to install
    echo You can install them later with: npm install
)
echo.

echo [5/5] Checking Docker (optional)...
docker --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo OK: Docker is installed
    docker ps >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo OK: Docker is running
    ) else (
        echo WARNING: Docker is not running
        echo You can start it from Docker Desktop
    )
) else (
    echo INFO: Docker not installed (optional)
    echo Download from: https://www.docker.com/products/docker-desktop
)
echo.

echo ================================================
echo   SETUP COMPLETE!
echo ================================================
echo.
echo Next Steps:
echo   1. Edit backend\.env with your Gemini API key
echo      Get it FREE at: https://aistudio.google.com/app/apikey
echo.
echo   2. Start the system:
echo      - With Docker: docker-compose up -d
echo      - Without Docker: Start_With_Analytics.bat
echo.
echo   3. Access at: http://localhost:3000
echo.
echo Ready? Press any key to open the Gemini API key page...
pause >nul
start https://aistudio.google.com/app/apikey
echo.
echo After getting your API key, edit backend\.env and start the system!
echo.
pause
