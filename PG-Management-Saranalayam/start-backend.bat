@echo off
echo ===================================================
echo Starting Om Sakthi Saranalayam Ladies Hostel Backend
echo ===================================================
cd /d "%~dp0backend"
if exist "mvnw.cmd" (
    call mvnw.cmd spring-boot:run
) else (
    mvn spring-boot:run
)
pause
