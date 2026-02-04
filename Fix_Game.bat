@echo off
cd /d "%~dp0"
title Repairing FinTwitch...

echo ========================================
echo 🛠️ REPAIRING GAME FILES
echo ========================================
echo.
echo 1. Installing missing 'zustand' library...
call npm install zustand --save

echo.
echo 2. Clearing Game Cache...
if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite"
)

echo.
echo ========================================
echo ✅ REPAIR COMPLETE!
echo ========================================
echo.
echo You can now close this window and run 'start_game.bat'.
pause
