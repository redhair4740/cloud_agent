# AI_Vision Codex 协作入口

本文件遵循 [AAIF AGENTS.md 开放标准](https://www.agentic-ai.foundation/)，为 AI 编程助手提供项目级指令。已被 OpenAI Codex、Gemini CLI、Cursor 等工具广泛支持。

## 项目概览

- **项目名称**: AI_Vision (VMesh Cloud)
- **项目描述**: AI 视觉智能平台基础脚手架，基于 Spring Boot 3.5 + Vue 3 构建的前后端分离企业级应用
- **版本**: 2026.01-SNAPSHOT

## 技术栈

### 后端（目录由 `.ai/project.yml` 的 `dirs.backend` 指定）
- **语言**: Java 21
- **框架**: Spring Boot 3.5.9
- **构建工具**: Maven
- **ORM**: MyBatis-Plus
- **数据库**: MySQL / PostgreSQL
- **缓存**: Redis
- **其他**: Lombok, MapStruct 1.6.3

### 前端（目录由 `.ai/project.yml` 的 `dirs.frontend` 指定）
- **语言**: TypeScript 5.3
- **框架**: Vue 3.5 + Vite 5.1
- **UI 组件**: Element Plus 2.11
- **状态管理**: Pinia 2.1
- **包管理**: pnpm 8.15.9
- **Node.js**: >= 16.0.0 (推荐 22.x)

## 开发命令

### 后端

后端目录不得假定为仓库根目录，执行命令前必须从 `.ai/project.yml` 动态读取 `dirs.backend`：

```bash
# 编译项目
BACKEND_DIR=$(awk -F'"' '/^[[:space:]]+backend:/ {print $2; exit}' .ai/project.yml)
cd "$BACKEND_DIR" && mvn clean compile

# 打包项目（跳过测试）
BACKEND_DIR=$(awk -F'"' '/^[[:space:]]+backend:/ {print $2; exit}' .ai/project.yml)
cd "$BACKEND_DIR" && mvn clean package -DskipTests

# 运行单元测试
BACKEND_DIR=$(awk -F'"' '/^[[:space:]]+backend:/ {print $2; exit}' .ai/project.yml)
cd "$BACKEND_DIR" && mvn test

# 完整构建（含测试）
BACKEND_DIR=$(awk -F'"' '/^[[:space:]]+backend:/ {print $2; exit}' .ai/project.yml)
cd "$BACKEND_DIR" && mvn clean verify

# 启动服务（需先编译）
BACKEND_DIR=$(awk -F'"' '/^[[:space:]]+backend:/ {print $2; exit}' .ai/project.yml)
java -jar "$BACKEND_DIR/vmesh-server/target/vmesh-server.jar"
```

### 前端

前端目录同样从 `.ai/project.yml` 动态读取 `dirs.frontend`：

```bash
# 安装依赖
FRONTEND_DIR=$(awk -F'"' '/^[[:space:]]+frontend:/ {print $2; exit}' .ai/project.yml)
cd "$FRONTEND_DIR" && pnpm install

# 启动本地开发服务器
FRONTEND_DIR=$(awk -F'"' '/^[[:space:]]+frontend:/ {print $2; exit}' .ai/project.yml)
cd "$FRONTEND_DIR" && pnpm dev

# 启动连接后端开发服务器
FRONTEND_DIR=$(awk -F'"' '/^[[:space:]]+frontend:/ {print $2; exit}' .ai/project.yml)
cd "$FRONTEND_DIR" && pnpm dev-server

# TypeScript 类型检查
FRONTEND_DIR=$(awk -F'"' '/^[[:space:]]+frontend:/ {print $2; exit}' .ai/project.yml)
cd "$FRONTEND_DIR" && pnpm ts:check

# ESLint 代码检查
FRONTEND_DIR=$(awk -F'"' '/^[[:space:]]+frontend:/ {print $2; exit}' .ai/project.yml)
cd "$FRONTEND_DIR" && pnpm lint:eslint

# Prettier 格式化
FRONTEND_DIR=$(awk -F'"' '/^[[:space:]]+frontend:/ {print $2; exit}' .ai/project.yml)
cd "$FRONTEND_DIR" && pnpm lint:format

# StyleLint 样式检查
FRONTEND_DIR=$(awk -F'"' '/^[[:space:]]+frontend:/ {print $2; exit}' .ai/project.yml)
cd "$FRONTEND_DIR" && pnpm lint:style

# 构建生产版本
FRONTEND_DIR=$(awk -F'"' '/^[[:space:]]+frontend:/ {print $2; exit}' .ai/project.yml)
cd "$FRONTEND_DIR" && pnpm build:prod
```

## 代码风格

- **后端**: 遵循阿里巴巴 Java 开发规范，使用 Lombok 简化代码
- **前端**: 使用 ESLint + Prettier 统一代码风格，TypeScript 严格模式
- **沟通**: 全程使用简体中文进行需求澄清、分析、变更说明与交付说明

## .ai/ 子目录结构

本项目的详细协作规范存放在 `.ai/` 目录下：

```
.ai/
├── agent.md          # 项目协作总入口（规则、模块边界、技术细节）
├── api-status.yml    # 接口联调状态清单（后端/人工确认，前端消费）
├── agents/           # 协作角色定义
│   ├── 20-backend-agent.md
│   ├── 30-frontend-agent.md
│   └── 40-review-agent.md
├── rules/            # 项目硬约束与边界规则
│   ├── 00-repo-baseline.md
│   ├── 01-business-dictionary.md
│   ├── 10-backend-development-rules.md
│   ├── 11-backend-object-layering-rules.md
│   ├── 20-frontend-development-rules.md
│   └── 30-fullstack-linkage-rules.md
└── skills/           # 可复用执行方法与操作流程
    ├── deploy-portainer-release/
    └── dynamic-menu-sync/
```

## 1. 读取顺序

1. 先读本文件 `AGENTS.md`
2. 再读 [`.ai/agent.md`](./.ai/agent.md)
3. 最后按需读取：
   - `./.ai/rules/`（硬约束与边界规则，必须遵守；先读 `00-repo-baseline.md` 与 `01-business-dictionary.md`）
   - `./.ai/agents/`（协作角色定义）
   - `./.ai/skills/`（可复用执行方法，当前已有 deploy-portainer-release、dynamic-menu-sync）

### 1.1 任务类型加载矩阵

| 任务类型 | 必读规则/文件 |
|----------|---------------|
| 通用任务 | `./.ai/rules/00-repo-baseline.md` + `./.ai/rules/01-business-dictionary.md` |
| 后端任务 | 通用规则 + `./.ai/rules/10-backend-development-rules.md` + `./.ai/rules/11-backend-object-layering-rules.md` |
| 前端任务 | 通用规则 + `./.ai/rules/20-frontend-development-rules.md` |
| 前后端联动任务 | 通用规则 + `./.ai/rules/10-backend-development-rules.md` + `./.ai/rules/20-frontend-development-rules.md` + `./.ai/rules/30-fullstack-linkage-rules.md` + `./.ai/api-status.yml` |
| Review 任务 | 按被评审对象加载对应规则；联动评审必须额外加载 `30-fullstack-linkage-rules.md` 与 `.ai/api-status.yml` |

### 1.2 核心红线摘要

- 业务词不得自行翻译；新增命名必须先查 `01-business-dictionary.md`，未收录词需标注待确认。
- 接口字段、类型、枚举和错误码以 OpenAPI（`/v3/api-docs`）为唯一契约真源，不得前端猜字段。
- 接口联调状态以 `.ai/api-status.yml` 为准，AI 不得自行把接口状态提升为 `ready`。
- Mock 只能落在统一 Mock 层或统一 mock 目录，禁止散落到 Vue 组件、Pinia action 或 API SDK 内部。
- 后端变更必须遵守模块边界、对象分层和增量 SQL 规则；历史 SQL 不得直接改写。
- 默认允许只读命令、静态检查、类型检查、编译与单元测试；删除、批量改写、数据库迁移、生产 API、权限/环境变更必须先确认。
- 没有真实验证证据时，必须明确标注“未验证/未执行测试/未编译验证”，不得写成“已通过/已完成”。

## 2. 输出与证据要求

1. 默认使用简体中文输出分析、说明、注释与结论。
2. 关键判断尽量附证据：真实文件路径、方法名、配置键、命令与实际行为。
3. 没有真实验证证据时，必须明确标注"未验证"，不得写成已完成或已通过。

## 3. 执行边界

1. 默认允许执行只读命令、静态检查、类型检查、编译与单元测试；后台执行单元测试时建议设置最大超时时间 60s，避免任务卡死。
2. 未获明确确认，不执行高风险操作（删除/批量改写/环境与权限变更/生产数据与密钥相关操作）。
3. 需执行高风险操作时，先说明影响范围与风险，再等待明确确认。
4. 若发现当前任务存在适合沉淀为可复用 skill 的稳定流程或检查清单，先给出 skill 化建议；未获明确同意前，不直接生成 skill 文件。经确认后生成的项目级 skill 统一保存到 `./.ai/skills/`。
5. Git 仅允许安全操作；禁止使用会丢失、覆盖、回滚、强推或批量改写历史/工作区的危险 git 操作。非破坏性的查看类、定位类、状态类 git 操作可以使用。
