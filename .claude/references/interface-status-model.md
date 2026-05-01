# 接口状态模型参考

本文件维护接口联调状态枚举、前端/AI 动作和状态清单字段。状态治理红线见 `.agents/rules/interface-contract-status.md`，契约检查流程见 `.agents/skills/contract-check/SKILL.md`。

## 状态枚举

| 状态 | 含义 | 前端/AI 动作 |
|------|------|-------------|
| `planned` | 已规划，未提供稳定契约 | 不猜字段，等待契约或确认 |
| `contracted` | OpenAPI 契约已提供 | 可生成类型，不默认联调 |
| `mockable` | 允许基于契约 Mock | 只走统一 Mock 层 |
| `partial` | 部分字段或路径可联调 | 稳定部分接真实 API，未完成部分继续 Mock |
| `ready` | 后端确认可联调 | 默认切真实 API，清理失效 Mock |
| `deprecated` | 接口废弃 | 禁止新增依赖，提出迁移方案 |

## 状态清单字段

维护接口状态清单时使用以下字段：

```yaml
interfaces:
  - path: /example/path
    method: GET
    module: example
    owner: backend-confirmed
    status: planned
    contract: /v3/api-docs
    confirmed_by: 待确认
    updated_at: yyyy-MM-dd
    frontend_action: 不猜字段；等待契约或后端确认后再实现。
    notes: 示例项，新增真实接口时复制本结构并替换。
```

## 字段要求

- `status` 只能使用状态枚举中的值。
- `confirmed_by` 必须记录确认人或确认来源；无法确认时写“待确认”。
- `updated_at` 必须记录最近状态更新时间。
- `frontend_action` 必须写清当前前端动作：等待契约、统一 Mock、部分接真实 API、切真实 API、迁移替代接口。
