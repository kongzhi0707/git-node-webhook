#!/bin/bash
# 确保脚本抛出遇到的错误
set -e 
echo "git auto push start..."

# date

dateNow=$(date +%T)

# build
npm run build

# push
git add .
git commit -m ":ok_hand: build at ${dateNow}"
git push origin master

echo "git auto push end..."
echo "build: now: ${dateNow}"