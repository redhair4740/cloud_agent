<!--
由 .ai/scripts/sync-trae-from-ai.mjs 从 .ai/ 生成。
请勿直接修改本文件；先修改 .ai/ 源文件，再重新运行同步脚本。
-->
# project_rules.md - AI_Vision Trae 入口

本目录由 `.ai/` 同步生成，Trae 侧请读取这里的自包含镜像，不要回写生成文件。

## 默认读取

1. 先读 `./.trae/runtime.md`，完成任务分类与规则加载判断。
2. 按任务类型读取 `./.trae/rules/*` 的必要文件。
3. 需要角色边界、skill 或模板时，再读取 `./.trae/agents/*`、`./.trae/skills/*/SKILL.md`、`./.trae/templates/*`。

## 维护方式

- 手工修改只发生在 `.ai/`。
- 修改 `.ai/` 后运行 `node .ai/scripts/sync-trae-from-ai.mjs` 更新本目录。
- 未验证必须明确标注，高风险操作必须先确认。
