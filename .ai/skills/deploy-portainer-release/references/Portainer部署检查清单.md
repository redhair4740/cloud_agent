# Portainer 部署检查清单

本文件给 `deploy-portainer-release` skill 提供更细的执行检查项。只有在需要继续落地部署资产、补交付清单、或核对发布边界时再读取，不必在每次触发 skill 时全文加载。

## 1. 仓库事实检查

部署方案开始前，至少核对以下内容：

### 后端

- 是否存在可直接复用的运行时 `Dockerfile`
- `vmesh-server` 是否仍是最终启动容器
- `pom.xml` 的 JDK 版本是否变化
- 是否存在真实 `application-prod.yaml`
- 数据库类型、Redis、MQ、对象存储等依赖是否已切换

### 前端

- `package.json` 的构建命令是否变化
- Node 版本要求是否变化
- `.env.prod` 是否仍使用构建期 API 地址
- `src/config/axios/config.ts` 是否仍用 `import.meta.env`
- WebSocket、文档页、监控页是否仍依赖统一基址

### 历史部署资产

- 旧 `docker-compose.yml` 是否仍引用不存在的目录
- 旧 HOWTO 是否仍使用过时端口、过时数据库、过时镜像名
- 旧脚本是否假设在目标机做 Maven / Node 构建

如果上述任一项明显不一致，默认结论就是：旧资产退役，不做兼容修补。

## 2. 默认技术决策

遇到没有额外约束的情况，默认使用以下决策：

| 决策点 | 默认选择 | 原因 |
| --- | --- | --- |
| 构建位置 | Jenkins | 让构建和运行分离 |
| 镜像仓库 | Harbor | 已有内网能力，不重复造轮子 |
| 发布平台 | Portainer Stack | 保持发布入口统一 |
| Portainer 是否 build | 否 | 目标环境不承担构建职责 |
| PostgreSQL / Redis 是否进 Stack | 否 | 应用和中间件生命周期解耦 |
| 前端镜像策略 | 按环境构建 | 当前项目基址是构建期固化 |
| 后端配置策略 | 外部挂载 | 不污染业务仓 profile |

## 3. 推荐交付物

### 最小交付物

- 部署方案文档
- Portainer `stack.yml`
- 后端外部配置模板
- 前端 nginx 反代配置
- Jenkinsfile

### 进阶交付物

- 发布检查清单
- 回滚检查清单
- 镜像命名与 tag 规则
- 外部依赖清单
- 环境变量对照表

## 4. Stack 文件最小要求

Portainer Stack 里建议只保留：

- `image`
- `ports`
- `environment`
- `env_file`
- `volumes`
- `networks`
- `healthcheck`
- `restart`

不建议继续保留：

- `build`
- Maven / Node 构建命令
- 中间件初始化 SQL 挂载
- 依赖旧源码目录的相对路径

## 5. 后端配置检查项

后端外部配置至少覆盖：

- `server.port`
- 主数据源 URL
- 主数据源 username
- 主数据源 password
- Redis host
- Redis port
- Redis password
- 日志目录

如果项目启用了以下能力，也需要纳入外部配置：

- MQ
- 对象存储
- 回调 URL
- 文档入口
- 第三方 API Key

## 6. 前端配置检查项

前端镜像构建前，至少确认：

- 页面访问域名
- 后端统一入口域名
- `/admin-api` 是否由 nginx 反代
- `/infra/ws` 是否由 nginx 反代
- `/doc.html` 是否由 nginx 反代
- 是否需要 `/admin/applications` 等监控页入口

如果用户明确要求“一个域名访问全部入口”，则前端 nginx 必须承担统一反向代理职责。

## 7. 发布检查清单

发布前至少确认：

1. Harbor 中已存在目标 tag 的前后端镜像
2. Portainer 可拉取 Harbor 镜像
3. 后端外部配置已挂载
4. 前端 nginx 配置已挂载或已打入镜像
5. PostgreSQL / Redis 连通信息已确认
6. Stack 使用的不是 `latest`

## 8. 回滚检查清单

回滚前至少确认：

1. 上一个稳定 tag 明确可用
2. 当前问题来自镜像还是配置
3. 若只是配置问题，优先回滚配置，不先回滚镜像
4. 回滚后至少验证登录页、核心接口、核心页面

## 9. 输出口径模板

部署方案类任务的最终说明至少写清：

- 本步目标
- 落地文件
- 影响范围
- 关键边界
- 验证结果
- 未验证项与原因

没有真实 Portainer / Jenkins / Harbor 操作证据时，一律写“未验证”。
