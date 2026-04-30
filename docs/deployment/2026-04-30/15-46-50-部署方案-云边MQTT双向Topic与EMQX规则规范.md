# 云边 MQTT 双向 Topic 与 EMQX 规则规范

## 1. 目标与边界

本文档定义云平台与边缘设备 MQTT 对接的目标态最佳实践，用于后续统一调整边缘端、云端 Edge 模块、EMQX 规则、测试数据和联调脚本。

目标：

- Topic 同时支持环境隔离、租户隔离、协议版本演进和按节点授权。
- 上行、下行 Topic 按语义分流，避免所有事件挤到单一 `/event`。
- EMQX Rule Engine / HTTP Sink 模板稳定，不依赖脆弱的 payload 猜测。
- 保留当前实现兼容说明，便于逐步迁移。

不包含：

- EMQX Dashboard 自动化配置脚本。
- 后端 Java 代码修改方案。
- 生产 TLS 证书、网络白名单、EMQX 集群高可用部署细节。

## 2. 当前实现与目标态关系

当前实现事实：

| 能力 | 当前代码位置 | 当前行为 |
| --- | --- | --- |
| MQTT 连接认证 | `EdgeRuntimeServiceImpl#authenticate` | 校验 `clientId=edge-node:{deviceId}`、`username=deviceId`、ACTIVE 凭证，并返回 per-device ACL |
| 当前默认 Topic 根 | `EdgeRuntimeServiceImpl#resolveTopicRoot` | 未自定义时使用 `moon/edge/node/{deviceId}` |
| 当前上行后缀 | `EdgeRuntimeServiceImpl#authenticate` | 允许 publish 到 `/register`、`/heartbeat`、`/device/report`、`/event` |
| 当前下行后缀 | `EdgeTaskServiceImpl#resolveCommandTopic` | `{topicRoot}/command/{commandKey}` |
| 下行发布 | `EdgeTaskServiceImpl#publishCommand` | 调 EMQX `{emqxApiBaseUrl}/publish`，`qos=1`，`retain=false` |
| 上行入站 | `EdgeRuntimeController#ingest` | `POST /admin-api/edge/runtime/ingest`，Header 使用 `X-EMQX-SIGNATURE` |

目标态说明：

- `topicRoot` 字段应升级为完整业务根路径，不再只表达 `moon/edge/node/{deviceId}`。
- 当前后端仍硬编码 `/register`、`/heartbeat`、`/device/report`、`/event`、`/command/#` 后缀；若要完全采用本文目标态后缀，需要后续调整 ACL、下发 Topic 和 Rule 匹配。
- 在代码调整前，可以先把节点 `topicRoot` 配置成目标态根路径，但后缀仍按当前实现兼容运行。

## 3. 推荐 Topic 根路径

目标态根路径：

```text
topicRoot = moon/{env}/tenants/{tenantId}/edge/v1/nodes/{nodeDeviceId}
```

示例：

```text
env = prod
tenantId = 1
nodeDeviceId = device-aa034de0a2f147faab579ba0b45db13f
clientId = edge-node:device-aa034de0a2f147faab579ba0b45db13f
username = device-aa034de0a2f147faab579ba0b45db13f
topicRoot = moon/prod/tenants/1/edge/v1/nodes/device-aa034de0a2f147faab579ba0b45db13f
```

字段含义：

| 片段 | 示例 | 说明 |
| --- | --- | --- |
| `vmesh` | `vmesh` | 产品命名空间，避免和其他系统 Topic 冲突 |
| `{env}` | `dev` / `test` / `prod` | 环境隔离，禁止多环境共用同一裸 Topic |
| `tenants/{tenantId}` | `tenants/1` | 租户隔离，和后端多租户数据模型对齐 |
| `edge/v1` | `edge/v1` | Edge MQTT 协议版本，支持后续 `v2` 并行迁移 |
| `nodes/{nodeDeviceId}` | `nodes/device-xxx` | 边缘节点凭证身份，不代表节点下挂设备 |

命名约束：

- Topic 只使用小写字母、数字、短横线、下划线和斜杠。
- `env` 使用固定枚举：`dev`、`test`、`staging`、`prod`。
- `tenantId` 使用后端真实租户 ID，不使用租户名称。
- `nodeDeviceId` 使用节点凭证 `deviceId`，与 MQTT `username` 保持一致。
- 不在 Topic 中放密钥、真实人名、手机号、IP 白名单、token 等敏感信息。

## 4. 目标态 Topic 规范

### 4.1 边缘端上行

| 方向 | Topic | QoS | eventType | 用途 |
| --- | --- | --- | --- | --- |
| Edge -> Cloud | `{topicRoot}/lifecycle/register` | 1 | `register` | 注册、首次上线、硬件指纹绑定 |
| Edge -> Cloud | `{topicRoot}/telemetry/heartbeat` | 0 | `heartbeat` | 心跳、资源指标、链路指标 |
| Edge -> Cloud | `{topicRoot}/telemetry/device-report` | 1 | `device.report` | 外设、摄像头、采集设备快照 |
| Edge -> Cloud | `{topicRoot}/events/task-progress` | 1 | `task_progress` / `task.progress` | 任务进度、成功、失败回执 |

设计原则：

- `lifecycle` 只放生命周期事件。
- `telemetry` 只放周期性或状态型遥测。
- `events` 只放业务事件。
- 不再使用泛化的 `{topicRoot}/event` 作为目标态主通道。
- 不再使用 `{topicRoot}/device/report` 这种双层含义混杂路径，目标态改为 `{topicRoot}/telemetry/device-report`。

任务完成上报示例：

```json
{
  "message_id": "task-progress-TASK-2049721057496186880-success-001",
  "occurred_at": 1777526556739,
  "event_type": "task_progress",
  "data": {
    "hardware_fingerprint": "hwfp-device-aa034de0a2f147faab579ba0b45db13f",
    "task_key": "TASK-2049721057496186880",
    "command_key": "reboot",
    "stage": "finalize",
    "status": "SUCCESS",
    "progress_pct": 100,
    "log_level": "INFO",
    "message": "Reboot command completed",
    "error_code": null,
    "error_message": null
  }
}
```

### 4.2 云端下行

| 方向 | Topic | QoS | retain | 用途 |
| --- | --- | --- | --- | --- |
| Cloud -> Edge | `{topicRoot}/commands/{commandKey}` | 1 | false | 云端任务下发 |

目标态使用复数 `commands`，和上行的 `events`、`telemetry` 形成一致语义。

当前 `commandKey` 映射建议保持：

| taskType | commandKey | 说明 |
| --- | --- | --- |
| `OTA` | `ota_update` | OTA 底座升级 |
| `ALGORITHM` | `algorithm_update` | 算法下发 |
| `CONFIG` | `config_update` | 配置下发 |
| `REBOOT` | `reboot` | 设备重启 |
| 其他 | `custom_command` | 自定义命令兜底 |

云端下发命令仍通过 EMQX Management API：

```text
POST {vmesh.edge.runtime.emqx-api-base-url}/publish
```

目标态 publish body：

```json
{
  "topic": "moon/prod/tenants/1/edge/v1/nodes/{nodeDeviceId}/commands/{commandKey}",
  "payload": "{Cloud 生成的命令 JSON 字符串}",
  "qos": 1,
  "retain": false
}
```

边缘端订阅：

```text
{topicRoot}/commands/#
```

## 5. 当前兼容 Topic 与迁移映射

当前实现兼容路径：

| 当前路径 | 目标路径 | 迁移动作 |
| --- | --- | --- |
| `moon/edge/node/{deviceId}` | `moon/{env}/tenants/{tenantId}/edge/v1/nodes/{nodeDeviceId}` | 后台节点 `topicRoot` 改为目标态根路径 |
| `{topicRoot}/register` | `{topicRoot}/lifecycle/register` | 调整后端 ACL、EMQX Rule 和边缘端发布路径 |
| `{topicRoot}/heartbeat` | `{topicRoot}/telemetry/heartbeat` | 调整后端 ACL、EMQX Rule 和边缘端发布路径 |
| `{topicRoot}/device/report` | `{topicRoot}/telemetry/device-report` | 调整后端 ACL、EMQX Rule 和边缘端发布路径 |
| `{topicRoot}/event` | `{topicRoot}/events/task-progress` | 调整后端 ACL、EMQX Rule 和边缘端发布路径 |
| `{topicRoot}/command/{commandKey}` | `{topicRoot}/commands/{commandKey}` | 调整后端下发 Topic 和边缘端订阅路径 |

迁移建议：

1. 新设备优先使用目标态根路径。
2. 后端先支持目标态和当前兼容路径双读双规则。
3. EMQX 同时保留旧规则和新规则，观察一轮联调周期。
4. 边缘端切换到目标态 Topic。
5. 所有设备切换完成后，再移除旧规则。

## 6. EMQX 认证与 ACL 最佳实践

HTTP Authentication 调用 Cloud：

```text
POST http://<cloud-host>:18080/admin-api/edge/runtime/authenticate
```

请求体：

```json
{
  "clientid": "${clientid}",
  "username": "${username}",
  "password": "${password}",
  "peerhost": "${peerhost}",
  "proto_ver": "${proto_ver}"
}
```

目标态 ACL：

- 允许 publish 到 `{topicRoot}/lifecycle/register`
- 允许 publish 到 `{topicRoot}/telemetry/heartbeat`
- 允许 publish 到 `{topicRoot}/telemetry/device-report`
- 允许 publish 到 `{topicRoot}/events/task-progress`
- 允许 subscribe 到 `{topicRoot}/commands/#`
- 禁止 publish 到 `{topicRoot}/commands/#`
- 禁止 subscribe 到 `{topicRoot}/telemetry/#`
- 禁止跨租户、跨环境、跨节点访问其他 Topic

ACL 最佳实践：

- 使用精确 Topic ACL，少用通配符。
- 只给边缘端自己的 `topicRoot` 权限。
- `commands/#` 只允许 subscribe，不允许 publish。
- 上行 Topic 只允许 publish，不允许 subscribe。
- EMQX 超级用户能力只给运维账号，不给边缘节点账号。

## 7. EMQX Rule Engine / HTTP Sink

HTTP Sink 统一转发到 Cloud：

```text
POST http://<cloud-host>:18080/admin-api/edge/runtime/ingest
```

Dashboard 推荐配置：

| 配置位置 | 推荐值 | 说明 |
| --- | --- | --- |
| HTTP Connector URL / Base URL | `http://<cloud-host>:18080` | 只放协议、主机和端口 |
| Rule Action / HTTP Sink Method | `POST` | 固定 POST |
| Rule Action / HTTP Sink Path / URL Path | `/admin-api/edge/runtime/ingest` | 只放路径，不要填完整 URL |
| Header `Content-Type` | `application/json` | 固定 JSON |
| Header `X-EMQX-SIGNATURE` | `<VMESH_EDGE_INGEST_SHARED_SECRET>` | 必须与后端配置完全一致 |

禁止配置：

```text
Path = http://<cloud-host>:18080/admin-api/edge/runtime/ingest
```

规则拆分建议：

- register、heartbeat、device-report、task-progress 分成独立规则。
- 每条规则只匹配一个语义 Topic。
- 不建议用一个 `#` 规则承接所有消息后再在模板里猜测事件类型。
- 模板字段必须能稳定渲染，不能出现 `undefined`。

## 8. 推荐 EMQX 规则

### 8.1 register 规则

匹配 Topic：

```text
moon/+/tenants/+/edge/v1/nodes/+/lifecycle/register
```

转发 envelope：

```json
{
  "eventType": "register",
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

### 8.2 heartbeat 规则

匹配 Topic：

```text
moon/+/tenants/+/edge/v1/nodes/+/telemetry/heartbeat
```

转发 envelope：

```json
{
  "eventType": "heartbeat",
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

### 8.3 device.report 规则

匹配 Topic：

```text
moon/+/tenants/+/edge/v1/nodes/+/telemetry/device-report
```

转发 envelope：

```json
{
  "eventType": "device.report",
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

### 8.4 task_progress 规则

匹配 Topic：

```text
moon/+/tenants/+/edge/v1/nodes/+/events/task-progress
```

转发 envelope：

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

任务事件要求：

- `payload.event_type` 固定为 `task_progress` 或 `task.progress`。
- `payload.data.task_key` 必填。
- `payload.data.status` 使用 `ACKNOWLEDGED`、`PROCESSING`、`SUCCESS`、`FAILED`、`TIMEOUT`、`CANCELED`。
- 成功完成时必须上报 `SUCCESS + progress_pct=100`。
- 失败时不强制 `progress_pct=100`，按最后实际进度或 `0` 上报。

### 8.5 client.connected / client.disconnected 规则

连接生命周期事件也进入同一个 Cloud ingest 入口：

```text
POST /admin-api/edge/runtime/ingest
```

推荐事件值：

- `client.connected`
- `client.disconnected`

连接事件用于维护连接态，不替代 `register` 和 `heartbeat`。节点仍必须完成 `authenticate -> register -> heartbeat` 后，才算完整进入可监控状态。

## 9. Payload 最佳实践

通用规则：

- MQTT payload 使用 JSON object，不发送裸字符串。
- MQTT payload 内字段使用 `snake_case`。
- Cloud HTTP envelope 字段使用后端 VO 的 `camelCase`。
- `occurred_at` 使用 13 位毫秒时间戳。
- `message_id` 必须全局唯一，建议包含事件类型、任务号或设备号。
- `hardware_fingerprint` 在 register 后续所有运行态事件中必须保持一致。
- 不要在 payload 中传明文 secret、token、密码、证书私钥。

上行 MQTT payload 与 Cloud HTTP envelope 分层：

| 层级 | 字段风格 | 示例 |
| --- | --- | --- |
| MQTT payload | `snake_case` | `message_id`、`occurred_at`、`event_type` |
| Cloud ingest envelope | `camelCase` | `eventType`、`messageId`、`occurredAt` |

禁止把 Cloud HTTP envelope 当 MQTT payload 发到业务 Topic。EMQX Rule 应负责把 MQTT payload 包装成 Cloud ingest envelope。

## 10. 时间参数规范

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `vmesh.edge.runtime.heartbeat-interval-sec` | `20` | Cloud 侧默认心跳间隔，边缘端可在 payload 中上报实际值 |
| `vmesh.edge.runtime.heartbeat-timeout-sec` | `60` | Cloud 侧心跳超时基础阈值 |
| `vmesh.edge.runtime.heartbeat-scan-interval-ms` | `30000` | Cloud 侧超时巡检间隔 |
| `vmesh.edge.runtime.default-task-timeout-minutes` | `30` | 默认任务超时时间 |

离线判定：

```text
timeout = max(heartbeat-timeout-sec, heartbeatIntervalSec * 3)
```

默认配置下：

```text
timeout = max(60, 20 * 3) = 60 秒
```

联调建议：

1. MQTT CONNECT 触发 `/edge/runtime/authenticate`。
2. 发布 `{topicRoot}/lifecycle/register`。
3. 发布 `{topicRoot}/telemetry/heartbeat`，建议每 20 秒一次。
4. 云端下发任务到 `{topicRoot}/commands/{commandKey}`。
5. 边缘端执行后发布 `{topicRoot}/events/task-progress`。
6. 成功时上报 `status=SUCCESS`、`progress_pct=100`；失败时上报 `status=FAILED` 和错误信息。

## 11. 代码与配置调整清单

要完整采用目标态，需要同步调整：

| 范围 | 调整点 |
| --- | --- |
| 后端节点默认 `topicRoot` | 默认生成 `moon/{env}/tenants/{tenantId}/edge/v1/nodes/{deviceId}` |
| 后端认证 ACL | 后缀改为 `/lifecycle/register`、`/telemetry/heartbeat`、`/telemetry/device-report`、`/events/task-progress`、`/commands/#` |
| 后端下发 Topic | `{topicRoot}/command/{commandKey}` 改为 `{topicRoot}/commands/{commandKey}` |
| EMQX Rule | 新增目标态规则，迁移期保留当前兼容规则 |
| 边缘端订阅 | 从 `{topicRoot}/command/#` 改为 `{topicRoot}/commands/#` |
| 边缘端上行 | 按语义发布到 lifecycle / telemetry / events |
| 测试数据 | 更新 `docs/test-data/edge-node-mqtt` 中的 Topic 示例 |
| API 文档 | 更新节点 `topicRoot` 示例和说明 |

## 12. 排障清单

| 现象 | 检查项 | 正确做法 |
| --- | --- | --- |
| `/edge/runtime/ingest` JSON 解析失败 | HTTP Sink body 是否出现 `undefined`、未闭合引号或非法换行 | 修正 Rule SQL 和模板，保证所有字段都有值 |
| `eventType=undefined` | MQTT payload 是否把完整 HTTP envelope 发到了业务 Topic | MQTT 只发业务 payload，EMQX 再包装 envelope |
| `occurredAt` 解析失败 | 是否渲染成 `undefined` 或字符串换行 | 使用数字毫秒时间戳，不加引号 |
| 任务进度不上涨 | `eventType`、`payload.data.task_key`、`progress_pct` 是否存在 | 任务事件使用 `task_progress` 并携带 `task_key` |
| 硬件指纹不匹配 | `hardwareFingerprint` 是否是真实绑定值 | register 后续事件必须沿用相同硬件指纹 |
| 下发后状态停在 `DISPATCHED` | 边缘端是否回传任务进度 Topic | 成功回传 `SUCCESS + progress_pct=100` |
| HTTP Sink 401 | Action Path 是否填完整 URL | Path 只填 `/admin-api/edge/runtime/ingest` |
| 云端下发失败 | `emqx-api-base-url/apiKey/apiSecret` 是否配置 | 后端调用 `{emqxApiBaseUrl}/publish` 需要完整凭据 |
| 跨环境消息串扰 | Topic 是否缺少 `{env}` | 目标态必须包含 `{env}` |
| 跨租户消息串扰 | Topic 是否缺少 `tenants/{tenantId}` | 目标态必须包含租户维度 |

## 13. 验收标准

- 新设备使用 `moon/{env}/tenants/{tenantId}/edge/v1/nodes/{nodeDeviceId}` 作为 Topic 根路径。
- EMQX 认证成功后，节点只获得自己目标态 `topicRoot` 下的 publish / subscribe 权限。
- Edge 能按 `lifecycle/register -> telemetry/heartbeat -> events/task-progress` 完成激活、在线和任务回执。
- Cloud 能按 `{topicRoot}/commands/{commandKey}` 下发命令。
- Rule Engine / HTTP Sink 转发到 `/admin-api/edge/runtime/ingest` 的 body 是合法 JSON。
- 任务成功回执后，任务状态进入 `SUCCESS`，进度为 `100`。
- 停止心跳后，Cloud 按超时阈值和巡检间隔降级离线。

## 14. 验证边界

已完成：

- 基于当前代码和现有文档静态核对 Topic、接口、ACL、下发和时间参数。
- 本文档已从当前兼容口径升级为目标态最佳实践，并保留迁移说明。

未验证：

- 未操作 EMQX Dashboard。
- 未发布真实 MQTT 消息。
- 未调用 `/admin-api/edge/runtime/ingest`。
- 未修改后端代码，因此目标态 Topic 目前还不是当前代码的完整运行态。
- 未验证生产环境证书、网络、ACL 插件顺序和 HTTP Sink 实际模板语法。
