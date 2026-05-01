---
lifecycle: living
topic: Edge边缘模块
type: API文档
created: 2026-04-30
last_updated: 2026-04-30
status: active
supersedes:
  - docs_old/api/2026-04-24/23-13-22-API文档-Edge边缘模块API文档.md
  - docs_old/api/2026-04-28/13-01-47-API文档-边缘监控与任务流水接口.md
related:
  - docs_codex/design/边云协同Edge全链路/设计方案.md
  - docs_codex/design/边缘监控与任务流水/设计方案.md
---

# Edge 边缘模块 API 文档

## 1. 文档说明

- 契约来源：当前源码静态扫描。
- OpenAPI 来源：未读取实时 `/v3/api-docs`。
- 适用模块：`moon_cloud_backend/vmesh-module-edge`、`moon_cloud_frontend/src/api/edge`。
- 验证口径：本次仅做文件级静态核对，未执行接口联调、未编译验证。
- 统一前缀：管理后台接口默认由网关追加 `/admin-api`，Controller 路径从 `/edge/**` 开始。
- 统一响应：除认证回调等特殊方法外，业务 Controller 使用 `CommonResult<T>` 或 `CommonResult<PageResult<T>>`。

## 2. 接口清单

### 2.1 节点管理 `/edge/node`

| 接口 | 方法 | 路径 | 状态 | 来源 |
|------|------|------|------|------|
| 创建节点 | POST | `/edge/node/create` | current | `EdgeNodeController#createEdgeNode`、`src/api/edge/node.ts` |
| 更新节点 | PUT | `/edge/node/update` | current | `EdgeNodeController#updateEdgeNode` |
| 删除节点 | DELETE | `/edge/node/delete?id={id}` | current | `EdgeNodeController#deleteEdgeNode` |
| 节点详情 | GET | `/edge/node/get?id={id}` | current | `EdgeNodeController#getEdgeNode` |
| 节点分页 | GET | `/edge/node/page` | current | `EdgeNodeController#getEdgeNodePage` |
| 节点统计 | GET | `/edge/node/stats` | current | `EdgeNodeController#getEdgeNodeStats` |
| 节点凭证 | GET | `/edge/node/credential?nodeId={nodeId}` | current | `EdgeNodeController#getEdgeNodeCredential` |
| 精简列表 | GET | `/edge/node/simple-list` | current | `EdgeNodeController#getEdgeNodeSimpleList` |
| 刷新凭证 | PUT | `/edge/node/refresh-credential?nodeId={nodeId}` | current | `EdgeNodeController#refreshCredential` |
| 导入模板 | GET | `/edge/node/get-import-template` | current | `EdgeNodeController#getImportTemplate` |
| 导入节点 | POST | `/edge/node/import` | current | `EdgeNodeController#importExcel` |

关键字段：

| 字段 | 说明 |
|------|------|
| `enabledStatus` | 节点启用状态，只表示准入开关 |
| `activationStatus` | 当前凭证版本激活结果 |
| `registrationStatus` | 注册链路阶段 |
| `connectionState` | MQTT 连接态 |
| `runtimeStatus` | 运行健康态 |
| `topicRoot` | MQTT Topic 根路径 |

### 2.2 设备与分组

| 主题 | 方法与路径 | 状态 | 来源 |
|------|------------|------|------|
| 设备 CRUD | `POST /edge/device/create`、`PUT /edge/device/update`、`DELETE /edge/device/delete`、`GET /edge/device/get`、`GET /edge/device/page` | current | `EdgeDeviceController`、`src/api/edge/device.ts` |
| 设备导出 | `GET /edge/device/export-excel` | current | `EdgeDeviceController#exportExcel` |
| 分组 CRUD | `POST /edge/group/create`、`PUT /edge/group/update`、`DELETE /edge/group/delete`、`GET /edge/group/get`、`GET /edge/group/page` | current | `EdgeDeviceGroupController`、`src/api/edge/group.ts` |
| 分组精简列表 | `GET /edge/group/simple-list` | current | `EdgeDeviceGroupController#getSimpleList` |

### 2.3 资源中心

| 接口 | 方法 | 路径 | 状态 | 来源 |
|------|------|------|------|------|
| 创建资源 | POST | `/edge/resource/create` | current | `EdgeResourceController`、`src/api/edge/resource.ts` |
| 更新资源 | PUT | `/edge/resource/update` | current | `EdgeResourceController` |
| 删除资源 | DELETE | `/edge/resource/delete?id={id}` | current | `EdgeResourceController` |
| 资源详情 | GET | `/edge/resource/get?id={id}` | current | `EdgeResourceController` |
| 精简列表 | GET | `/edge/resource/simple-list` | current | `EdgeResourceController` |
| 旧版资源兼容 | GET/POST/PUT/DELETE | `/edge/resource-legacy/**` | compatible | `EdgeDispatchResourceController` |

### 2.4 运行时 `/edge/runtime`

| 接口 | 方法 | 路径 | 状态 | 来源 |
|------|------|------|------|------|
| EMQX 鉴权 | POST | `/edge/runtime/authenticate` | current | `EdgeRuntimeController#authenticate` |
| EMQX 上行入站 | POST | `/edge/runtime/ingest` | current | `EdgeRuntimeController#ingest` |
| 重放事件 | POST | `/edge/runtime/replay-event` | current | `EdgeRuntimeController#replayEvent`、`src/api/edge/runtime.ts` |

鉴权请求字段参考 `EdgeRuntimeAuthReqVO`：`clientid`、`username`、`password`、`peerhost`、`proto_ver`。

ingest 请求要求：

- Header 必须包含 `X-EMQX-SIGNATURE`。
- Body 使用 `EdgeRuntimeIngestReqVO`，包含 `eventType`、`eventId/messageId`、`clientId`、`username`、`deviceId`、`hardwareFingerprint`、`topic`、`occurredAt`、`payload` 等运行时上下文。
- 允许事件类型包括 `register`、`heartbeat`、`device.report`、`task_progress`、`task.progress`，以及 EMQX 连接事件。

### 2.5 监控中心 `/edge/monitor`

| 接口 | 方法 | 路径 | 状态 | 来源 |
|------|------|------|------|------|
| 概览 | GET | `/edge/monitor/overview` | current | `EdgeMonitorController#getOverview` |
| 注册链路分页 | GET | `/edge/monitor/registration/page` | compatible | `EdgeMonitorController#getRegistrationPage` |
| 心跳分页 | GET | `/edge/monitor/heartbeat/page` | current | `EdgeMonitorController#getHeartbeatPage` |
| 设备异常分页 | GET | `/edge/monitor/device-abnormal/page` | current | `EdgeMonitorController#getDeviceAbnormalPage` |
| 系统状态分页 | GET | `/edge/monitor/system-status/page` | current | `EdgeMonitorController#getSystemStatusPage` |
| 高负载兼容 | GET | `/edge/monitor/high-load/page` | compatible | `EdgeMonitorController#getHighLoadPage` |
| 告警分页 | GET | `/edge/monitor/alert/page` | current | `EdgeMonitorController#getAlertPage` |
| 节点详情 | GET | `/edge/monitor/node/{nodeId}/detail` | current | `EdgeMonitorController#getNodeDetail` |
| 节点趋势 | GET | `/edge/monitor/node/{nodeId}/trend` | current | `EdgeMonitorController#getNodeTrend` |

### 2.6 任务中心 `/edge/task`

| 接口 | 方法 | 路径 | 状态 | 来源 |
|------|------|------|------|------|
| 任务统计 | GET | `/edge/task/statistics` | current | `EdgeTaskController#getStatistics` |
| 任务下发 | POST | `/edge/task/dispatch` | current | `EdgeTaskController#dispatch` |
| 任务分页 | GET | `/edge/task/page` | current | `EdgeTaskController#getTaskPage` |
| 任务详情 | GET | `/edge/task/{taskKey}` | current | `EdgeTaskController#getTaskDetail` |
| 任务日志 | GET | `/edge/task/{taskKey}/logs` | current | `EdgeTaskController#getTaskLogs` |
| 取消任务 | POST | `/edge/task/{taskKey}/cancel` | current | `EdgeTaskController#cancelTask` |
| 重试任务 | POST | `/edge/task/{taskKey}/retry` | current | `EdgeTaskController#retryTask` |

## 3. 枚举与字段口径

| 字段/枚举 | 类型 | 说明 | 来源 |
|-----------|------|------|------|
| `taskType` | String | `OTA`、`ALGORITHM`、`CONFIG`、`REBOOT` 等 | `EdgeTaskDispatchReqVO`、`EdgeTaskServiceImpl#resolveCommandKey` |
| `commandKey` | String | `ota_update`、`algorithm_update`、`config_update`、`reboot`、`custom_command` | `EdgeTaskServiceImpl` |
| `deviceAbnormal.status` | String | `OFFLINE`、`STREAM_LOST`、`FRAME_DROP`、`AUTH_FAILED` | `EdgeMonitorAbnormalDeviceRespVO` 与旧接口文档 |
| `healthLevel` | String | `GOOD`、`WARN`、`CRITICAL` 等健康等级 | `EdgeMonitorSystemStatusRespVO` |
| `topicRoot` | String | `moon/{env}/tenants/{tenantId}/edge/{version}/nodes/{deviceId}` | `EdgeTopicService` |

## 4. 验证与未确认项

- 已验证：静态确认 Controller 路径、前端 SDK 路径、VO 关键字段。
- 未验证：未读取实时 OpenAPI，未执行接口联调，未执行后端编译，未执行前端构建。
- 未确认项：接口权限码、错误码细节、分页参数完整字段、真实线上菜单权限是否已全部配置。

## 变更日志

| 日期 | 变更摘要 | 变更来源 |
|------|----------|----------|
| 2026-04-30 | 合并 Edge API 旧文档和监控任务接口文档，按当前源码重整 | `docs_old/api/**Edge*`、`Edge*Controller`、`src/api/edge/*.ts` |
