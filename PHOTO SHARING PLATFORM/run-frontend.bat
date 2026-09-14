@echo off
title React Frontend Server
echo ===================================================
echo   Starting React Frontend Dev Server (Port 5173)
echo ===================================================
cd /d "%~dp0frontend"
npm run dev
pause
