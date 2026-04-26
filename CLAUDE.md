# CLAUDE.md — AI_Vision 项目指令

> 此文件由 `.ai/` 投影生成；请勿脱离源文件单独扩写规则全文。

## 默认读取

1. 先读本文件。
2. 再读 `./.ai/runtime.md`，按任务类型加载必要规则。
3. 需要命令时读 `./.ai/commands.md`；需要治理说明时读 `./.ai/agent.md`。

## 核心约束

- 使用简体中文输出。
- `.ai/` 是唯一规则源，平台入口只做短导航。
- 目录名从 `./.ai/project.yml` 动态读取。
- 接口契约以 `/v3/api-docs` 为准，接口状态以 `./.ai/api-status.yml` 为准。
- 未执行验证必须标注“未验证/未执行测试/未编译验证”。
- 高风险操作、生产 API、数据库迁移和危险 Git 操作必须先确认。

## 按需加载

- 任务分类：`./.ai/skills/task-classifier/SKILL.md`
- 规则矩阵与红线：`./.ai/runtime.md`
- 详细规则：`./.ai/rules/*.md`
- 角色边界：`./.ai/agents/*.md`
- 可复用流程：`./.ai/skills/*/SKILL.md`
