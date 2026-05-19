# yianzhihu

`yianzhihu` 是一个面向子女、老人、护理员与院方管理场景的养老/护理服务系统。项目采用前后端分离架构，包含后端微服务、管理后台和小程序前端三部分，适合用于活动管理、商品管理、护理服务、消息沟通和用户业务流程的统一承载。

## 项目结构

```text
.
├── backend-mp      # Spring Boot / Spring Cloud 多模块后端
├── backend-admin   # Vue 3 + Element Plus 管理后台
└── frontend-mp    # uni-app / uVue 小程序前端
```

## 技术栈

- 后端：Spring Boot 2.7.14、Spring Cloud、Spring Cloud Alibaba、MyBatis-Plus、Redis、RabbitMQ、Sentinel、OpenFeign
- 管理后台：Vue 3、Vue Router 4、Pinia、Element Plus、Axios、ECharts
- 小程序前端：uni-app / uVue、Vue 3
- 数据库：MySQL 8.0

## 功能模块

### 后端微服务

`backend-mp` 是 Maven 多模块工程，包含以下服务：

- `yiAnZhiHu-gateway`
- `yiAnZhiHu-api`
- `yiAnZhiHu-common`
- `yiAnZhiHu-pojo`
- `yiAnZhiHu-children`
- `yiAnZhiHu-caretaker`
- `yiAnZhiHu-dean`
- `yiAnZhiHu-admin`
- `yiAnZhiHu-activity`
- `yiAnZhiHu-chat`
- `yiAnZhiHu-goods`

配套 `sql/` 目录提供了初始化脚本：

- `zh-admin.sql`
- `zh-caretaker.sql`
- `zh-children.sql`
- `zh-dean.sql`
- `zh-goods.sql`

### 管理后台

`backend-admin` 是 Vue 3 管理端，主要用于院方/运营后台的业务管理。项目依赖 `Element Plus`、`Pinia`、`ECharts` 和 `Axios`，适合做表单管理、列表管理和数据看板。

### 小程序前端

`frontend-mp` 是面向终端用户的小程序前端，包含以下页面/场景：

- 登录、注册、修改密码、个人信息
- 儿童端：首页、商城、购物车、订单、支付、活动审批、AI 咨询、地图等
- 院方/管理端页面：活动、争议、老人信息、登录等
- 护理相关页面：护理详情、护理列表、我的页面等

## 环境要求

- Node.js 16+，用于 `backend-admin` 和 `frontend-mp`
- Java 11，Maven 3.8+，用于 `backend-mp`
- MySQL 8.0
- Redis
- RabbitMQ
- Nacos、Sentinel、Elasticsearch 等中间件按后端配置启用情况准备

## 启动方式

### 1. 启动后端

进入 `backend-mp`，先导入对应 SQL 脚本，再按需启动各个微服务模块。

```bash
mvn clean install
```

然后分别启动需要的服务模块，例如网关、业务服务和管理服务。

### 2. 启动管理后台

进入 `backend-admin`：

```bash
npm install
npm run serve
```

打包：

```bash
npm run build
```

### 3. 启动小程序前端

进入 `frontend-mp`，使用 HBuilderX 或 uni-app / uVue 对应方式运行到目标平台。

## 配置说明

后端服务的具体端口、数据库地址、Redis、Nacos 等配置分散在各模块的 `src/main/resources/application.yml` 或 `application.properties` 中。上线前请根据本地或服务器环境修改这些配置。

小程序相关配置主要在以下文件中：

- `frontend-mp/manifest.json`
- `frontend-mp/pages.json`
- `frontend-mp/project.config.json`

## 开发建议

- 优先从 `backend-mp/yiAnZhiHu-gateway` 作为统一入口梳理接口
- 数据库初始化后再启动后端服务，避免服务因表结构缺失报错
- 管理后台和小程序前端应统一后端接口地址，确保登录态和权限逻辑一致

## 贡献方式

1. Fork 本仓库
2. 创建分支进行修改
3. 提交代码并发起合并请求

## 说明

仓库根目录原有 `README.en.md` 保留英文模板。如果你需要，我也可以继续把 `README.en.md` 一起整理成一份与中文 README 对应的英文版。
