---
lifecycle: living
topic: 边云监控与告警控制中心
type: API文档
created: 2026-05-08
last_updated: 2026-05-08
status: active
supersedes: []
related:
  - docs/design/边云监控与告警控制中心/设计方案.md
  - docs/design/边云协同Edge全链路/设计方案.md
  - docs/api/Edge边缘模块/API文档.md
---

# 边云监控与告警控制中心 API 文档

## 1. 文档说明

- 契约来源：当前设计文档 + 现有 `edge` 模块源码静态扫描。
- OpenAPI 来源：未读取实时 `/v3/api-docs`。
- 适用模块：`moon_cloud_backend/vmesh-module-edge`、`moon_cloud_frontend/src/views/edge/**`、`moon_cloud_frontend/src/api/edge/**`。
- 验证口径：本次仅输出目标态 API 规范，未执行接口联调、未编译验证、未生成真实 Controller。
- 统一前缀：管理后台接口默认由网关追加 `/admin-api`，业务路径从 `/edge/**` 开始。
- 统一响应：除特殊二进制或流式接口外，统一使用 `CommonResult<T>` 或 `CommonResult<PageResult<T>>`。
- 状态说明：
  - `current`：当前代码已存在
  - `planned`：设计已明确、代码未实现
  - `compatible`：兼容保留，不作为新页面主入口

## 2. 设计原则

### 2.1 领域边界

- 本中心属于 `edge` 业务域，不依赖 `infra` 作为主轴。
- 监控、告警、策略、控制、任务是一个闭环，但职责拆分如下：
  - `runtime`：接收边缘事实
  - `monitor`：提供运行总览与聚合读模型
  - `alert`：统一告警实例、历史、策略
  - `control`：人工/自动控制编排
  - `task`：实际命令下发与回执

### 2.2 告警来源模型

统一告警中心接受两类来源：

- `EDGE_REPORTED`：边缘端或设备端主动上报
- `CLOUD_EVALUATED`：云端根据运行态、任务态、设备态派生计算

两类来源进入统一告警实例模型，不再拆成两套页面或两套历史。

## 3. 接口清单

### 3.1 运行总览 `/edge/monitor`

说明：

- V1 运行总览优先复用现有 `monitor` 聚合能力。
- 后续若首页需要独立结构，可新增 `/edge/overview/**`，但不建议现在和 `monitor` 并行造两套。

| 接口 | 方法 | 路径 | 状态 | 来源 |
|------|------|------|------|------|
| 运行总览概览 | GET | `/edge/monitor/overview` | current | `EdgeMonitorController#getOverview` |
| 心跳分页 | GET | `/edge/monitor/heartbeat/page` | current | `EdgeMonitorController#getHeartbeatPage` |
| 设备异常分页 | GET | `/edge/monitor/device-abnormal/page` | current | `EdgeMonitorController#getDeviceAbnormalPage` |
| 系统状态分页 | GET | `/edge/monitor/system-status/page` | current | `EdgeMonitorController#getSystemStatusPage` |
| 节点详情 | GET | `/edge/monitor/node/{nodeId}/detail` | current | `EdgeMonitorController#getNodeDetail` |
| 节点趋势 | GET | `/edge/monitor/node/{nodeId}/trend` | current | `EdgeMonitorController#getNodeTrend` |

建议首页总览卡片至少聚合：

| 字段 | 类型 | 说明 |
|------|------|------|
| `onlineNodeCount` | Long | 在线节点数 |
| `onlineDeviceCount` | Long | 在线设备数 |
| `abnormalDeviceCount` | Long | 异常设备数 |
| `activeAlertCount` | Long | 活跃告警数 |
| `failedTaskCount` | Long | 失败任务数 |
| `controlFailedCount` | Long | 控制失败数 |

补充说明：

- `onlineDeviceCount`、`failedTaskCount`、`controlFailedCount` 当前可能需要在现有 overview 基础上扩展。
- 设计阶段不要求现在就修改现有 `EdgeMonitorOverviewRespVO`，但后续实现要统一口径。

### 3.2 实时告警 `/edge/alert/realtime`

| 接口 | 方法 | 路径 | 状态 | 来源 |
|------|------|------|------|------|
| 实时告警分页 | GET | `/edge/alert/realtime/page` | planned | `docs/design/边云监控与告警控制中心/设计方案.md` |
| 实时告警详情 | GET | `/edge/alert/{alertId}` | planned | 同上 |
| 告警确认 | POST | `/edge/alert/{alertId}/ack` | planned | 同上 |
| 告警关闭 | POST | `/edge/alert/{alertId}/close` | planned | 同上 |
| 告警静默 | POST | `/edge/alert/{alertId}/silence` | planned | 同上 |

`GET /edge/alert/realtime/page` 请求参数建议：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `pageNo` | Integer | 是 | 页码 |
| `pageSize` | Integer | 是 | 每页条数 |
| `sourceType` | String | 否 | `EDGE_REPORTED` / `CLOUD_EVALUATED` |
| `severity` | String | 否 | `INFO` / `WARN` / `CRITICAL` |
| `alertType` | String | 否 | 告警类型 |
| `status` | String | 否 | 默认建议只查 `OPEN` / `ACKED` |
| `nodeId` | Long | 否 | 节点筛选 |
| `deviceId` | Long | 否 | 设备筛选 |
| `keyword` | String | 否 | 节点名/设备名/告警摘要搜索 |

`GET /edge/alert/realtime/page` 返回项建议：

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | Long | 告警实例 ID |
| `alertKey` | String | 告警业务键 |
| `sourceType` | String | 告警来源 |
| `alertType` | String | 告警类型 |
| `severity` | String | 严重级别 |
| `status` | String | 当前状态 |
| `nodeId` | Long | 节点 ID |
| `nodeName` | String | 节点名称 |
| `deviceId` | Long | 设备 ID |
| `deviceName` | String | 设备名称 |
| `taskKey` | String | 关联任务 Key |
| `strategyId` | Long | 命中的策略 ID |
| `summary` | String | 摘要 |
| `detailJson` | Object | 详情 |
| `firstTriggeredAt` | String | 首次触发时间 |
| `lastTriggeredAt` | String | 最近触发时间 |
| `recommendedAction` | String | 推荐动作说明 |

动作接口请求体建议：

#### `POST /edge/alert/{alertId}/ack`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `remark` | String | 否 | 确认备注 |

#### `POST /edge/alert/{alertId}/close`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `reason` | String | 是 | 关闭原因 |

#### `POST /edge/alert/{alertId}/silence`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `durationMinutes` | Integer | 是 | 静默时长 |
| `reason` | String | 否 | 静默原因 |

### 3.3 告警历史 `/edge/alert/history`

| 接口 | 方法 | 路径 | 状态 | 来源 |
|------|------|------|------|------|
| 告警历史分页 | GET | `/edge/alert/history/page` | planned | `docs/design/边云监控与告警控制中心/设计方案.md` |
| 告警时间线 | GET | `/edge/alert/{alertId}/timeline` | planned | 同上 |

`GET /edge/alert/history/page` 请求参数建议：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `pageNo` | Integer | 是 | 页码 |
| `pageSize` | Integer | 是 | 每页条数 |
| `sourceType` | String | 否 | 告警来源 |
| `severity` | String | 否 | 告警级别 |
| `alertType` | String | 否 | 告警类型 |
| `nodeId` | Long | 否 | 节点筛选 |
| `deviceId` | Long | 否 | 设备筛选 |
| `strategyId` | Long | 否 | 策略筛选 |
| `status` | String | 否 | 生命周期状态 |
| `beginTime` | String | 否 | 开始时间 |
| `endTime` | String | 否 | 结束时间 |
| `keyword` | String | 否 | 摘要搜索 |

`GET /edge/alert/{alertId}/timeline` 返回项建议：

| 字段 | 类型 | 说明 |
|------|------|------|
| `eventId` | Long | 时间线事件 ID |
| `eventType` | String | `TRIGGERED` / `ACKED` / `RECOVERED` / `CLOSED` / `CONTROL_TRIGGERED` / `CONTROL_SUCCEEDED` / `CONTROL_FAILED` |
| `eventTime` | String | 事件时间 |
| `operator` | String | 操作人或系统 |
| `content` | String | 事件说明 |
| `detailJson` | Object | 附加明细 |

### 3.4 告警策略 `/edge/alert/strategy`

| 接口 | 方法 | 路径 | 状态 | 来源 |
|------|------|------|------|------|
| 策略分页 | GET | `/edge/alert/strategy/page` | planned | `docs/design/边云监控与告警控制中心/设计方案.md` |
| 策略详情 | GET | `/edge/alert/strategy/get?id={id}` | planned | 同上 |
| 创建策略 | POST | `/edge/alert/strategy/create` | planned | 同上 |
| 更新策略 | PUT | `/edge/alert/strategy/update` | planned | 同上 |
| 删除策略 | DELETE | `/edge/alert/strategy/delete?id={id}` | planned | 同上 |
| 启用策略 | POST | `/edge/alert/strategy/{id}/enable` | planned | 同上 |
| 停用策略 | POST | `/edge/alert/strategy/{id}/disable` | planned | 同上 |

策略请求体建议：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | String | 是 | 策略名称 |
| `scopeType` | String | 是 | `NODE` / `DEVICE` / `DEVICE_TYPE` / `GROUP` |
| `scopeIds` | Long[] | 否 | 作用对象 ID 列表 |
| `alertType` | String | 是 | 告警类型 |
| `severity` | String | 是 | 告警级别 |
| `triggerRule` | Object | 是 | 触发条件 |
| `recoverRule` | Object | 否 | 恢复条件 |
| `actionType` | String | 是 | `ALERT_ONLY` / `NOTIFY` / `AUTO_CONTROL` / `CREATE_TASK` |
| `actionConfig` | Object | 否 | 动作配置 |
| `priority` | Integer | 否 | 优先级 |
| `enabled` | Boolean | 是 | 是否启用 |
| `remark` | String | 否 | 备注 |

`triggerRule` 建议字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| `metric` | String | 监控指标或事件名 |
| `operator` | String | `GT` / `GTE` / `LT` / `LTE` / `EQ` / `NEQ` |
| `threshold` | String | 阈值 |
| `durationSeconds` | Integer | 持续时长 |
| `consecutiveTimes` | Integer | 连续次数 |
| `timeWindowMinutes` | Integer | 时间窗口 |

`actionConfig` 建议字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| `notifyChannels` | String[] | 通知渠道 |
| `controlType` | String | 控制类型 |
| `taskType` | String | 若动作走任务，映射到任务类型 |
| `resourceId` | Long | 关联资源 |
| `inlinePayload` | Object | 控制载荷 |

### 3.5 硬件控制 `/edge/control`

说明：

- 硬件控制是独立业务入口，但执行载体优先复用现有 `/edge/task/dispatch`、`/edge/task/{taskKey}`、`/edge/task/{taskKey}/logs`。
- 不建议再平行建设第二套“控制任务表 + 控制日志表”语义。

| 接口 | 方法 | 路径 | 状态 | 来源 |
|------|------|------|------|------|
| 控制下发 | POST | `/edge/control/dispatch` | planned | `docs/design/边云监控与告警控制中心/设计方案.md` |
| 控制记录分页 | GET | `/edge/control/page` | planned | 同上 |
| 控制详情 | GET | `/edge/control/{controlId}` | planned | 同上 |
| 取消控制 | POST | `/edge/control/{controlId}/cancel` | planned | 同上 |
| 重试控制 | POST | `/edge/control/{controlId}/retry` | planned | 同上 |

`POST /edge/control/dispatch` 请求体建议：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `nodeId` | Long | 是 | 目标节点 |
| `deviceId` | Long | 否 | 目标设备 |
| `controlType` | String | 是 | `REBOOT_NODE` / `RESTART_SERVICE` / `SWITCH_MODE` / `REFRESH_CONFIG` / `CUSTOM_COMMAND` |
| `sourceType` | String | 是 | `MANUAL` / `ALERT_LINKED` |
| `alertId` | Long | 否 | 若由告警触发，回填关联告警 |
| `taskType` | String | 是 | 复用任务类型 |
| `resourceId` | Long | 否 | 关联资源 |
| `inlinePayload` | Object | 否 | 内联控制参数 |
| `reason` | String | 否 | 下发原因 |

`GET /edge/control/page` 返回项建议：

| 字段 | 类型 | 说明 |
|------|------|------|
| `controlId` | Long | 控制记录 ID |
| `taskKey` | String | 关联任务 Key |
| `nodeId` | Long | 节点 ID |
| `nodeName` | String | 节点名称 |
| `deviceId` | Long | 设备 ID |
| `deviceName` | String | 设备名称 |
| `controlType` | String | 控制类型 |
| `sourceType` | String | `MANUAL` / `ALERT_LINKED` |
| `alertId` | Long | 关联告警 |
| `status` | String | 控制状态 |
| `result` | String | 执行结果摘要 |
| `createdAt` | String | 创建时间 |
| `finishedAt` | String | 完成时间 |

### 3.6 与现有任务中心的关系 `/edge/task`

| 接口 | 方法 | 路径 | 状态 | 来源 |
|------|------|------|------|------|
| 任务统计 | GET | `/edge/task/statistics` | current | `EdgeTaskController#getStatistics` |
| 任务下发 | POST | `/edge/task/dispatch` | current | `EdgeTaskController#dispatch` |
| 任务分页 | GET | `/edge/task/page` | current | `EdgeTaskController#getTaskPage` |
| 任务详情 | GET | `/edge/task/{taskKey}` | current | `EdgeTaskController#getTaskDetail` |
| 任务日志 | GET | `/edge/task/{taskKey}/logs` | current | `EdgeTaskController#getTaskLogs` |
| 取消任务 | POST | `/edge/task/{taskKey}/cancel` | current | `EdgeTaskController#cancelTask` |
| 重试任务 | POST | `/edge/task/{taskKey}/retry` | current | `EdgeTaskController#retryTask` |

建议约束：

- `control` 不直接面向 EMQX publish，而是统一落成 `task`。
- `taskType` 应扩展支持硬件控制语义，不把页面直接暴露为底层 `commandKey` 拼装器。
- 控制结果回写后，应同时更新告警历史时间线。

## 4. 枚举与字段口径

### 4.1 告警来源

| 枚举 | 含义 |
|------|------|
| `EDGE_REPORTED` | 边缘端/设备端主动上报 |
| `CLOUD_EVALUATED` | 云端派生计算 |

### 4.2 告警状态

| 枚举 | 含义 |
|------|------|
| `OPEN` | 告警中 |
| `ACKED` | 已确认待恢复 |
| `RECOVERED` | 已恢复 |
| `CLOSED` | 已关闭 |
| `SILENCED` | 已静默 |

### 4.3 告警历史事件

| 枚举 | 含义 |
|------|------|
| `TRIGGERED` | 触发 |
| `RETRIGGERED` | 再次触发 |
| `ACKED` | 确认 |
| `RECOVERED` | 恢复 |
| `CLOSED` | 关闭 |
| `CONTROL_TRIGGERED` | 触发控制 |
| `CONTROL_SUCCEEDED` | 控制成功 |
| `CONTROL_FAILED` | 控制失败 |

### 4.4 策略作用范围

| 枚举 | 含义 |
|------|------|
| `NODE` | 节点 |
| `DEVICE` | 设备 |
| `DEVICE_TYPE` | 设备类型 |
| `GROUP` | 分组 |

### 4.5 策略动作

| 枚举 | 含义 |
|------|------|
| `ALERT_ONLY` | 仅生成告警 |
| `NOTIFY` | 发送通知 |
| `AUTO_CONTROL` | 自动发起控制 |
| `CREATE_TASK` | 自动创建任务 |

### 4.6 控制类型

| 枚举 | 含义 |
|------|------|
| `REBOOT_NODE` | 重启节点 |
| `RESTART_SERVICE` | 重启服务 |
| `SWITCH_MODE` | 切换模式 |
| `REFRESH_CONFIG` | 刷新配置 |
| `CUSTOM_COMMAND` | 自定义命令 |

## 5. 契约一致性检查结论

- OpenAPI 来源：未读取实时 `/v3/api-docs`
- 前端检查范围：当前仅覆盖 `moon_cloud_frontend/src/views/edge/**` 与未来建议的 `src/api/edge/alert.ts`、`control.ts`
- 接口状态：状态未确认
- 状态确认人：未确认
- 状态更新时间：2026-05-08
- 结论：**未验证**

当前已知一致性结论：

| 级别 | 后端契约 | 前端位置 | 问题 | 建议 |
|------|----------|----------|------|------|
| P1 | `/edge/monitor/**` 现有接口可支撑运行总览大部分读能力 | 未来 `views/edge/overview` | 现有 overview 字段未覆盖在线设备数、控制失败数 | 后续补充 overview 聚合字段或单独增加首页聚合接口 |
| P1 | `/edge/task/**` 已具备执行载体能力 | 未来 `views/edge/control` | 当前任务语义偏通用，不是面向“硬件控制”直接建模 | 由 `control` 子域做请求适配，不让页面直接拼装底层任务载荷 |
| P1 | `/edge/alert/**` 仍为目标态接口 | 未来 `views/edge/alert/**` | 当前代码未见真实 Controller | 先按本文档收口字段，再在实现时生成真实 OpenAPI |
| P2 | 实时告警与历史告警页面都依赖统一告警实例与时间线 | 未来 `src/api/edge/alert.ts` | 当前仅有 `edge_monitor_alert` 当前态模型，缺历史时间线模型 | 后续新增告警历史事件表与对应接口 |

## 6. 验证与未确认项

- 已验证：静态确认 `edge/runtime`、`edge/monitor`、`edge/task` 现有接口路径与职责。
- 未验证：未读取实时 OpenAPI；未执行接口联调；未执行后端编译；未执行前端构建；未验证边缘端真实告警上报 payload。
- 未确认项：
  - `/edge/alert/**` 与 `/edge/control/**` 的最终错误码
  - 告警历史事件表的最终字段
  - 控制记录是独立表还是任务视图映射
  - 边缘端真实告警事件字段名、时间格式、幂等键

## 变更日志

| 日期 | 变更摘要 | 变更来源 |
|------|----------|----------|
| 2026-05-08 | 新增“边云监控与告警控制中心”API 文档，覆盖运行总览、实时告警、历史、策略、硬件控制与任务协同 | 用户要求“接口的话直接生成 API 规范文档” |
