@echo off
title SIPS - Menghentikan Server
color 0C
echo.
echo  ============================================================
echo   Menghentikan semua server SIPS...
echo  ============================================================
echo.

:: Kill PHP artisan serve process
echo  Menghentikan Laravel Server (port 8000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000"') do (
    taskkill /PID %%a /F >nul 2>&1
)
echo  [OK] Laravel Server dihentikan.

:: Kill Vite dev server process
echo  Menghentikan Vite Dev Server (port 5173)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173"') do (
    taskkill /PID %%a /F >nul 2>&1
)
echo  [OK] Vite Dev Server dihentikan.

:: Close SIPS windows
taskkill /FI "WINDOWTITLE eq SIPS - Laravel Server" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq SIPS - Vite Dev Server" /F >nul 2>&1

echo.
echo  ============================================================
echo   Semua server SIPS berhasil dihentikan.
echo  ============================================================
echo.
pause
