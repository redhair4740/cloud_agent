# AI_Vision Claude Code 协作入口

本文件是 Claude Code 的项目级短入口。详细规则不在这里重复展开，避免上下文过长和多处漂移。

## 默认读取

1. 先读本文件。
2. 再读 `./.ai/runtime.md`，完成任务分类与规则加载判断。
3. 按 `runtime.md` 的任务矩阵，只读取当前任务需要的 `./.ai/rules/*`、`./.ai/agents/*`、`./.ai/skills/*` 或模板。
4. 需要命令时读取 `./.ai/commands.md`；需要治理说明时读取 `./.ai/agent.md`。

## 核心约束

- 全程使用简体中文沟通、分析、注释与交付说明。
- `.ai/` 是协作规范唯一真实来源。
- 目录名必须从 `./.ai/project.yml` 动态读取，不写死本地目录。
- 接口契约以 OpenAPI `/v3/api-docs` 为准；接口状态以 `./.ai/api-status.yml` 为准。
- 未验证必须明确标注“未验证/未执行测试/未编译验证”。
- 高风险操作和危险 Git 操作必须先确认，具体边界见 `./.ai/runtime.md`。

## 任务入口

- 任务开始先参考 `./.ai/skills/task-classifier/SKILL.md` 做只读分类。
- 后端任务读取 `10` + `11` 规则；前端任务读取 `20` 规则；联动任务读取 `30` 规则与 `api-status.yml`。
- Skills 和 templates 只在任务语义命中时读取，禁止默认全量加载。
