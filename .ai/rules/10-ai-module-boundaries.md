# Rule: AI 模块边界

## 1. AI 功能归属

- 所有 AI 业务能力默认归 `vmesh-module-vision`。
- AI 模块内部再区分：模型、聊天、绘图、音乐、写作、知识库、工作流、工具调用、安全、web 分组。
- 只有通用基础设施才允许下沉到 `vmesh-framework`；AI 业务编排不要塞进 `vmesh-server`。

## 2. MCP 约束

- 只允许使用 Spring MVC 版本的 MCP server。
- 禁止引入 `spring-ai-starter-mcp-server-webflux` 或 `spring-ai-starter-mcp-client-webflux`。
- 如果调整 `spring.ai.mcp.*` 开关，必须同步检查 `SecurityConfiguration` 的匿名放行是否仍成立。

## 3. 模型与工具调用

- 新增 provider、模型工厂、tool callback 时，先检查 `AiAutoConfiguration` 与 `AiModelFactoryImpl` 是否已有统一入口。
- Methods as Tools 与 Functions as Tools 优先沿用 `tool/method`、`tool/function` 现有组织方式。
- 角色、模型、知识库、工作流配置若依赖数据库字段或菜单能力，代码改动后要检查是否需要补 SQL 或管理端入口。

## 4. 向量库与 RAG

- 当前支持 Redis、Qdrant、Milvus 三类向量存储。
- 修改向量存储逻辑前，先判断是公共工厂逻辑还是某个 provider 的专属逻辑。
- `application-local.yaml` 当前关闭了 Qdrant / Milvus 的自动配置并改为手动创建，不能忽略这个前提直接改自动装配。
- 知识库相关改动要同时检查 dataobject、mapper、service、VO，避免只改一层。

## 5. 工作流约束

- AI 工作流主线是 TinyFlow，不是 Flowable。
- Flowable 仍然存在于全仓基础能力中，但不要把 AI 工作流错误地实现到 BPM 模块。
- 修改 AI 工作流前，先确认入口是否在 `AiWorkflowServiceImpl`，再判断是否需要同步 controller 与持久化对象。

## 6. 启用态判断

- 如果 `vmesh-server/pom.xml` 里 AI 模块依赖仍是注释态，则应视为“代码存在但服务未装配”。
- 这种情况下，新增 AI 代码不能声称“接口可用”；要么同步装配，要么明确写成“模块仍未启用”。
- `DefaultController` 的 AI 404 文案是当前禁用态的统一降级行为，改 server 装配时要一并核对。

## 7. 安全边界

- 严禁在文档和对话中回显 provider 密钥、通知地址、第三方账号密钥。
- 新增外部 AI 平台时，优先使用配置类或环境变量，不把密钥硬编码进 Java 常量。
