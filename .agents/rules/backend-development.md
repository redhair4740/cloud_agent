---
alwaysApply: false
description: 约束后端技术栈、PostgreSQL 数据访问、增量 SQL、模块边界和接口联动边界。
---
# 后端开发规则

## 技术栈

- JDK 使用 21，Spring Boot 使用 3.5.x，MyBatis-Plus 使用 3.5.x。
- Web 栈使用 Spring MVC，不切换为 WebFlux。
- 数据库以 PostgreSQL 为准；SQL、方言函数、分页、默认值和驱动行为必须保持 PostgreSQL 可执行。
- 涉及 MCP 能力时，后端仍遵守 Spring MVC 体系，禁止引入 WebFlux 版 MCP server/client 依赖。

## PostgreSQL 与数据访问

- SQL 变更先判断 PostgreSQL 行为，再考虑其他兼容性。
- PostgreSQL `jsonb` 字段必须确认 JDBC 绑定类型，不得只靠 Java 字段改成 `Map` 或 `Object` 假设可写入。
- `jsonb` DO 字段优先复用 `com.wf.vmesh.framework.mybatis.core.type.PgJsonbTypeHandler`，并配合 `@TableField(typeHandler = ...)` 与 `@TableName(autoResultMap = true)`。
- Service 处理 JSON 载荷时优先使用明确结构或 `Map<String, Object>`，避免无必要的多次字符串/对象转换。
- 出现 `jsonb` 类型不匹配错误时，优先排查 TypeHandler 与 JDBC 参数绑定。

## 增量 SQL

- 新增建表、改表、索引、初始化数据只允许追加增量 SQL，不直接改写历史 SQL。
- SQL 落点以仓库真实后端目录和 SQL 目录为准，文件名使用 `yyyy-MM-dd-HH-mm-ss.sql`。
- 当前项目新增变更只提交 PostgreSQL 脚本，不额外补 MySQL 或其他数据库脚本。
- 数据库表名优先使用已存在模块前缀；新增表名前缀必须体现归属域，例如 `system_`、`edge_`、`algorithm_`、`vision_`、`report_`。
- 新建业务表默认包含 `id`、`name`、`serial`、`creator`、`create_time`、`updater`、`update_time`、`deleted`、`tenant_id`；缺失时必须说明业务必要性并确认。

## 模块边界

- 开发前先确认需求归属域；优先落入现有域，只有现有域都不合适时才提出新域。
- 新增域必须说明职责、边界和与现有域关系。
- 启动装配类模块只承载入口、装配和全局配置，不承载具体业务编排。
- 通用基础设施模块只放跨域复用能力，不吸收具体业务语义。
- 不跨域直接复用其他域的 mapper/dataobject 作为常规实现手段；跨域协作优先走 service 契约、VO/DTO 或应用服务。

## 联动与安全边界

- 涉及接口路径、请求参数、响应结构、错误码或鉴权语义变化时，切换到 API-First 联动规则。
- AI 平台配置中的密钥等敏感信息只允许通过配置项或环境变量注入，禁止硬编码和交付回显。
