@echo off
title Smart Bin & Clean City AI Platform
echo Starting Smart Bin & Clean City AI Server...
start "" "http://localhost:5173"
if exist "C:\Users\hp\AppData\Local\ms-playwright-go\1.50.1\node.exe" (
    "C:\Users\hp\AppData\Local\ms-playwright-go\1.50.1\node.exe" "%~dp0run_app.js"
) else (
    node "%~dp0run_app.js"
)
pause
