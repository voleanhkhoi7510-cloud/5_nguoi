@echo off
chcp 65001 >nul
title FamilyConnect Backend (Port 3000)
cd /d "%~dp0"
echo ========================================================
echo   DANG KHOI DONG BACKEND FAMILYCONNECT (PORT 3000)
echo ========================================================
where npm >nul 2>nul
if errorlevel 1 (
  echo CHUA CAI NODE.JS. Vui long cai dat Node.js tu https://nodejs.org
  pause
  exit /b
)
call npm run dev
pause
