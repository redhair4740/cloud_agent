---
name: deploy-portainer-release
version: "1.0.0"
depends_on:
  - ".ai/rules/00-repo-baseline.md"
description: 为 AI_Vision 这类前后端项目输出 Jenkins 构建、Harbor 推送、Portainer Stack 发布的简化部署方案，并沉淀部署文档、检查清单与交付边界。用于用户要求重建或替换旧 Docker/Compose 资产、梳理"不改业务代码"的部署路线、生成 Portainer 发布方案、整理外部配置边界或补部署文档时。
---

# Portainer 部署发布

## 概览

使用本 skill 时，默认目标不是继续修补旧 compose，而是基于当前仓库真实入口重建一套可维护的发布基线。

默认推荐路线：

```text
Jenkins 构建 -> Harbor 推镜像 -> Portainer 重部署
```

默认边界：

- 不改业务代码
- Portainer 不直接 build 源码
- PostgreSQL / Redis 等中间件外置
- 生产配置由部署侧外部挂载
- 前端按环境构建镜像
- 如果用户要求前后端各自管理部署资产，则优先采用"前后端各自 deploy、自主发布"的结构

## 工作流

### 第 1 步：核对真实构建与运行入口

优先读取：

- `<backend-dir>/vmesh-server/Dockerfile`
- `<backend-dir>/vmesh-server/pom.xml`
- `<backend-dir>/pom.xml`
- `<backend-dir>/vmesh-server/src/main/resources/application*.yaml`
- `<frontend-dir>/package.json`
- `<frontend-dir>/.env.prod`
- `<frontend-dir>/src/config/axios/config.ts`

如果仓库里还存在旧部署资产，再额外读取：

- `<backend-dir>/script/docker/*`
- 任何旧 `Docker-HOWTO.md`
- 任何旧 `docker-compose.yml`

### 第 2 步：先判断旧部署资产是否应退役

出现以下情况时，默认直接退役并重建：

- 目录名和当前项目不一致
- 端口、数据库类型、构建方式已脱节
- 仍假设在目标机执行 Maven / Node build
- 仍依赖演示环境的一把起中间件

### 第 3 步：优先按"各自 deploy、自主发布"落地

如果用户希望前后端各自管理部署资产，默认路径固定为：

- 后端：`<backend-dir>/deploy/`
- 前端：`<frontend-dir>/deploy/`

默认不要继续把新资产放到根仓 `deploy/`。

### 第 4 步：明确发布边界

输出方案时，至少拆清楚：

1. 后端发布入口
2. 前端发布入口
3. Jenkins 的职责
4. Harbor 的职责
5. Portainer 的职责
6. 外部依赖边界

默认职责口径：

- 后端 deploy 只负责 backend
- 前端 deploy 只负责 frontend
- PostgreSQL / Redis 等全部外置

### 第 5 步：如果前后端独立发布，必须考虑共享网络

当前前端通常还需要同域代理到后端。若前后端拆成两个独立 Stack，默认必须建立共享外部 Docker 网络。

默认约定：

- 网络名：`data_app-network`
- 后端服务 alias：`backend`
- 前端 nginx 代理到 `http://backend:48080`

如果没有共享外部网络，前端独立 Stack 无法稳定按容器名访问后端。

### 第 6 步：产物默认拆成前后端两套

后端默认产物：

- `Jenkinsfile`
- `Dockerfile`
- `stack.yml`
- `.env.example`
- `application-deploy.yaml.template`
- `首发操作清单.md`

前端默认产物：

- `Jenkinsfile`
- `Dockerfile`
- `stack.yml`
- `.env.example`
- `nginx/default.conf.template`
- `首发操作清单.md`

### 第 7 步：首发操作清单也按前后端拆分

如果用户要求补"首发操作清单"，默认不是写根仓统一清单，而是：

- `<backend-dir>/deploy/首发操作清单.md`
- `<frontend-dir>/deploy/首发操作清单.md`

两份清单都要写清"共享 Docker 网络"的前提和验证步骤。

### 第 8 步：输出时必须写清验证边界

部署方案类任务非常容易把静态分析误写成已完成。必须明确区分：

- 已验证：真实构建、真实推送、真实发布、真实联通检查
- 未验证：仅阅读代码、仅写文档、仅生成配置模板

如果本轮没有真实 Jenkins / Harbor / Portainer 操作，只能写"未验证"。

## 产物建议

用户要求"落实为文档"时，默认优先产出：

1. 根仓总览方案文档
2. 后端 deploy 文档与首发清单
3. 前端 deploy 文档与首发清单

根仓总览文档可写到：

- `docs/Portainer简单部署最佳实践方案.md`

更细的检查项可参考：

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
- 不要把外部 PostgreSQL / Redis 又塞回 Stack，只为看起来"完整"
- 不要把仓库里的示例地址、示例密钥、示例账号当成生产配置
- 不要把"文档已写完"描述成"部署已完成"
