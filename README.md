# fx多项目和组件管理模板
fx多项目管理模板

## Experience quickly
* [Live playground](https://github.com/laogong5i0/ "fx 多项目管理模板")


## 运行前(初始化项目)

```bash
# 安装所有项目的依赖包
yarn bootstrap
```

## 运行指定项目、组件库
```bash
# 首先在项目根目录上的package.json中使用yarn workspace [项目名称] [项目的scripts]定义运行指令
# 例如："dev:proj1": "yarn workspace tdesign-gov-vue-scaffold dev",

# 使用yarn运行
yarn dev:proj1

# 如何运行组件库
# 首先在项目根目录上的package.json中使用yarn workspace [项目名称] [项目的scripts]定义运行指令
# 例如："lib:gt4-components:watch": "yarn workspace @fx/gt4-components watch",
yarn lib:gt4-components:watch

```

## 目录结构

```bash
├── packages
│   ├── docs
│   ├── gt4-dzswj-common-fx
│   |   ├── components   # 业务组件
│   |   └── utils   # 实用js函数库
|   └── projects  # 所有的项目工程存放路径。按服务划分
│       ├── proj1 # 具体项目，这里的文件不提交到git上。每个开发者需要时自己到git上clone到projects目录中并单独管理
│       └── proj2
```

## 框架使用规范

### 项目和组件库命名规范

- 组件和项目名统一使用小写字母多个单词使用`-`隔开

### 项目和组件库运行名称定义规范

- 组件和js函数库统一使用: `lib:[组件库名称]:[watch/build]`
- 项目统一使用: `[dev/build]:[项目名称]`

## 如何安装npm服务器上npm包到项目具体项目中
```bash

# 给proA安装依赖packageA
lerna add packageA --scope=proA 

# 给proA项目安装依赖包package-a@0.0.0
yarn workspace proA add package-a@0.0.0 

# 进入到具体项目安装依赖包。这方式不推荐使用。
cd projects/app1 & yarn add hello-world 

# 在root下安装公⽤依赖typescript包
yarn add -W -D typescript 

```

## 当前工程内组件和工具安装到指定项目
```bash
# 安装module-1 到目录packages/prefix- 的文件里去
lerna add module-1 packages/prefix-*

# Install babel-core 到所有modules
lerna add babel-core

# Install @fx/gt4-utils to proj1
lerna add @fx/gt4-utils --scope=proj1

# Install module-1 to module-2 in devDependencies
lerna add module-1 --scope=module-2 --dev

# Install module-1 to module-2 in peerDependencies
lerna add module-1 --scope=module-2 --peer

# 将packageA作为proA的依赖进⾏安装
larna add package-a --scope=proA  

```
~~^== yarn workspace安装本地包，第⼀次必须加上lerna.json中的版本号（后续⼀定不要再加版本号），否则，会从 npm.org远程检索安装~~


### Description
* balbalbalballalbla


## Relevant
[Vue](https://cn.vuejs.org/) |
[TDesign](https://tdesign.tencent.com/)

## License
Apache-2.0
