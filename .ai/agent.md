# .ai 项目协作总入口

本文件是项目团队协作入口，定义项目适用范围、目录职责、读取优先级、模块边界与最低交付要求。

## 1. 项目适用范围

- 适用于当前仓库内的需求分析、设计、开发、联调、文档与交付任务。
- 面向“项目结果”协作，不面向某个单一工具说明。
- 目标是让团队在同一边界下稳定推进：同一规则、同一职责、同一输出口径。

## 2. 项目目录映射

> 目录名变量引用自 `.ai/project.yml`，修改项目名只需改该文件。

- 后端主工程目录：`./{{dirs.backend}}`
  - 承载后端接口、领域模型、数据访问、后端配置与后端测试代码。
- 前端主工程目录：`./{{dirs.frontend}}`
  - 承载页面、组件、状态管理、API 调用封装与前端交互逻辑。
- 原型/设计参考目录：`./{{dirs.design}}`
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
    - `./.ai/agents/10-fullstack-linkage-agent.md`
    - `./.ai/agents/40-review-agent.md`
- `./.ai/rules/`
  - 定义项目硬约束与边界规则，属于必须遵守项。
  - 涵盖模块归属、开发边界、交付标准、测试与验证口径。
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
2. `./.ai/rules/*.md`（再明确硬约束与边界）
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

1. `backend-agent`
   - 规则继承：`00-repo-baseline.md + 10-backend-development-rules.md + 11-backend-object-layering-rules.md`
2. `frontend-agent`
   - 规则继承：`00-repo-baseline.md + 20-frontend-development-rules.md`
3. `fullstack-agent`
   - 规则继承：`00-repo-baseline.md + 10-backend-development-rules.md + 11-backend-object-layering-rules.md + 20-frontend-development-rules.md + 30-fullstack-linkage-rules.md`
4. `review-agent`
   - 规则继承：按被评审对象加载对应规则集合
   - 评审后端改动：加载 `backend-agent` 规则集
   - 评审前端改动：加载 `frontend-agent` 规则集
   - 评审 fullstack 改动：加载 `fullstack-agent` 规则集

调度原则：

- 先判定任务对象（backend/frontend/fullstack/review），再绑定规则集合。
- `fullstack-agent` 不能降级为单边规则，必须包含 `30-fullstack-linkage-rules.md` 联动规则。
- `review-agent` 不使用独立规则替代对象规则，而是对对象规则做一致性复核。

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
2. `frontend-agent`
   - 适用：仅前端模块改动（页面、组件、状态管理、调用封装、交互文案）。
   - 排除：不包含后端契约与业务规则改造。
3. `fullstack-agent`
   - 适用：跨前后端联动改造，需统一接口契约与页面行为验收。
   - 入口：`./.ai/agents/10-fullstack-linkage-agent.md`
4. `review-agent`
   - 适用：评审任务，重点检查风险、回归、缺失测试、协议不一致、模块边界破坏。
   - 入口：`./.ai/agents/40-review-agent.md`
   - 规则：按被评审对象加载对应规则集，不单独替代对象规则。

选择规则：

- 同时涉及前后端协议与交互，优先 `fullstack-agent`。
- 用户明确要求评审/回归检查，优先 `review-agent`。
- 单边改动按职责选择 `backend-agent` 或 `frontend-agent`。
- 若任务同时包含“实现 + 评审”，先实现（backend/frontend/fullstack），再由 `review-agent` 按对象规则集复核。

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
| Gemini CLI | `.ai/adapters/gemini-cli/` | `GEMINI.md` + `.gemini/settings.json` | 规则内联投影到单一入口文件 |
| Trae-CN | `.ai/adapters/trae-cn/` | `.trae/rules/` | 规则文件按原文复制到 `.trae/rules/` 目录 |
| Claude Code | `.ai/adapters/claude-code/` | `CLAUDE.md` | 规则内联投影到单一入口文件 |

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

## 13. 跨模型适配

### 13.1 模型能力分类

不同 AI 模型在上下文窗口、指令格式、工具调用三方面能力存在差异。详细分类与适配策略参见 [model-adapters.md](./model-adapters.md)。

### 13.2 能力维度

| 维度 | 等级 | 说明 |
|------|------|------|
| 上下文窗口 | 大 / 中 / 小 | 决定可加载的规范内容量 |
| 指令格式 | 高级 / 中级 / 基础 | 决定规则表达的结构化程度 |
| 工具调用 | 原生支持 / 部分支持 / 不支持 | 决定自动化执行能力 |

### 13.3 降级策略

1. **上下文降级**：按优先级裁剪 `rules > agent.md > agents > skills`
2. **指令格式降级**：`XML 标签 → Markdown 结构 → 纯文本列表`
3. **工具调用降级**：`原生 function calling → 带确认调用 → 手动操作指引`

### 13.4 目标模型速查

| 模型系列 | 代表型号 | 上下文 | 指令格式 | 工具调用 |
|----------|----------|--------|----------|----------|
| GPT 系列 | GPT-4.1 / GPT-4o | 大 | 高级 | 原生支持 |
| Claude 系列 | Claude 3.5 Sonnet / Claude 3 Opus | 大 | 高级 | 原生支持 |
| Gemini 系列 | Gemini 2.5 Pro / Gemini 1.5 Pro | 大 | 高级 | 原生支持 |

完整模型能力速查表与适配执行流程详见 [model-adapters.md](./model-adapters.md)。

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
