@echo off
title FinTwitch Complete System (fin_final2)
color 0b

echo ================================================================
echo       🚀 Starting FinTwitch City + Pathway Analytics
echo ================================================================
echo.

:: 1. Start Pathway + FastAPI Backend (Python)
echo [1/3] Launching Pathway Analytics Backend (Port 8000)...
start "Pathway Backend - Port 8000" cmd /k "cd /d "C:\Users\lenovo\Desktop\fintwitch python pathway" && .venv\Scripts\activate && python main.py"
timeout /t 3 >nul

:: 2. Start Event Generator Backend (Python)
echo [2/3] Launching Financial Event Generator (Port 5000)...
start "Event Generator - Port 5000" cmd /k "cd /d "C:\Users\lenovo\Desktop\fin_final2\backend" && python financial_event_generator.py"
timeout /t 3 >nul

:: 3. Start Frontend Client (React + Vite)
echo [3/3] Launching FinTwitch City Frontend...
start "FinTwitch City Frontend" cmd /k "cd /d "C:\Users\lenovo\Desktop\fin_final2" && npm run dev"

:: 4. Wait and open browser
echo.
echo [4/4] Waiting for services to start...
timeout /t 8 >nul
echo.
echo Opening browser...
start http://localhost:3000

echo.
echo ================================================================
echo    ✅  COMPLETE SYSTEM ONLINE
echo.
echo    🎮 Game: http://localhost:3000
echo    🎲 Event Generator: http://localhost:5000
echo    📊 Analytics Backend: http://localhost:8000
echo    📈 View Transactions: http://localhost:8000/transactions
echo    📚 API Docs: http://localhost:8000/docs
echo.
echo    Keep all windows open while playing!
echo ================================================================
echo.
pause
