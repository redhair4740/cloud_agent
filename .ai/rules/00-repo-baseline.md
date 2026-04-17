# Rule: 仓库通用基线

## 1. 模块边界

- 根 `pom.xml` 是唯一的模块真相来源；新增或调整模块前先核对聚合声明。
- `vmesh-server` 只做启动、装配、默认降级接口，不放业务实现。
- `vmesh-module-system` 放系统域通用业务。
- `vmesh-module-infra` 放基础设施、运维、研发工具。
- `vmesh-module-vision` 放 AI 域。
- 通用基础设施优先沉淀到 `vmesh-framework/*starter*`，不要在业务模块重复封装。

## 2. 技术栈硬约束

- Java 版本按根 `pom.xml` 固定为 21。
- Spring Boot 按根 `pom.xml` 固定在 3.5.x 线。
- Web 栈按当前实现是 Spring MVC，不擅自切到 WebFlux。
- ORM 主线是 MyBatis + MyBatis Plus + dynamic-datasource + mybatis-plus-join。
- Redis、MQ、监控、Job 优先复用现有 starter。

## 3. 配置与环境

- 修改数据源前，必须同时检查 `vmesh-server/src/main/resources/application.yaml`、`application-local.yaml`、部署脚本与容器脚本。
- 当前仓库同时存在 PostgreSQL 本地配置与 MySQL docker 示例，AI 不能主观假设数据库只有一种。
- 所有新配置优先放入既有命名空间，不随意创造新的顶层前缀。
- `application*.yaml` 内存在真实样例和敏感值，允许定位，不允许在对话、文档、提交说明里展开具体值。

## 4. 代码与注释

- 保持 KISS、YAGNI，不做提前抽象。
- 核心流程、三方平台差异、临时兼容逻辑必须补简体中文注释。
- 修改功能时，不保留失效的兼容代码。
- 业务代码沿用现有分层：controller / service / dal / dataobject / vo / enums / framework。

## 5. 验证与风险

- 未经明确确认，不运行测试。
- 未经明确确认，不做批量删除、重命名、回滚、docker 启停、外网真实服务调用。
- 如果只做静态改动，没有执行验证，必须明确标注“未验证”。
