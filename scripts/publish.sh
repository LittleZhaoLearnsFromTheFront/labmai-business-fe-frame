#!/usr/bin/env sh

publishProject(){
  if [ $1 == 'patch' ]; then
    npm version patch
    if [ $? -ne 0 ]; then
      echo '\\033[1;31m\\t ERROR: 版本号更改失败 \\033[0m'
      exit
    fi
  fi
  if [ $1 == 'minor' ]; then 
    npm version minor
    if [ $? -ne 0 ]; then
      echo '\\033[1;31m\\t ERROR: 版本号更改失败 \\033[0m'
      exit
    fi
  fi
  if [ $1 == 'major' ]; then
    npm version major
    if [ $? -ne 0 ]; then
      echo '\\033[1;31m\\t ERROR: 版本号更改失败 \\033[0m'
      exit
    fi
  fi

  npmVersion=$(node -e "(function () { console.log(require('./package.json').version) })()")
  read -p '请输入版本发布的内容（不能为空）：' content
  echo "- v$npmVersion\n    $content" >> README.md
  git add README.md
  git commit -m "chore:在README，增加 $npmVersion 版本内容"
    
  npm publish
  if [ $? -ne 0 ]; then
    echo '\\033[1;31m\\t ERROR: npm发布失败\\033[0m'
    exit
  fi
}

# 开始
packageVersionNow=$(node -e "(function () { console.log(require('./package.json').version) })()")
npmVersionNow=$(npm view create-react-crv version)
echo $packageVersionNow $npmVersionNow
if [ "-${packageVersionNow}-" != "-${npmVersionNow}-" ]; then
  npm publish
  if [ $? -ne 0 ]; then
    echo '\\033[1;31m\\t ERROR: npm发布失败\\033[0m'
  fi
  exit
fi

gitEditNum=$(git status --short | wc -l )

if [ $gitEditNum -gt 0 ]; then
    echo '\\033[1;31m\\t ERROR: git有未提交的文件，提交后再发布 \\033[0m'
    exit
fi

npm run build
echo "请选择发布的版本:"
select option in "BUG版本" "新增功能版本" "大版本"; do
    case $option in
        "BUG版本") 
            read -p '是否要发布BUG版本(y/n)' confirm
            if [ "-${confirm}-" == "-y-" ]; then
                publishProject 'patch'
            fi
         break;;
        "新增功能版本") 
            read -p '是否要发布新增功能版本(y/n)' confirm
            if [ "-${confirm}-" == "-y-" ]; then
                publishProject 'minor'
            fi
         break;;
        "大版本") 
            read -p '是否要发布大版本(y/n)' confirm
            if [ "-${confirm}-" == "-y-" ]; then
                publishProject 'major'
            fi
         break;;
        *) echo "无效的选项";;
    esac
done