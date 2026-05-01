---
alwaysApply: false
description: 定义接口契约真源、联调状态权限边界和 AI 不得自行提升 ready 的红线。
---
# 接口契约与联调状态规则

## 契约真源

- OpenAPI `/v3/api-docs` 是接口契约唯一真源。
- 接口状态只描述能否 Mock、能否联调或是否废弃，不替代 OpenAPI 字段契约。
- 前端和 AI 不得根据代码存在、本地可访问或单次调通自行把接口状态提升为 `ready`。
- 接口状态必须由后端负责人、接口负责人或人工确认人维护。

## 状态模型

- 接口状态枚举和状态清单字段维护在 `.agents/references/interface-status-model.md`。
- 状态清单只能描述联调可用性，不写字段结构；字段结构回到 OpenAPI。
