# .ai 项目协作总入口

本文件是项目团队协作入口，定义项目适用范围、目录职责、读取优先级、模块边界与最低交付要求。

## 1. 项目适用范围

- 适用于当前仓库内的需求分析、设计、开发、联调、文档与交付任务。
- 面向“项目结果”协作，不面向某个单一工具说明。
- 目标是让团队在同一边界下稳定推进：同一规则、同一职责、同一输出口径。

## 2. 项目目录映射

> 目录名统一从 `.ai/project.yml` 的 `dirs.*` 动态读取，每位协作者可按本地目录结构调整该文件。

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

## 3. 目录职责（agents / rules / skills）

- `./.ai/adapters/`
  - 承载跨平台适配器，将 `.ai/` 体系投影到各 AI 工具原生配置格式。
  - 每个子目录对应一个平台，包含该平台的投影规则与模板。
  - 当前适配平台：
    - `./.ai/adapters/codex/`：Codex 适配（基准平台，`AGENTS.md` 即原生入口）
    - `./.ai/adapters/gemini-cli/`：Gemini CLI 适配（投影为 `GEMINI.md`）
    - `./.ai/adapters/trae-cn/`：Trae-CN 适配（投影为 `.trae/rules/`）
    - `./.ai/adapters/claude-code/`：Claude Code 适配（投影为 `CLAUDE.md`）
  - 投影方向：`.ai/` → 各平台配置（单向），禁止反向修改投影文件。
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
- `./.ai/CHANGELOG.md`
  - 承载 `.ai` 目录下所有规范、配置、架构变更的追踪记录。
  - 每条记录包含：日期、变更类型（新增/修改/移除）、变更摘要、影响范围、变更人。
  - 变更记录按日期倒序排列，保留历史不删除。
  - 用于团队成员快速了解规范体系的演进与最新状态。

## 4. 读取顺序与优先级

标准读取顺序：

1. `./.ai/agent.md`（先明确项目协作总入口）
2. `./.ai/rules/*.md`（再明确硬约束与边界；其中 `00-repo-baseline.md` 与 `01-business-dictionary.md` 优先读取）
3. `./.ai/agents/*.md`（再匹配任务协作模式）
4. `./.ai/skills/*/SKILL.md`（若存在可用 skill，再作为最后一步读取）

文档冲突时优先级：

1. `rules`（最高）
2. `agent.md`
3. `agents`
4. `skills`

## 5. Git 使用边界

- 允许使用安全的 git 操作辅助查看与定位，例如状态查看、差异查看、日志查看、文件归属与提交历史查询。
- 禁止使用危险的 git 操作，包括但不限于：覆盖工作区、强制回退、重写历史、强推、批量丢弃改动、未确认的冲突性 checkout/reset/restore/rebase。
- 只要某个 git 操作可能导致用户现有改动、历史记录或当前分支状态不可逆丢失，就视为危险操作，不得执行。

## 6. 规则组合继承与调度线

按任务类型加载规则集合：

任务开始先参考 `./.ai/skills/task-classifier/SKILL.md` 做只读分类，输出 `task_type`、`api_first_required`、`required_rules` 与判断原因；若同时命中后端接口信号与前端接口消费信号，自动切换为前后端联动任务。

| 任务类型 | 必读规则/文件 |
|----------|---------------|
| 通用任务 | `./.ai/rules/00-repo-baseline.md` + `./.ai/rules/01-business-dictionary.md` |
| 后端任务 | 通用规则 + `./.ai/rules/10-backend-development-rules.md` + `./.ai/rules/11-backend-object-layering-rules.md` |
| 前端任务 | 通用规则 + `./.ai/rules/20-frontend-development-rules.md` |
| 前后端联动任务 | 通用规则 + `./.ai/rules/10-backend-development-rules.md` + `./.ai/rules/20-frontend-development-rules.md` + `./.ai/rules/30-fullstack-linkage-rules.md` + `./.ai/api-status.yml` |
| Review 任务 | 按被评审对象加载对应规则；联动评审必须额外加载 `30-fullstack-linkage-rules.md` 与 `.ai/api-status.yml` |

跨端联动任务调度原则：

- 按 API-First 流程执行：Backend Agent 先输出 OpenAPI 契约 → 后端/人工确认 `.ai/api-status.yml` → 前后端按契约实现 → `contract-check` 做一致性验证。
- 联动任务必须遵守 `30-fullstack-linkage-rules.md` 的所有硬约束。

## 7. 项目模块与边界说明

- 前后端联动按“接口契约 + 页面行为”共同验收，禁止单边定义为准。
- 原型只用于参考布局与功能点，不作为字段、接口、数据结构的直接实现依据。
- 模块化设计以未来微服务化为目标，先清晰定义域边界，再落地模块职责。
- 后端对象管理默认走轻量模块化：模块间强调边界，模块内默认保持 `VO + DO` 即可，不默认引入 `BO` 中间层。
- 规范目标目录统一使用 `dal/mapper` 这类中性命名。
- 跨域协作必须明确输入输出，避免隐式耦合与跨域直接依赖扩散。

## 8. Skill 沉淀建议机制

- 在需求实现、排障、迁移、联调、评审过程中，AI 应自动判断当前任务里是否出现了可复用、可沉淀、可跨任务复用的方法论或操作流程。
- 若满足以下任一特征，应主动提出"建议沉淀为 skill"：
  - 同类任务已重复出现两次及以上
  - 存在稳定的执行步骤、检查清单或判断路径
  - 明显适用于后续多个模块、多个需求或多名协作者复用
  - 继续依赖临时对话说明会增加遗漏、返工或口径漂移风险
- 提建议时至少说明：
  - 为什么适合沉淀为 skill
  - 预期适用场景
  - 建议的 skill 名称与范围
  - 若沉淀后会减少哪些重复解释或重复劳动
- 未获得用户明确同意前，只提出建议，不直接生成 skill 文件或 skill 目录。
- 用户明确同意后，才进入 skill 设计与落地阶段。
- 新生成的项目级 skill 必须保存到 `./.ai/skills/` 目录下，不写到其他位置。

## 8.1 Skill 自动发现与推荐规则

### 自动发现

- AI 在接收任务后，应扫描 `./.ai/skills/*/SKILL.md` 目录，读取所有可用 Skill 的 YAML frontmatter（`name`、`version`、`depends_on`、`description`）。
- 扫描时机：任务初始化阶段，优先于具体实现步骤之前完成。
- 若 `./.ai/skills/` 目录不存在或为空，跳过此步骤，不报错。

### 依赖预检

- 发现匹配 Skill 后，必须检查其 `depends_on` 声明：
  - `depends_on` 列出的规则文件（如 `.ai/rules/00-repo-baseline.md`）必须存在且可读取。
  - `depends_on` 列出的其他 Skill（格式为 `skill:<skill-name>`）必须已在 `./.ai/skills/` 中存在。
- 若任一依赖缺失，应向用户报告缺失项，并标记该 Skill 为"依赖不满足，暂不可用"，不跳过依赖直接使用。
- 依赖全部满足时，按正常流程加载该 Skill。

### 推荐规则

- 根据任务描述与 Skill 的 `description` 字段进行语义匹配，判断是否推荐使用。
- 推荐条件（满足任一即可推荐）：
  - 任务关键词与 Skill description 存在明确交集（如"部署"、"菜单"、"路由同步"）。
  - 用户明确提到 Skill 名称或 Skill 涉及的操作领域。
  - 任务涉及的操作流程与 Skill 工作流高度重合。
- 推荐时输出格式：
  - 推荐的 Skill 名称与版本
  - 推荐理由（一句话说明匹配点）
  - 依赖预检结果（已满足 / 缺失项）
- 不推荐的条件：
  - Skill 的 `depends_on` 未全部满足。
  - 任务与 Skill 领域无交集。
  - 用户已明确表示不使用该 Skill。

### 版本兼容

- 当同一 Skill 存在多个版本时（未来可能），以 `version` 字段标识，默认使用最新版本。
- 若用户指定版本，以用户指定为准。
- `version` 遵循语义化版本（SemVer）：`MAJOR.MINOR.PATCH`。
  - MAJOR：不兼容的规范变更。
  - MINOR：向后兼容的功能新增。
  - PATCH：向后兼容的问题修正。

### SKILL.md frontmatter 规范

所有 Skill 的 `SKILL.md` 必须包含以下 YAML frontmatter 字段：

```yaml
---
name: <skill-name>           # 必填，Skill 唯一标识，小写短横线分隔
version: "x.y.z"             # 必填，语义化版本号
depends_on:                  # 必填，依赖声明，无依赖时为空列表
  - ".ai/rules/<rule>.md"    # 规则文件依赖
  - "skill:<skill-name>"     # 其他 Skill 依赖
description: <描述>           # 必填，Skill 功能与适用场景描述
---
```

## 9. 任务类型与 Agent 选择

按任务主导目标选择 agent：

1. `backend-agent`
   - 适用：仅后端模块改动（接口实现、服务逻辑、数据访问、后端测试）。
   - 排除：不包含前端页面/状态/调用链同步改造。
   - 涉及新接口或接口变更时，必须先走"API 契约先行"流程（第 9 节），生成 OpenAPI 契约文档。
2. `frontend-agent`
   - 适用：仅前端模块改动（页面、组件、状态管理、调用封装、交互文案）。
   - 排除：不包含后端契约与业务规则改造。
   - 接口调用必须按 OpenAPI 文档对齐，不得自行猜测字段。
3. `review-agent`
   - 适用：评审任务，重点检查风险、回归、缺失测试、协议不一致、模块边界破坏。
   - 入口：`./.ai/agents/40-review-agent.md`
   - 规则：按被评审对象加载对应规则集，不单独替代对象规则。

跨端联动任务执行方式：

- 不再设独立 Agent，按 API-First 流程拆分执行：
  1. Backend Agent 先走"API 契约先行"（写 Controller 骨架，生成 `/v3/api-docs`）
  2. 与前端确认契约无误
  3. Backend Agent 独立完成 Service 实现，Frontend Agent 独立完成前端实现
  4. 使用 `contract-check` skill 做最终一致性验证
- 联动任务必须遵守 `30-fullstack-linkage-rules.md` 所有硬约束。

选择规则：

- 单边改动按职责选择 `backend-agent` 或 `frontend-agent`。
- 涉及接口协议变更时，按 API-First 流程执行（见上）。
- 用户明确要求评审/回归检查，优先 `review-agent`。
- 若任务同时包含"实现 + 评审"，先实现再由 `review-agent` 按对象规则集复核。

## 10. 团队最低输出要求

每次任务输出至少包含：

- 本步目标
- 落地文件
- 影响范围
- 关键边界
- 验证结果（已验证 / 未验证）
- 未验证项与原因

## 11. Review 与优化建议归档要求

- 遇到代码 review 结论、联调问题或优化建议时，除对话输出外，还要同步更新 `./docs/review-tracking/` 下对应的 review 清单文件。
- 评审清单按日期目录组织：`./docs/review-tracking/yyyy-MM-dd/review清单-hh-mm-ss-文档名称-状态.md`。
- 状态后缀仅允许 `已完成`、`未完成`；若清单状态变化，文件名与 README 索引需同步更新。
- 文档中的每个待办事项必须使用 Markdown 勾选框记录，默认新增为 `[ ]`。
- 对应代码完成后，需要在同一文档里同步把事项更新为 `[x]`，并补充完成说明；若未做真实验证，必须继续标注“未验证”。
- 若同一次 review 同时覆盖多个仓库或前后端联动问题，统一收敛到同一章节，避免拆散上下文。

## 12. 跨平台配置投影

### 12.1 SSOT 策略

`.ai/` 目录是项目协作规范的**唯一真实来源（Single Source of Truth）**。所有 AI 工具的配置文件均为 `.ai/` 体系的投影派生文件，禁止反向修改。

### 12.2 平台适配目录

| 平台 | 适配目录 | 投影目标 | 说明 |
|------|----------|----------|------|
| Codex | `.ai/adapters/codex/` | `AGENTS.md` | 基准平台，`AGENTS.md` 即原生入口，无需额外投影 |
| Gemini CLI | `.ai/adapters/gemini-cli/` | `GEMINI.md` + `.gemini/settings.json` | 摘要投影 + 规则路径引用 |
| Trae-CN | `.ai/adapters/trae-cn/` | `.trae/rules/` | 规则文件按原文复制到 `.trae/rules/` 目录 |
| Claude Code | `.ai/adapters/claude-code/` | `CLAUDE.md` | 摘要投影 + 规则路径引用 |

### 12.3 投影规则

1. **投影方向**：`.ai/` → 各平台配置（单向）
2. **触发时机**：`.ai/agent.md` 或 `.ai/rules/*.md` 变更时重新投影
3. **冲突处理**：以 `.ai/` 源文件为准，投影文件为只读派生
4. **源文件优先**：禁止直接修改投影文件，所有变更必须回到 `.ai/` 体系

### 12.4 各平台投影详情

详细投影规则与模板结构参见各适配目录下的 `README.md`：

- [codex/README.md](./adapters/codex/README.md)：Codex 适配说明
- [gemini-cli/README.md](./adapters/gemini-cli/README.md)：Gemini CLI 投影模板
- [trae-cn/README.md](./adapters/trae-cn/README.md)：Trae-CN 投影模板
- [claude-code/README.md](./adapters/claude-code/README.md)：Claude Code 投影模板

## 13. 跨模型能力适配

### 13.1 适配原则

模型池会持续变化，本项目不按具体厂商、系列或型号维护适配清单。实际执行时按当前会话的能力表现判断，详细策略参见 [model-adapters.md](./model-adapters.md)。

### 13.2 能力维度

| 维度 | 等级 | 说明 |
|------|------|------|
| 上下文容量 | 充足 / 受限 | 决定是否需要裁剪规则与代码上下文 |
| 工具能力 | 可直接调用 / 需人工确认 / 不可调用 | 决定自动化执行方式 |
| 指令遵循 | 稳定 / 一般 / 易漂移 | 决定是否需要压缩为核心红线或编号清单 |
| 文件读取 | 可按路径读取 / 只能读取入口摘要 | 决定是否能按任务加载 `.ai/rules/*.md` |

### 13.3 默认策略

1. 默认使用“摘要入口 + 按任务类型加载详细规则”。
2. 大部分实际模型上下文足够时，不做预裁剪。
3. 仅当出现上下文遗忘、规则漏读、工具失败或输出漂移时，才按 `model-adapters.md` 降级。
4. 降级只减少输入范围或简化表达方式，不改变规则语义与优先级。


## 14. 团队协作无感化

### 14.1 Onboarding 机制

新成员加入项目时，按以下顺序快速了解规范体系：

1. 阅读 `AGENTS.md`（协作入口，定义读取顺序与核心约束）
2. 阅读本文件 `.ai/agent.md`（项目总入口，定义目录职责与规则调度）
3. 按任务类型阅读对应 agent 文档（`.ai/agents/`）
4. 按需阅读相关规则文件（`.ai/rules/`）
5. 查看 `.ai/CHANGELOG.md` 了解最新变更

### 14.2 变更追踪

所有 `.ai/` 目录下的规范变更均记录在 [CHANGELOG.md](./CHANGELOG.md)：

- 每条记录包含：日期、变更类型、变更摘要、影响范围、变更人
- 变更记录按日期倒序排列，保留历史不删除
- 团队成员可通过 CHANGELOG 快速了解规范演进

### 14.3 Skill 发现机制

AI 在接收任务后自动扫描 `./.ai/skills/*/SKILL.md`，根据任务描述与 Skill 的 `description` 字段进行语义匹配并推荐使用。详见 §8.1 Skill 自动发现与推荐规则。

### 14.4 协作无感化目标

- **零培训成本**：新成员通过文档链路即可理解协作规则
- **变更可追溯**：所有规范变更均有记录，避免口径漂移
- **Skill 自动推荐**：AI 主动推荐可复用流程，减少重复劳动

## 15. 文档模板

### 15.1 模板目录

文档模板统一存放在 `./.ai/templates/` 目录，用于规范各类文档的输出格式与必填字段。

### 15.2 模板列表

| 模板文件 | 用途 | 必填字段 |
|----------|------|----------|
| `design-doc.md` | 设计文档 | 背景、目标、方案、影响范围、验收标准 |
| `review-checklist.md` | 评审清单 | 评审项、严重级别、问题描述、建议修复 |
| `handover-doc.md` | 交接文档 | 项目概述、关键模块、部署流程、注意事项 |
| `bug-fix.md` | Bug 修复工单 | 复现步骤、根因分析、修复方案、验证结果 |
| `refactor.md` | 重构工单 | 重构动机、范围、策略、验证计划 |

### 15.3 使用方式

1. 复制模板内容
2. 按必填字段填充
3. 输出到 `docs/` 对应目录（`docs/design/`、`docs/review-tracking/` 等）
4. 按文档命名规范命名（参见 §2 项目目录映射）

### 15.4 模板扩展

若需新增模板，应：

1. 在 `./.ai/templates/` 下创建新模板文件
2. 在本章节更新模板列表
3. 在 `.ai/CHANGELOG.md` 记录变更
