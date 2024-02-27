#!/usr/bin/env bash

npm run build

if [ ! -d dist ]; then
  echo '\\033[1;31m\\t ERROR: dist不存在，请先执行build！ \\033[0m'
  exit
fi
read -r -p '请输入具名版本名称，可留空匿名发布最新版: ' version
if [ "-${version}-" == "--" ]; then
  version="dist"
fi
reponame=$(git remote -v | awk 'NR==2{print $2}' | awk -F/ '{print $NF}' | awk -F. '{print $1}')
read -p '请输入您的bitbucket用户名: ' myusername
read -s -p '请输入密码: ' mypassword

currentcommithash=$(git log -n 1 --format=%H)

currentdate=$(date +"%Y-%m-%d %H:%M:%S")
cat dist/index.html | sed 's/<meta charset="utf-8">/<meta charset="utf-8" ><meta name="lm-release-version" content="'"$version"'"><meta name="lm-release-date" content="'"$currentdate"'"><meta name="lm-release-code" content="'"$currentcommithash"'">/g' dist/index.html >dist/index.html.new
mv dist/index.html.new dist/index.html

cat deploy.template | sed 's/LABMAIREPONAME/'${reponame}'/g' >deploy.sh

echo $currentcommithash >dist/commit.code.txt

COPYFILE_DISABLE=1 tar -zcvf ${version}.tgz dist deploy.sh
cat deploy.sh
rm deploy.sh
curl -f -L -X POST -u ${myusername}:${mypassword} https://api.bitbucket.org/2.0/repositories/genee/${reponame}/downloads -F files=@${version}.tgz
if [ $? -ne 0 ]; then echo '\\033[1;31m\\t ERROR: 压缩包上传到bitbucket失败！！ \\033[0m'; fi
