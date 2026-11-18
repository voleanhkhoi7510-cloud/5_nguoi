@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ===================================================================
echo     KHOI DONG DONG THOI BACKEND VA FRONTEND - FAMILYCONNECT
echo ===================================================================
echo.

where npm >nul 2>nul
if errorlevel 1 (
  echo [LOI] Khong tim thay Node.js. Vui long cai dat Node.js tu https://nodejs.org
  pause
  exit /b
)

echo [1/2] Dang khoi dong Backend (Port 3000)...
start "FamilyConnect Backend (Port 3000)" cmd /k "cd /d ""%~dp0backend"" && title FamilyConnect Backend (Port 3000) && npm run dev"

timeout /t 2 /nobreak >nul

echo [2/2] Dang khoi dong Frontend (Port 5173)...
start "FamilyConnect Frontend (Port 5173)" cmd /k "cd /d ""%~dp0frontend"" && title FamilyConnect Frontend (Port 5173) && npm run dev"

echo.
echo ===================================================================
echo   DA KHOI DONG CA HAI DICH VU!
echo.
echo   * Frontend dang mo tai: http://localhost:5173
echo   * Backend API chay tai: http://localhost:3000
echo   * Kiem tra Backend:     http://localhost:3000/api/v1/health
echo.
echo   (De tat ca hai ung dung, hay dong 2 cua so CMD vua mo len)
echo ===================================================================
echo.
pause
