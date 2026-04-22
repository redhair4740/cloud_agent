---
name: deploy-portainer-release
description: 为 AI_Vision 这类前后端项目输出 Jenkins 构建、Harbor 推送、Portainer Stack 发布的简化部署方案，并沉淀部署文档、检查清单与交付边界。用于用户要求重建或替换旧 Docker/Compose 资产、梳理“不改业务代码”的部署路线、生成 Portainer 发布方案、整理外部配置边界或补部署文档时。
---

# Portainer 部署发布

## 概览

使用本 skill 时，默认目标不是“继续修补旧 compose”，而是基于当前仓库真实入口重新建立一套可维护的发布基线。

默认推荐路线：

```text
Jenkins 构建 -> Harbor 推镜像 -> Portainer 拉镜像发布
```

默认边界：

- 不改业务代码
- Portainer 不直接 build 源码
- PostgreSQL / Redis 等中间件外置
- 生产配置由部署侧外部挂载
- 前端按环境构建镜像，而不是一个镜像跑所有环境

## 工作流

### 第 1 步：核对当前仓库的真实构建与运行入口

优先读取以下文件，确认事实，不要沿用旧部署脚本记忆：

- `WF_VMesh_Coud/vmesh-server/Dockerfile`
- `WF_VMesh_Coud/vmesh-server/pom.xml`
- `WF_VMesh_Coud/pom.xml`
- `WF_VMesh_Coud/vmesh-server/src/main/resources/application*.yaml`
- `WF_VMesh_Coud_UI/package.json`
- `WF_VMesh_Coud_UI/.env.prod`
- `WF_VMesh_Coud_UI/src/config/axios/config.ts`

如果仓库里还存在旧部署资产，再额外读取：

- `WF_VMesh_Coud/script/docker/*`
- 任何旧 `Docker-HOWTO.md`
- 任何旧 `docker-compose.yml`

目标不是证明旧资产还能不能用，而是判断它们是否已经和真实仓库脱节。

### 第 2 步：先判断旧部署资产是“可复用”还是“应退役”

遇到以下情况时，默认判定为“应退役并重建”：

- compose 里的目录名和当前项目目录不一致
- compose 里的端口、数据库类型、构建方式已经和当前项目脱节
- 构建逻辑仍假设在目标机上执行 Maven / Node build
- 部署说明依赖演示环境的一把起中间件

如果确认旧资产不一致，不要做“修补式兼容”方案，直接输出新基线。

### 第 3 步：给出单一推荐路线，而不是并列一堆方案

默认只推荐这一条：

```text
Jenkins 构建
  -> Harbor 存储镜像
  -> Portainer Stack 运行镜像
  -> PostgreSQL / Redis 使用独立服务
```

除非用户明确要求比较多种方案，否则不要同时给：

- Portainer 直接 build
- docker-compose on host
- 手工 docker run
- 一把起中间件 compose

原因很简单：这些方案会把“简单”重新变复杂。

### 第 4 步：明确部署职责边界

输出方案时，至少拆清楚下面四层职责：

1. 业务仓负责什么
2. Jenkins 负责什么
3. Harbor 负责什么
4. Portainer 负责什么

默认职责口径：

- 业务仓：保留可复用 Dockerfile 与模板
- Jenkins：构建镜像并推 Harbor
- Harbor：存储不可变版本镜像
- Portainer：拉镜像、挂配置、发布与回滚

### 第 5 步：明确前后端的发布策略

后端默认策略：

- Jenkins 编译 Jar
- 构建运行时镜像
- 通过外部挂载配置覆盖生产环境差异

前端默认策略：

- Jenkins 执行生产构建
- 生成静态产物
- 构建 nginx 镜像
- 由 nginx 统一代理 `/admin-api`、`/infra/ws`、`/doc.html`

如果前端使用 `import.meta.env` 在构建期拼接 API 地址，默认判断为“前端按环境构建镜像”，不要假设运行期再改变量就能全部生效。

### 第 6 步：需要落地文件时，优先收口到统一部署目录

如果用户要求继续落实文件，默认建议把部署资产统一放到：

- `deploy/jenkins/`
- `deploy/portainer/`

常见文件包括：

- `deploy/jenkins/Jenkinsfile`
- `deploy/portainer/stack.yml`
- `deploy/portainer/backend/application-deploy.yaml.template`
- `deploy/portainer/frontend/nginx.conf`

不要把环境级部署资产继续散落回旧 `script/docker/`。

### 第 7 步：输出时必须写清验证边界

部署方案类任务非常容易把“静态分析”误写成“已完成”。必须明确区分：

- 已验证：真实构建、真实推送、真实发布、真实联通检查
- 未验证：仅阅读代码、仅写文档、仅生成配置模板

如果本轮没有真实 Jenkins / Harbor / Portainer 操作，只能写“未验证”。

## 产物建议

用户要求“落实为文档”时，默认优先产出：

1. 一份中文部署方案文档
2. 一份中文检查清单
3. 如果用户继续推进，再落 `stack.yml`、`Jenkinsfile`、`nginx.conf`、`application-deploy.yaml.template`

适合先写到：

- `docs/Portainer简单部署最佳实践方案.md`

需要更细的检查项时，再读取：

- `references/Portainer部署检查清单.md`

## 输出要求

输出部署方案时，至少包含：

- 本步目标
- 落地文件
- 影响范围
- 关键边界
- 推荐路线
- 明确退役哪些旧资产
- 验证结果
- 未验证项与原因

## 禁止事项

- 不要默认让 Portainer 直接构建源码
- 不要把旧 compose 当成必须兼容的包袱
- 不要把外部 PostgreSQL / Redis 又塞回 Stack，只为看起来“完整”
- 不要把仓库里的示例地址、示例密钥、示例账号当成生产配置
- 不要把“文档已写完”描述成“部署已完成”
