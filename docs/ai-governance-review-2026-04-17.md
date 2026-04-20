# AI_Vision 协作规范体系评估与顶层治理优化建议

## 1. 评估范围

- 根入口：`/mnt/e/projects/AI/AI_Vision/AGENT.md`
- 项目协作入口：`/mnt/e/projects/AI/AI_Vision/.ai/agent.md`
- 规则集：`/mnt/e/projects/AI/AI_Vision/.ai/rules/*.md`
- 角色集：`/mnt/e/projects/AI/AI_Vision/.ai/agents/*.md`
- 跟踪文档：`/mnt/e/projects/AI/AI_Vision/docs/review-tracking/review-and-optimization-checklist.md`

本结论基于静态阅读与目录核对，未做流程演练或团队访谈。

## 2. 当前规范对项目的适配度结论

结论：现有规范体系已经适合当前项目进入“多人、多模块、前后端联动”的协作阶段，尤其在以下几类问题上已经具备较强约束力：

- 有清晰入口：根入口 `AGENT.md` + 项目入口 `.ai/agent.md`，读取顺序明确。
- 有角色分工：backend / frontend / fullstack / review 四类角色已拆分，适合当前双仓协作。
- 有模块边界：后端规则已强调 `server / module / framework` 分层，方向符合未来微服务化。
- 有联动意识：前后端一旦涉及字段、错误码、权限、分页语义变化，就切 fullstack。
- 有验证口径：未验证必须显式标注，能降低“读代码即宣称已完成”的协作噪音。
- 有 review 留痕：`docs/review-tracking/review-and-optimization-checklist.md` 已承担问题跟踪职责。

## 3. 已确认的主要缺口

### 3.1 P1：根入口命名与常见协作约定不一致

- 当前根入口文件名是 `AGENT.md`，不是更常见的 `AGENTS.md`。
- 风险不是“文件不能用”，而是：
  - 新成员、外部代理、自动化工具更容易优先寻找 `AGENTS.md`
  - 后续若出现子目录级规范，命名不统一会增加入口判断成本
  - 文档、脚本、团队口头约定容易出现“AGENT / AGENTS”混用

建议：

- 明确一个唯一规范名作为标准入口，优先统一为 `AGENTS.md`
- 若暂时不改名，也至少在根入口与 `.ai/agent.md` 中写明“当前仓库根入口文件名固定为 `AGENT.md`”
- 后续增加文档互链自检，避免入口文件名变动后引用失效

### 3.2 P1：后端模块边界规则未完整覆盖真实模块

- 聚合工程真实存在 `vmesh-module-report`
- 但后端规则与 backend-agent 的模块候选列表里未纳入 `report`
- 这会导致后续协作者在做报表、统计、导出、BI 类需求时，没有明确域归属口径，容易误塞到 `infra` 或 `vision`

建议：

- 在后端规则和 backend-agent 中把 `report` 补为正式候选域
- 同时给出一句职责边界，例如“报表、统计分析、可视化数据聚合优先归属 report，不吸收系统配置或 AI 编排语义”

### 3.3 P1：现有规范更强于“开发约束”，弱于“团队治理约束”

当前文件已经能约束“怎么写”，但还没有明确约束“谁来定、谁审批、谁兜底、何时准入、何时升级风险”。缺失项主要包括：

- 需求进入开发前的 DoR（Definition of Ready）
- 上线前的 DoD（Definition of Done）
- 变更分级（普通变更 / 高风险变更 / 跨域变更 / 数据变更）
- 人员责任矩阵（谁负责领域决策、接口定版、联调签收、回滚决策）
- 例外流程（赶工、临时跳过测试、接口先占位等情况谁批准）

建议：

- 新增单独治理规则文件，不和编码规则混在一起
- 让“人和流程”成为显式约束，而不是只约束代理执行步骤

### 3.4 P2：Review 跟踪文档能记问题，但还不够支撑项目管理

当前 `review-and-optimization-checklist.md` 已能记问题与完成状态，但对团队管理仍有缺口：

- 没有责任人
- 没有优先级统一定义（文档里当前存在 `P1/P2`，但规则里 review-agent 使用 `S0-S3`）
- 没有目标版本 / 计划迭代
- 没有阻塞状态 / 依赖关系 / 复验人

建议：

- 统一问题分级口径，只保留一套
- 每条事项至少补：负责人、计划版本、复验状态、验证证据链接
- 若继续用 Markdown，也建议统一任务模板

### 3.5 P2：Fullstack 规则强调“契约对齐”，但没有“契约源”唯一化

当前 fullstack-agent 要求给出契约来源，但没有规定“哪个才是最终真源”。在多人协作中，这会直接导致：

- 后端以 VO 为准，前端以 TS 类型为准
- 有 OpenAPI 时没人确认是否已同步
- 接口字段变更后，不清楚先改哪一侧文档/代码

建议：

- 明确一条规则：接口契约唯一真源是什么
- 可选方案：
  - 以后端 OpenAPI/Swagger 导出为准
  - 以后端 VO + controller 注解为准
  - 以前端 SDK 生成产物为准（不推荐）
- 一旦真源确定，就规定字段变更必须同步更新哪几个产物

### 3.6 P2：Skill 机制有入口，但没有项目级沉淀清单

`.ai/agent.md` 已经把 skill 沉淀机制写进去，但当前 `.ai/skills/` 仍为空。对当前项目而言，已经出现了适合固化的重复流程：

- 后端模块归属判断
- PostgreSQL 兼容检查
- 前后端契约联动检查
- review 结论同步归档
- 原型到生产实现的落地边界检查

建议：

- 不要一次性堆很多 skill
- 先沉淀 2 到 3 个最高频、最稳的项目级 skill

## 4. 建议新增的顶层治理层

建议把规范体系从“入口 + 角色 + 编码规则”升级为“入口 + 治理规则 + 执行规则 + 模板/skill”四层。

### 4.1 第一层：总入口

保留：

- `AGENT.md` 或统一后的 `AGENTS.md`
- `/.ai/agent.md`

职责：

- 只定义读取顺序、作用范围、总优先级、总边界
- 不塞入大量具体编码细节

### 4.2 第二层：治理规则

建议新增：

- `/.ai/rules/05-collaboration-governance.md`

建议内容：

- 任务分级：普通、跨域、高风险、数据变更、上线阻断
- DoR：需求进入开发前必须具备什么
- DoD：开发完成后至少满足什么
- RACI：需求 owner、域 owner、接口 owner、review owner、发布 owner
- 例外审批：哪些情况允许跳过标准流程，谁批准，如何留痕
- 优先级与严重级统一口径：统一 `P0-P3` 或 `S0-S3`，不要混用

### 4.3 第三层：执行规则

保留并小幅增强：

- `00-repo-baseline.md`
- `10-backend-development-rules.md`
- `20-frontend-development-rules.md`
- `30-fullstack-linkage-rules.md`

增强建议：

- 在 backend 规则中补 `report` 域
- 在 fullstack 规则中补“契约唯一真源”
- 在通用规则中补“文档互链自检”和“规范变更需要更新变更记录”

### 4.4 第四层：模板与 skill

建议新增目录：

- `/.ai/templates/`

建议模板：

- `task-intake-template.md`
- `adr-template.md`
- `review-item-template.md`
- `release-checklist-template.md`

建议优先沉淀的 skill：

- `/.ai/skills/module-boundary-check/`
- `/.ai/skills/fullstack-contract-check/`
- `/.ai/skills/postgresql-compat-check/`

## 5. 面向团队协作的具体优化方案

### 5.1 统一“决策留痕”

对“新增域、接口语义变化、数据库迁移、兼容策略、临时降级”这类高影响决策，建议统一沉淀 ADR。

建议目录：

- `/mnt/e/projects/AI/AI_Vision/docs/adr/`

每条 ADR 至少包含：

- 背景
- 决策项
- 备选方案
- 为什么选当前方案
- 影响范围
- 回滚/撤销条件

### 5.2 统一“协作入口格式”

建议以后复杂任务统一要求以下字段：

- 使用的 skill
- skill 目录
- 本步目标
- 落地文件
- 影响范围
- 关键边界
- 风险等级
- 验证结果
- 未验证项

当前规范已覆盖其中大半，但还缺“风险等级”与“责任归属”。

### 5.3 统一“问题分级”和“发布准入”

当前 review-agent 用 `S0-S3`，跟踪文档用 `P1/P2`，口径不统一。

建议二选一：

- 全部统一成 `S0-S3`，偏上线风险
- 全部统一成 `P0-P3`，偏排期优先级

同时定义：

- 哪个等级必须阻断上线
- 哪个等级允许带风险上线
- 哪个等级必须补复验

### 5.4 给跨仓联动增加“签收点”

当前项目至少包含：

- 后端仓：`WF_VMesh_Coud`
- 前端仓：`WF_VMesh_Coud_UI`
- 原型仓：`wf_vmesh_cloud_design`

建议明确跨仓签收点：

- 契约签收：后端 owner + 前端 owner
- 页面行为签收：产品/设计 + 前端 owner
- 可上线签收：review owner + 发布 owner

否则 fullstack 虽然定义了联动，但仍可能停留在“技术代理自己判断完成”。

### 5.5 给 review 跟踪补“管理字段”

建议每条 review 事项扩展为：

- 严重级
- 标题
- 责任人
- 所属模块
- 计划版本
- 当前状态
- 验证状态
- 证据链接

如果暂时不接入外部系统，Markdown 也足够承载这一版治理。

## 6. 推荐的最小落地顺序

为了避免过度设计，建议只做三步：

1. 先统一入口命名、问题分级、后端模块候选清单
2. 再新增一份 `05-collaboration-governance.md`，补 DoR / DoD / RACI / 例外审批
3. 最后只沉淀 2 到 3 个项目级高频 skill，不一次性铺满

## 7. 简短结论

现有规范已经足够支撑“当前项目开发协作”，但还不足以支撑“顶层项目治理协作”。现在最值得补的不是再写更多开发细则，而是把“责任、决策、分级、准入、例外、留痕”单独抽成治理层，让规则体系从“会写代码”升级为“能稳定组织多人协作”。
