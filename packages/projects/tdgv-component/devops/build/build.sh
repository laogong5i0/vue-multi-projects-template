#!/bin/bash
# 使用maven编译打包源码
image_repo=$1
project_names=$2
docker_username=$3  ### 镜像仓库用户名
docker_password=$4  ### 镜像仓库库用户密码
version=$5                   ### 镜像版本变量
BUILD_TYPE=$6
NPM_BUILD_SCRIPT=$7
registry_url=`echo ${image_repo}|awk -F / '{print $1}'`

function build_dockerfile(){
echo "+++++++++++++++start build dockerfile++++++++++++++++++++++"
echo  "$project_name"
tar_path=`find . -name "dist.tar.gz"`
echo "+++++++++++ ${tar_path} +++++++"
if [ -z "${tar_path}" ];then
echo "need tar.gz package is not exit"
exit 222
fi
targz=`find . -name "dist.tar.gz"|awk -F / '{print $NF}'`
#cp -r ${tar_path} .
cat << EOF > Dockerfile
## 前端公共镜像
FROM ccr.ccs.tencentyun.com/tsf_100013631257/tsf-web-public-image:latest
## 定义变量
ENV workdir /usr/local/openresty/nginx/
## 添加代码压缩包到镜像中
ADD ${targz}  \${workdir}/html/
RUN  mv \${workdir}/html/dist/*  \${workdir}/html/
WORKDIR \${workdir}

CMD ["sh", "-ec", "sh /root/tsf-consul-template-docker/script/start.sh; exec /usr/local/openresty/nginx/sbin/nginx -c /usr/local/openresty/nginx/conf/nginx.conf"]
EOF

}

function juge_status( ){
if [ $? -ne 0 ];then
echo "$1" "failed"
 exit 111
fi
}
function build_image(){
echo "+++++++++++++++start build docker image++++++++++++++++++++++"
echo ${registry_url}
docker login --username=${docker_username} --password=${docker_password} ${registry_url} && docker build -t  ${image_repo}/${project_name}:${version} .  && docker push ${image_repo}/${project_name}:${version}
juge_status build_imag
}

function build() {
  # 编译
  echo "+++++++++++++++start compiler++++++++++++++++++++++"
  echo '安装npm依赖 ===> start'
  # yarn config set registry https://rgnpm.pdcts.com.cn
  # yarn config set sass_binary_site "https://npm.taobao.org/mirrors/node-sass"

  time yarn install
  echo '安装npm依赖 ===> end'
  if [ $? -ne 0 ]
  then
  echo "Failed to yarn install"
  exit -1
  fi
  # 运行编辑+打包命令. 生成dist.tar.gz
  echo '构建前端工程 ===> start'
  # node server 工程打包
  if [ $BUILD_TYPE === 'node' ]; then
    echo "yarn ${NPM_BUILD_SCRIPT}"
    yarn ${NPM_BUILD_SCRIPT}
    mv ./node_modules ./dist/
    echo $(ls ./dist/)
  # 静态文件打包
  elif [ $BUILD_TYPE === 'static' ]; then
    mv html dist
  # - 前端工程打包
  else
    yarn ${NPM_BUILD_SCRIPT}
    echo "yarn ${NPM_BUILD_SCRIPT}"
  fi

  tar zcfv  dist.tar.gz  --exclude ./dist/dev.html dist/*


  echo '构建前端工程 ===> end'

  if [ $? -ne 0 ]; then
   echo "Failed to build ${project_name}."
    exit 128
  fi
}


function execu(){
   arr_service_list=$(echo ${project_names//,/ })
   for service in ${arr_service_list[@]};do
   project_name=$service
   build_dockerfile $service
   build_image
   done
}
build
execu
