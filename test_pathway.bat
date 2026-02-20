@echo off
title Test Pathway Integration
color 0a

echo ========================================
echo   Testing Pathway Integration
echo ========================================
echo.

python test_pathway_integration.py

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Test script failed to run.
    echo Make sure Python and requests library are installed.
    echo Run: pip install requests
    echo.
)

pause
