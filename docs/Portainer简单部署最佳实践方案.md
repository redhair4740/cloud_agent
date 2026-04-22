# AI_Vision Portainer 简单部署最佳实践方案

## 1. 文档定位

本文档用于统一当前 `AI_Vision` 外层仓库的部署口径，目标是回答一个明确问题：

- 在 **不改业务代码** 的前提下，
- 将当前前后端项目部署到 **Portainer 平台**，
- 并且已经具备 **Jenkins**、**Harbor** 等内网 DevOps 能力时，
- 哪条路线最简单、最稳、后续最好维护。

本文档结论基于当前仓库静态阅读整理，**未做真实 Jenkins / Harbor / Portainer 联调验证**。

---

## 2. 当前仓库的真实事实

### 2.1 项目主目录

- 后端主工程：`WF_VMesh_Coud`
- 前端主工程：`WF_VMesh_Coud_UI`

这两个目录的职责由外层协作入口定义，见 [../.ai/agent.md](../.ai/agent.md)。

### 2.2 后端已经具备可复用的镜像入口

当前后端已有运行时镜像入口：

- [../WF_VMesh_Coud/vmesh-server/Dockerfile](../WF_VMesh_Coud/vmesh-server/Dockerfile)

后端 `vmesh-server` 是标准 Spring Boot 可执行 Jar：

- 聚合工程使用 JDK 21，见 [../WF_VMesh_Coud/pom.xml](../WF_VMesh_Coud/pom.xml)
- `vmesh-server` 打包类型是 `jar`，并通过 `spring-boot-maven-plugin` 做 `repackage`，见 [../WF_VMesh_Coud/vmesh-server/pom.xml](../WF_VMesh_Coud/vmesh-server/pom.xml)

这意味着：

- 后端完全适合走 `Jenkins 编译 Jar -> 构建运行镜像 -> 推 Harbor`
- 没必要让 Portainer 直接参与 Maven 构建

### 2.3 前端已经具备稳定构建入口

当前前端已有明确的生产构建脚本：

- [../WF_VMesh_Coud_UI/package.json](../WF_VMesh_Coud_UI/package.json)

关键事实：

- 使用 `build:prod`
- Node 版本要求 `>=20`
- 前端是标准 Vite 静态产物项目

这意味着：

- 前端适合走 `Jenkins 打包 dist -> 构建 nginx 静态镜像 -> 推 Harbor`
- 不建议让 Portainer 在目标环境上临时构建前端

### 2.4 前端接口地址是构建期固化，不是运行期自动切换

当前前端请求基址来自：

- [../WF_VMesh_Coud_UI/src/config/axios/config.ts](../WF_VMesh_Coud_UI/src/config/axios/config.ts)
- [../WF_VMesh_Coud_UI/.env.prod](../WF_VMesh_Coud_UI/.env.prod)

前端实际使用：

```text
VITE_BASE_URL + VITE_API_URL
```

并且仓库里还存在以下依赖 `VITE_BASE_URL` 的入口：

- `/admin-api`
- `/infra/ws`
- `/doc.html`
- `/admin/applications`

这意味着：

- 在**不改前端代码**的前提下，前端镜像应该按环境构建
- 不要假设“一个前端镜像运行时改几个环境变量就能跑所有环境”

### 2.5 后端当前没有真正可直接复用的 `application-prod.yaml`

当前后端资源目录里只有：

- `application.yaml`
- `application-local.yaml`
- `application-dev.yaml`

见：

- [../WF_VMesh_Coud/vmesh-server/src/main/resources](../WF_VMesh_Coud/vmesh-server/src/main/resources)

这意味着：

- 最简单的生产路线不是继续在业务仓里补更多环境 profile
- 而是把生产配置外置，由部署侧挂载

### 2.6 旧 docker / compose 资产可以直接视为历史遗留

当前仓库里仍有：

- [../WF_VMesh_Coud/script/docker/docker-compose.yml](../WF_VMesh_Coud/script/docker/docker-compose.yml)
- [../WF_VMesh_Coud/script/docker/Docker-HOWTO.md](../WF_VMesh_Coud/script/docker/Docker-HOWTO.md)

但这些资产和当前真实仓库已经不一致，因此不应继续作为生产基线。既然当前任务前提已经明确“都可以修改或者删除重构”，则最佳实践不是修补旧资产，而是直接重建新的部署资产。

---

## 3. 单一推荐路线

推荐采用以下单一路线，作为当前项目默认部署基线：

```text
Jenkins 构建
  -> Harbor 存储镜像
  -> Portainer Stack 拉镜像并发布
  -> PostgreSQL / Redis 使用外部独立服务
```

换句话说：

- **Jenkins 负责 build**
- **Harbor 负责存**
- **Portainer 负责 deploy**

Portainer **不负责源码构建**，也**不负责中间件初始化**。

---

## 4. 推荐目标架构

### 4.1 运行链路

```text
浏览器
  -> 前端 nginx 容器
     -> /admin-api    反向代理到后端
     -> /infra/ws     反向代理到后端
     -> /doc.html     反向代理到后端
  -> 后端 Spring Boot 容器
     -> PostgreSQL
     -> Redis
```

### 4.2 核心原则

1. 用户只访问一个统一域名
2. 前端和后端各自独立成镜像
3. PostgreSQL / Redis 外置
4. Portainer Stack 只写运行信息，不写构建逻辑
5. 环境差异通过外部配置解决，不把生产配置写回业务仓

---

## 5. 推荐职责边界

### 5.1 业务仓负责什么

建议业务仓只保留下面几类可复用资产：

- 后端 `Dockerfile`
- 前端 `Dockerfile`
- `.dockerignore`
- 可复用的 nginx 配置模板

业务仓不再承担：

- 环境级 `docker-compose`
- MySQL / Redis / MQ 一把起脚本
- 演示环境用的 SQL 初始化胶水逻辑
- 与当前真实部署不一致的 HOWTO 文档

### 5.2 Jenkins 负责什么

Jenkins 负责整个构建链路：

1. 拉取源码
2. 编译后端 Jar
3. 构建后端运行镜像
4. 构建前端静态产物
5. 构建前端 nginx 镜像
6. 推送 Harbor
7. 输出镜像 tag 与构建记录

### 5.3 Harbor 负责什么

Harbor 只负责：

- 存储镜像
- 管理 tag
- 给 Portainer 提供统一拉取地址

推荐使用不可变版本 tag，例如：

```text
harbor.xxx.local/ai-vision/backend:2026.04.22-<gitsha>
harbor.xxx.local/ai-vision/frontend:2026.04.22-<gitsha>
```

不建议生产发布长期使用 `latest`。

### 5.4 Portainer 负责什么

Portainer 只负责：

- 管理 Stack
- 管理环境变量
- 管理挂载文件
- 启停、升级、回滚容器

Portainer 不负责：

- `mvn package`
- `pnpm build`
- Docker `build`
- 初始化 PostgreSQL / Redis

---

## 6. 当前项目的推荐部署目录规划

既然旧部署资产已经不可信，建议后续把新部署资产收口到统一目录，例如：

```text
deploy/
├── jenkins/
│   └── Jenkinsfile
└── portainer/
    ├── stack.yml
    ├── backend/
    │   ├── application-deploy.yaml.template
    │   └── README.md（若后续确实需要人工运维说明）
    └── frontend/
        └── nginx.conf
```

如果后续希望进一步解耦，也可以把 `deploy/` 再拆为独立部署仓。但在当前阶段，先放在外层根仓已经足够。

---

## 7. 后端推荐实践

### 7.1 后端镜像策略

后端统一使用：

```text
Jenkins 编译 Jar -> 运行时镜像
```

推荐保留“构建环境”和“运行环境”分离：

- 构建阶段：JDK / Maven
- 运行阶段：JRE

当前仓库已有运行时镜像入口，因此后续只需要在构建链路中补齐：

- Jar 产物生成
- 产物复制
- Harbor 推送

### 7.2 后端配置策略

后端不建议继续在业务仓内补更多生产 profile。

推荐方式：

- 容器内只带基础应用包
- 生产配置通过挂载文件外置
- 启动时追加：

```text
SPRING_PROFILES_ACTIVE=deploy
SPRING_CONFIG_ADDITIONAL_LOCATION=/run/config/
```

这样做的价值：

- 不改业务代码
- 不污染仓库环境配置
- 生产地址、密码、连接串都由部署侧控制
- 配置回滚和镜像回滚可以分开处理

### 7.3 后端最小外部配置项

后端部署配置至少应覆盖：

- `server.port`
- PostgreSQL 主数据源连接串
- PostgreSQL 用户名/密码
- Redis host / port / password
- 日志目录
- 与本环境有关的回调地址、文档入口、监控入口

如果某些模块涉及 MQ、对象存储、第三方回调，也应一并外置。

---

## 8. 前端推荐实践

### 8.1 前端镜像策略

前端统一使用：

```text
Jenkins build:prod -> 生成静态产物 -> nginx 镜像
```

### 8.2 前端环境策略

在**不改前端代码**的前提下，前端建议按环境构建镜像：

- 测试环境镜像
- 预发环境镜像
- 生产环境镜像

原因不是流程复杂，而是当前前端的接口基址、文档入口、WebSocket 入口都依赖构建期环境变量。

### 8.3 前端访问策略

前端推荐统一使用单域名入口，例如：

```text
https://vision.xxx.internal
```

然后由 nginx 做统一反向代理：

- `/admin-api` -> 后端
- `/infra/ws` -> 后端
- `/doc.html` -> 后端
- `/admin/applications` -> 后端

这样做的收益：

- 用户侧只认一个域名
- 不需要前端再暴露单独后端地址
- 登录、接口、文档、WebSocket 的入口都统一

---

## 9. 数据库与中间件策略

### 9.1 PostgreSQL / Redis 外置

推荐直接使用独立的 PostgreSQL / Redis 服务，而不是继续把这些中间件写回 Stack。

原因：

- 当前项目已经不是“演示一把起”场景
- 你已经有完整的内网平台能力
- 应用容器和中间件容器生命周期应该解耦

### 9.2 初始化脚本与数据库表结构

像 Quartz 这种依赖手工初始化 SQL 的能力，应纳入数据库初始化或 DBA 流程，而不是依赖 compose 启动时顺手挂进去。

当前仓库已有 PostgreSQL SQL：

- [../WF_VMesh_Coud/sql/postgresql/ruoyi-vue-pro.sql](../WF_VMesh_Coud/sql/postgresql/ruoyi-vue-pro.sql)
- [../WF_VMesh_Coud/sql/postgresql/quartz.sql](../WF_VMesh_Coud/sql/postgresql/quartz.sql)

这类文件的职责是“初始化参考与变更交付”，不是“由 Portainer 代替 DBA 执行”。

---

## 10. 发布与回滚策略

### 10.1 发布策略

发布动作应当简化为：

1. Jenkins 生成新镜像
2. 推送 Harbor
3. Portainer Stack 改用新 tag
4. 重建容器
5. 做最小健康检查

### 10.2 回滚策略

回滚动作应当简化为：

1. 在 Portainer 把 image tag 改回上一个稳定版本
2. 保持挂载配置不变
3. 重建容器
4. 验证最小链路

如果问题来自配置而不是镜像，则只回滚挂载配置，不动镜像版本。

---

## 11. 最低交付清单

若后续要把本方案真正落地，最低应交付以下文件：

1. 后端运行镜像 Dockerfile
2. 前端 nginx 镜像 Dockerfile
3. Portainer `stack.yml`
4. 后端 `application-deploy.yaml.template`
5. 前端 nginx 反代配置
6. Jenkinsfile
7. 发布检查清单
8. 回滚检查清单

---

## 12. 建议明确退役的旧资产

如果确认旧资产已经不再可信，建议在新体系落地后明确退役：

- `WF_VMesh_Coud/script/docker/docker-compose.yml`
- `WF_VMesh_Coud/script/docker/Docker-HOWTO.md`
- 与旧目录、旧端口、旧中间件假设强绑定的脚本

这里的重点不是“先兼容”，而是“明确切换基线”。

---

## 13. 风险与注意事项

### 13.1 密钥与示例配置风险

当前仓库配置文件中存在明显不适合作为生产直接复用的地址、账号、示例键值。后续部署时应：

- 统一从外部配置覆盖
- 不在文档、skill、Stack 中回显真实密钥
- 上线前安排一次密钥轮换

### 13.2 验证边界

本文档只定义推荐路线，不代表以下内容已经验证：

- Jenkins 构建链路已跑通
- Harbor 推送权限已确认
- Portainer Stack 已落地
- nginx 反代规则已验证
- PostgreSQL / Redis 网络连通已验证

这些都必须在真正实施时单独验证，并明确记录“已验证 / 未验证”。

---

## 14. 最终结论

在当前仓库和当前约束下，最简单、最稳、后续最好维护的路线只有一条：

```text
Jenkins 构建 -> Harbor 推镜像 -> Portainer 拉镜像发布
```

并且配套采用以下边界：

- 前后端各自独立镜像
- PostgreSQL / Redis 外置
- Portainer 不参与 build
- 生产配置外部挂载
- 前端按环境构建镜像
- 旧 docker / compose 资产直接退役，不做修补式兼容

这条路线既满足“不要改业务代码”，也能把部署复杂度压到最低。

---

## 15. 文档状态

- 文档状态：首次落版
- 适用范围：`AI_Vision` 外层仓库当前前后端部署方案讨论
- 验证结果：未验证
- 未验证原因：本轮仅完成方案收敛与文档沉淀，未实际执行发布链路
