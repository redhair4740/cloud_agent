# AI_Vision AI 协作配置体系

本目录是 AI_Vision 项目 AI 协作规范的**唯一真实来源**（Single Source of Truth）。所有 AI 编程助手的项目级指令、规则、角色定义与可复用技能均在此定义，再通过适配器投影到各工具的原生配置格式。

## 架构总览

```text
.ai/                          ← 唯一真实来源（所有规则、角色、技能的定义中心）
├── agent.md                  ← 项目协作总入口
├── project.yml               ← 项目元数据（目录映射、技术栈、版本号）
├── api-status.yml            ← 接口联调状态清单（后端/人工确认，前端消费）
├── model-adapters.md         ← 跨模型适配层（能力分类与降级策略）
├── CHANGELOG.md              ← 规范变更追踪
├── agents/                   ← 协作角色定义
├── rules/                    ← 硬约束与边界规则
├── skills/                   ← 可复用执行方法
├── templates/                ← 文档模板
└── adapters/                 ← 跨平台投影适配器
    ├── codex/                ← Codex 适配（基准平台）
    ├── claude-code/          ← Claude Code 适配
    ├── gemini-cli/           ← Gemini CLI 适配
    └── trae-cn/              ← Trae-CN 适配

↓ 投影（单向，禁止反向修改）↓

项目根目录
├── AGENTS.md                 ← Codex 原生入口（基准，无需投影）
├── CLAUDE.md                 ← Claude Code 原生入口（投影自 .ai/）
├── GEMINI.md                 ← Gemini CLI 原生入口（投影自 .ai/）
├── .gemini/
│   └── settings.json         ← Gemini CLI 项目配置
└── .trae/
    └── rules/                ← Trae-CN 规则目录（投影自 .ai/rules/）
        ├── project_rules.md
        ├── 00-repo-baseline.md
        ├── 01-business-dictionary.md
        ├── 10-backend-development-rules.md
        ├── 11-backend-object-layering-rules.md
        ├── 20-frontend-development-rules.md
        └── 30-fullstack-linkage-rules.md
```

## 核心原则

| 原则 | 说明 |
|------|------|
| 单一来源 | `.ai/` 是所有规范的定义中心，投影文件为派生产物；测试阶段暂不提供同步脚本，需手工同步并对照源文件检查 |
| 单向投影 | `.ai/` → 各平台配置，禁止反向修改投影文件 |
| 规则优先级 | `rules` > `agent.md` > `agents` > `skills` |
| 契约先行 | 涉及前后端契约变更时，必须走 API-First 流程：OpenAPI 文档定版后再各自实现 |

## 读取顺序

1. `AGENTS.md`（项目协作入口，Codex 基准）
2. `.ai/agent.md`（项目协作总入口）
3. `.ai/rules/*.md`（硬约束与边界规则，必须遵守；优先读取 `00-repo-baseline.md` 与 `01-business-dictionary.md`）
4. `.ai/agents/*.md`（协作角色定义，按需加载）
5. `.ai/skills/*/SKILL.md`（可复用执行方法，按需加载）

## 目录详解

### agents/ — 协作角色

| 角色 | 文件 | 规则继承 | 适用场景 |
|------|------|----------|----------|
| Backend Agent | `20-backend-agent.md` | 基线 + 业务字典 + 后端规则 + API 契约先行 | 后端单侧闭环任务 |
| Frontend Agent | `30-frontend-agent.md` | 基线 + 业务字典 + 前端规则 | 前端单侧闭环任务 |
| Review Agent | `40-review-agent.md` | 按被评审对象加载 | 代码评审与风险扫描 |

### rules/ — 硬约束规则

| 编号 | 文件 | 覆盖范围 |
|------|------|----------|
| 00 | `00-repo-baseline.md` | 跨前后端通用基线（沟通、证据、原型边界、文档管理） |
| 01 | `01-business-dictionary.md` | 业务领域字典（核心业务词、英文命名、禁用译法、表/权限前缀） |
| 10 | `10-backend-development-rules.md` | 后端开发强制规则（技术栈、PostgreSQL 兼容、SQL 规范、模块边界、编译验证） |
| 11 | `11-backend-object-layering-rules.md` | 后端对象分层（轻量模块化：VO + DO，默认不引入 BO） |
| 20 | `20-frontend-development-rules.md` | 前端开发强制规范（技术栈、API SDK、Pinia、Mock 边界） |
| 30 | `30-fullstack-linkage-rules.md` | 前后端联动强制规则（契约一致、最低交付清单、冲突处理） |

### skills/ — 可复用执行方法

| Skill | 版本 | 说明 |
|-------|------|------|
| `contract-check` | 1.0.0 | 前后端接口契约一致性检查（对照 OpenAPI 文档与前端代码） |
| `deploy-portainer-release` | 1.0.0 | Jenkins 构建 → Harbor 推镜像 → Portainer Stack 发布 |
| `dynamic-menu-sync` | 1.0.0 | 前端动态路由与后端数据库菜单同步 |

### templates/ — 文档模板

| 模板 | 用途 |
|------|------|
| `design-doc.md` | 设计文档（背景、目标、方案、影响范围、验收标准） |
| `review-checklist.md` | 评审清单（评审项、严重级别、问题描述、建议修复） |
| `handover-doc.md` | 交接文档（项目概述、关键模块、部署流程、注意事项） |
| `bug-fix.md` | Bug 修复工单（复现步骤、根因分析、修复方案、验证结果） |
| `refactor.md` | 重构工单（重构动机、范围、策略、验证计划） |

### adapters/ — 跨平台投影适配器

各适配器将 `.ai/` 体系投影到对应 AI 工具的原生配置格式：

| 适配器 | 投影目标 | 投影方式 |
|--------|----------|----------|
| `codex/` | `AGENTS.md` | 无需投影，源即目标（基准平台） |
| `claude-code/` | `CLAUDE.md` | 摘要投影 + 规则路径引用 |
| `gemini-cli/` | `GEMINI.md` + `.gemini/settings.json` | 摘要投影 + 规则路径引用 + contextFileName 配置 |
| `trae-cn/` | `.trae/rules/` | 规则逐文件复制 + project_rules.md 汇总 |

## 投影文件说明

### AGENTS.md

- **用途**：Codex / OpenAI Codex 的原生协作入口
- **来源**：直接作为基准文件编写，其他投影以此为参照
- **内容**：读取顺序、输出与证据要求、执行边界、技术栈、开发命令

### CLAUDE.md

- **用途**：Claude Code 的原生项目指令入口
- **来源**：投影自 `AGENTS.md` + `.ai/agent.md` 的核心摘要，并引用 `.ai/rules/*.md` 详细规则路径
- **特点**：使用摘要模式降低默认上下文占用，按任务类型加载详细规则

### GEMINI.md

- **用途**：Gemini CLI 的原生项目指令入口
- **来源**：投影自 `AGENTS.md` + `.ai/agent.md` 的核心摘要，并引用 `.ai/rules/*.md` 详细规则路径
- **特点**：使用摘要模式降低默认上下文占用，按任务类型加载详细规则
- **配置**：`.gemini/settings.json` 指定 `contextFileName: "GEMINI.md"`

### .trae/rules/

- **用途**：Trae IDE 的项目级规则目录，IDE 自动加载所有 `.md` 文件
- **来源**：`.ai/rules/*.md` 逐文件原文复制 + `project_rules.md` 汇总投影
- **特点**：规则文件编号与源文件保持一致，便于对照

## project.yml — 项目元数据

项目目录映射与技术栈参数的唯一配置来源，AI 代理与后续同步工具均应从此文件读取变量值：

```yaml
dirs:
  backend: "WF_VMesh_Coud"
  frontend: "WF_VMesh_Coud_UI"
  design: "wf_vmesh_cloud_design"
  sql: "sql/postgresql"

backend_stack:
  jdk: "21"
  spring_boot: "3.5.x"
  orm: "MyBatis-Plus 3.5.x"
  database: "PostgreSQL"

frontend_stack:
  node: "20.x"
  framework: "Vue 3.x"
  build_tool: "Vite 5.x"
  ui_library: "Element Plus"
  package_manager: "pnpm"
```

## model-adapters.md — 跨模型能力适配层

定义不同 AI 模型与工具环境下的能力判断和降级策略，不维护具体模型型号清单：

- **上下文容量**：充足 / 受限，决定是否需要裁剪规则与代码上下文。
- **工具能力**：可直接调用 / 需人工确认 / 不可调用，决定自动化执行方式。
- **指令遵循**：稳定 / 一般 / 易漂移，决定是否需要压缩为核心红线或编号清单。
- **文件读取**：可按路径读取 / 只能读取入口摘要，决定是否能按任务加载 `.ai/rules/*.md`。

默认采用“摘要入口 + 按任务类型加载详细规则”；只有出现上下文不足、工具失败、漏读规则或输出漂移时才降级。

## 变更管理

所有规范变更记录在 `.ai/CHANGELOG.md`，每条记录包含：

- 日期、变更类型（新增/修改/移除）
- 变更摘要、影响范围、变更人

变更记录按日期倒序排列，保留历史不删除。

## 快速开始

1. **新协作者**：先读 `AGENTS.md`，再按读取顺序加载规则
2. **修改规则**：只修改 `.ai/` 下的源文件；测试阶段手工同步到各平台投影文件，并用搜索命令检查是否漂移
3. **新增 Skill**：先提出 Skill 方案，确认后保存到 `.ai/skills/`
4. **新增文档**：使用 `.ai/templates/` 中的模板，输出到 `docs/` 对应目录
