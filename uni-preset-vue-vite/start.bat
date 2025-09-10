@echo off
echo ===================================
echo 自动修复Vue依赖问题并启动项目
echo ===================================

node fix-and-start.js

if %ERRORLEVEL% NEQ 0 (
  echo 自动修复失败，请参考 ERROR_FIX_GUIDE.md 文件手动解决问题
  pause
) 