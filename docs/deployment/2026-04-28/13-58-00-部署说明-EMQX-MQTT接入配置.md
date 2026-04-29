# EMQX MQTT 接入配置说明

## 1. 文档目标

本文档说明当前项目如何接入 EMQX，用于边缘节点注册、心跳、设备上报、任务进度上报和云端任务下发。

当前确认的接入方式：

- Cloud 不常驻 MQTT subscribe 客户端。
- 边缘节点直连 EMQX Broker。
- EMQX 通过 HTTP Authentication 调 Cloud 做节点鉴权。
- EMQX 通过 Rule Engine / HTTP Sink 把上行 MQTT 消息推给 Cloud。
- Cloud 通过 EMQX Management API `/api/v5/publish` 下发任务命令。

参考设计文档：

```text
docs/design/2026-04-22/00-00-00-设计方案-边云协同Edge全链路生产级设计.md
```

## 2. 当前代码现状

当前项目已经具备基础 EMQX 接入链路：

| 能力 | 当前落点 | 说明 |
| --- | --- | --- |
| EMQX HTTP 鉴权 | `WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/runtime/EdgeRuntimeController.java` | `POST /edge/runtime/authenticate`，实际访问前缀为 `/admin-api` |
| 上行事件入口 | `EdgeRuntimeController` | `POST /edge/runtime/ingest`，由 EMQX Rule Engine / HTTP Sink 调用 |
| 鉴权逻辑 | `EdgeRuntimeServiceImpl#authenticate` | 校验 `clientid=edge-node:{deviceId}`、`username=deviceId`、BCrypt secret |
| 事件处理 | `EdgeRuntimeServiceImpl#ingest` | 原始事件落库，并同步推进 snapshot、metric、alert、task |
| 下行发布 | `EdgeTaskServiceImpl#publishCommand` | 调用 `{emqxApiBaseUrl}/publish` |
| 运行配置 | `EdgeRuntimeProperties` | 配置前缀为 `vmesh.edge.runtime` |

当前没有后端常驻 MQTT 订阅客户端，这符合生产级设计中的架构决策。

## 3. 地址与配置项

用户提供的 EMQX Dashboard/API 根地址为：

```text
http://10.94.32.89/
```

该地址用于 Cloud 调 EMQX Management API。项目内应配置为：

```yaml
vmesh:
  edge:
    runtime:
      emqx-api-base-url: http://10.94.32.89/api/v5
```

如果现场 EMQX 使用默认 Dashboard/API 端口，改为：

```yaml
vmesh:
  edge:
    runtime:
      emqx-api-base-url: http://10.94.32.89:18083/api/v5
```

边缘节点实际连接 Broker 的地址是另一个配置，不能和 Dashboard/API 地址混用：

```yaml
vmesh:
  edge:
    runtime:
      broker-endpoint: tcp://10.94.32.89:1883
```

生产启用 TLS Listener 时改为：

```yaml
vmesh:
  edge:
    runtime:
      broker-endpoint: ssl://10.94.32.89:8883
```

完整配置项：

| 配置键 | 环境变量 | 示例 | 说明 |
| --- | --- | --- | --- |
| `vmesh.edge.runtime.broker-endpoint` | `VMESH_EDGE_BROKER_ENDPOINT` | `tcp://10.94.32.89:1883` | 返回给边缘节点连接 EMQX Broker |
| `vmesh.edge.runtime.emqx-api-base-url` | `VMESH_EDGE_EMQX_API_BASE_URL` | `http://10.94.32.89/api/v5` | Cloud 调 EMQX Management API 的基础地址 |
| `vmesh.edge.runtime.emqx-api-key` | `VMESH_EDGE_EMQX_API_KEY` | 不提交真实值 | EMQX API Key |
| `vmesh.edge.runtime.emqx-api-secret` | `VMESH_EDGE_EMQX_API_SECRET` | 不提交真实值 | EMQX API Secret |
| `vmesh.edge.runtime.ingest-shared-secret` | `VMESH_EDGE_INGEST_SHARED_SECRET` | 不提交真实值 | EMQX HTTP Sink 调 Cloud 时携带的共享密钥，必填非空 |
| `vmesh.edge.runtime.heartbeat-interval-sec` | `VMESH_EDGE_HEARTBEAT_INTERVAL_SEC` | `20` | 心跳间隔 |
| `vmesh.edge.runtime.heartbeat-timeout-sec` | `VMESH_EDGE_HEARTBEAT_TIMEOUT_SEC` | `60` | 心跳超时 |

敏感配置只允许写入环境变量、Portainer Stack 变量或宿主机实际部署配置文件，不允许提交到仓库。

## 4. Cloud 侧配置文件

本次已补齐以下配置入口：

```text
WF_VMesh_Coud/vmesh-server/src/main/resources/application-local.yaml
WF_VMesh_Coud/vmesh-server/src/main/resources/application-dev.yaml
WF_VMesh_Coud/deploy/application-deploy.yaml.template
WF_VMesh_Coud/deploy/.env.example
WF_VMesh_Coud/deploy/stack.yml
WF_VMesh_Coud/deploy/Stack.yaml
```

本地或 dev 环境默认值：

```yaml
vmesh:
  edge:
    runtime:
      broker-endpoint: ${VMESH_EDGE_BROKER_ENDPOINT:tcp://10.94.32.89:1883}
      emqx-api-base-url: ${VMESH_EDGE_EMQX_API_BASE_URL:http://10.94.32.89/api/v5}
      emqx-api-key: ${VMESH_EDGE_EMQX_API_KEY:}
      emqx-api-secret: ${VMESH_EDGE_EMQX_API_SECRET:}
      # 必填，需与 EMQX HTTP Action 的 X-EMQX-SIGNATURE 完全一致
      ingest-shared-secret: ${VMESH_EDGE_INGEST_SHARED_SECRET:}
      heartbeat-interval-sec: 20
      heartbeat-timeout-sec: 60
```

部署环境由 `deploy/application-deploy.yaml.template` 和 Portainer 环境变量共同生效。

## 5. EMQX 侧配置

### 5.1 HTTP Authentication

在 EMQX Dashboard 配置 HTTP Authentication，Cloud 地址为：

```text
POST http://<cloud-host>:48080/admin-api/edge/runtime/authenticate
```

请求体字段需要包含：

```json
{
  "clientid": "${clientid}",
  "username": "${username}",
  "password": "${password}",
  "peerhost": "${peerhost}",
  "proto_ver": "${proto_ver}"
}
```

Cloud 校验规则：

- `clientid` 必须等于 `edge-node:{deviceId}`。
- `username` 必须等于节点凭证中的 `deviceId`。
- `password` 必须匹配节点凭证的 BCrypt hash。
- 节点必须启用。

鉴权成功后 Cloud 返回 per-device ACL：

- 允许 publish 到 `{topicRoot}/register`
- 允许 publish 到 `{topicRoot}/heartbeat`
- 允许 publish 到 `{topicRoot}/device/report`
- 允许 publish 到 `{topicRoot}/event`
- 允许 subscribe 到 `{topicRoot}/command/#`

### 5.2 Rule Engine / HTTP Sink

EMQX Rule Engine / HTTP Sink 目标地址：

```text
POST http://<cloud-host>:48080/admin-api/edge/runtime/ingest
```

在 EMQX Dashboard 中要按 Connector 和 Action 拆开配置，不要把完整 URL 写进 Action path：

| 配置位置 | 推荐值 | 说明 |
| --- | --- | --- |
| HTTP Connector URL / Base URL | `http://<cloud-host>:48080` | 只放协议、主机和端口 |
| Rule Action / HTTP Sink Method | `POST` | 固定 POST |
| Rule Action / HTTP Sink Path / URL Path | `/admin-api/edge/runtime/ingest` | 只放路径，不要再包含 `http://<cloud-host>:48080` |

如果 Action path 误填成完整 URL，例如 `http://127.0.0.1:18080/admin-api/edge/runtime/ingest`，EMQX 渲染后的真实请求路径会变成：

```text
/http://127.0.0.1:18080/admin-api/edge/runtime/ingest
```

该路径无法命中后端免登录规则 `EdgeSecurityConfiguration#authorizeRequestsCustomizer` 中的 `/admin-api/edge/runtime/ingest`，请求会落到 Spring Security 的 `anyRequest().authenticated()` 兜底，最终由 `AuthenticationEntryPointImpl#commence` 返回：

```json
{"code":401,"msg":"账号未登录","data":null}
```

Header 必须包含：

```text
X-EMQX-SIGNATURE: <VMESH_EDGE_INGEST_SHARED_SECRET>
```

后端按 fail-closed 处理该入口：

- HTTP 请求缺少 `X-EMQX-SIGNATURE` 时，请求不会进入 `EdgeRuntimeServiceImpl#ingest` 主流程。
- `VMESH_EDGE_INGEST_SHARED_SECRET` 未配置或为空时，所有 ingest 请求都会被拒绝。
- Header 值与 `VMESH_EDGE_INGEST_SHARED_SECRET` 不完全一致时，返回边缘运行时签名不合法。

建议映射体：

```json
{
  "eventType": "${event_type}",
  "eventId": "${id}",
  "messageId": "${payload.message_id}",
  "clientId": "${clientid}",
  "username": "${username}",
  "deviceId": "${username}",
  "topic": "${topic}",
  "occurredAt": "${payload.occurred_at}",
  "payload": ${payload}
}
```

请求体模板需要保证所有变量都能被 Rule SQL 解析出来：

- 如果 MQTT payload 本身已经是 Cloud `EdgeRuntimeIngestReqVO` 结构，HTTP Sink body 可以直接使用 `${payload}` 原样转发。
- 如果由 EMQX 重新拼装 envelope，Rule SQL 必须先从 JSON payload 中解析 `messageId`、`deviceId`、`occurredAt` 等字段，不能让模板渲染出 `"messageId": "undefined"` 或 `"occurredAt": undefined`。
- `deviceId` 应使用节点凭证中的设备标识，例如 `device-test`；不要把 MQTT 客户端的 Dashboard 用户名 `admin` 当作 `deviceId`。
- `payload` 字段必须是合法 JSON 对象；如果 `${payload}` 是字符串，需要先确认 EMQX 模板最终渲染后没有多余引号、转义错误或未定义变量。

需要覆盖的事件：

| MQTT / EMQX 事件 | Cloud `eventType` |
| --- | --- |
| 客户端连接 | `client.connected` |
| 客户端断开 | `client.disconnected` |
| `{topicRoot}/register` | `register` |
| `{topicRoot}/heartbeat` | `heartbeat` |
| `{topicRoot}/device/report` | `device.report` |
| `{topicRoot}/event` 中任务进度 | `task_progress` 或 `task.progress` |

## 6. Topic 与 Payload

节点身份规范：

```text
clientId = edge-node:{deviceId}
username = {deviceId}
password = 节点凭证 secret
topicRoot = vmesh/edge/node/{deviceId}
```

Topic 规范：

| 方向 | Topic | QoS | 用途 |
| --- | --- | --- | --- |
| 上行 | `{topicRoot}/register` | 1 | 注册与首次上线 |
| 上行 | `{topicRoot}/heartbeat` | 0 | 节点心跳与资源指标 |
| 上行 | `{topicRoot}/device/report` | 1 | 外设快照 |
| 上行 | `{topicRoot}/event` | 1 | 业务事件，V1 主要支持任务进度 |
| 下行 | `{topicRoot}/command/{commandKey}` | 1 | 云端任务下发 |

心跳 payload 示例：

```json
{
  "message_id": "hb-20260428-0001",
  "occurred_at": 1776818460000,
  "runtime_status": "ONLINE",
  "metrics": {
    "cpu_usage_pct": 45.2,
    "memory_usage_pct": 62.8,
    "gpu_usage_pct": 78.0,
    "storage_usage_pct": 35.5,
    "temperature_c": 68.4
  },
  "network": {
    "edge_rtt_ms": 42.5,
    "packet_loss_pct": 0.1,
    "cloud_probe_rtt_ms": 45.0
  }
}
```

任务进度 payload 示例：

```json
{
  "message_id": "evt-20260428-0001",
  "occurred_at": 1776818580000,
  "event_type": "task_progress",
  "data": {
    "task_key": "TASK-20260428-0001",
    "command_key": "ota_update",
    "stage": "download",
    "status": "PROCESSING",
    "progress_pct": 65,
    "log_level": "INFO",
    "message": "Downloading firmware 65%",
    "error_code": null,
    "error_message": null
  }
}
```

## 7. 联调命令

以下命令只用于本地或测试环境。生产环境调用前必须确认目标地址、密钥和数据影响。

### 7.1 模拟心跳上行

```bash
curl -X POST "http://<cloud-host>:48080/admin-api/edge/runtime/ingest" -H "Content-Type: application/json" -H "X-EMQX-SIGNATURE: <shared-secret>" -d '{"eventType":"heartbeat","eventId":"evt-hb-001","messageId":"hb-001","clientId":"edge-node:<deviceId>","username":"<deviceId>","deviceId":"<deviceId>","topic":"vmesh/edge/node/<deviceId>/heartbeat","occurredAt":1776818460000,"payload":{"message_id":"hb-001","occurred_at":1776818460000,"runtime_status":"ONLINE","metrics":{"cpu_usage_pct":45.2,"memory_usage_pct":62.8,"gpu_usage_pct":78.0,"storage_usage_pct":35.5,"temperature_c":68.4},"network":{"edge_rtt_ms":42.5,"packet_loss_pct":0.1,"cloud_probe_rtt_ms":45.0}}}'
```

### 7.2 模拟任务进度上行

```bash
curl -X POST "http://<cloud-host>:48080/admin-api/edge/runtime/ingest" -H "Content-Type: application/json" -H "X-EMQX-SIGNATURE: <shared-secret>" -d '{"eventType":"task_progress","eventId":"evt-task-001","messageId":"task-msg-001","clientId":"edge-node:<deviceId>","username":"<deviceId>","deviceId":"<deviceId>","topic":"vmesh/edge/node/<deviceId>/event","occurredAt":1776818580000,"payload":{"message_id":"task-msg-001","occurred_at":1776818580000,"event_type":"task_progress","data":{"task_key":"<taskKey>","command_key":"ota_update","stage":"download","status":"PROCESSING","progress_pct":65,"log_level":"INFO","message":"Downloading firmware 65%","error_code":null,"error_message":null}}}'
```

### 7.3 验证 EMQX API 地址

如果 `VMESH_EDGE_EMQX_API_BASE_URL=http://10.94.32.89/api/v5` 不通，优先确认是否应该使用默认 Dashboard/API 端口：

```text
http://10.94.32.89:18083/api/v5
```

## 8. 验收标准

节点接入：

- 创建节点后能拿到 `deviceId`、一次性 `secretKey`、`topicRoot`、`brokerEndpoint`。
- 边缘节点使用 `clientId=edge-node:{deviceId}`、`username=deviceId`、`password=secretKey` 能通过 EMQX 鉴权。
- register / heartbeat 上行后，`edge_runtime_event` 有记录，`edge_node_runtime_snapshot` 更新。

任务下发：

- 后台创建任务后，Cloud 调 EMQX `/publish` 成功。
- 任务状态进入 `DISPATCHED`。
- 边缘节点收到 `{topicRoot}/command/{commandKey}`。
- 节点回传 `task_progress` 后，任务进度和任务日志更新。

安全：

- 错误 `X-EMQX-SIGNATURE` 请求被拒绝。
- 禁用节点无法通过鉴权。
- 重复 `messageId` 不重复推进状态。

## 9. 排障清单

| 现象 | 优先检查 |
| --- | --- |
| 任务下发失败，提示 EMQX 配置缺失 | `VMESH_EDGE_EMQX_API_BASE_URL`、`VMESH_EDGE_EMQX_API_KEY`、`VMESH_EDGE_EMQX_API_SECRET` 是否传入容器 |
| Cloud 调 `/publish` 不通 | `http://10.94.32.89/api/v5` 是否实际需要 `:18083` |
| 节点无法连接 Broker | `broker-endpoint` 是否误填成 HTTP Dashboard 地址 |
| 鉴权失败 | `clientid` 是否为 `edge-node:{deviceId}`，`username` 是否等于 `deviceId` |
| ingest 返回 `{"code":401,"msg":"账号未登录"}` | 先看 EMQX trace 的 `action_template_rendered.result.path`；若是 `/http://.../admin-api/edge/runtime/ingest`，说明 Action path 误填了完整 URL，应改为 `/admin-api/edge/runtime/ingest` |
| ingest 被拒绝 | `X-EMQX-SIGNATURE` 是否等于 `ingest-shared-secret`，以及后端 `VMESH_EDGE_INGEST_SHARED_SECRET` 是否已配置为非空 |
| ingest 请求体解析失败 | EMQX trace 中 body 是否出现 `"messageId": "undefined"`、`"occurredAt": undefined`、`"deviceId": "admin"` 或非法 JSON |
| 心跳入库但监控不更新 | `eventType` 是否为 `heartbeat`，payload 是否包含 `metrics` 与 `network` |
| 任务进度不上涨 | `eventType` 是否为 `task_progress` 或 `task.progress`，`data.task_key` 是否存在 |

## 10. 当前未覆盖项

以下能力当前仍属于后续增强：

- `replay-event` 真实重放失败事件。
- EMQX 来源 IP 白名单。
- Redis 预去重与异步 handler 拆分。
- `device.report` 对设备异常明细的完整同步。
- EMQX Dashboard 自动化配置脚本。

未完成这些增强不影响当前 V1 按 HTTP Authentication + Rule Engine / HTTP Sink + `/api/v5/publish` 打通基础收发链路。
