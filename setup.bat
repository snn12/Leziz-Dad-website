@echo off
title Leziz Dad - Quraşdırma (SETUP)
echo ============================================
echo  Leziz Dad - quraşdırma baslayir
echo  Bu is bir nece deqiqe ceke biler
echo ============================================
echo.
echo [1/3] Backend paketleri quraşdirilir...
cd /d "%~dp0server"
call npm install
echo.
echo [2/3] Frontend paketleri quraşdirilir...
cd /d "%~dp0client"
call npm install
echo.
echo [3/3] Sayt yiginir (build)...
call npm run build
echo.
echo ============================================
echo  HAZIR! Indi start.bat faylini calisdirin
echo ============================================
pause