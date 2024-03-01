#!/usr/bin/env bash
runBuild(){
    cp src/pages/nodes/$2.ts src/pages/images.ts
    export NODE_NAME=$2
    vite build
    sed -i '' 's/\/LABMAI_BUSINESS_CLOUD_BEAN_FE_ROOT_PATH/LABMAI_BUSINESS_CLOUD_BEAN_FE_ROOT_PATH/g' dist/$1-$2/index.html
}

if [ "-$VERSION_NAME-" == '--' ];then
    echo "\\033[1;31m\\t ERROR: 没有版本信息 \\033[0m"
    exit
fi

tsc
files_data=$(ls -F -R src/pages/nodes)
echo $files_data
if [ "-$READ_VERSION-" == "--" ];then
    for file in $files_data
    do
        runBuild $VERSION_NAME ${file%.ts}
    done
    exit
fi
read -p '请输入需打包的节点: ' nodeName

if [ "-$nodeName-" != "--" ];
then
    if [[ ! $files_data[@] =~ "$nodeName.ts" ]];then
        echo "\\033[1;31m\\t ERROR: src/pages/nodes目录下不包含该节点 \\033[0m"
        exit
    fi
    runBuild $VERSION_NAME $nodeName
else
    for file in $files_data
    do
        runBuild $VERSION_NAME ${file%.ts}
    done
fi




