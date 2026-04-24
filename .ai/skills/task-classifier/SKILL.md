---
name: task-classifier
version: "1.0.0"
depends_on:
  - ".ai/rules/00-repo-baseline.md"
  - ".ai/rules/01-business-dictionary.md"
  - ".ai/rules/30-fullstack-linkage-rules.md"
description: 在任务开始或评审前自动判断任务类型与是否需要进入 API-First 联动模式。用于减少后端/前端/联动/review 误判，依据需求文本、计划变更文件、git diff 文件列表与接口契约信号输出 task_type、required_rules 与 api_first_required。
---

# 任务类型分类器

## 概览

本 skill 用于任务开始阶段的只读分类，不直接修改代码，不替代 `.ai/rules`。分类结果用于决定加载哪些规则、是否进入 API-First、是否需要运行 `contract-check`。

## 输入来源

优先按以下顺序收集信息：

1. 用户需求文本：是否出现接口、字段、VO、响应结构、错误码、鉴权、联调、页面调用、Mock 等关键词。
2. 当前工作区变更：`git status --short` 与 `git diff --name-only`。
3. 计划变更文件：若尚未改代码，根据用户提到的模块、路径、文件名和功能点推断。
4. 必要时只读搜索：使用 `rg` 定位 Controller、前端 API、页面、状态管理和 OpenAPI 注解。

## 检测路径信号

### 后端接口信号

命中任一类即视为可能影响接口契约：

- `controller/**`、`**/*Controller.java`
- `controller/**/vo/**`、`**/*ReqVO.java`、`**/*RespVO.java`
- `@RequestMapping`、`@GetMapping`、`@PostMapping`、`@PutMapping`、`@DeleteMapping`
- `@Operation`、`@Schema`、`@Parameter`、`@ApiResponse`
- 错误码、鉴权注解、分页参数、枚举响应字段

### 前端接口消费信号

命中任一类即视为可能影响接口消费：

- `<frontend-dir>/src/api/**`
- `<frontend-dir>/src/views/**`
- `<frontend-dir>/src/store/**`
- `<frontend-dir>/src/router/**`
- 请求参数类型、响应类型、错误处理分支、Mock 文件或统一 Mock 层

## 分类规则

| task_type | 触发条件 | api_first_required |
|-----------|----------|--------------------|
| `backend` | 仅涉及后端内部逻辑、Service、Mapper、SQL、配置或测试，且不改变 Controller/VO/OpenAPI 契约 | `false` |
| `frontend` | 仅涉及前端页面、组件、样式、状态或既有接口消费方式，且不要求后端字段/接口变化 | `false` |
| `fullstack` | 同时出现后端接口信号与前端接口消费信号，或需求明确要求新增/调整接口字段、响应、错误码、鉴权、联调 | `true` |
| `review-backend` | 评审对象仅含后端变更且无前端消费影响 | `false` |
| `review-frontend` | 评审对象仅含前端变更且无后端契约影响 | `false` |
| `review-fullstack` | 评审对象同时含后端接口信号与前端消费信号，或可能存在契约不一致 | `true` |
| `uncertain` | 文件或需求信号不足，无法判断是否影响契约 | `unknown` |

## 强制联动触发

出现以下任一情况，必须进入联动模式：

- 同一任务同时涉及后端 Controller/VO/OpenAPI 注解与前端 `src/api`、`src/views`、`src/store` 或 Mock。
- 后端新增、删除、重命名接口字段或调整响应结构。
- 调整接口路径、HTTP 方法、请求参数、分页参数、错误码语义或鉴权语义。
- 前端需求无法在既有 OpenAPI 契约下实现。
- Review 中发现后端接口变更但前端调用未同步，或前端新增字段依赖但后端契约缺失。

## 避免过度联动

以下情况默认不触发联动，但交付时必须说明未触发原因：

- 只改后端 Service/Mapper 内部实现，不改变 Controller、VO、OpenAPI 或错误码。
- 只改 SQL 查询性能、索引、内部配置或单元测试，不改变外部响应语义。
- 只改前端样式、布局、组件拆分、文案或既有接口调用展示方式。
- 只改文档、脚本、部署说明或非接口相关配置。

## 输出模板

```yaml
task_type: fullstack
confidence: high
api_first_required: true
trigger_files:
  - <backend-dir>/vmesh-module-*/src/main/java/**/controller/**
  - <frontend-dir>/src/api/**
required_rules:
  - .ai/rules/00-repo-baseline.md
  - .ai/rules/01-business-dictionary.md
  - .ai/rules/10-backend-development-rules.md
  - .ai/rules/20-frontend-development-rules.md
  - .ai/rules/30-fullstack-linkage-rules.md
  - .ai/api-status.yml
reason: 同时命中后端接口信号和前端接口消费信号，需要 API-First 联动。
next_action: 先确认 OpenAPI 契约与 api-status 状态，再进入实现。
```

## 不确定处理

当分类为 `uncertain` 时：

- 不直接进入实现。
- 输出缺失信息与可选判断路径。
- 优先做只读搜索补充证据；仍无法判断时，请求人确认是否涉及接口契约变更。
