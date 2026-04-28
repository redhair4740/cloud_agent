# project_rules.md - AI_Vision Trae 入口

本文件是 Trae 的项目级入口。`.trae/` 是 Trae 原生规范目录，规则、角色、技能和模板均在本目录内单独维护。

## 默认读取

1. 先读 `./.trae/runtime.md`，完成任务分类与规则加载判断。
2. 按任务类型读取 `./.trae/rules/*` 的必要文件。
3. 需要角色边界、skill 或模板时，再读取 `./.trae/agents/*`、`./.trae/skills/*/SKILL.md`、`./.trae/templates/*`。

## 维护方式

- `.trae/` 内容按 Trae 使用习惯单独维护。
- 核心红线应与 `.ai/` 保持一致：简体中文、动态目录、OpenAPI 真源、api-status、未验证口径和高风险确认。
- 未验证必须明确标注，高风险操作必须先确认。
