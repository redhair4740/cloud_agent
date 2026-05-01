---
lifecycle: record
topic: Edge MQTT 测试数据
type: 测试数据说明
created: 2026-04-30
status: active
---

# Edge MQTT 测试数据说明

## 1. 使用边界

- 本文档只保留测试数据的当前使用方式，不保留旧 dated 文档历史。
- `docs_old/test-data/edge-node-mqtt/*.json` 是 MQTT payload 示例，不是 Cloud `/edge/runtime/ingest` 的完整 HTTP envelope。
- 已按用户要求原样迁移 `docs_old/test-data/edge-node-mqtt/*.json`，包括旧节点 ID、现场地址、任务号和凭证类样例信息。
- 这些 JSON 是旧联调样例，不代表当前测试环境仍可直接复用；使用前请按当前节点凭证和 Topic 更新。

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
| `90-错误硬件指纹心跳.json` | Edge -> Cloud | 异常样例 | 预期 Cloud 因硬件指纹不一致拒收 |
| `91-错误设备身份心跳.json` | Edge -> Cloud | 异常样例 | 预期 Cloud 因设备身份上下文不一致拒收 |

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
  "hardwareFingerprint": "${payload.data.hardware_fingerprint}",
  "topic": "${topic}",
  "occurredAt": ${payload.occurred_at},
  "payload": ${payload}
}
```

校验重点：

- `occurredAt` 是数字时不要加引号。
- Rule SQL 必须先保证字段存在，禁止输出 `undefined`。
- `clientId` 必须等于 `edge-node:{deviceId}`。
- `topic` 必须与 eventType 对应的 Topic 后缀匹配。

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
- 已迁移：`docs_old/test-data/edge-node-mqtt/*.json` 共 11 个样例已原样复制到本目录。
- 未验证：未在真实 EMQX 发布，未调用 Cloud 接口。
- 未确认项：旧样例里的 `deviceId`、`topicRoot`、secret、EMQX 地址是否仍适用于当前测试环境。

## 变更日志

| 日期 | 变更摘要 | 变更来源 |
|------|----------|----------|
| 2026-04-30 | 初始重整旧测试数据目录说明 | `docs_old/test-data/edge-node-mqtt/README.md` 与当前源码 |
| 2026-04-30 | 按用户要求原样迁移 11 个 MQTT JSON payload 样例，并补充样例索引 | `docs_old/test-data/edge-node-mqtt/*.json` |
