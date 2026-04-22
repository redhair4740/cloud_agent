# AI_Vision Portainer 简单部署最佳实践方案

## 1. 文档定位

本文档用于统一当前 `AI_Vision` 外层仓库的部署口径，目标是定义一套可以直接交给运维或后续代理继续实施的发布基线。

适用前提：

- 不改业务代码
- 后端用 `mvn`
- 前端用 `npm`
- Portainer 目标环境按单机 Docker 使用
- PostgreSQL、Redis 等中间件已经单独部署完成
- 前后端**各自管理自己的部署资产**
- 前后端**各自独立发布**
- 前后端各自维护自己的“首发操作清单”

本文档基于当前仓库静态阅读整理，**未做真实 Jenkins / Harbor / Portainer 联调验证**。

---

## 2. 当前项目发布边界

### 2.1 后端发布单元

后端真正的运行单元是：

- `WF_VMesh_Coud/vmesh-server`

因此后端部署资产不再放到根仓，也不再放到 `WF_VMesh_Coud` 根目录统一管理，而是收口到：

```text
WF_VMesh_Coud/deploy/
```

### 2.2 前端发布单元

前端仓本身就是一个独立发布单元：

- `WF_VMesh_Coud_UI`

因此前端部署资产直接收口到：

```text
WF_VMesh_Coud_UI/deploy/
```

### 2.3 中间件边界

以下内容全部视为外部依赖，不进入任何 Stack：

- PostgreSQL
- Redis
- RabbitMQ
- RocketMQ
- Kafka
- 其他对象存储或第三方服务

---

## 3. 最终部署入口

### 3.1 后端部署入口

```text
WF_VMesh_Coud/deploy/
├── Jenkinsfile
├── Dockerfile
├── stack.yml
├── .env.example
├── application-deploy.yaml.template
└── 首发操作清单.md
```

### 3.2 前端部署入口

```text
WF_VMesh_Coud_UI/deploy/
├── Jenkinsfile
├── Dockerfile
├── stack.yml
├── .env.example
├── nginx/
│   └── default.conf.template
└── 首发操作清单.md
```

### 3.3 根仓职责

根仓只保留：

- 总览方案文档
- rule / agent / skill 等协作规范

根仓不再保留执行型部署入口，不再作为前后端发布资产的主位置。

---

## 4. 默认推荐发布链路

当前项目默认链路如下：

```text
后端 Jenkins 构建并推送 Harbor
  -> Portainer 重部署后端 Stack

前端 Jenkins 构建并推送 Harbor
  -> Portainer 重部署前端 Stack
```

职责边界固定为：

- Jenkins：负责 build 和 push
- Harbor：负责存镜像
- Portainer：负责部署与重建
- PostgreSQL / Redis：外部现有服务，不进 Stack

当前默认是：

- **前后端独立发布**
- **Portainer 手动重部署**
- **自动 webhook 只作为可选扩展**

---

## 5. 后端部署说明

后端部署资产路径：

- [deploy](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud/deploy)

### 5.1 构建方式

后端固定使用：

```text
mvn -pl vmesh-server -am clean package -DskipTests -Dmaven.repo.local=$WORKSPACE/.m2/repository
```

后端 Jenkinsfile 只处理：

1. 构建 `vmesh-server.jar`
2. 构建后端运行时镜像
3. 推送 Harbor
4. 可选触发 Portainer webhook

### 5.2 后端 Stack

后端 `stack.yml` 只部署一个服务：

- `backend`

后端 Stack 必须：

- 挂载外部配置文件
- 挂载日志目录
- 连接共享外部 Docker 网络
- 给 `backend` 服务设置固定网络别名 `backend`

这样前端独立 Stack 里的 nginx 才能通过：

```text
http://backend:48080
```

访问后端。

### 5.3 后端配置模板

后端 `application-deploy.yaml.template` 只覆盖：

- `server.port`
- PostgreSQL URL / 用户名 / 密码
- Redis host / port / password
- 日志路径
- 生产环境下的必要开关

它不负责创建数据库，也不负责初始化 Quartz 表。

### 5.4 后端首发清单

后端首发清单路径：

- [首发操作清单.md](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud/deploy/首发操作清单.md)

它至少应覆盖：

1. 创建共享 Docker 网络
2. 准备后端外部配置文件
3. Jenkins 参数填写
4. Harbor 推送结果检查
5. Portainer 后端 Stack 首次导入 / 首次重部署
6. 后端接口与日志验证

---

## 6. 前端部署说明

前端部署资产路径：

- [deploy](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud_UI/deploy)

### 6.1 构建方式

前端固定使用：

```text
npm ci
npm run build:prod
```

前端 Dockerfile 与 Jenkinsfile 都应直接对齐当前产物目录：

```text
dist-prod/
```

不再沿用根仓旧方案中的 `build/dist/` 作为仓内产物目录语义。

### 6.2 前端 Stack

前端 `stack.yml` 只部署一个服务：

- `frontend`

前端 Stack 必须：

- 连接与后端相同的共享外部 Docker 网络
- 通过 nginx 同域反代访问后端

默认代理入口：

- `/admin-api`
- `/infra/ws`
- `/doc.html`
- 可选 `/admin/applications`

### 6.3 前端 Nginx

前端 nginx 模板路径：

- [default.conf.template](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud_UI/deploy/nginx/default.conf.template)

默认行为：

- `/` 使用 SPA fallback
- `/admin-api` 代理到 `http://backend:48080`
- `/infra/ws` 带 WebSocket 升级头
- `/doc.html` 代理到后端

### 6.4 前端首发清单

前端首发清单路径：

- [首发操作清单.md](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud_UI/deploy/首发操作清单.md)

它至少应覆盖：

1. 确认共享 Docker 网络已存在
2. Jenkins 参数填写
3. 构建时写入 `VITE_BASE_URL` / `VITE_API_URL`
4. Portainer 前端 Stack 首次导入 / 首次重部署
5. 首页、静态资源、代理接口、WebSocket 验证

---

## 7. 共享网络约定

由于前后端拆成两个独立 Stack，但前端仍要通过容器内域名 `backend` 访问后端，所以必须存在一个共享外部 Docker 网络。

默认建议名称：

```text
data_app-network
```

使用原则：

- 该网络由人工首次创建
- 后端 Stack 和前端 Stack 都以 `external network` 方式接入
- 后端服务在该网络上暴露 alias：`backend`

如果后续要改网络名，只能通过各自 `.env.example` 或 Stack 变量统一修改。

---

## 8. 可选自动发布扩展

当前方案默认仍是：

- Jenkins 推 Harbor
- Portainer 手动重部署

如果后续确认：

- Portainer 版本满足要求
- 目标环境允许 Jenkins 调 webhook

则可在前后端各自 Jenkinsfile 中分别启用：

- `ENABLE_PORTAINER_WEBHOOK=true`
- `PORTAINER_WEBHOOK_URL=<各自真实 webhook 地址>`

这只是增强项，不是默认链路。

---

## 9. 历史资产处理

历史 `script/docker/*` 与根仓 `deploy/` 视为旧基线。

完成迁移后：

- 根仓 `deploy/` 删除
- 根仓文档全部改为指向新路径
- 后续部署相关工作一律以：
  - `WF_VMesh_Coud/deploy/`
  - `WF_VMesh_Coud_UI/deploy/`
  为准

---

## 10. 验证边界

本次仅定义与落地部署资产结构，不代表以下内容已经验证：

- Jenkins 真机执行
- Harbor 推送权限
- Portainer Stack 真机导入
- 共享外部网络真实连通
- nginx 真实代理效果
- PostgreSQL / Redis 网络连通
- webhook 自动发布

因此当前状态只能表述为：

- **部署资产结构已落地**
- **真实发布链路未验证**
