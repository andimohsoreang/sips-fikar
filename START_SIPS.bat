@echo off
title SIPS - Sistem Informasi Persuratan (Dewan Komisaris)
color 0A

echo.
echo  ============================================================
echo   SIPS - Sistem Informasi Penomoran Surat
echo   Dewan Komisaris - Startup Launcher
echo  ============================================================
echo.

:: ============================================================
:: 1. CHECK PHP
:: ============================================================
echo  [1/4] Memeriksa PHP...
php --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo  [ERROR] PHP tidak ditemukan!
    echo  Pastikan PHP sudah terinstall dan ada di PATH.
    echo  Download: https://windows.php.net/download/
    echo.
    pause
    exit /b 1
)
for /f "tokens=2 delims= " %%v in ('php --version ^| findstr /i "PHP"') do (
    echo  [OK] PHP versi %%v ditemukan.
    goto php_ok
)
:php_ok

echo.

:: ============================================================
:: 2. CHECK NODE & NPM
:: ============================================================
echo  [2/4] Memeriksa Node.js dan NPM...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo  [ERROR] Node.js tidak ditemukan!
    echo  Download: https://nodejs.org/
    echo.
    pause
    exit /b 1
)
for /f %%v in ('node --version') do echo  [OK] Node.js %%v ditemukan.
for /f %%v in ('npm --version') do echo  [OK] NPM v%%v ditemukan.

echo.

:: ============================================================
:: 3. CHECK COMPOSER & DEPENDENCIES
:: ============================================================
echo  [3/4] Memeriksa dependencies project...
if not exist "vendor\" (
    echo  [!] Folder vendor tidak ada. Menjalankan composer install...
    composer install --no-interaction
)
if not exist "node_modules\" (
    echo  [!] Folder node_modules tidak ada. Menjalankan npm install...
    npm install
)
echo  [OK] Dependencies siap.

echo.

:: ============================================================
:: 4. CHECK .env & APP KEY
:: ============================================================
echo  [4/4] Memeriksa konfigurasi .env...
if not exist ".env" (
    echo  [!] File .env tidak ada. Menyalin dari .env.example...
    copy .env.example .env
    php artisan key:generate
    echo  [OK] .env berhasil dibuat dengan APP_KEY baru.
) else (
    echo  [OK] File .env sudah ada.
)

:: ============================================================
:: 5. RUN MIGRATIONS (jika ada yang pending)
:: ============================================================
echo.
echo  Memeriksa status database migrations...
php artisan migrate --force --no-interaction >nul 2>&1
if %errorlevel% equ 0 (
    echo  [OK] Database migration selesai.
) else (
    echo  [!] Peringatan: Migration gagal. Cek koneksi database di .env
)

echo.
echo  ============================================================
echo   Semua pengecekan selesai! Memulai server...
echo  ============================================================
echo.
echo  Laravel Server  : http://localhost:8000
echo  Vite Dev Server : http://localhost:5173
echo.
echo  Tekan CTRL+C di masing-masing jendela untuk menghentikan.
echo.

:: ============================================================
:: LAUNCH SERVERS IN SEPARATE WINDOWS
:: ============================================================
start "SIPS - Laravel Server" cmd /k "color 0A && echo  [SIPS] Laravel Server berjalan... && echo  Alamat: http://localhost:8000 && echo. && php artisan serve"

timeout /t 2 /nobreak >nul

start "SIPS - Vite Dev Server" cmd /k "color 0B && echo  [SIPS] Vite Dev Server berjalan... && echo  Alamat: http://localhost:5173 && echo. && npm run dev"

timeout /t 3 /nobreak >nul

:: ============================================================
:: OPEN BROWSER
:: ============================================================
echo  Membuka browser...
start http://localhost:8000

echo.
echo  ============================================================
echo   SIPS berhasil dijalankan!
echo   Browser akan terbuka otomatis di http://localhost:8000
echo  ============================================================
echo.
pause
