@echo off
rem Windows: double-click this file to start the app.
cd /d "%~dp0"
set PORT=8000
rem Open the browser a moment after the server starts.
start "" /b powershell -NoProfile -Command "Start-Sleep 1; Start-Process 'http://localhost:%PORT%'"

where node >nul 2>nul
if %errorlevel%==0 (
  node scripts\serve.js %PORT%
  goto :end
)
where python >nul 2>nul
if %errorlevel%==0 (
  echo Hanzi Cards is running at http://localhost:%PORT%  (Ctrl+C to stop)
  python -m http.server %PORT% --bind 127.0.0.1
  goto :end
)
echo Please install Node.js (https://nodejs.org) or Python 3 first.
pause
:end
