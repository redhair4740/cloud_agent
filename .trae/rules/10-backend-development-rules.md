# Rule: 后端开发强制规则

本规则只定义后端技术、SQL、模块边界和验证要求。对象分层细节见 `11-backend-object-layering-rules.md`，联动流程见 `30-fullstack-linkage-rules.md`。

## 1. 技术栈

- JDK 使用 21，Spring Boot 使用 3.5.x，MyBatis-Plus 使用 3.5.x。
- Web 栈使用 Spring MVC，不切换为 WebFlux。
- 数据库以 PostgreSQL 为准；SQL、方言函数、分页、默认值和驱动行为必须保持 PostgreSQL 可执行。
- 涉及 MCP 能力时，后端仍遵守 Spring MVC 体系，禁止引入 WebFlux 版 MCP server/client 依赖。

## 2. PostgreSQL 与数据访问

- SQL 变更先判断 PostgreSQL 行为，再考虑其他兼容性。
- PostgreSQL `jsonb` 字段必须确认 JDBC 绑定类型，不得只靠 Java 字段改成 `Map` 或 `Object` 假设可写入。
- `jsonb` DO 字段优先复用 `com.wf.vmesh.framework.mybatis.core.type.PgJsonbTypeHandler`，并配合 `@TableField(typeHandler = ...)` 与 `@TableName(autoResultMap = true)`。
- Service 处理 JSON 载荷时优先使用明确结构或 `Map<String, Object>`，避免无必要的多次字符串/对象转换。
- 出现 `jsonb` 类型不匹配错误时，优先排查 TypeHandler 与 JDBC 参数绑定。

## 3. 增量 SQL

- 新增建表、改表、索引、初始化数据只允许追加增量 SQL，不直接改写历史 SQL。
- SQL 目录读取 `.trae/project.yml` 的 `dirs.backend` 与 `dirs.sql`，落点为 `<backend-dir>/<sql-dir>/yyyy-MM-dd/yyyy-MM-dd-HH-mm-ss.sql`。
- 当前项目新增变更只提交 PostgreSQL 脚本，不额外补 MySQL 或其他数据库脚本。
- 新建业务表默认包含 `id`、`name`、`serial`、`creator`、`create_time`、`updater`、`update_time`、`deleted`、`tenant_id`；缺失需说明业务必要性并确认。

## 4. 模块边界

- 开发前先确认需求归属域；优先落入现有域，只有现有域都不合适时才提出新域。
- 新增域必须说明职责、边界和与现有域关系。
- 启动装配类模块只承载入口、装配和全局配置，不承载具体业务编排。
- 通用基础设施模块只放跨域复用能力，不吸收具体业务语义。
- 不跨域直接复用其他域的 mapper/dataobject 作为常规实现手段；跨域协作优先走 service 契约、VO/DTO 或应用服务。

## 5. 开发过程

- 对象分层和目录组织遵守 `11-backend-object-layering-rules.md`，默认 `VO + DO`，不预设 `BO`。
- 重点禁止新增 `controller -> mapper` 直连和 controller 直接编排跨子域聚合。
- 接口协议变更必须明确请求参数、响应结构、错误码和鉴权影响，并切换到联动规则。
- 数据库变更必须说明迁移路径、回滚思路、历史数据影响和 SQL 落地路径。
- AI 平台配置中的密钥等敏感信息只允许通过配置项或环境变量注入，禁止硬编码和交付回显。

## 6. 编译验证

- 后端代码默认偏向执行最小可行编译验证，不能只靠阅读代码判断。
- 低复杂度文案、常量、注解等小改动可不编译，但交付必须标注“未编译验证”。
- 中复杂度变更必须执行模块级编译：方法签名、类型转换、Mapper/DO/VO 字段、依赖注入、配置键、SQL 映射、TypeHandler、序列化逻辑。
- 高复杂度变更除模块编译外需建议更高强度验证：跨模块重构、数据库迁移、鉴权链路、启动装配、消息链路、第三方集成。
- 涉及 `<backend-dir>/<edge-module>` 时，优先读取 `.trae/project.yml` 的 `dirs.backend` 与 `backend_stack.edge_module` 后执行：`cd "$BACKEND_DIR" && mvn compile -pl "$EDGE_MODULE" -am`。
- 其他模块优先使用“目标模块 + `-am`”的最小编译范围。
- 声称编译通过时必须给出真实命令、执行范围和结果；未执行时写“未编译验证”。

## 7. 后端交付

- 说明目标、落地文件、影响模块、边界决策、回归风险。
- 高风险变更单列风险和后续验证建议。
- 仅当需求可后端单侧闭环时由 Backend Agent 独立处理；接口协议影响前端时转 `30-fullstack-linkage-rules.md`。
