@echo off
title Spring Boot Backend Server
echo ===================================================
echo   Starting Spring Boot Backend Server (Port 8080)
echo ===================================================
cd /d "%~dp0"
"..\\.maven\\bin\\mvn.cmd" spring-boot:run
pause
