# .ai 协作规范治理入口

`.ai/` 是 AI_Vision 协作规范的唯一真实来源。本文件只说明规范体系如何组织与维护；AI 执行任务时默认先读 `./.ai/runtime.md`，再按任务加载详细规则。

## 1. 文件职责

| 路径 | 职责 | 默认加载 |
|------|------|----------|
| `runtime.md` | 任务分类、加载矩阵、核心红线、风险边界 | 是 |
| `commands.md` | 后端/前端开发与验证命令 | 按需 |
| `project.yml` | 目录映射、技术栈、模块名参数 | 按需 |
| `api-status.yml` | 接口联调状态清单 | 联动/前端按需 |
| `rules/` | 不同任务类型的硬约束 | 按任务 |
| `agents/` | Backend/Frontend/Review 角色边界 | 按任务 |
| `skills/` | 可复用执行流程 | 语义命中时 |
| `templates/` | 文档模板 | 生成文档时 |
| `scripts/` | 协作配置同步脚本 | 治理维护时 |

## 2. 目录映射原则

- 后端、前端、设计、SQL 等目录统一从 `./.ai/project.yml` 的 `dirs.*` 读取。
- 技术栈和模块名统一从 `project.yml` 对应字段读取。
- 协作文档统一归入 `docs/`，具体命名和索引规则见 `docs/README.md` 与 `runtime.md`。

## 3. 规则优先级

当文档存在差异时，按以下顺序处理：

1. `rules/`：硬约束真源。
2. `runtime.md`：默认运行时摘要。
3. `agents/`：角色边界，不替代规则。
4. `skills/`：流程方法，不降低规则要求。
5. `templates/`、`scripts/`：模板、同步脚本。

## 4. 任务调度

- 任务开始先使用 `skills/task-classifier/SKILL.md` 做只读分类。
- 分类结果只决定加载哪些规则，不替代规则本身。
- 后端、前端、联动、Review 的规则组合以 `runtime.md` 为准。
- 联动任务按 `rules/30-fullstack-linkage-rules.md` 的 API-First 流程执行，不再维护独立 Fullstack Agent。

## 5. Agent 边界

- `agents/20-backend-agent.md`：后端单侧闭环任务的角色边界。
- `agents/30-frontend-agent.md`：前端单侧闭环任务的角色边界。
- `agents/40-review-agent.md`：评审任务的输出与归档边界。
- Agent 文档只保留职责和切换条件；具体技术规则回到 `rules/`。

## 6. Skill 沉淀

- 新增稳定流程或检查清单前，先提出 skill 方案并获得确认。
- 项目级 skill 统一放入 `./.ai/skills/<skill-name>/SKILL.md`。
- Skill frontmatter 至少包含 `name`、`version`、`depends_on`、`description`。
- Skill 只描述执行流程，通用红线和技术硬约束引用 `runtime.md` 与 `rules/`。

## 7. 跨平台适配

- `.ai/` 固定为唯一手工维护源，禁止反向修改生成镜像后不同步源文件。
- Codex：根目录 `AGENTS.md`，短入口。
- Claude Code：`CLAUDE.md`，短入口。
- Trae-CN：运行 `node .ai/scripts/sync-trae-from-ai.mjs`，从 `.ai/` 生成运行时支撑文件及 `.trae/rules`、`.trae/agents`、`.trae/skills`、`.trae/templates` 自包含镜像。
- Codex 与 Claude Code 入口只承载短导航，不复制 `rules/` 全文；Trae 读取脚本生成后的 `.trae/` 镜像。

## 8. 变更管理

- 修改 `.ai/` 规范时同步检查入口适配是否需要更新，并运行 Trae 同步脚本。
- 重要规范变更记录到 `CHANGELOG.md`。
- 不新增平行治理说明源；如需分析报告，放入 `docs/governance/` 并在 `docs/README.md` 建索引。
