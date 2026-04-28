# Rule: 前后端联动强制规则

本规则只定义接口契约、API-First、api-status 与 contract-check。后端和前端单侧技术规则分别见 `10-backend-development-rules.md` 与 `20-frontend-development-rules.md`。

## 1. 适用范围

- 同一任务同时涉及后端 Controller/VO/OpenAPI 与前端 API/页面/store/Mock。
- 新增或调整接口路径、方法、请求参数、响应字段、枚举、错误码、鉴权或分页语义。
- 前端需求无法在既有 OpenAPI 契约下实现。
- Review 中发现接口变更和前端消费不一致。

## 2. 继承规则

联动任务必须读取：

1. `00-repo-baseline.md`
2. `01-business-dictionary.md`
3. `10-backend-development-rules.md`
4. `20-frontend-development-rules.md`
5. `30-fullstack-linkage-rules.md`
6. `.trae/api-status.yml`

涉及后端对象组织时追加读取 `11-backend-object-layering-rules.md`。

## 3. 契约真源

- OpenAPI `/v3/api-docs` 是接口契约唯一真源。
- 后端 Controller 注解是 OpenAPI 生成源，接口变化必须反映在注解中。
- 前端实现必须以 OpenAPI 为准，不得猜字段名、类型、枚举或错误码语义。
- `.trae/api-status.yml` 只描述接口是否可 Mock、可联调或废弃，不替代 OpenAPI 字段契约。
- 接口状态由后端或人工确认后更新；AI 不得根据代码存在、本地可访问或联调成功自行提升为 `ready`。

## 4. API-First 流程

```text
1. Backend Agent 写 Controller 骨架和完整 OpenAPI 注解
2. 启动后端服务并导出 /v3/api-docs
3. 前后端确认路径、方法、参数、字段、错误码和鉴权语义
4. 后端或人工确认 .trae/api-status.yml 状态
5. Backend Agent 实现 Service 逻辑
6. Frontend Agent 按 OpenAPI 实现类型、调用和页面行为
7. 使用 contract-check 做一致性验证
```

## 5. 接口状态

| 状态 | 含义 | 前端/AI 动作 |
|------|------|-------------|
| `planned` | 已规划，未提供稳定契约 | 不猜字段，等待契约或确认 |
| `contracted` | OpenAPI 契约已提供 | 可生成类型，不默认联调 |
| `mockable` | 允许基于契约 Mock | 只走统一 Mock 层 |
| `partial` | 部分字段或路径可联调 | 稳定部分接真实 API，未完成部分继续 Mock |
| `ready` | 后端确认可联调 | 默认切真实 API，清理失效 Mock |
| `deprecated` | 接口废弃 | 禁止新增依赖，提出迁移方案 |

## 6. 联动硬约束

- 禁止把联动理解为只改一个端；必须同步核对契约与页面行为。
- 禁止单边先改协议再要求另一端兜底。
- 字段、枚举、错误码、分页筛选参数必须端到端一致，不一致先修正再交付。
- Mock 不得散落到组件、Pinia action 或 API SDK 内部。

## 7. 最低交付

- 契约文档快照：`/v3/api-docs` JSON 或可访问地址。
- 接口状态：`.trae/api-status.yml` 对应状态、确认人与更新时间。
- 联动映射：后端字段/接口 -> 前端类型/调用 -> 页面行为。
- 回归影响：受影响模块、页面、接口和失败路径。
- contract-check 结果或手动对照不一致清单。
- 验证结论：已验证项与未验证项，未验证必须说明原因。
