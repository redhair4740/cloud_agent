# CLAUDE.md — AI_Vision 项目指令

> 此文件由 .ai/ 投影生成；测试阶段需手工同步，请勿脱离源文件单独修改。
> 源文件：AGENTS.md → .ai/agent.md → .ai/rules/
> 投影时间：2026-04-24

## 读取顺序

1. 先读本文件 `CLAUDE.md`
2. 按本文件引用路径加载角色与技能文档（按需）

## 核心约束

### 输出与证据要求

1. 默认使用简体中文输出分析、说明、注释与结论。
2. 关键判断尽量附证据：真实文件路径、方法名、配置键、命令与实际行为。
3. 没有真实验证证据时，必须明确标注"未验证"，不得写成已完成或已通过。

### 执行边界

1. 默认允许执行只读命令、静态检查、类型检查、编译与单元测试；后台执行单元测试时建议设置最大超时时间 60s，避免任务卡死。
2. 未获明确确认，不执行高风险操作（删除/批量改写/环境与权限变更/生产数据与密钥相关操作）。
3. 需执行高风险操作时，先说明影响范围与风险，再等待明确确认。
4. 若发现当前任务存在适合沉淀为可复用 skill 的稳定流程或检查清单，先给出 skill 化建议；未获明确同意前，不直接生成 skill 文件。经确认后生成的项目级 skill 统一保存到 `./.ai/skills/`。
5. Git 仅允许安全操作；禁止使用会丢失、覆盖、回滚、强推或批量改写历史/工作区的危险 git 操作。非破坏性的查看类、定位类、状态类 git 操作可以使用。

## 项目概览

- 适用于当前仓库内的需求分析、设计、开发、联调、文档与交付任务。
- 面向"项目结果"协作，不面向某个单一工具说明。
- 目标是让团队在同一边界下稳定推进：同一规则、同一职责、同一输出口径。

## 项目目录映射

- 后端主工程目录：由 `.ai/project.yml` 的 `dirs.backend` 指定
  - 承载后端接口、领域模型、数据访问、后端配置与后端测试代码。
- 前端主工程目录：由 `.ai/project.yml` 的 `dirs.frontend` 指定
  - 承载页面、组件、状态管理、API 调用封装与前端交互逻辑。
- 原型/设计参考目录：由 `.ai/project.yml` 的 `dirs.design` 指定
  - 只用于参考布局、信息层级、交互流程与功能点，不作为代码实现来源。
- 项目协作规范目录：`./.ai`
  - 承载当前项目的 agents / rules / skills 规范体系。
- 项目文档目录：`./docs`
  - 承载评审结论、设计方案、交接文档、治理评审、部署方案和其他需要持续追踪的 Markdown 工件。
  - `./docs/design/`：承载技术设计方案及对应的 AI 交接文档，按日期子目录组织。
  - `./docs/governance/`：承载治理评审、协作分析、规范评估文档，按日期子目录组织。
  - `./docs/deployment/`：承载部署方案、运维方案，按日期子目录组织。
  - `./docs/review-tracking/`：承载评审清单与跟踪记录，按日期子目录组织。
  - 文档命名格式：`hh-mm-ss-类型标签-文档名称.md`，时间戳在前保证默认排序按时间排列；`review-tracking/` 目录例外，使用 `review清单-hh-mm-ss-文档名称-状态.md`。
  - 文档索引与使用约定：`./docs/README.md`

## 目录职责

- `./.ai/agents/`
  - 定义协作角色、分工方式、任务拆解与汇报模板。
  - 用于明确主责任人与跨角色协作流程。
  - 当前主用文档：
    - `./.ai/agents/20-backend-agent.md`
    - `./.ai/agents/30-frontend-agent.md`
    - `./.ai/agents/40-review-agent.md`
- `./.ai/api-status.yml`
  - 记录接口联调状态，由后端或人工确认后更新。
  - 前端与 AI 只消费状态，用于决定是否 Mock、是否切真实 API、是否清理失效 Mock。
- `./.ai/rules/`
  - 定义项目硬约束与边界规则，属于必须遵守项。
  - 涵盖业务命名、模块归属、开发边界、交付标准、测试与验证口径。
  - 核心基线文档：
    - `./.ai/rules/00-repo-baseline.md`（跨端通用基线）
    - `./.ai/rules/01-business-dictionary.md`（业务领域字典与命名映射）
  - 联动规则文档：
    - `./.ai/rules/30-fullstack-linkage-rules.md`（前后端联动强制规则）
- `./.ai/skills/`
  - 预留给后续可复用执行方法与操作流程。
  - 当前目录可为空；只有实际存在可用 skill 时才读取。
  - 不得突破 `rules` 的约束。
- `./.ai/templates/`
  - 承载项目文档模板，用于规范各类文档的输出格式与必填字段。
  - 模板列表：
    - `design-doc.md`：设计文档模板（背景、目标、方案、影响范围、验收标准）
    - `review-checklist.md`：评审清单模板（评审项、严重级别、问题描述、建议修复）
    - `handover-doc.md`：交接文档模板（项目概述、关键模块、部署流程、注意事项）
    - `bug-fix.md`：Bug 修复工单模板（复现步骤、根因分析、修复方案、验证结果）
    - `refactor.md`：重构工单模板（重构动机、范围、策略、验证计划）
  - 使用方式：复制模板内容，按必填字段填充，输出到 `docs/` 对应目录。

## 规则组合继承与调度线

按任务类型加载规则集合：

1. `backend-agent`
   - 规则继承：`00-repo-baseline.md + 01-business-dictionary.md + 10-backend-development-rules.md + 11-backend-object-layering-rules.md`
   - 涉及新接口或接口变更时，必须先走"API 契约先行"流程。
2. `frontend-agent`
   - 规则继承：`00-repo-baseline.md + 01-business-dictionary.md + 20-frontend-development-rules.md`
   - 接口调用必须按 OpenAPI 文档对齐，不得自行猜测字段。
3. `review-agent`
   - 规则继承：按被评审对象加载对应规则集合
   - 评审后端改动：加载 `backend-agent` 规则集
   - 评审前端改动：加载 `frontend-agent` 规则集
   - 评审联动改动：加载 `backend-agent` + `frontend-agent` + `01-business-dictionary.md` + `30-fullstack-linkage-rules.md` 规则集

跨端联动任务调度原则：

- 按 API-First 流程执行：
  1. Backend Agent 先走"API 契约先行"流程（写 Controller 骨架，生成 `/v3/api-docs`）
  2. 与前端确认契约无误
  3. Backend Agent 完成 Service 实现，Frontend Agent 完成前端实现
  4. 使用 `contract-check` skill 做最终一致性验证
- 联动任务必须遵守 `30-fullstack-linkage-rules.md` 的所有硬约束。

## 项目模块与边界说明

- 前后端联动按"接口契约 + 页面行为"共同验收，禁止单边定义为准。
- 原型只用于参考布局与功能点，不作为字段、接口、数据结构的直接实现依据。
- 模块化设计以未来微服务化为目标，先清晰定义域边界，再落地模块职责。
- 后端对象管理默认走轻量模块化：模块间强调边界，模块内默认保持 `VO + DO` 即可，不默认引入 `BO` 中间层。
- 规范目标目录统一使用 `dal/mapper` 这类中性命名。
- 跨域协作必须明确输入输出，避免隐式耦合与跨域直接依赖扩散。

## Git 使用边界

- 允许使用安全的 git 操作辅助查看与定位，例如状态查看、差异查看、日志查看、文件归属与提交历史查询。
- 禁止使用危险的 git 操作，包括但不限于：覆盖工作区、强制回退、重写历史、强推、批量丢弃改动、未确认的冲突性 checkout/reset/restore/rebase。
- 只要某个 git 操作可能导致用户现有改动、历史记录或当前分支状态不可逆丢失，就视为危险操作，不得执行。

## 团队最低输出要求

每次任务输出至少包含：

- 本步目标
- 落地文件
- 影响范围
- 关键边界
- 验证结果（已验证 / 未验证）
- 未验证项与原因

## 规则摘要与路径引用

本文件使用摘要模式，不再全量内联 `.ai/rules/*.md`。执行任务时必须按任务类型加载下列详细规则文件。

### 任务开始分类

- 每轮任务开始先参考 `./.ai/skills/task-classifier/SKILL.md` 做只读分类，输出 `task_type`、`api_first_required`、`required_rules` 与判断原因。
- 若同时命中后端接口信号（Controller/VO/OpenAPI 注解）与前端接口消费信号（`src/api`、`src/views`、`src/store`、Mock），自动切换为前后端联动任务。
- 分类不确定时先补充只读搜索证据；仍无法判断时，必须明确标注 `task_type: uncertain` 并请求确认是否涉及接口契约变更。

### 任务类型加载矩阵

| 任务类型 | 必读规则/文件 |
|----------|---------------|
| 通用任务 | `./.ai/rules/00-repo-baseline.md` + `./.ai/rules/01-business-dictionary.md` |
| 后端任务 | 通用规则 + `./.ai/rules/10-backend-development-rules.md` + `./.ai/rules/11-backend-object-layering-rules.md` |
| 前端任务 | 通用规则 + `./.ai/rules/20-frontend-development-rules.md` |
| 前后端联动任务 | 通用规则 + `./.ai/rules/10-backend-development-rules.md` + `./.ai/rules/20-frontend-development-rules.md` + `./.ai/rules/30-fullstack-linkage-rules.md` + `./.ai/api-status.yml` |
| Review 任务 | 按被评审对象加载对应规则；联动评审必须额外加载 `30-fullstack-linkage-rules.md` 与 `.ai/api-status.yml` |

### 核心红线摘要

- 业务词不得自行翻译；新增命名必须先查 `01-business-dictionary.md`，未收录词需标注待确认。
- 接口字段、类型、枚举和错误码以 OpenAPI（`/v3/api-docs`）为唯一契约真源，不得前端猜字段。
- 接口联调状态以 `.ai/api-status.yml` 为准，AI 不得自行把接口状态提升为 `ready`。
- Mock 只能落在统一 Mock 层或统一 mock 目录，禁止散落到 Vue 组件、Pinia action 或 API SDK 内部。
- 后端变更必须遵守模块边界、对象分层和增量 SQL 规则；历史 SQL 不得直接改写。
- 默认允许只读命令、静态检查、类型检查、编译与单元测试；删除、批量改写、数据库迁移、生产 API、权限/环境变更必须先确认。
- 没有真实验证证据时，必须明确标注“未验证/未执行测试/未编译验证”，不得写成“已通过/已完成”。

### 详细规则路径

- `./.ai/rules/00-repo-baseline.md`：跨端通用基线、证据表达、未验证口径、通用风险边界。
- `./.ai/rules/01-business-dictionary.md`：业务领域字典、推荐英文、禁用译法、表/权限前缀。
- `./.ai/skills/task-classifier/SKILL.md`：任务类型分类、必读规则判断与 API-First 触发判断。
- `./.ai/rules/10-backend-development-rules.md`：后端技术栈、SQL、模块边界、编译验证。
- `./.ai/rules/11-backend-object-layering-rules.md`：后端对象分层与目录组织。
- `./.ai/rules/20-frontend-development-rules.md`：前端 API SDK、状态管理、Mock 与交付规则。
- `./.ai/rules/30-fullstack-linkage-rules.md`：前后端联动、OpenAPI 契约、接口状态流转和 contract-check。
- `./.ai/api-status.yml`：接口联调状态清单，由后端/人工确认后更新。
