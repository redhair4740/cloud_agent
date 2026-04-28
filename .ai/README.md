# AI_Vision AI 协作配置体系

本目录是项目 AI 协作规范的唯一真实来源。默认运行时只加载 `runtime.md`，详细规则、角色、技能和模板均按任务需要读取。

## 目录总览

```text
.ai/
├── runtime.md          # 默认运行时入口：分类、矩阵、红线、风险边界
├── commands.md         # 开发/验证命令，目录从 project.yml 动态读取
├── agent.md            # 规范治理入口，不作为默认长上下文
├── project.yml         # 目录映射、技术栈、模块名参数
├── api-status.yml      # 接口联调状态真源
├── rules/              # 详细硬规则，按任务加载
├── agents/             # 角色边界，按任务加载
├── skills/             # 可复用流程，语义命中时加载
└── templates/          # 文档模板，生成文档时加载
```

## 默认读取顺序

1. 项目入口：`AGENTS.md` 或 `CLAUDE.md`。
2. `./.ai/runtime.md`。
3. `./.ai/skills/task-classifier/SKILL.md` 做任务分类。
4. 按任务读取必要的 `rules/`、`agents/`、`skills/` 或 `templates/`。

## 详细规则

| 文件 | 覆盖范围 |
|------|----------|
| `rules/00-repo-baseline.md` | 通用沟通、证据、未验证、风险和文档管理 |
| `rules/01-business-dictionary.md` | 业务词、英文命名、禁用译法、表/权限前缀 |
| `rules/10-backend-development-rules.md` | 后端技术栈、PostgreSQL、SQL、模块边界、编译验证 |
| `rules/11-backend-object-layering-rules.md` | 后端 VO/DO/Mapper/Service 分层与目录组织 |
| `rules/20-frontend-development-rules.md` | 前端技术栈、API SDK、Pinia、Mock、验证边界 |
| `rules/30-fullstack-linkage-rules.md` | API-First、OpenAPI、api-status、contract-check |

## Agents 与 Skills

| 类型 | 文件 | 用途 |
|------|------|------|
| Agent | `agents/20-backend-agent.md` | 后端单侧闭环任务边界 |
| Agent | `agents/30-frontend-agent.md` | 前端单侧闭环任务边界 |
| Agent | `agents/40-review-agent.md` | Review 输出与归档边界 |
| Skill | `skills/task-classifier/SKILL.md` | 任务分类与规则选择 |
| Skill | `skills/contract-check/SKILL.md` | 前后端契约一致性检查 |
| Skill | `skills/dynamic-menu-sync/SKILL.md` | 动态菜单与按钮权限同步 |
| Skill | `skills/deploy-portainer-release/SKILL.md` | Portainer 发布方案与检查清单 |

## 维护原则

- `.ai/` 是 Codex 和 Claude Code 的协作规范来源。
- 入口文件不复制规则全文，避免上下文过长和多处漂移。
- `project.yml` 是目录和技术参数来源，文档中不要写死本地目录名。
- 示例内容放在 `templates/examples/`，模板默认只保留空结构。
