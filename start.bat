@echo off
echo ======================================
echo Corbett Bakers - Quick Start
echo ======================================
echo.

echo [1/3] Installing dependencies...
call npm install
cd server
call npm install
cd ..
echo ✓ Dependencies installed

echo.
echo [2/3] Starting Backend Server...
echo Backend will run on http://localhost:5000
start cmd /k "cd server && npm run dev"

echo.
echo [3/3] Starting Frontend Server...
timeout /t 2
call npm run dev

echo.
echo ======================================
echo Setup Complete!
echo ======================================
echo Frontend: http://localhost:5173
echo Backend: http://localhost:5000
echo Admin Panel: http://localhost:5173/#/admin
echo Credentials: admin / admin@123
echo ======================================
