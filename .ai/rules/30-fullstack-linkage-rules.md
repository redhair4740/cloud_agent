# 30 Fullstack Linkage 强制规则

> 此文件由 .ai/ 自动生成，请勿直接编辑。
> 源文件：.ai/rules/30-fullstack-linkage-rules.md
> 投影时间：2026-04-24

## 1. 适用范围

- 适用于同时涉及后端与前端的联动任务：接口契约变更、字段链路变更、页面行为同步改造、联调回归修复。
- 本规则是联动增强规则，不替代基础规则与单边规则。
- 联动任务按 API-First 流程执行（本文件第 6 节）：Backend Agent 契约先行 + Frontend Agent 按 OpenAPI 文档实现 + contract-check 验证。

## 2. 强制继承规则集合

联动任务必须同时继承以下规则集合：

1. `00-repo-baseline.md` 全局基线规则（global）
2. `10-backend-development-rules.md` 后端开发规则（backend）
3. `20-frontend-development-rules.md` 前端开发规则（frontend）
4. `30-fullstack-linkage-rules.md` 联动规则（linkage，本文件）

联动执行流程：

1. Backend Agent 先走"API 契约先行"流程（见 `20-backend-agent.md` 第 9 节），输出 OpenAPI 契约文档。
2. 前/后端确认契约无误（以 `/v3/api-docs` 为准）。
3. Backend Agent 独立完成 Service 实现。
4. Frontend Agent 独立完成前端实现（按 OpenAPI 文档对齐类型与调用）。
5. 使用 `contract-check` skill 做最终一致性验证。

按任务内容追加：

- 涉及领域建模、服务编排、数据与测试策略时，直接按本文件与 `10-backend-development-rules.md` 执行，不再依赖额外域/测试规则文件。
- 联动任务必须先做域归属判断：优先归入现有域模块；若现有域都不合适，先提出并创建新域，再进行端到端联动实现与验收。
- 涉及 AI 能力链路时，必须在联动交付中同步说明后端启用态、接口可达性与前端降级行为，禁止把"代码存在"当"接口可用"。
- 涉及 AI 配置项联动时，联调过程与交付记录不得回显密钥等敏感信息。

## 3. 联动执行硬约束

- 禁止将联动理解为"只改一个端"；必须同步核对前后端契约与页面行为。
- 禁止以联调为由绕过后端或前端既有规则；任何临时逻辑不得落到错误层级。
- 字段、枚举、错误码、分页筛选参数必须端到端一致，出现不一致必须先修正再交付。

## 4. 最低交付清单

- 规则继承声明：本次任务实际继承的规则集合。
- 契约文档快照：`/v3/api-docs` JSON 或可访问地址。
- 联动变更映射：后端字段/接口 -> 前端类型/调用 -> 页面行为。
- 回归影响说明：受影响模块、页面、接口与失败路径。
- 测试覆盖说明：后端单元测试覆盖场景（正常、边界、失败）与前端关键交互回归点；未执行测试必须写明原因。
- 契约一致性检查结果：`contract-check` skill 输出或手动对照结果。
- 验证结论：已验证项与未验证项（未验证必须写原因）。

## 5. 冲突处理

- 文档冲突时，优先级遵循总入口：`rules > agent.md > agents > skills`。
- 若 `30` 与单边规则存在表述差异，以"不降低单边约束、补强联动约束"为原则处理。

## 6. 契约唯一真源与 API-First 流程

### 6.1 契约唯一真源

- OpenAPI 文档（`/v3/api-docs`）是接口契约的唯一真实来源。
- 后端通过 springdoc + knife4j 的注解（`@Operation` / `@Schema` / `@ApiResponse`）自动生成契约文档。
- 前端实现必须以 OpenAPI 文档为准，不得自行猜测字段名、类型、枚举值或错误码语义。
- 后端 Controller 注解是契约文档的生成源，任何接口变更必须反映在注解中。

### 6.2 API-First 执行流程

```text
1. Backend Agent 写 Controller 骨架（含完整注解）
   ↓
2. 启动后端服务，访问 /v3/api-docs 拿到 OpenAPI 文档
   ↓
3. 与前端确认契约（路径、方法、字段、错误码）
   ↓
4. Backend Agent 实现 Service 逻辑
5. Frontend Agent 按 OpenAPI 文档实现前端
   ↓
6. 使用 contract-check skill 做一致性验证
```

### 6.3 contract-check

- 联动交付完成后，必须执行契约一致性检查。
- 检查方式：使用 `.ai/skills/contract-check/SKILL.md` 定义的流程。
- 检查范围：所有变更涉及的前端 API 调用与后端 OpenAPI 文档。
- 检查输出：不一致清单（含严重级别 P0-P3），作为联动交付的组成部分。
