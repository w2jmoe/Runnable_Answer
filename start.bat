@echo off
setlocal
cd /d "%~dp0"
set PORT=3000
set URL=http://127.0.0.1:%PORT%

echo.
echo ========================================
echo   Runnable Answer
echo ========================================
echo.

if not exist "node_modules\" (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo.
    echo npm install failed. Please check Node.js and try again.
    pause
    exit /b 1
  )
  echo.
)

echo Stopping any old server on port %PORT%...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-NetTCPConnection -LocalPort %PORT% -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"
if exist ".next\dev\lock" del /f /q ".next\dev\lock" >nul 2>&1
timeout /t 1 /nobreak >nul

echo.
echo Starting at %URL%
echo Keep this window open while using the app.
echo Press Ctrl+C to stop the server.
echo.

REM Open browser quietly after the page responds. No second console window.
start /b powershell -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -Command "for ($i=0; $i -lt 40; $i++) { try { $r = Invoke-WebRequest -Uri '%URL%' -UseBasicParsing -TimeoutSec 1; if ($r.StatusCode -ge 200) { Start-Process '%URL%'; break } } catch {} ; Start-Sleep -Milliseconds 400 }"

call npm run dev -- -H 127.0.0.1 -p %PORT%
set EXIT_CODE=%ERRORLEVEL%

if not "%EXIT_CODE%"=="0" (
  echo.
  echo Server failed to start.
  echo Close other Node windows for this project, then run start.bat again.
  pause
  exit /b %EXIT_CODE%
)

endlocal
