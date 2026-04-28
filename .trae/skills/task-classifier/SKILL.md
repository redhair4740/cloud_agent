<!--
由 .ai/scripts/sync-trae-from-ai.mjs 从 .ai/ 生成。
请勿直接修改本文件；先修改 .ai/ 源文件，再重新运行同步脚本。
-->
---
name: task-classifier
version: "1.1.0"
depends_on:
  - ".trae/runtime.md"
  - ".trae/rules/00-repo-baseline.md"
  - ".trae/rules/01-business-dictionary.md"
description: 在任务开始或评审前只读判断任务类型、必读规则和是否触发 API-First。输出 task_type、api_first_required、required_rules 与原因。
---

# 任务类型分类器

## 概览

本 skill 只做分类，不修改文件，不替代 `runtime.md` 或 `rules/`。分类结果用于决定本轮需要读取哪些规则。

## 输入来源

1. 用户需求文本：接口、字段、VO、错误码、鉴权、联调、页面调用、Mock 等信号。
2. 工作区状态：`git status --short` 与 `git diff --name-only`。
3. 计划变更文件：用户提到的模块、路径、文件名和功能点。
4. 必要只读搜索：Controller、VO、OpenAPI 注解、前端 API、页面、store、Mock。

## 分类规则

| task_type | 触发条件 | api_first_required |
|-----------|----------|--------------------|
| `backend` | 仅后端内部逻辑、Service、Mapper、SQL、配置或测试，且不改变接口契约 | `false` |
| `frontend` | 仅前端页面、组件、样式、状态或既有接口消费，且不要求后端变化 | `false` |
| `fullstack` | 同时命中后端接口信号与前端消费信号，或明确新增/调整接口契约 | `true` |
| `review-backend` | 评审对象仅含后端变更且无前端消费影响 | `false` |
| `review-frontend` | 评审对象仅含前端变更且无后端契约影响 | `false` |
| `review-fullstack` | 评审对象可能存在前后端契约不一致 | `true` |
| `uncertain` | 信号不足，无法判断是否影响契约 | `unknown` |

## 强制联动信号

- 后端 Controller/VO/OpenAPI 注解与前端 `src/api`、`src/views`、`src/store` 或 Mock 同时出现。
- 新增、删除、重命名接口字段，或调整响应结构、路径、HTTP 方法、分页、错误码、鉴权语义。
- 前端需求无法在既有 OpenAPI 契约下实现。
- Review 发现后端接口变更但前端调用未同步，或前端依赖字段后端契约缺失。

## 输出模板

```yaml
task_type: fullstack
confidence: high
api_first_required: true
trigger_files:
  - <backend-dir>/.../controller/**
  - <frontend-dir>/src/api/**
required_rules:
  - .trae/runtime.md
  - .trae/rules/00-repo-baseline.md
  - .trae/rules/01-business-dictionary.md
  - .trae/rules/10-backend-development-rules.md
  - .trae/rules/20-frontend-development-rules.md
  - .trae/rules/30-fullstack-linkage-rules.md
reason: 同时命中后端接口信号和前端消费信号，需要 API-First。
```

## 不确定处理

- 先补充只读搜索证据。
- 仍无法判断时输出 `task_type: uncertain`，并请求确认是否涉及接口契约变更。
