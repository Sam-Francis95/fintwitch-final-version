@echo off
title FinTwitch Pathway Intelligence System v2.0
color 0b

echo ================================================================
echo    🌊 FinTwitch Pathway Financial Intelligence Engine v2.0
echo ================================================================
echo.
echo    Starting comprehensive real-time analytics system...
echo    • Streaming analytics
echo    • Time-windowed metrics  
echo    • Financial intelligence
echo    • LLM-powered insights
echo.

:: 1. Start Pathway Intelligence Engine v2 (Advanced Analytics)
echo [1/4] Launching Pathway Intelligence Engine (Port 8000)...
start "Pathway Intelligence v2.0" cmd /k "cd /d "%~dp0backend" && python pathway_streaming_v2.py"
timeout /t 4 >nul

:: 2. Start Event Generator Backend (Python)
echo [2/4] Launching Financial Event Generator (Port 5000)...
start "Event Generator - Port 5000" cmd /k "cd /d "%~dp0backend" && python financial_event_generator.py"
timeout /t 2 >nul

:: 3. Start Budget Backend (Python)
echo [3/4] Launching Budget System Backend (Port 5001)...
start "Budget Backend - Port 5001" cmd /k "cd /d "%~dp0backend" && python budget_system.py"
timeout /t 2 >nul

:: 4. Start Frontend Client (React + Vite)
echo [4/4] Launching FinTwitch Frontend...
start "FinTwitch Frontend" cmd /k "cd /d "%~dp0" && npm run dev"

:: 5. Wait and open browser
echo.
echo Waiting for all services to initialize...
timeout /t 10 >nul
echo.
echo Opening browser...
start http://localhost:3000/pathway

echo.
echo ================================================================
echo    ✅  PATHWAY INTELLIGENCE SYSTEM ONLINE
echo.
echo    🎮 Main App: http://localhost:3000
echo    🧠 Intelligence Dashboard: http://localhost:3000/pathway
echo    🎲 Event Generator: http://localhost:5000
echo    💰 Budget System: http://localhost:5001
echo    🌊 Pathway Engine: http://localhost:8000
echo    📚 API Docs: http://localhost:8000/docs
echo.
echo    📊 Features Active:
echo       ✓ Real-time streaming analytics
echo       ✓ Time-windowed metrics (1-60 min)
echo       ✓ Category aggregations
echo       ✓ Financial intelligence & alerts
echo       ✓ LLM-powered natural language insights
echo.
echo    Keep all terminal windows open!
echo ================================================================
echo.
pause
