# AI_Vision (VMesh Cloud)

AI 视觉智能平台基础脚手架，基于 Spring Boot 3.5 + Vue 3 构建的前后端分离企业级应用。

## 项目结构

```text
AI_Vision/
├── WF_VMesh_Coud/             ← 后端主工程（Java 21 / Spring Boot 3.5 / MyBatis-Plus / PostgreSQL）
├── WF_VMesh_Coud_UI/          ← 前端主工程（Vue 3 / Vite 5 / Element Plus / Pinia / pnpm）
├── wf_vmesh_cloud_design/     ← 原型/设计参考（仅参考布局与交互，不作为实现依据）
├── docs/                      ← 项目文档（设计方案、交接文档、治理评审、部署方案、评审清单）
├── .ai/                       ← AI 协作规范体系（唯一真实来源）
├── AGENTS.md                  ← Codex / OpenAI Codex 原生协作入口
├── CLAUDE.md                  ← Claude Code 原生项目指令（投影自 .ai/）
├── GEMINI.md                  ← Gemini CLI 原生项目指令（投影自 .ai/）
├── .gemini/settings.json      ← Gemini CLI 项目配置
└── .trae/rules/               ← Trae IDE 项目规则目录（投影自 .ai/rules/）
```

## 技术栈

### 后端

| 项目 | 版本 |
|------|------|
| JDK | 21 |
| Spring Boot | 3.5.x |
| ORM | MyBatis-Plus 3.5.x |
| 数据库 | PostgreSQL |
| 构建工具 | Maven |

### 前端

| 项目 | 版本 |
|------|------|
| Node.js | 20.x |
| Vue | 3.x（Composition API） |
| Vite | 5.x |
| Element Plus | 当前版本 |
| Pinia | 当前版本 |
| pnpm | 当前版本 |

## 开发命令

### 后端

```bash
mvn clean compile                  # 编译项目
mvn clean package -DskipTests      # 打包（跳过测试）
mvn test                           # 运行单元测试
mvn clean verify                   # 完整构建（含测试）
java -jar vmesh-server/target/vmesh-server.jar  # 启动服务
```

### 前端

```bash
pnpm install          # 安装依赖
pnpm dev              # 启动本地开发服务器
pnpm dev-server       # 启动连接后端开发服务器
pnpm ts:check         # TypeScript 类型检查
pnpm lint:eslint      # ESLint 代码检查
pnpm lint:format      # Prettier 格式化
pnpm lint:style       # StyleLint 样式检查
pnpm build:prod       # 构建生产版本
```

## AI 协作配置体系

本项目采用 `.ai/` 目录作为 AI 协作规范的**唯一真实来源**（Single Source of Truth），通过适配器投影到各 AI 工具的原生配置格式。

### 架构关系

```text
.ai/（唯一真实来源）
├── agent.md              ← 项目协作总入口
├── project.yml           ← 项目元数据（目录映射、技术栈、版本号）
├── model-adapters.md     ← 跨模型适配层（能力分类与降级策略）
├── CHANGELOG.md          ← 规范变更追踪
├── agents/               ← 协作角色定义
├── rules/                ← 硬约束与边界规则
├── skills/               ← 可复用执行方法
├── templates/            ← 文档模板
└── adapters/             ← 跨平台投影适配器
    ├── codex/            ← Codex 适配（基准平台）
    ├── claude-code/      ← Claude Code 适配
    ├── gemini-cli/       ← Gemini CLI 适配
    └── trae-cn/          ← Trae-CN 适配

↓ 投影（单向，禁止反向修改）↓

AGENTS.md                 ← Codex 原生入口（基准，无需投影）
CLAUDE.md                 ← Claude Code 原生入口（投影自 .ai/）
GEMINI.md                 ← Gemini CLI 原生入口（投影自 .ai/）
.gemini/settings.json     ← Gemini CLI 项目配置
.trae/rules/              ← Trae IDE 规则目录（投影自 .ai/rules/）
```

### 核心原则

| 原则 | 说明 |
|------|------|
| 单一来源 | `.ai/` 是所有规范的定义中心，投影文件均为自动生成产物 |
| 单向投影 | `.ai/` → 各平台配置，禁止反向修改投影文件 |
| 规则优先级 | `rules` > `agent.md` > `agents` > `skills` |
| 跨端联动 | 涉及前后端契约变更时，必须按 fullstack 联动任务处理 |

### 协作角色

| 角色 | 文件 | 规则继承 | 适用场景 |
|------|------|----------|----------|
| Fullstack Agent | `agents/10-fullstack-linkage-agent.md` | 全部规则 + 联动规则 | 前后端联动任务 |
| Backend Agent | `agents/20-backend-agent.md` | 基线 + 后端规则 | 后端单侧闭环任务 |
| Frontend Agent | `agents/30-frontend-agent.md` | 基线 + 前端规则 | 前端单侧闭环任务 |
| Review Agent | `agents/40-review-agent.md` | 按被评审对象加载 | 代码评审与风险扫描 |

### 硬约束规则

| 编号 | 文件 | 覆盖范围 |
|------|------|----------|
| 00 | `rules/00-repo-baseline.md` | 跨前后端通用基线（沟通、证据、原型边界、文档管理） |
| 10 | `rules/10-backend-development-rules.md` | 后端开发强制规则（技术栈、PostgreSQL 兼容、SQL 规范、模块边界、编译验证） |
| 11 | `rules/11-backend-object-layering-rules.md` | 后端对象分层（轻量模块化：VO + DO，默认不引入 BO） |
| 20 | `rules/20-frontend-development-rules.md` | 前端开发强制规范（技术栈、API SDK、Pinia、Mock 边界） |
| 30 | `rules/30-fullstack-linkage-rules.md` | 前后端联动强制规则（契约一致、最低交付清单、冲突处理） |

### 可复用技能

| Skill | 版本 | 说明 |
|-------|------|------|
| `deploy-portainer-release` | 1.0.0 | Jenkins 构建 → Harbor 推镜像 → Portainer Stack 发布 |
| `dynamic-menu-sync` | 1.0.0 | 前端动态路由与后端数据库菜单同步 |

### 文档模板

| 模板 | 用途 |
|------|------|
| `templates/design-doc.md` | 设计文档（背景、目标、方案、影响范围、验收标准） |
| `templates/review-checklist.md` | 评审清单（评审项、严重级别、问题描述、建议修复） |
| `templates/handover-doc.md` | 交接文档（项目概述、关键模块、部署流程、注意事项） |
| `templates/bug-fix.md` | Bug 修复工单（复现步骤、根因分析、修复方案、验证结果） |
| `templates/refactor.md` | 重构工单（重构动机、范围、策略、验证计划） |

### 读取顺序

1. `AGENTS.md`（项目协作入口，Codex 基准）
2. `.ai/agent.md`（项目协作总入口）
3. `.ai/rules/*.md`（硬约束与边界规则，必须遵守）
4. `.ai/agents/*.md`（协作角色定义，按需加载）
5. `.ai/skills/*/SKILL.md`（可复用执行方法，按需加载）

### 投影文件说明

| 文件 | 目标平台 | 来源 | 特点 |
|------|----------|------|------|
| `AGENTS.md` | Codex / OpenAI Codex | 基准文件，无需投影 | 直接作为协作入口 |
| `CLAUDE.md` | Claude Code | 投影自 `.ai/` | 所有规则内联到单文件 |
| `GEMINI.md` | Gemini CLI | 投影自 `.ai/` | 所有规则内联 + `.gemini/settings.json` 配置 |
| `.trae/rules/` | Trae IDE | 投影自 `.ai/rules/` | 逐文件复制 + `project_rules.md` 汇总 |

## 代码风格

- **后端**：遵循阿里巴巴 Java 开发规范，使用 Lombok 简化代码
- **前端**：ESLint + Prettier 统一代码风格，TypeScript 严格模式
- **沟通**：全程使用简体中文进行需求澄清、分析、变更说明与交付说明

## 快速开始

1. **新协作者**：先读 `AGENTS.md`，再按读取顺序加载规则
2. **修改规则**：只修改 `.ai/` 下的源文件，再重新投影到各平台
3. **新增 Skill**：先提出 Skill 方案，确认后保存到 `.ai/skills/`
4. **新增文档**：使用 `.ai/templates/` 中的模板，输出到 `docs/` 对应目录
