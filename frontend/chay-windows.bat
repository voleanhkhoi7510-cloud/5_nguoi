@echo off
chcp 65001 >nul
cd /d "%~dp0"
where npm >nul 2>nul
if errorlevel 1 (
  echo CHUA CAI NODE.JS. Hay vao https://nodejs.org tai ban LTS, cai xong roi bam dup file nay lai.
  pause
  exit /b
)
echo Dang cai thu vien, lan dau co the mat 1-2 phut...
call npm install
echo Dang khoi dong. Dong cua so nay de tat trang web.
call npm run dev
pause
