<!--
由 .ai/scripts/sync-trae-from-ai.mjs 从 .ai/ 生成。
请勿直接修改本文件；先修改 .ai/ 源文件，再重新运行同步脚本。
-->
# .trae 协作规范治理入口

`.trae/` 是从 `.ai/` 生成的 Trae 自包含镜像。本文件只说明 Trae 侧如何读取生成内容；不要在 `.trae/` 内手工维护规则。

## 读取顺序

1. 先读 `./.trae/runtime.md`。
2. 按任务类型读取 `./.trae/rules/*`。
3. 需要角色边界时读取 `./.trae/agents/*`。
4. 需要可复用流程时读取 `./.trae/skills/*/SKILL.md`。
5. 生成文档时读取 `./.trae/templates/*`。

## 维护方式

- 唯一手工维护源是 `.ai/`。
- 修改 `.ai/` 后运行 `node .ai/scripts/sync-trae-from-ai.mjs`。
- 脚本会重建 `.trae/rules`、`.trae/agents`、`.trae/skills`、`.trae/templates`，并更新运行时支撑文件。
