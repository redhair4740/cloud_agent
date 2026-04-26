# AI_Vision 运行时协作入口

本文件是 AI 默认加载的最小上下文入口。`.ai/rules/*` 才是详细硬规则真源；未命中任务时不要一次性加载全部规则、agents、skills 或 templates。

## 1. 任务开始

1. 先用 `./.ai/skills/task-classifier/SKILL.md` 做只读分类。
2. 输出或内部确认：`task_type`、`api_first_required`、`required_rules`、判断原因。
3. 只读取当前任务需要的规则文件；不确定时先补充只读搜索证据。
4. 若分类仍不确定，标注 `task_type: uncertain`，并确认是否涉及接口契约变更。

## 2. 按任务加载

| 任务类型 | 必读规则/文件 |
|----------|---------------|
| 通用任务 | `./.ai/rules/00-repo-baseline.md` + `./.ai/rules/01-business-dictionary.md` |
| 后端任务 | 通用规则 + `./.ai/rules/10-backend-development-rules.md` + `./.ai/rules/11-backend-object-layering-rules.md` |
| 前端任务 | 通用规则 + `./.ai/rules/20-frontend-development-rules.md` |
| 前后端联动任务 | 通用规则 + `./.ai/rules/10-backend-development-rules.md` + `./.ai/rules/20-frontend-development-rules.md` + `./.ai/rules/30-fullstack-linkage-rules.md` + `./.ai/api-status.yml` |
| Review 任务 | 先分类被评审对象；按后端/前端/联动加载对应规则，联动评审额外读 `./.ai/api-status.yml` |

按需读取：

- 角色边界：`./.ai/agents/*.md`
- 可复用流程：`./.ai/skills/*/SKILL.md`
- 文档模板：`./.ai/templates/*.md`
- 开发命令：`./.ai/commands.md`
- 规范治理说明：`./.ai/agent.md`

## 3. 核心红线

- 全程使用简体中文沟通、分析、注释与交付说明。
- 目录名从 `./.ai/project.yml` 动态读取，不写死本地工程目录。
- 业务词先查 `./.ai/rules/01-business-dictionary.md`，未收录词标注待确认。
- 接口契约以 OpenAPI `/v3/api-docs` 为唯一真源，前端不得猜字段、类型、枚举或错误码。
- 接口联调状态以 `./.ai/api-status.yml` 为准，AI 不得自行把接口状态提升为 `ready`。
- Mock 只能放统一 Mock 层或统一 mock 目录，禁止散落到 Vue 组件、Pinia action 或 API SDK 内部。
- 后端改动遵守模块边界、对象分层和增量 SQL 规则；历史 SQL 不得直接改写。
- 未执行真实验证时必须写“未验证/未执行测试/未编译验证”，不得写成“已通过/已完成”。

## 4. 风险与 Git

- 默认允许只读命令、静态检查、类型检查、编译和单元测试；后台测试建议设置 60s 超时。
- 删除、批量重命名、数据库迁移、生产 API、外部服务写入、权限/环境变更必须先说明影响并获得明确确认。
- 禁止默认执行会丢失、覆盖、回滚、重写历史或强推的危险 Git 操作。
- 只要发现敏感信息，只允许定位和脱敏说明，禁止回显明文。

## 5. 交付口径

- 交付说明至少包含：目标、落地文件、影响范围、关键边界、验证结果、未验证项与原因。
- 关键判断尽量附证据：文件路径、方法名、配置键、命令和实际行为。
- 新增文档按 `docs/README.md` 约定落位；Review 清单按 `docs/review-tracking/` 规则同步索引。
