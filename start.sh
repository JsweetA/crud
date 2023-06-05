#!/bin/sh
set -ux

app_name="tianyi-web"

repo_url="$1"
repo_auth="any:hFEyg1_5RSpkZL5ZMPvw"
repository="http://$repo_auth@${repo_url#*//}"

if [ ! -d "$app_name" ]; then
    echo "项目仓库不存在,执行git clone"
    git clone $repository
    cd $app_name
else
    echo "项目仓库已存在,执行git pull"
    cd $app_name
    git pull $repository
fi

npm config set registry https://registry.npm.taobao.org
npm i
npm run build
node update.js './dist' '/root/apps/www/tianyi-web'
