# FinTwitch Pathway Backend Starter (PowerShell)

Write-Host "========================================"
Write-Host "  FinTwitch Pathway Backend Starter" -ForegroundColor Cyan
Write-Host "========================================"
Write-Host ""

Set-Location $PSScriptRoot

Write-Host "[1/2] Activating virtual environment..." -ForegroundColor Yellow
& ".\.venv\Scripts\Activate.ps1"

Write-Host "[2/2] Starting FastAPI server on port 8000..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Backend available at: " -NoNewline
Write-Host "http://localhost:8000" -ForegroundColor Green
Write-Host "API Documentation at: " -NoNewline
Write-Host "http://localhost:8000/docs" -ForegroundColor Green
Write-Host ""
Write-Host "Press CTRL+C to stop the server" -ForegroundColor Red
Write-Host "========================================"
Write-Host ""

python main.py
