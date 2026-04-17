---
name: vmesh-platform-backend
description: 在 WF_VMesh_Coud 仓库中开发或修改通用后端能力时使用。适用于 Maven 多模块、Spring Boot 3.5、Spring MVC、MyBatis Plus、dynamic-datasource、Redis、MQ、Quartz、监控等场景；会先确认目标模块边界、profile 配置、数据库类型与现有 starter，再落到 system、infra、framework 或 server 的正确位置。
---

# VMesh Platform Backend

## 何时使用

- 需求落在 `vmesh-server`、`vmesh-module-system`、`vmesh-module-infra`、`vmesh-framework`
- 任务涉及 Spring MVC 接口、MyBatis Plus、Redis、MQ、Quartz、监控、代码生成、系统域能力
- 需要判断“这段代码该放在哪个模块”
- 需要按未来微服务化目标保持清晰域边界

## 先做什么

1. 读根 `pom.xml`，确认模块和 JDK / Spring Boot 版本。
2. 读目标模块 `pom.xml`，确认该模块已经依赖哪些 starter。
3. 若涉及配置，读 `vmesh-server/src/main/resources/application.yaml` 和当前 profile。
4. 若涉及数据库，额外读 `application-local.yaml` 与 `script/docker/docker-compose.yml`。
5. 若有代码改动，检查目标模块现有测试目录和测试基建。

## 模块路由

- `vmesh-server`
  - 启动类、装配、默认降级接口、profile 级配置
- `vmesh-module-system`
  - 用户、权限、字典、通知、租户等通用业务域
- `vmesh-module-infra`
  - 任务、日志、文件、代码生成、监控、WebSocket、研发工具
- `vmesh-framework/*starter*`
  - 通用基础设施封装、自动配置、跨模块复用能力

## 域边界判断

- 先判断这是领域能力还是技术底座。
- 领域能力放 `module`，技术底座放 `framework`。
- 不跨域直接复用内部 DAL 作为默认方案。
- 默认考虑未来拆成独立服务后的边界稳定性。

## 落地规则

- 不在 `vmesh-server` 塞业务实现。
- 优先复用已有 starter，不平行再造基础设施接入。
- 数据层改动前先确认数据库类型，不把 SQL / ID 策略写死。
- 配置项沿用既有命名空间，不创建新的配置体系。
- 关键流程补中文注释，尤其是多库兼容、消息通道、监控开关。
- 只要改了业务代码，默认同步补标准可运行的单元测试。

## 测试要求

- 测试放模块自己的 `src/test/java`、`src/test/resources`
- 优先复用模块现有 `application-unit-test.yaml`、SQL 初始化脚本、mock 基建
- 覆盖正常路径、关键分支、异常路径
- 未经确认不执行，但测试代码必须达到可运行状态

## 输出要求

- 明确写出修改归属模块
- 明确写出域归属判断
- 明确写出是否已验证
- 如果没跑测试，直说“未验证”
