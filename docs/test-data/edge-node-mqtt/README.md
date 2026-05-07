---
lifecycle: record
topic: Edge MQTT 测试数据
type: 测试数据说明
created: 2026-04-30
status: active
---

# Edge MQTT 测试数据说明

## 1. 使用边界

- 本目录只保留“当前可直接复制使用”的示例数据，不再保留历史迁移口径。
- 除 `10`、`11` 外，其余 `01`-`09`、`90`、`91` 都是 MQTT payload，不是 Cloud `/edge/runtime/ingest` 的完整 HTTP envelope。
- 本目录所有示例统一使用同一套节点身份：`deviceId=device-aa034de0a2f147faab579ba0b45db13f`、`hardwareFingerprint=hwfp-device-aa034de0a2f147faab579ba0b45db13f`。
- 使用前只需要替换当前环境真实的 `deviceId`、`hardwareFingerprint`、`secret`、`tenantId/topicRoot` 即可。

## 2. 当前 Topic 与接口

| 场景 | Topic | Cloud 接口 | 预期 |
|------|-------|------------|------|
| 节点连接认证 | MQTT CONNECT | `POST /admin-api/edge/runtime/authenticate` | EMQX 调 Cloud 完成认证并拿到 ACL |
| 节点注册激活 | `{topicRoot}/lifecycle/register` | `POST /admin-api/edge/runtime/ingest` | 首次绑定硬件指纹，节点进入已激活 |
| 节点心跳在线 | `{topicRoot}/telemetry/heartbeat` | `POST /admin-api/edge/runtime/ingest` | 更新运行态和心跳指标 |
| 设备快照上报 | `{topicRoot}/telemetry/device-report` | `POST /admin-api/edge/runtime/ingest` | 更新外设状态或异常信息 |
| 任务进度上报 | `{topicRoot}/events/task-progress` | `POST /admin-api/edge/runtime/ingest` | 更新任务进度、状态和日志 |
| 云端配置下发 | `{topicRoot}/commands/config_update` | Cloud 调 EMQX `/api/v5/publish` | 边缘端收到配置更新命令 |
| 云端重启下发 | `{topicRoot}/commands/reboot` | Cloud 调 EMQX `/api/v5/publish` | 边缘端收到重启命令 |

### 2.1 已跑通的模拟 Topic（心跳）

> 目的：把「当前已跑通」的模拟 Topic 和样例数据固化到文档，方便边缘端按同一口径对齐。

- 已跑通 Topic（`eventType=heartbeat`，后缀对应关系见 `moon_cloud_backend/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/service/runtime/EdgeTopicService.java#resolveEventTopicSuffix:75`）：

```text
moon/dev/tenants/1/edge/v1/nodes/device-aa034de0a2f147faab579ba0b45db13f/telemetry/heartbeat
```

- MQTT 连接参数（与本文「MQTT 连接参数」一致）：

```text
clientId = edge-node:device-aa034de0a2f147faab579ba0b45db13f
username = device-aa034de0a2f147faab579ba0b45db13f
password = 节点凭证 secret（禁止写入文档）
```

- 下发（Cloud -> Edge）订阅 Topic（用于接收 `{topicRoot}/commands/#`；tenantId 使用通配符以兼容多租户）：

```text
moon/dev/tenants/+/edge/v1/nodes/device-aa034de0a2f147faab579ba0b45db13f/#
```

- 发布 payload（直接使用本目录样例文件 `02-节点心跳在线.json`，作为 MQTT publish 的消息体）：

```json
{
  "event_type": "heartbeat",
  "message_id": "heartbeat-device-aa034de0a2f147faab579ba0b45db13f-001",
  "occurred_at": 1776818460000,
  "hardware_fingerprint": "hwfp-device-aa034de0a2f147faab579ba0b45db13f",
  "runtime_status": "ONLINE",
  "software_version": "edge-runtime-test-1.0.0",
  "agent_version": "vmesh-edge-agent-1.0.0",
  "heartbeat_interval_sec": 20,
  "metrics": {
    "cpu_usage_pct": 35.2,
    "memory_usage_pct": 48.6,
    "gpu_usage_pct": 12.0,
    "storage_usage_pct": 41.5,
    "temperature_c": 55.4
  },
  "network": {
    "edge_rtt_ms": 20.5,
    "packet_loss_pct": 0.0,
    "cloud_probe_rtt_ms": 22.0
  }
}
```

## 3. 样例文件索引

| 文件 | 方向 | 场景 | 说明 |
|------|------|------|------|
| `01-节点注册激活.json` | Edge -> Cloud | 节点注册激活 | 发布到 `{topicRoot}/lifecycle/register` |
| `02-节点心跳在线.json` | Edge -> Cloud | 节点心跳在线 | 发布到 `{topicRoot}/telemetry/heartbeat` |
| `03-设备快照上报.json` | Edge -> Cloud | 设备快照上报 | 发布到 `{topicRoot}/telemetry/device-report` |
| `04-任务进度上报.json` | Edge -> Cloud | 通用任务进度 | 发布到 `{topicRoot}/events/task-progress` |
| `05-节点心跳告警.json` | Edge -> Cloud | 资源/运行告警心跳 | 发布到 `{topicRoot}/telemetry/heartbeat` |
| `06-云端下发配置更新.json` | Cloud -> Edge | 配置更新命令 | 发布到 `{topicRoot}/commands/config_update` |
| `07-云端下发重启.json` | Cloud -> Edge | 重启命令 | 发布到 `{topicRoot}/commands/reboot` |
| `08-重启任务完成上报.json` | Edge -> Cloud | 重启任务成功回执 | 发布到 `{topicRoot}/events/task-progress` |
| `09-配置更新任务完成上报.json` | Edge -> Cloud | 配置更新成功回执 | 发布到 `{topicRoot}/events/task-progress` |
| `10-client-connected-ingest.json` | EMQX -> Cloud | 连接建立事件 | `POST /admin-api/edge/runtime/ingest` 的 HTTP envelope 样例 |
| `11-client-disconnected-ingest.json` | EMQX -> Cloud | 连接断开事件 | `POST /admin-api/edge/runtime/ingest` 的 HTTP envelope 样例 |
| `90-错误硬件指纹心跳.json` | Edge -> Cloud | 异常样例 | 预期 Cloud 因硬件指纹不一致拒收 |
| `91-错误设备身份心跳.json` | Edge -> Cloud | 异常样例 | 预期 Cloud 因设备身份上下文不一致拒收 |

约定：

- `01`、`02`、`03`、`05`、`90`、`91` 现在都显式带 `event_type`，这样可直接复用本文的 HTTP Sink 模板。
- `06`、`07` 是 Cloud -> Edge 下行命令消息体，不会发送到 `/edge/runtime/ingest`。
- `06` 的内层 `payload` 对应前端“配置下发”表单提交的 `inlinePayload` JSON 对象，经后端 `EdgeTaskServiceImpl#buildPayload` 原样透传。
- `07` 的内层 `payload` 对应后端默认重启载荷，当前源码会给出 `versionText` 和 `timeoutMinutes` 两个字段。
- `10`、`11` 是 EMQX 生命周期事件的 HTTP ingest envelope，不走 MQTT 业务 Topic。

下行命令 envelope 口径：

- 外层字段 `message_id`、`occurred_at`、`task_key`、`command_key`、`node_id`、`device_id`、`client_id` 由后端 `EdgeTaskServiceImpl#buildCommandEnvelope` 固定生成。
- 下行 MQTT publish 到 EMQX 时，真实请求体还会带 `topic`、`payload`、`qos=1`、`retain=false`，其中这里保存的 JSON 文件就是 `payload` 的内容本体。

### 3.1 EMQX Publish 完整请求示例

配置更新命令完整请求：

```json
{
  "topic": "moon/dev/tenants/1/edge/v1/nodes/device-aa034de0a2f147faab579ba0b45db13f/commands/config_update",
  "payload": "{\"occurred_at\":1777526539722,\"device_id\":\"device-aa034de0a2f147faab579ba0b45db13f\",\"payload\":{\"report_interval_sec\":20,\"log_level\":\"INFO\",\"camera\":{\"exposure_mode\":\"auto\",\"frame_rate\":15},\"network\":{\"probe_host\":\"cloud.example.internal\",\"probe_interval_sec\":30}},\"task_key\":\"TASK-2049720986113327104\",\"command_key\":\"config_update\",\"message_id\":\"cmd-2860591e8c454be780ae80978c4207ae\",\"client_id\":\"edge-node:device-aa034de0a2f147faab579ba0b45db13f\",\"node_id\":10}",
  "qos": 1,
  "retain": false
}
```

重启命令完整请求：

```json
{
  "topic": "moon/dev/tenants/1/edge/v1/nodes/device-aa034de0a2f147faab579ba0b45db13f/commands/reboot",
  "payload": "{\"occurred_at\":1777526556739,\"device_id\":\"device-aa034de0a2f147faab579ba0b45db13f\",\"payload\":{\"versionText\":null,\"timeoutMinutes\":30},\"task_key\":\"TASK-2049721057496186880\",\"command_key\":\"reboot\",\"message_id\":\"cmd-2bd9aef343d74943be8ced5b2fff09ec\",\"client_id\":\"edge-node:device-aa034de0a2f147faab579ba0b45db13f\",\"node_id\":10}",
  "qos": 1,
  "retain": false
}
```

说明：

- 这里的 `payload` 是字符串，不是嵌套 JSON 对象；后端 `publishCommand(...)` 会先把命令 envelope 做一次 `JsonUtils.toJsonString(...)`，再放进 EMQX `/publish` 请求体。
- `topic` 由 `EdgeTopicService#resolveCommandTopic` 生成，格式是 `{topicRoot}/commands/{commandKey}`。
- 如果你在 EMQX Dashboard / API 里手工模拟下发，也应按这个完整结构发，而不是只发内层 `payload` 对象。

## 4. MQTT 连接参数

```text
clientId = edge-node:{deviceId}
username = {deviceId}
password = 节点凭证 secret
topicRoot = moon/{env}/tenants/{tenantId}/edge/{version}/nodes/{deviceId}
```

要求：

- `deviceId` 必须来自节点当前 ACTIVE 凭证。
- `password` 不写入文档和仓库。
- `hardwareFingerprint` 在首次注册后必须保持一致。
- `topicRoot` 以 `EdgeTopicService` 生成或节点台账保存值为准。

## 5. HTTP Sink 映射

推荐 envelope：

```json
{
  "eventType": "${payload.event_type}",
  "eventId": "${payload.message_id}",
  "messageId": "${payload.message_id}",
  "clientId": "${clientid}",
  "username": "${username}",
  "deviceId": "${username}",
  "hardwareFingerprint": "${payload.hardware_fingerprint}",
  "topic": "${topic}",
  "occurredAt": ${payload.occurred_at},
  "payload": ${payload}
}
```

如果 EMQX 规则侧不能保证 `payload.event_type` 一定存在，可改成“按规则分别配置固定 eventType”，例如 heartbeat 规则固定填 `"eventType": "heartbeat"`。

校验重点：

- `occurredAt` 是数字时不要加引号。
- Rule SQL 必须先保证字段存在，禁止输出 `undefined`。
- `clientId` 必须等于 `edge-node:{deviceId}`。
- `topic` 必须与 eventType 对应的 Topic 后缀匹配。
- 入站字段口径以 `moon_cloud_backend/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/runtime/vo/EdgeRuntimeIngestReqVO.java:10` 为准（payload 透传，不在 VO 层做结构约束）。

生命周期事件补充：

- `client.connected`、`client.disconnected` 不是边缘端主动 publish 的业务 payload，而是 EMQX 生命周期事件转发给 Cloud 的 HTTP envelope。
- 这两类事件通常没有 `{topicRoot}/...` 业务 Topic，可只依赖 `clientId`、`username/deviceId` 和 payload 中的 `event` / `event_type` 识别。
- 当前服务端已兼容三种识别顺序：`eventType` 显式字段 > `payload.event_type` / `payload.event` > 业务 Topic 后缀。

时间与连接状态语义：

- 运行态快照、监控页时间字段统一使用 Cloud 接收时间 `observedAt`。
- payload 的 `occurredAt` 仅表示边缘端原始事件时间，保留用于事件追溯，不覆盖监控页接收时刻。
- 若环境未转发 `client.connected` 事件到 Cloud ingest，则“最近连接”为空属于严格语义预期。

## 6. 超时离线场景

超时离线不由单个 payload 直接触发。测试方式：

1. 完成 `authenticate -> register -> heartbeat`。
2. 确认节点进入在线态。
3. 停止继续发布 heartbeat。
4. 等待 `EdgeRuntimeServiceImpl#scanHeartbeatTimeouts` 巡检。
5. 预期节点降级为离线，并打开 `OFFLINE` 告警。

默认阈值：

- `vmesh.edge.runtime.heartbeat-interval-sec=20`
- `vmesh.edge.runtime.heartbeat-timeout-sec=60`
- `vmesh.edge.runtime.heartbeat-scan-interval-ms=30000`

## 7. 验证边界

- 已验证：静态确认当前 Topic 后缀来自 `EdgeTopicService` 与 `EdgeRuntimeServiceImpl#authenticate`。
- 已整理：所有示例的 `deviceId`、`hardwareFingerprint`、`message_id` 前缀和 README 示例已统一为同一套可直接替换的当前口径。
- 未验证：未在真实 EMQX 发布，未调用 Cloud 接口。
- 未确认项：当前测试环境的真实 `tenantId`、`topicRoot`、secret、EMQX 地址。

## 变更日志

| 日期 | 变更摘要 | 变更来源 |
|------|----------|----------|
| 2026-05-06 | 补充已跑通的心跳模拟 Topic 与可直接发布的 payload 示例 | 现场联调结果 + `EdgeTopicService#resolveEventTopicSuffix` |
| 2026-05-07 | 移除历史迁移口径，统一全部示例为当前可直接复制使用的 deviceId / hardwareFingerprint / event_type 口径 | 当前源码与联调约束 |
