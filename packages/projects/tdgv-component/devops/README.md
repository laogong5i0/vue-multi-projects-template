# 政务云 coding 标准发布脚本

## 接入必读须知，以下变量配置需在 coding 配置参数中使用

TSF 接入系统固定变量

| 名称                | 默认值                                    | 描述                 | 类型        | 说明                                                                       |
| ------------------- | ----------------------------------------- | -------------------- | ----------- | -------------------------------------------------------------------------- |
| VERSION             | v0.0.1                                    | 版本号               | String      | 发布版本号                                                                 |
| DEPLOY_ENABLE       | true                                      | -                    | Boolean     | 是否自动发布,运维预留参数                                                  |
| TSF_REPO            | `ccr.ccs.tencentyun.com/tsf_100013631257` | TSF 镜像仓库         | String      | 用于拉取制品镜像地址                                                       |
| HARBOR_ACCOUNT_NAME | 100006274537                              | TSF 发布账号         | String      | -                                                                          |
| HARBOR_PASSWORD     | 已运维配置为准                            | TSF 镜像发布账号密码 | String      | -                                                                          |
| SUB_CREDENTIALS_ID  | 已运维配置为准                            | 工蜂 Coding 凭据     | Coding 凭据 | 用于拉取 git 仓库代码的账号，需在自己的项目或项目组中关联`ipc_csig3`该账号 |
| TSF_ENDPOINT        | `tsf.tencentcloudapi.com`                 | TSF 发布服务地址     | String      | -                                                                          |
| APPLICATION_TYPE    | C                                         | -                    | String      | -                                                                          |
| MICROSERVICE_TYPE   | N                                         | -                    | String      | -                                                                          |
| PROTOCOL_PORTS      | 80                                        | 容器端口             | Number      | 部署 tsf 容器端口                                                          |
| ACCESS_TYPE         | 2                                         | -                    | Number      | -                                                                          |
| SECRET_ID           | 以运维配置为准                            | tsf 认证密钥         | Password    | 密钥                                                                       |
| SECRET_KEY          | 以运维配置为准                            | tsf 认证密钥 key     | Password    | 密钥 key                                                                   |
| remote_passwd       | 以运维配置为准                            | tsf 认证密钥 key     | Password    | 密钥 key,暂未用到                                                          |

| TSF 接入需配置的变量 | 名称 | 类型 | 说明 | 
| --- | --- | --- | --- |
| SUB_GIT_REPO_URL | git 仓库地址 | String | git 代码仓库 | 
| DEPLOY_ENV | 发布项目环境 | String | 环境设置 `${项目}-dev` |
| NPM_BUILD_SCRIPT | npm 执行脚本 | String | npm 脚本参数 | 
| GIT_USERNAME | git 账号 | String | 用于拉取 submodule |
| GIT_PASSWORD | git 密码 | String | 用于拉取 submodule | 
| SUB_BRANCH | 分支名称 | String | 分支名称 | 
| APPLICATION_NAME | 项目工程名称 | String | 项目工程名称 | 
| GIT_PROJECT_NAME | tsf 打包发布名称 | String | tsf 打包发布名称 | 
| BUILD_TYPE | 编译类型 | String | `node | static | default ` |

> 开发接入 tsf 需要更改未 TSF 接入需配置的变量

```bash
# doker 登录
doker login --username=100006274537 ccr.ccs.tencentyun.com
```
