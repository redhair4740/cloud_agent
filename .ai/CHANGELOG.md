# AI_Vision 项目变更日志

本文件记录 `.ai` 目录下所有规范、配置、架构变更的追踪记录。

## 格式定义

每条变更记录包含以下字段：

| 字段 | 说明 | 示例 |
|------|------|------|
| 日期 | 变更发生日期，格式 `YYYY-MM-DD` | `2026-04-24` |
| 变更类型 | 变更性质：`新增` / `修改` / `移除` | `新增` |
| 变更摘要 | 简要描述变更内容 | 新增模型适配器规范文档 |
| 影响范围 | 受影响的模块、目录或功能 | `.ai/adapters/` |
| 变更人 | 变更发起者 | `AI Agent` 或团队名称 |

---

## 变更记录

### 2026-04-28

#### 简化 AI 工具适配范围
- **变更类型**: 修改
- **变更摘要**: 支持工具收敛为 Codex、Claude Code、Trae-CN；移除 Gemini 适配口径；Trae 从 stub 回指改为脚本同步的自包含镜像，并同步运行时支撑文件
- **影响范围**: `AGENTS.md`、`CLAUDE.md`、`.ai/README.md`、`.ai/agent.md`、`.ai/adapters/`、`.ai/model-adapters.md`、`.ai/scripts/`、`.trae/`
- **变更人**: AI Agent

### 2026-04-26

#### 协作提示词全量去重
- **变更类型**: 修改
- **变更摘要**: 新增 `runtime.md` 与 `commands.md`，将平台入口收敛为短导航，Trae 投影改为 stub，agents/rules/skills/templates 按职责去重，模板示例移至 `templates/examples/`
- **影响范围**: `AGENTS.md`、`GEMINI.md`、`CLAUDE.md`、`.trae/rules/`、`.ai/runtime.md`、`.ai/commands.md`、`.ai/adapters/`、`.ai/agents/`、`.ai/rules/`、`.ai/skills/`、`.ai/templates/`
- **变更人**: AI Agent

### 2026-04-24

#### 新增 contract-check skill
- **变更类型**: 新增
- **变更摘要**: 新增 contract-check skill，以 OpenAPI 文档（`/v3/api-docs`）为契约唯一真源，逐项对照前端 API 调用与后端接口定义，输出不一致清单（P0-P3 严重级别）
- **影响范围**: `.ai/skills/contract-check/`
- **变更人**: AI Agent

#### 新增 API 契约先行（Backend Agent 第 9 节）
- **变更类型**: 新增
- **变更摘要**: Backend Agent 新增第 9 节"API 契约先行"，涉及新接口或接口变更时必须先写 Controller 骨架 + OpenAPI 注解，生成 `/v3/api-docs` 契约文档，与前端确认后再填写 Service 实现
- **影响范围**: `.ai/agents/20-backend-agent.md`
- **变更人**: AI Agent

#### 废除 Fullstack Agent
- **变更类型**: 移除
- **变更摘要**: 废除 `10-fullstack-linkage-agent.md`，联动任务不再由单一 Agent 处理，改为 API-First 流程：Backend Agent 契约先行 → OpenAPI 定版 → 前后端独立实现 → contract-check 验证
- **影响范围**: `.ai/agents/10-fullstack-linkage-agent.md`、`.ai/agents/30-frontend-agent.md`、`.ai/agent.md`
- **变更人**: AI Agent

#### 增强 30-fullstack-linkage-rules.md
- **变更类型**: 修改
- **变更摘要**: 联动规则新增第 6 节"契约唯一真源与 API-First 流程"，明确 OpenAPI 文档为契约唯一真源，定义 API-First 执行流程，补充 contract-check 验证要求
- **影响范围**: `.ai/rules/30-fullstack-linkage-rules.md`、`.trae/rules/30-fullstack-linkage-rules.md`
- **变更人**: AI Agent

#### 同步 .trae/rules/ 投影
- **变更类型**: 修改
- **变更摘要**: 同步所有 .trae/rules/ 投影文件（project_rules.md、30-fullstack-linkage-rules.md），移除 fullstack-agent 调度线，新增 API-First 流程和 contract-check skill 引用
- **影响范围**: `.trae/rules/project_rules.md`、`.trae/rules/30-fullstack-linkage-rules.md`
- **变更人**: AI Agent

#### 新增 adapters/ 目录
- **变更类型**: 新增
- **变更摘要**: 新增模型适配器目录，用于存放 AI 模型适配器配置与实现
- **影响范围**: `.ai/adapters/`
- **变更人**: AI Agent

#### 新增 templates/ 目录
- **变更类型**: 新增
- **变更摘要**: 新增模板目录，用于存放可复用的 prompt 模板与代码模板
- **影响范围**: `.ai/templates/`
- **变更人**: AI Agent

#### 新增 model-adapters.md
- **变更类型**: 新增
- **变更摘要**: 新增模型适配器规范文档，定义多模型适配的接口标准与使用指南
- **影响范围**: `.ai/model-adapters.md`
- **变更人**: AI Agent

#### 新增 CHANGELOG.md
- **变更类型**: 新增
- **变更摘要**: 新增变更追踪文件，建立规范变更记录机制
- **影响范围**: `.ai/CHANGELOG.md`
- **变更人**: AI Agent

#### 升级 AGENTS.md
- **变更类型**: 修改
- **变更摘要**: 优化协作入口文档，明确读取顺序、输出证据要求与执行边界
- **影响范围**: `AGENTS.md`
- **变更人**: AI Agent

#### 增强 Skill 体系
- **变更类型**: 修改
- **变更摘要**: 扩展 skills 目录结构，新增 `deploy-portainer-release` 与 `dynamic-menu-sync` 两个可复用 skill
- **影响范围**: `.ai/skills/`
- **变更人**: AI Agent

#### 更新 agent.md
- **变更类型**: 修改
- **变更摘要**: 完善项目协作总入口，新增 Skill 沉淀建议机制、任务类型与 Agent 选择规则、Review 归档要求
- **影响范围**: `.ai/agent.md`
- **变更人**: AI Agent

---

## 变更统计

| 日期 | 新增 | 修改 | 移除 | 总计 |
|------|------|------|------|------|
| 2026-04-24 | 6 | 5 | 1 | 12 |

---

## 使用说明

1. **新增变更时**：在对应日期下追加记录条目，按时间倒序排列（最新在前）
2. **跨日变更**：新增日期分组，保持日期倒序
3. **修改记录**：保留原始记录，追加修订说明，不删除历史
4. **移除操作**：标注移除原因与替代方案（如有）
