# AI_Vision Codex 协作入口

本文件遵循 [AAIF AGENTS.md 开放标准](https://www.agentic-ai.foundation/)，为 AI 编程助手提供项目级指令。已被 OpenAI Codex、Gemini CLI、Cursor 等工具广泛支持。

## 项目概览

- **项目名称**: AI_Vision (VMesh Cloud)
- **项目描述**: AI 视觉智能平台基础脚手架，基于 Spring Boot 3.5 + Vue 3 构建的前后端分离企业级应用
- **版本**: 2026.01-SNAPSHOT

## 技术栈

### 后端 ({{dirs.backend}})
- **语言**: Java 21
- **框架**: Spring Boot 3.5.9
- **构建工具**: Maven
- **ORM**: MyBatis-Plus
- **数据库**: MySQL / PostgreSQL
- **缓存**: Redis
- **其他**: Lombok, MapStruct 1.6.3

### 前端 ({{dirs.frontend}})
- **语言**: TypeScript 5.3
- **框架**: Vue 3.5 + Vite 5.1
- **UI 组件**: Element Plus 2.11
- **状态管理**: Pinia 2.1
- **包管理**: pnpm 8.15.9
- **Node.js**: >= 16.0.0 (推荐 22.x)

## 开发命令

### 后端
```bash
# 编译项目
mvn clean compile

# 打包项目（跳过测试）
mvn clean package -DskipTests

# 运行单元测试
mvn test

# 完整构建（含测试）
mvn clean verify

# 启动服务（需先编译）
java -jar vmesh-server/target/vmesh-server.jar
```

### 前端
```bash
# 安装依赖
pnpm install

# 启动本地开发服务器
pnpm dev

# 启动连接后端开发服务器
pnpm dev-server

# TypeScript 类型检查
pnpm ts:check

# ESLint 代码检查
pnpm lint:eslint

# Prettier 格式化
pnpm lint:format

# StyleLint 样式检查
pnpm lint:style

# 构建生产版本
pnpm build:prod
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
├── agents/           # 协作角色定义
│   ├── 20-backend-agent.md
│   ├── 30-frontend-agent.md
│   └── 40-review-agent.md
├── rules/            # 项目硬约束与边界规则
│   ├── 00-repo-baseline.md
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
   - `./.ai/rules/`（硬约束与边界规则，必须遵守）
   - `./.ai/agents/`（协作角色定义）
   - `./.ai/skills/`（可复用执行方法，当前已有 deploy-portainer-release、dynamic-menu-sync）

## 2. 输出与证据要求

1. 默认使用简体中文输出分析、说明、注释与结论。
2. 关键判断尽量附证据：真实文件路径、方法名、配置键、命令与实际行为。
3. 没有真实验证证据时，必须明确标注"未验证"，不得写成已完成或已通过。

## 3. 执行边界

1. 未获明确确认，不运行测试。
2. 未获明确确认，不执行高风险操作（删除/批量改写/环境与权限变更/生产数据与密钥相关操作）。
3. 需执行高风险操作时，先说明影响范围与风险，再等待明确确认。
4. 若发现当前任务存在适合沉淀为可复用 skill 的稳定流程或检查清单，先给出 skill 化建议；未获明确同意前，不直接生成 skill 文件。经确认后生成的项目级 skill 统一保存到 `./.ai/skills/`。
5. Git 仅允许安全操作；禁止使用会丢失、覆盖、回滚、强推或批量改写历史/工作区的危险 git 操作。非破坏性的查看类、定位类、状态类 git 操作可以使用。
