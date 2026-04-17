# WF_VMesh_Coud agent 规范（历史迁移）

这份文档定义“代理在这个仓库里怎么工作”，重点不是解释技术本身，而是统一协作方式、权限边界和证据标准。

## 1. 仓库画像

- 这是 Maven 多模块后端工程，模块入口在根 `pom.xml`。
- 技术主线是 JDK 21 + Spring Boot 3.5.9 + Spring MVC + MyBatis Plus + dynamic-datasource + Redis/Redisson。
- `vmesh-module-vision` 是 AI 域，额外包含 Spring AI、MCP、向量库、TinyFlow 工作流。
- `edge` 是独立业务域，承载边缘节点管理、设备凭证治理、节点激活与心跳状态等能力。
- `vmesh-server` 默认并未强制装配 AI 模块，是否启用要看 `vmesh-server/pom.xml` 和 `DefaultController` 当前状态。
- 当前模块化不是“按包拆着看”，而是为了未来微服务化做域沉淀；代理新增能力时必须优先考虑域归属是否稳定。

## 2. 代理工作流

1. 先确认目标模块。
   - 只改启动装配与 profile：看 `vmesh-server`
   - 只改基础设施：看 `vmesh-module-infra` 和 `vmesh-framework`
   - 只改系统域：看 `vmesh-module-system`
   - 只改 AI：看 `vmesh-module-vision`
   - 只改边缘节点与边缘接入治理：看 `edge` 域实现（保持独立域边界）
2. 先确认运行时边界。
   - 涉及数据库、缓存、MQ、监控、AI provider 时，必须先读 `application.yaml` 和对应 `application-*.yaml`
   - 涉及部署、容器、初始化时，必须先读 `script/docker`、`script/shell`、`sql`
3. 再决定修改位置。
   - 业务逻辑进 `module`
   - 通用基础设施进 `framework/*starter*`
   - 启动和装配留在 `server`
4. 若有代码改动，补对应单元测试。
   - 测试文件放目标模块 `src/test/java`
   - 测试资源放目标模块 `src/test/resources`
   - 测试要能被标准 Maven/JUnit 体系运行，不写一次性脚本测试
   - 未经确认不执行测试，但代码应达到可运行状态
5. 最后输出证据。
   - 写明改了什么
   - 为什么改在这里
   - 哪些已验证，哪些未验证

## 3. 代理能做什么

- 在既有模块边界内新增或修改 controller / service / mapper / dataobject / vo / config。
- 为现有能力补齐 AI 适配、配置项、工具调用、向量库接入、工作流执行逻辑。
- 按现有风格补中文注释，尤其是关键流程、特殊兼容、三方平台差异点。
- 在 `sql`、`script`、`application*.yaml` 范围内补文档化约束或与代码同步的配置模板。
- 为新增或修改的业务逻辑同步产出标准单元测试。
- 产出本仓库可复用的 rule / agent / skill 文档。

## 4. 代理不能直接做什么

- 未经确认直接运行测试、构建全仓、启动 docker、连接外部真实服务。
- 未经确认删除文件、批量重命名、回滚用户已有改动。
- 未经确认替换 `application*.yaml` 中现有真实样例为新密钥，或在回复中回显密钥值。
- 未经确认把数据库类型、消息中间件、向量库实现强行切到另一套方案。
- 在 `vmesh-server` 里堆业务代码，或在 `vmesh-module-vision` 里引入 WebFlux MCP starter。
- 为了省事把跨域逻辑直接塞进“当前顺手的模块”，破坏未来微服务拆分边界。

## 5. 强制检查项

### 5.1 改数据层前

- 同时检查 `application-local.yaml` 与 `script/docker/docker-compose.yml`
- 判断当前任务是“兼容多库”还是“只服务当前 profile”
- 判断 ID 策略、方言、分页、DDL 是否受现有库类型影响

### 5.2 改 AI 前

- 先看 `vmesh-module-vision/pom.xml`
- 再看 `AiAutoConfiguration`、`AiModelFactoryImpl`、`SecurityConfiguration`
- 判断当前能力属于模型接入、tool calling、向量检索、MCP、工作流中的哪一类
- 判断是否需要同步菜单、字典、SQL 种子或 server 装配

### 5.3 改配置前

- 判断配置是样例、开发态、本地态还是准生产态
- 新增配置优先沿用现有命名空间：`spring.*`、`vmesh.*`
- 能复用现有配置类时，不新增平行配置体系

### 5.4 做领域设计前

- 先判断能力属于 system、infra、vision、edge 中哪个域
- 领域模型、service、DAL 尽量域内闭合，不做跨域 mapper 直连
- 跨域协作优先通过明确接口、应用服务或稳定契约，不写隐式耦合
- 设计时默认考虑未来独立部署后的拆分成本

### 5.5 写测试前

- 优先写 JUnit 5 + 模块既有测试基建
- 单测覆盖正常路径、关键分支、异常路径
- 测试命名直接反映业务语义，不写含糊 case1/case2
- 如果依赖数据库、Redis、MQ，优先复用模块现有 `application-unit-test.yaml`、SQL 初始化脚本或 mock 能力

## 6. 默认汇报模板

- 使用的 skill：
- skill目录：
- 本步目标：
- 落地文件：
- 关键边界：
- 未验证项：

## 7. 文档映射

- 硬约束：`./.ai/rules/*.md`
- 可复用流程：`./.ai/skills/*/SKILL.md`
