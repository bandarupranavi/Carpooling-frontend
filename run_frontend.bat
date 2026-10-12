@echo off
cd /d "%~dp0"
echo ==========================================
echo   Carpooling for College System - Frontend
echo ==========================================
where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js is not installed. Install the Node.js LTS version first.
  pause
  exit /b 1
)
where npm >nul 2>nul
if errorlevel 1 (
  echo ERROR: npm was not found. Reinstall Node.js LTS and reopen this window.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Installing frontend packages. This first step needs an internet connection...
  call npm install
  if errorlevel 1 (
    echo Package installation failed. Check your internet connection and try again.
    pause
    exit /b 1
  )
)
echo Starting frontend...
call npm run dev
pause
