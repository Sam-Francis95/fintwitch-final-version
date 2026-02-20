# FinTwitch - Automated Setup Script for Windows
# This script sets up Docker, Pathway, and Gemini integration

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  FinTwitch v3.0 - Automated Setup for Windows" -ForegroundColor Cyan  
Write-Host "  Real Pathway + Gemini AI Integration" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️  WARNING: Not running as Administrator" -ForegroundColor Yellow
    Write-Host "Some operations may fail without admin privileges" -ForegroundColor Yellow
    Write-Host ""
}

# Step 1: Check Python
Write-Host "[1/7] Checking Python installation..." -ForegroundColor Green
$pythonVersion = python --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Python found: $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Python not found. Please install Python 3.9+ from python.org" -ForegroundColor Red
    exit 1
}

# Step 2: Check Docker
Write-Host "`n[2/7] Checking Docker Desktop..." -ForegroundColor Green
$dockerVersion = docker --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Docker found: $dockerVersion" -ForegroundColor Green
    
    # Check if Docker is running
    docker ps 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Docker is running" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Docker is installed but not running" -ForegroundColor Yellow
        Write-Host "   Please start Docker Desktop and run this script again" -ForegroundColor Yellow
        
        # Try to start Docker Desktop
        $dockerPath = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
        if (Test-Path $dockerPath) {
            Write-Host "   Starting Docker Desktop..." -ForegroundColor Cyan
            Start-Process $dockerPath
            Write-Host "   Waiting 30 seconds for Docker to start..." -ForegroundColor Cyan
            Start-Sleep -Seconds 30
        }
    }
} else {
    Write-Host "❌ Docker Desktop not found" -ForegroundColor Red
    Write-Host "   Download from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    Write-Host "   After installing Docker, run this script again" -ForegroundColor Yellow
    
    $response = Read-Host "Would you like to open the Docker download page? (Y/N)"
    if ($response -eq 'Y' -or $response -eq 'y') {
        Start-Process "https://www.docker.com/products/docker-desktop"
    }
    exit 1
}

# Step 3: Check WSL 2
Write-Host "`n[3/7] Checking WSL 2..." -ForegroundColor Green
$wslVersion = wsl --list --verbose 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ WSL is installed" -ForegroundColor Green
    if ($wslVersion -match "VERSION 2") {
        Write-Host "✓ WSL 2 is active" -ForegroundColor Green
    } else {
        Write-Host "⚠️  WSL 2 not found. Setting default to WSL 2..." -ForegroundColor Yellow
        wsl --set-default-version 2
    }
} else {
    Write-Host "⚠️  WSL not fully configured" -ForegroundColor Yellow
    Write-Host "   Docker will handle WSL setup automatically" -ForegroundColor Cyan
}

# Step 4: Install Python Dependencies
Write-Host "`n[4/7] Installing Python dependencies..." -ForegroundColor Green
Set-Location -Path "backend"
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Python packages installed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install Python packages" -ForegroundColor Red
    Set-Location -Path ".."
    exit 1
}

Set-Location -Path ".."

# Step 5: Configure Gemini API
Write-Host "`n[5/7] Configuring Gemini API..." -ForegroundColor Green

if (Test-Path "backend\.env") {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
    $content = Get-Content "backend\.env" -Raw
    if ($content -match "GEMINI_API_KEY=AI[a-zA-Z0-9_-]+") {
        Write-Host "✓ Gemini API key found in .env" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Gemini API key not configured" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "🔑 Get your FREE Gemini API key:" -ForegroundColor Cyan
        Write-Host "   1. Visit: https://aistudio.google.com/app/apikey" -ForegroundColor White
        Write-Host "   2. Sign in with Google" -ForegroundColor White
        Write-Host "   3. Click 'Create API Key'" -ForegroundColor White
        Write-Host "   4. Copy your key (starts with 'AI...')" -ForegroundColor White
        Write-Host ""
        
        $response = Read-Host "Would you like to open the API key page now? (Y/N)"
        if ($response -eq 'Y' -or $response -eq 'y') {
            Start-Process "https://aistudio.google.com/app/apikey"
        }
        
        Write-Host ""
        $apiKey = Read-Host "Enter your Gemini API key (or press Enter to skip)"
        
        if ($apiKey) {
            $envContent = Get-Content "backend\.env" -Raw
            $envContent = $envContent -replace "GEMINI_API_KEY=.*", "GEMINI_API_KEY=$apiKey"
            $envContent | Set-Content "backend\.env" -NoNewline
            Write-Host "✓ API key saved to .env" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Skipped API key setup. System will use mock mode." -ForegroundColor Yellow
            Write-Host "   You can add your key to backend\.env later" -ForegroundColor Cyan
        }
    }
} else {
    Write-Host "Creating .env file from template..." -ForegroundColor Cyan
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "✓ .env file created" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Edit backend\.env to add your Gemini API key" -ForegroundColor Yellow
    Write-Host "   Get FREE key: https://aistudio.google.com/app/apikey" -ForegroundColor Cyan
}

# Step 6: Build Docker Image
Write-Host "`n[6/7] Building Docker image..." -ForegroundColor Green
Write-Host "This may take a few minutes on first run..." -ForegroundColor Cyan

docker build -t fintwitch-pathway ./backend

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Docker image built successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to build Docker image" -ForegroundColor Red
    Write-Host "   Try: docker-compose build" -ForegroundColor Yellow
}

# Step 7: Install Node Dependencies
Write-Host "`n[7/7] Installing Node.js dependencies..." -ForegroundColor Green
$nodeVersion = node --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Node packages installed" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Failed to install Node packages" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Node.js not found. Frontend setup skipped." -ForegroundColor Yellow
    Write-Host "   Install Node.js from: https://nodejs.org/" -ForegroundColor Cyan
}

# Setup Complete
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  ✅ SETUP COMPLETE!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Option 1 - Docker Start (Recommended):" -ForegroundColor White
Write-Host "  docker-compose up -d" -ForegroundColor Yellow
Write-Host ""
Write-Host "Option 2 - Manual Start:" -ForegroundColor White
Write-Host "  .\Start_With_Analytics.bat" -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 Access Points:" -ForegroundColor Cyan
Write-Host "  • Frontend:      http://localhost:3000" -ForegroundColor White
Write-Host "  • Pathway API:   http://localhost:8000" -ForegroundColor White
Write-Host "  • API Docs:      http://localhost:8000/docs" -ForegroundColor White
Write-Host "  • LLM Insights:  http://localhost:8000/insights/llm" -ForegroundColor White
Write-Host "  • Status Check:  http://localhost:8000/status" -ForegroundColor White
Write-Host ""
Write-Host "📖 Documentation:" -ForegroundColor Cyan
Write-Host "  • Gemini Setup:  GEMINI_SETUP.md" -ForegroundColor White
Write-Host "  • Docker Guide:  DOCKER_PATHWAY_SETUP.md" -ForegroundColor White
Write-Host "  • Full Setup:    REAL_PATHWAY_LLM_SETUP.md" -ForegroundColor White
Write-Host ""
Write-Host "🔑 Remember: Add your Gemini API key to backend\.env for real AI!" -ForegroundColor Yellow
Write-Host "   Get it FREE at: https://aistudio.google.com/app/apikey" -ForegroundColor Cyan
Write-Host ""

$response = Read-Host "Would you like to start the system now with Docker? (Y/N)"
if ($response -eq 'Y' -or $response -eq 'y') {
    Write-Host "`nStarting FinTwitch with Docker Compose..." -ForegroundColor Green
    docker-compose up -d
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ System started successfully!" -ForegroundColor Green
        Write-Host "  Opening dashboard in browser..." -ForegroundColor Cyan
        Start-Sleep -Seconds 5
        Start-Process "http://localhost:3000/pathway"
    }
} else {
    Write-Host "`nYou can start the system later with:" -ForegroundColor Cyan
    Write-Host "  docker-compose up -d" -ForegroundColor Yellow
    Write-Host "or" -ForegroundColor Cyan
    Write-Host "  .\Start_With_Analytics.bat" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Green
