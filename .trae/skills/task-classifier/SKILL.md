---
name: task-classifier
description: 当任务开始、需求边界不清、评审对象需要归类、或需要判断是否触发 API-First 时使用。输出任务类型、是否联动、建议规则和判断证据。
---

# 任务类型分类器

## 触发场景

- 用户提出开发、修复、评审、联调、设计文档或部署任务。
- 需求中出现接口、字段、VO、错误码、鉴权、联调、页面调用、Mock 等信号。
- 任务边界不清，需要先判断后端、前端、联动或 review 类型。

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

- 后端 Controller、VO、OpenAPI 注解与前端 API、页面、store 或 Mock 同时出现。
- 新增、删除、重命名接口字段，或调整响应结构、路径、HTTP 方法、分页、错误码、鉴权语义。
- 前端需求无法在既有 OpenAPI 契约下实现。
- Review 发现后端接口变更但前端调用未同步，或前端依赖字段后端契约缺失。

## 输出格式

```yaml
task_type: fullstack
confidence: high
api_first_required: true
trigger_files:
  - <backend-dir>/.../controller/**
  - <frontend-dir>/src/api/**
suggested_rules:
  - repo-baseline
  - business-dictionary
  - backend-development
  - frontend-development
  - fullstack-api-first
reason: 同时命中后端接口信号和前端消费信号，需要 API-First。
```

无法判断时先补充只读搜索证据；仍无法判断时输出 `task_type: uncertain`，并请求确认是否涉及接口契约变更。
