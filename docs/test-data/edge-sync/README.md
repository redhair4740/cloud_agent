---
lifecycle: record
topic: Edge Sync 测试数据
type: 测试数据说明
created: 2026-05-06
status: active
related:
  - docs/design/边缘数据同步/设计方案.md
  - docs/api/Edge边缘模块/API文档.md
---

# Edge Sync 测试数据说明

## 1. 使用边界

- 本目录用于 `POST /edge/sync/**` 与 `POST /edge/sync/ingest` 的联调测试，不复用现有 `runtime/ingest` 或任务上报样例。
- 测试对象覆盖实时同步、断网续传、一致性校验三条主链路，接口入口以 `moon_cloud_backend/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/sync/EdgeSyncController.java` 为准。
- 下行同步 payload 已按对象级生成，包含 `object_key`、`version`、`hash`、`content`，来源见 `EdgeSyncServiceImpl#buildSyncPayload`。
- `ingest` 请求头 `X-EMQX-SIGNATURE` 必须等于 `vmesh.edge.runtime.ingest-shared-secret` 对应值；代码在 `EdgeSyncServiceImpl#ingest` 先做签名校验，不支持匿名调试。
- 本文档只提供可复制测试数据和流程，不代表真实环境中的 `nodeId`、`deviceId`、`secret`、MQTT 地址已确认。

## 2. 目录内容

| 文件 | 用途 | 说明 |
|------|------|------|
| `01-publish-request.json` | 发起实时同步 | 云端手工触发 `/edge/sync/node/{nodeId}/publish` 请求体 |
| `02-reconcile-request.json` | 发起一致性校验 | 云端手工触发 `/edge/sync/node/{nodeId}/reconcile` 请求体 |
| `11-ingest-sync-ack.json` | 边端 ACK 回执 | 模拟 `sync.ack` 入站 |
| `12-ingest-sync-applied.json` | 边端应用成功回执 | 模拟 `sync.applied` 入站 |
| `13-ingest-sync-diff.json` | 边端差异回执 | 模拟 `sync.diff` 入站 |
| `14-ingest-sync-conflict.json` | 边端冲突回执 | 模拟 `sync.conflict` 入站 |

## 3. 对象类型覆盖

| 对象类型 | 方向 | 推荐场景 | objectKey 口径 |
|----------|------|----------|----------------|
| `NODE_BASE_CONFIG` | `CLOUD_TO_EDGE` | 节点基础配置实时同步 | 节点 ID |
| `RESOURCE_BINDING` | `CLOUD_TO_EDGE` | 资源绑定下发 | `resourceKey` |
| `NODE_RUNTIME_FACT` | `EDGE_TO_CLOUD` | 节点运行事实回流 | 节点 ID |

证据：

- 对象类型与方向定义：`moon_cloud_backend/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/enums/sync/EdgeSyncObjectTypeEnum.java`
- 对象 key 匹配逻辑：`moon_cloud_backend/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/service/sync/EdgeSyncServiceImpl.java#matchesDescriptorKey`

## 4. 前置条件

1. 准备一个已存在的边缘节点，记下真实 `nodeId`、`deviceId`、租户和节点在线状态。
2. 若测试实时同步或一致性校验，节点必须在线；`publish()` 离线时会把明细置为 `RETRY_WAITING`，`reconcile()` 离线时直接拒绝，见 `EdgeSyncServiceImpl#publish`、`#reconcile`。
3. 准备同步入站签名密钥 `${EDGE_SYNC_INGEST_SECRET}`，它应等于后端配置 `vmesh.edge.runtime.ingest-shared-secret`。
4. `edge/sync` 当前只处理节点级对象；设备台账、设备分组、设备控制不在本目录测试范围内。

## 5. 关键状态机

### 5.1 批次状态

| 状态 | 含义 | 触发位置 |
|------|------|----------|
| `PENDING` | 已建批次但尚未成功发布 | `EdgeSyncServiceImpl#publish`、`#refreshBatchStatus` |
| `PUBLISHED` | 有明细处于 `PENDING/PUBLISHED/ACKED` 中间态 | `EdgeSyncServiceImpl#refreshBatchStatus` |
| `WAITING_CONFIRMATION` | 至少一条明细处于 `CONFLICT_PENDING` | `EdgeSyncServiceImpl#refreshBatchStatus` |
| `PARTIAL_SUCCESS` | 全部结束但存在 `FAILED` | `EdgeSyncServiceImpl#refreshBatchStatus` |
| `COMPLETED` | 全部 `APPLIED` 或无对象待处理 | `EdgeSyncServiceImpl#refreshBatchStatus` |
| `FAILED` | 枚举已定义，当前主流程未直接写入批次级 `FAILED` | `EdgeSyncBatchStatusEnum` |

### 5.2 明细状态

| 状态 | 含义 |
|------|------|
| `PENDING` | 明细已创建，等待首次发布 |
| `PUBLISHED` | 命令已发出，等待边端 ACK / APPLIED |
| `ACKED` | 已收到 `sync.ack` |
| `APPLIED` | 已收到 `sync.applied`，会同步更新 snapshot 为 `IN_SYNC` |
| `RETRY_WAITING` | 节点离线或发布失败，等待定时扫描或人工重试 |
| `CONFLICT_PENDING` | 仅历史遗留双向冲突会进入该状态；当前节点级对象默认按云端基线自动重发 |
| `FAILED` | 重试次数超限 |
| `RESOLVED_CLOUD` | 历史冲突按云端基线确认后的状态 |

## 6. 后台与前端查看入口

- 后台接口：
  - `GET /edge/sync/overview`
  - `GET /edge/sync/batch/page`
  - `GET /edge/sync/item/page`
  - `GET /edge/sync/node/{nodeId}/snapshot/page`
  - `GET /edge/sync/node/{nodeId}/diff/{objectType}?objectKey=...`
  - `GET /edge/sync/conflict/page`
- 前端页面：
  - API 封装：`moon_cloud_frontend/src/api/edge/sync.ts`
  - 页面入口：`moon_cloud_frontend/src/views/edge/sync/index.vue`
  - 页面支持：
    - 批次筛选 `nodeId/status/direction/timeRange`
    - 批次明细筛选 `status/objectType`
    - 操作 `发起同步`、`一致性校验`、`重试补传`、`查看 Diff`、`按云端重发`
    - 冲突状态展示主要用于历史遗留冲突记录

## 7. 请求样例

### 7.1 发起实时同步

请求体参考 `01-publish-request.json`。

```bash
curl -X POST 'http://{host}/admin-api/edge/sync/node/2001/publish' -H 'Authorization: Bearer {token}' -H 'Content-Type: application/json' --data @docs/test-data/edge-sync/01-publish-request.json
```

预期：

- 返回 `batchKey`。
- 后端会按对象级拆出多条 `edge_sync_item`，见 `EdgeSyncServiceImpl#createAndDispatchItem`。
- 若节点在线，批次先进入 `PUBLISHED`；若节点离线，明细进入 `RETRY_WAITING`。

### 7.2 发起一致性校验

请求体参考 `02-reconcile-request.json`。

```bash
curl -X POST 'http://{host}/admin-api/edge/sync/node/2001/reconcile' -H 'Authorization: Bearer {token}' -H 'Content-Type: application/json' --data @docs/test-data/edge-sync/02-reconcile-request.json
```

预期：

- 返回 `RECONCILE-{nodeId}`。
- 后端向 compare topic 下发对象类型清单，见 `EdgeSyncServiceImpl#reconcile`。
- 后续边端应回传 `sync.diff` 或 `sync.conflict` 到 `/edge/sync/ingest`。

### 7.3 模拟边端 ingest 回执

以下样例都要求设置签名头：

```bash
curl -X POST 'http://{host}/admin-api/edge/sync/ingest' -H 'Content-Type: application/json' -H 'X-EMQX-SIGNATURE: ${EDGE_SYNC_INGEST_SECRET}' --data @docs/test-data/edge-sync/11-ingest-sync-ack.json
```

把文件替换为：

- `11-ingest-sync-ack.json`
- `12-ingest-sync-applied.json`
- `13-ingest-sync-diff.json`
- `14-ingest-sync-conflict.json`

使用前必须替换占位符：

- `${BATCH_KEY}`：实时同步返回的批次号
- `${NODE_ID}`：真实节点 ID
- `${DEVICE_ID}`：真实节点 deviceId
- `${OBJECT_KEY}`：明细对象 key
- `${OCCURRED_AT}`：毫秒时间戳

## 8. 测试流程

### 8.1 实时同步

1. 在同步页面选择在线节点，勾选 `NODE_BASE_CONFIG`、`RESOURCE_BINDING`，点击“发起同步”。
2. 或直接调用 `POST /edge/sync/node/{nodeId}/publish`。
3. 记录返回的 `batchKey`，然后调用 `GET /edge/sync/batch/page` 找到该批次。
4. 调用 `GET /edge/sync/item/page?batchId={batchId}`，确认已生成对象级明细，且 `expectedVersion/expectedHash/objectKey` 非空。
5. 用 `11-ingest-sync-ack.json` 模拟边端 ACK；预期对应明细变为 `ACKED`。
6. 再用 `12-ingest-sync-applied.json` 模拟边端应用成功；预期明细变为 `APPLIED`，批次最终进入 `COMPLETED`。
7. 调用 `GET /edge/sync/node/{nodeId}/snapshot/page`，预期对应 `objectType + objectKey` 的 snapshot 为 `IN_SYNC`。

预期数据库变化：

- `edge_sync_batch.status`：`PENDING/PUBLISHED -> COMPLETED`
- `edge_sync_item.status`：`PENDING/PUBLISHED -> ACKED -> APPLIED`
- `edge_sync_snapshot.sync_status`：`IN_SYNC`

### 8.2 断网续传

1. 让测试节点离线，或直接在离线节点上调用 `POST /edge/sync/node/{nodeId}/publish`。
2. 预期批次创建成功，但明细状态为 `RETRY_WAITING`，见 `EdgeSyncServiceImpl#createAndDispatchItem`。
3. 节点恢复在线后有两种触发方式：
   - 等待定时任务 `scanRetryWaitingItems()` 扫描补发。
   - 手工调用 `POST /edge/sync/item/{itemId}/retry` 立即重试。
4. 重试成功后，明细进入 `PUBLISHED`，再按实时同步链路补 `sync.ack` 与 `sync.applied`。
5. 若多次失败超过 `syncRetryMaxCount`，预期明细进入 `FAILED`，批次在全部对象结束后进入 `PARTIAL_SUCCESS`。

检查点：

- `GET /edge/sync/overview` 中 `retryWaitingItemCount` 是否先增加再下降。
- 页面“批次详情”抽屉中 `retryCount`、`lastError` 是否符合预期。

### 8.3 一致性校验

1. 选择在线节点，调用 `POST /edge/sync/node/{nodeId}/reconcile`，对象类型建议选择 `NODE_BASE_CONFIG` 与 `RESOURCE_BINDING`。
2. 边端发现只有差异无冲突时，回传 `13-ingest-sync-diff.json`。
3. 预期 `edge_sync_snapshot` 以 `nodeId + objectType + objectKey` 维度 upsert，状态为 `DRIFTED`，见 `EdgeSyncServiceImpl#upsertSnapshot`。
4. 调用 `GET /edge/sync/node/{nodeId}/diff/{objectType}?objectKey={objectKey}` 查看 `cloudData/edgeData/conflictFields`。
5. 若边端回传 `14-ingest-sync-conflict.json`，预期后端保留 `edge_sync_snapshot` 差异快照，并自动按云端基线重发该节点对象。
6. 节点在线时，明细会重新进入 `PUBLISHED`；节点离线时，明细进入 `RETRY_WAITING`。

### 8.4 冲突自动收敛与历史冲突处理

1. 当前节点级对象收到 `sync.conflict` 时，后端会保留 diff 快照并自动按云端基线重发，见 `EdgeSyncServiceImpl#handleCloudAuthoritativeConflict`。
2. 如果仓库里还有历史遗留 `CONFLICT_PENDING` 记录，可调用 `POST /edge/sync/conflict/{conflictId}/confirm-cloud` 做云端基线确认。
3. 自动重发或人工按云端重发后，再模拟 `sync.ack`、`sync.applied`。

预期：

- 历史冲突使用 `confirm-cloud` 后进入 `RESOLVED_CLOUD`
- 当前节点级对象不会再产生“采纳边端回写”流程
- 对应明细最终收敛到 `APPLIED`

## 9. 推荐联调顺序

1. 先跑“实时同步”单对象成功链路，确认 `batch -> item -> snapshot` 三层状态流转正常。
2. 再跑“断网续传”，确认 `RETRY_WAITING` 与 `retryItem/scanRetryWaitingItems` 生效。
3. 最后跑“一致性校验 + 自动重发”，否则问题会混在一条链路里难定位。

## 10. 未验证项

- 未在真实 EMQX 上完成端到端下发、ACK、APPLIED、DIFF、CONFLICT 联调。
- 未验证 `NODE_RUNTIME_FACT` 是否由当前边端实现按 `sync` Topic 主动回传。
- 未执行自动化测试；本文档仅依据当前源码和现有页面行为整理。

## 变更日志

| 日期 | 变更摘要 | 变更来源 |
|------|----------|----------|
| 2026-05-06 | 新增边缘数据同步测试数据说明、请求样例和联调流程 | 当前 `edge/sync` 后端实现与前端页面 |
