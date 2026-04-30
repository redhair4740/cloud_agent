# 边缘节点 MQTT 测试数据

## 测试节点

- `nodeId`: `9`
- `name`: `节点2`
- `serial`: `BYHD-000002`
- `deviceId`: `device-169a7ca9ef444b188eca02342099b82e`
- `clientId`: `edge-node:device-169a7ca9ef444b188eca02342099b82e`
- `brokerEndpoint`: `http://10.94.32.89:8883`
- `topicRoot`: `vmesh/edge/node/device-169a7ca9ef444b188eca02342099b82e`
- `hardwareFingerprint`: `hwfp-device-169a7ca9ef444b188eca02342099b82e`
- `credentialVersion`: `2`

## Cloud 后端接口

- `cloudBaseUrl`: `http://<cloud-host>:18080/admin-api`
- MQTT 连接认证：`POST {cloudBaseUrl}/edge/runtime/authenticate`
- MQTT 消息入站：`POST {cloudBaseUrl}/edge/runtime/ingest`

`/authenticate` 只用于 EMQX HTTP Authentication 连接认证，请求体必须是 `clientid/username/password/peerhost/proto_ver`。

`/ingest` 只用于 EMQX Rule Engine / HTTP Sink 转发业务消息，请求体必须是运行时事件 envelope，包含 `eventType/clientId/username/deviceId/topic/payload` 等字段，并携带请求头 `X-EMQX-SIGNATURE`。

本目录下的 JSON 文件是 MQTT payload，不能直接发到 `/authenticate`。

## 建议发布顺序

| 顺序 | 业务场景 | 文件 | 发布 Topic | 后端接口 | 预期 |
|---|---|---|---|---|---|
| 0 | 节点连接认证 | 无 payload 文件 | MQTT CONNECT | `POST {cloudBaseUrl}/edge/runtime/authenticate` | EMQX 使用连接参数完成认证并拿到 ACL |
| 1 | 节点注册激活 | `01-节点注册激活.json` | `vmesh/edge/node/device-169a7ca9ef444b188eca02342099b82e/register` | `POST {cloudBaseUrl}/edge/runtime/ingest` | 首次绑定硬件指纹，节点变为已激活 |
| 2 | 节点心跳在线 | `02-节点心跳在线.json` | `vmesh/edge/node/device-169a7ca9ef444b188eca02342099b82e/heartbeat` | `POST {cloudBaseUrl}/edge/runtime/ingest` | 运行状态更新为在线 |
| 3 | 设备快照上报 | `03-设备快照上报.json` | `vmesh/edge/node/device-169a7ca9ef444b188eca02342099b82e/device/report` | `POST {cloudBaseUrl}/edge/runtime/ingest` | 外设状态进入运行事件链路 |
| 4 | 任务进度上报 | `04-任务进度上报.json` | `vmesh/edge/node/device-169a7ca9ef444b188eca02342099b82e/event` | `POST {cloudBaseUrl}/edge/runtime/ingest` | 任务进度更新 |
| 5 | 告警心跳 | `05-节点心跳告警.json` | `vmesh/edge/node/device-169a7ca9ef444b188eca02342099b82e/heartbeat` | `POST {cloudBaseUrl}/edge/runtime/ingest` | 运行状态更新为告警；这是资源/运行告警场景，不是超时离线 |
| 6 | 错误硬件指纹 | `90-错误硬件指纹心跳.json` | `vmesh/edge/node/device-169a7ca9ef444b188eca02342099b82e/heartbeat` | `POST {cloudBaseUrl}/edge/runtime/ingest` | 云端拒收 |
| 7 | 错误设备身份 | `91-错误设备身份心跳.json` | `vmesh/edge/node/device-169a7ca9ef444b188eca02342099b82e/heartbeat` | `POST {cloudBaseUrl}/edge/runtime/ingest` | 云端应因上下文不一致拒收 |

## 超时离线场景

超时离线不由某个 payload 文件直接触发。测试方式是先完成 `authenticate -> register -> heartbeat`，确认节点进入在线态后停止继续发布 heartbeat，等待 Cloud 巡检任务处理。

当前后端巡检入口为 `EdgeRuntimeServiceImpl#scanHeartbeatTimeouts`，默认配置 `vmesh.edge.runtime.heartbeat-scan-interval-ms=30000` 毫秒。超时阈值为 `max(vmesh.edge.runtime.heartbeat-timeout-sec, heartbeatIntervalSec * 3)`；默认心跳 `20` 秒、超时 `60` 秒时，停止心跳后约一个超时窗口加一次巡检间隔内会降级为离线，并打开 `OFFLINE` 告警。后续恢复有效心跳后，`OFFLINE` 告警会恢复为 `RECOVERED`。

## 使用说明

这些文件是 MQTT payload，不是 Cloud `/edge/runtime/ingest` 的完整 HTTP envelope。

MQTT 客户端连接参数应使用：

- `host=10.94.32.89`
- `port=8883`
- `clientId=edge-node:device-169a7ca9ef444b188eca02342099b82e`
- `username=device-169a7ca9ef444b188eca02342099b82e`
- `password=38b89e1860d449a1bf5b968a5b2987d9`

EMQX Rule Engine / HTTP Sink 需要把 MQTT 上下文映射到 Cloud：

- `clientId`: `${clientid}`
- `username`: `${username}`
- `deviceId`: `${username}`
- `hardwareFingerprint`: `${payload.hardware_fingerprint}`
- `topic`: `${topic}`
- `payload`: `${payload}`
