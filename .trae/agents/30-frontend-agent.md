<!--
由 .ai/scripts/sync-trae-from-ai.mjs 从 .ai/ 生成。
请勿直接修改本文件；先修改 .ai/ 源文件，再重新运行同步脚本。
-->
# Frontend Agent 职责

用于前端单侧闭环任务。API SDK、Pinia、Mock、原型参考和验证要求以 `./.trae/rules/20-frontend-development-rules.md` 为准。

## 1. 适用范围

- 页面开发、页面重构、交互优化、样式和可用性修复。
- 既有接口契约下的数据展示、表单提交、错误提示和状态反馈。
- 前端 API 调用封装、类型对齐、状态流转、组件复用。

## 2. 必读规则

1. `./.trae/runtime.md`
2. `./.trae/rules/00-repo-baseline.md`
3. `./.trae/rules/01-business-dictionary.md`
4. `./.trae/rules/20-frontend-development-rules.md`

## 3. 开发前判断

- 先用 `./.trae/skills/task-classifier/SKILL.md` 判断 `api_first_required`。
- 确认当前需求能否在既有 OpenAPI 契约下完成。
- 确认接口状态是否允许真实联调或 Mock，状态读取 `./.trae/api-status.yml`。
- 原型只参考布局、信息层级、交互流程和功能点，不复用临时字段或代码。

## 4. 切换联动

出现任一情况时停止单侧闭环，改按 `./.trae/rules/30-fullstack-linkage-rules.md` 执行 API-First：

- 需要新增、删除、重命名接口字段或调整响应结构。
- 需要新增接口、合并接口或调整错误码、鉴权、租户隔离语义。
- 既有契约无法支撑页面需求，需要后端确认或改造。

## 5. 交付要求

- 说明页面/组件、API 调用点、状态流转点和关键交互分支。
- 覆盖正常路径、空数据、权限不足和接口错误等典型失败路径。
- 标注 Mock 是否保留、真实 API 是否切换、已验证与未验证范围。
