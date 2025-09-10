#!/bin/bash

echo "==================================="
echo "自动修复Vue依赖问题并启动项目"
echo "==================================="

node fix-and-start.js

if [ $? -ne 0 ]; then
  echo "自动修复失败，请参考 ERROR_FIX_GUIDE.md 文件手动解决问题"
  read -p "按任意键继续..."
fi 