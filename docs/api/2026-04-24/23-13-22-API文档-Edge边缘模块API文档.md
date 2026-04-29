# Edge 边缘模块 API 文档

> 本文档基于 `vmesh-module-edge` 后端 Controller + 前端 API SDK 源文件整理生成。
>
> 生成日期：2026-04-24
> 覆盖范围：管理后台 REST API（后端 Java Controller + 前端 TypeScript SDK）
> 后端前缀：所有接口默认前缀为 `/admin-api`（由网关统一配置）
> 基础响应结构：
> ```json
> { "code": 0, "msg": "success", "data": T }
> ```

---

## 目录

1. [节点管理](#11-节点管理-edge-controller)
2. [设备台账](#12-设备台账-edge-device-controller)
3. [设备分组](#13-设备分组-edge-device-group-controller)
4. [资源管理（新版）](#14-资源管理新版-edge-resource-controller)
5. [任务资源（旧版兼容）](#15-任务资源旧版兼容-edge-dispatch-resource-controller)
6. [任务中心](#16-任务中心-edge-task-controller)
7. [运行时管理（EMQX）](#17-运行时管理-edge-runtime-controller)
8. [监控中心](#18-监控中心-edge-monitor-controller)

---

### 1.1 节点管理 (Edge Node Controller)

**基础路径：** `POST/GET/PUT/DELETE /edge/node/**`

**Controller 源码：** [EdgeNodeController.java](../../../WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/node/EdgeNodeController.java)
**前端 SDK：** [node.ts](../../../WF_VMesh_Coud_UI/src/api/edge/node.ts)

---

#### 1.1.1 创建边缘节点

- **方法：** `POST /edge/node/create`
- **权限：** `edge:node:create`
- **请求体：** `EdgeNodeCreateReqVO`

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| name | String | 是 | 节点名称 | "华东-01" |
| serial | String | 是 | 节点序列号 | "SN-20260416-001" |
| model | String | 否 | 节点型号 | "VMESH-X1" |
| region | String | 否 | 区域 | "华东" |
| workshop | String | 否 | 车间 | "一车间" |
| productionLine | String | 否 | 产线 | "产线A" |
| mqttTopic | String | 否 | MQTT 主题（兼容字段） | "edge/node/01" |
| topicRoot | String | 否 | Topic 根路径 | "vmesh/edge/node/device-001" |
| brokerEndpoint | String | 否 | Broker 地址 | "ssl://mqtt.example.com:8883" |
| description | String | 否 | 描述 | "用于焊接工位视觉检测" |
| credentialDeviceId | String | 否 | 凭证设备 ID（兼容字段） | "device-001" |
| credentialSecret | String | 否 | 凭证密钥（兼容字段） | "secret-001" |
| enabledStatus | Integer | 否 | 节点启用状态 | 1 |
| defaultDispatchPolicy | String | 否 | 默认下发策略 | "IMMEDIATE" |

- **响应：** `CommonResult<Long>` → 返回节点 ID

- **前端 SDK 调用：**
  ```typescript
  import { EdgeNodeApi } from '@/api/edge/node'

  const nodeId = await EdgeNodeApi.createEdgeNode({
    name: '华东-01',
    serial: 'SN-20260416-001',
    region: '华东',
  })
  ```

---

#### 1.1.2 更新边缘节点

- **方法：** `PUT /edge/node/update`
- **权限：** `edge:node:update`
- **请求体：** `EdgeNodeUpdateReqVO`（同创建，额外增加 `id`）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | Long | 是 | 节点编号 |

- **响应：** `CommonResult<Boolean>`

---

#### 1.1.3 删除边缘节点

- **方法：** `DELETE /edge/node/delete`
- **权限：** `edge:node:delete`
- **查询参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | Long | 是 | 节点编号 |

- **响应：** `CommonResult<Boolean>`

---

#### 1.1.4 获取边缘节点详情

- **方法：** `GET /edge/node/get`
- **权限：** `edge:node:query`
- **查询参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | Long | 是 | 节点编号 |

- **响应：** `CommonResult<EdgeNodeRespVO>`

| 响应字段 | 类型 | 说明 | 示例 |
|----------|------|------|------|
| id | Long | 节点编号 | 1024 |
| name | String | 节点名称 | "华东-01" |
| serial | String | 序列号 | "SN-20260416-001" |
| model | String | 型号 | "VMESH-X1" |
| region | String | 区域 | "华东" |
| workshop | String | 车间 | "一车间" |
| productionLine | String | 产线 | "产线A" |
| mqttTopic | String | MQTT 主题 | "edge/node/01" |
| topicRoot | String | Topic 根路径 | "vmesh/edge/node/device-001" |
| brokerEndpoint | String | Broker 地址 | "ssl://mqtt.example.com:8883" |
| description | String | 描述 | "用于焊接工位视觉检测" |
| enabledStatus | Integer | 启用状态编码 | 1 |
| enabled | Boolean | 是否启用 | true |
| activationStatus | Integer | 激活状态编码 | 1 |
| status | String | 运行状态摘要（兼容字段，未启用或未激活返回 null） | "online" |
| registrationStatus | String | 注册状态 | "ACTIVATED" |
| connectionState | String | 连接状态 | "ONLINE" |
| runtimeStatus | String | 运行状态 | "RUNNING" |
| activationTime | LocalDateTime | 激活时间 | |
| lastHeartbeatTime | LocalDateTime | 最后心跳 | |
| cpuUsageRate | BigDecimal | CPU 使用率(%) | 20.15 |
| memoryUsageRate | BigDecimal | 内存使用率(%) | 68.20 |
| gpuUsageRate | BigDecimal | GPU 使用率(%) | 39.00 |
| storageUsageRate | BigDecimal | 存储使用率(%) | 56.40 |
| defaultDispatchPolicy | String | 默认下发策略 | "IMMEDIATE" |
| createTime | LocalDateTime | 创建时间 | |

> **状态语义：** `activationStatus` 仅表示当前有效凭证版本是否激活（0=待激活，1=已激活）；在线/离线与运行状态请使用 `connectionState`、`runtimeStatus`，兼容字段 `status` 仅提供前端列表摘要。

---

#### 1.1.5 分页查询边缘节点

- **方法：** `GET /edge/node/page`
- **权限：** `edge:node:query`
- **查询参数（基于 PageParam）：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| pageNo | Integer | 否 | 页码，默认 1 |
| pageSize | Integer | 否 | 每页条数，默认 10 |
| keyword | String | 否 | 关键字（名称/序列号模糊） |
| region | String | 否 | 区域筛选 |
| activationStatus | Integer | 否 | 激活状态筛选 |
| enabledStatus | Integer | 否 | 启用状态筛选 |
| registrationStatus | String | 否 | 注册状态筛选 |
| connectionState | String | 否 | 连接状态筛选 |
| runtimeStatus | String | 否 | 运行状态筛选 |
| enabled | Boolean | 否 | 是否启用（兼容字段） |

- **响应：** `CommonResult<PageResult<EdgeNodeRespVO>>`

```json
{
  "code": 0,
  "data": {
    "list": [ /* EdgeNodeRespVO 数组 */ ],
    "total": 100
  }
}
```

---

#### 1.1.6 获取边缘节点统计

- **方法：** `GET /edge/node/stats`
- **权限：** `edge:node:query`
- **响应：** `CommonResult<EdgeNodeStatsRespVO>`

| 字段 | 类型 | 说明 |
|------|------|------|
| pending | Long | 待激活节点数（`activationStatus=0`） |
| online | Long | 已激活且在线节点数（`activationStatus=1 AND connectionState=ONLINE`） |
| offline | Long | 已激活且离线节点数（`activationStatus=1 AND connectionState=OFFLINE`） |
| running | Long | 已激活且运行中节点数（`activationStatus=1 AND runtimeStatus=RUNNING`） |
| warning | Long | 已激活且告警节点数（`activationStatus=1 AND runtimeStatus=WARNING`） |
| total | Long | 节点总数 |

- **前端 SDK：** `EdgeNodeApi.getEdgeNodeStats()`

---

#### 1.1.7 获取节点凭证

- **方法：** `GET /edge/node/credential`
- **权限：** `edge:node:query`
- **查询参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| nodeId | Long | 是 | 节点编号 |

- **响应：** `CommonResult<EdgeNodeCredentialRespVO>`

| 字段 | 类型 | 说明 |
|------|------|------|
| nodeId | Long | 节点编号 |
| deviceId | String | 设备 ID |
| secretKey | String | 明文密钥（仅创建或轮换时返回） |
| secretHint | String | 密钥提示（如末4位） |
| brokerEndpoint | String | Broker 地址 |
| topicRoot | String | Topic 根路径 |
| credentialVersion | Integer | 凭证版本号 |
| issuedAt | LocalDateTime | 签发时间 |

---

#### 1.1.8 获取节点精简列表

- **方法：** `GET /edge/node/simple-list`
- **权限：** `edge:node:query`
- **响应：** `CommonResult<List<EdgeNodeSimpleRespVO>>`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Long | 节点编号 |
| name | String | 节点名称 |
| serial | String | 序列号 |

- **前端 SDK：** `EdgeNodeApi.getEdgeNodeSimpleList()`

---

#### 1.1.9 刷新节点凭证

- **方法：** `PUT /edge/node/refresh-credential`
- **权限：** `edge:node:update`
- **查询参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| nodeId | Long | 是 | 节点编号 |

- **响应：** `CommonResult<EdgeNodeCredentialRespVO>`（返回新凭证，含明文 secretKey）

> **状态影响：** 刷新凭证会撤销旧 ACTIVE 凭证并生成新版本；节点 `activationStatus` 重置为 `0`，`activationTime/lastHeartbeatTime` 清空，runtime snapshot 收敛为 `registrationStatus=PREPARED`、`connectionState=OFFLINE`、`runtimeStatus=OFFLINE`。边缘端必须使用新凭证重新完成 `authenticate -> register` 后才恢复已激活与运行态更新。

---

#### 1.1.10 获取导入模板

- **方法：** `GET /edge/node/get-import-template`
- **权限：** `edge:node:import`
- **响应：** Excel 文件（Content-Disposition: attachment）
- **模板字段：** 名称、序列号、型号、区域、车间、产线、MQTT主题、描述、凭证设备ID、凭证密钥、启用状态

---

#### 1.1.11 导入边缘节点

- **方法：** `POST /edge/node/import`
- **权限：** `edge:node:import`
- **请求方式：** `multipart/form-data`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | MultipartFile | 是 | Excel/CSV 文件 |
| updateSupport | Boolean | 否 | 是否支持更新，默认 false |

- **响应：** `CommonResult<EdgeNodeImportRespVO>`

| 字段 | 类型 | 说明 |
|------|------|------|
| createSerials | String[] | 创建成功的序列号集合 |
| updateSerials | String[] | 更新成功的序列号集合 |
| failureSerials | Map<String, String> | 导入失败集合（key=序列号, value=失败原因） |

- **支持文件格式：** Excel (.xls/.xlsx) 和 CSV（自动识别表头或按位置解析）
- **前端 SDK：** `EdgeNodeApi.importEdgeNodes(formData, updateSupport)`

---

### 1.2 设备台账 (Edge Device Controller)

**基础路径：** `POST/GET/PUT/DELETE /edge/device/**`

**Controller 源码：** [EdgeDeviceController.java](../../../WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/device/EdgeDeviceController.java)
**前端 SDK：** [device.ts](../../../WF_VMesh_Coud_UI/src/api/edge/device.ts)

---

#### 1.2.1 创建设备台账

- **方法：** `POST /edge/device/create`
- **权限：** `edge:device:create`
- **请求体：** `EdgeDeviceCreateReqVO`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| deviceCode | String | 是 | 设备业务编号 |
| serial | String | 是 | 序列号 |
| name | String | 是 | 设备名称 |
| type | String | 是 | 设备类型 |
| edgeNodeId | Long | 是 | 边缘节点编号 |
| groupId | Long | 否 | 设备组编号 |
| region | String | 否 | 区域 |
| status | Integer | 否 | 状态码 |
| resolution | String | 否 | 分辨率 |
| manufacturer | String | 否 | 厂商 |
| model | String | 否 | 型号 |
| location | String | 否 | 安装位置 |
| installTime | LocalDateTime | 否 | 安装时间 |
| lastHeartbeatTime | LocalDateTime | 否 | 最后心跳时间 |

- **响应：** `CommonResult<Long>` → 设备 ID

---

#### 1.2.2 更新设备台账

- **方法：** `PUT /edge/device/update`
- **权限：** `edge:device:update`
- **请求体：** `EdgeDeviceUpdateReqVO`（继承创建，额外增加 `id`）

---

#### 1.2.3 删除设备台账

- **方法：** `DELETE /edge/device/delete`
- **权限：** `edge:device:delete`
- **查询参数：** `id` (Long, 必填)
- **响应：** `CommonResult<Boolean>`

---

#### 1.2.4 获取设备详情

- **方法：** `GET /edge/device/get`
- **权限：** `edge:device:query`
- **查询参数：** `id` (Long, 必填)
- **响应：** `CommonResult<EdgeDeviceRespVO>`

| 响应字段 | 类型 | 说明 |
|----------|------|------|
| id | Long | 设备编号 |
| deviceCode | String | 设备业务编码 |
| serial | String | 序列号 |
| name | String | 设备名称 |
| type | String | 设备类型 |
| edgeNodeId | Long | 边缘节点编号 |
| edgeNodeName | String | 边缘节点名称 |
| region | String | 区域 |
| groupId | Long | 设备组编号 |
| groupName | String | 设备组名称 |
| status | String | 状态字符串 |
| resolution | String | 分辨率 |
| manufacturer | String | 厂商 |
| model | String | 型号 |
| location | String | 安装位置 |
| installTime | LocalDateTime | 安装时间 |
| lastHeartbeatTime | LocalDateTime | 最后心跳时间 |
| createTime | LocalDateTime | 创建时间 |

---

#### 1.2.5 分页查询设备台账

- **方法：** `GET /edge/device/page`
- **权限：** `edge:device:query`
- **查询参数（基于 PageParam）：**

| 参数 | 类型 | 说明 |
|------|------|------|
| pageNo | Integer | 页码 |
| pageSize | Integer | 每页条数 |
| keyword | String | 关键字模糊搜索 |
| region | String | 区域筛选 |
| status | String | 状态筛选 |

- **响应：** `CommonResult<PageResult<EdgeDeviceRespVO>>`

---

#### 1.2.6 获取设备精简列表

- **方法：** `GET /edge/device/simple-list`
- **权限：** `edge:device:query`
- **响应：** `CommonResult<List<EdgeDeviceSimpleRespVO>>` → `{id, name}`

---

#### 1.2.7 导出设备台账

- **方法：** `GET /edge/device/export-excel`
- **权限：** `edge:device:export`
- **查询参数：** 与分页查询相同（pageSize 自动设为不分页）
- **响应：** Excel 文件导出

---

### 1.3 设备分组 (Edge Device Group Controller)

**基础路径：** `POST/GET/PUT/DELETE /edge/group/**`

**Controller 源码：** [EdgeDeviceGroupController.java](../../../WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/group/EdgeDeviceGroupController.java)
**前端 SDK：** [group.ts](../../../WF_VMesh_Coud_UI/src/api/edge/group.ts)

---

#### 1.3.1 创建设备分组

- **方法：** `POST /edge/group/create`
- **权限：** `edge:group:create`
- **请求体：** `EdgeDeviceGroupCreateReqVO`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | String | 是 | 分组名称 |
| type | String | 是 | 分组类型 |
| region | String | 否 | 区域 |
| description | String | 否 | 分组描述 |

- **响应：** `CommonResult<Long>` → 分组 ID

---

#### 1.3.2 更新设备分组

- **方法：** `PUT /edge/group/update`
- **权限：** `edge:group:update`
- **请求体：** `EdgeDeviceGroupUpdateReqVO`（继承创建，额外增加 `id`）

---

#### 1.3.3 删除设备分组

- **方法：** `DELETE /edge/group/delete`
- **权限：** `edge:group:delete`
- **查询参数：** `id` (Long, 必填)

---

#### 1.3.4 获取设备分组详情

- **方法：** `GET /edge/group/get`
- **权限：** `edge:group:query`
- **查询参数：** `id` (Long, 必填)
- **响应：** `CommonResult<EdgeDeviceGroupRespVO>`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Long | 分组编号 |
| name | String | 分组名称 |
| type | String | 分组类型 |
| region | String | 区域 |
| deviceCount | Long | 设备数量 |
| description | String | 分组描述 |
| createTime | LocalDateTime | 创建时间 |
| devices | List | 关联设备列表（详情接口返回） |

**设备列表每项（EdgeDeviceGroupDeviceRespVO）：**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Long | 设备编号 |
| deviceCode | String | 设备编码 |
| name | String | 设备名称 |
| type | String | 设备类型 |
| status | String | 状态字符串 |
| edgeNodeName | String | 所属节点名称 |
| region | String | 区域 |
| lastHeartbeatTime | LocalDateTime | 最后心跳时间 |

---

#### 1.3.5 分页查询设备分组

- **方法：** `GET /edge/group/page`
- **权限：** `edge:group:query`
- **查询参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| pageNo | Integer | 页码 |
| pageSize | Integer | 每页条数 |
| keyword | String | 关键字（名称/描述模糊） |
| region | String | 区域筛选 |

- **响应：** `CommonResult<PageResult<EdgeDeviceGroupRespVO>>`
  > 分页列表仅返回 deviceCount，不返回 devices 明细

---

#### 1.3.6 获取设备分组精简列表

- **方法：** `GET /edge/group/simple-list`
- **权限：** `edge:group:query`
- **响应：** `CommonResult<List<EdgeDeviceGroupSimpleRespVO>>` → `{id, name}`

---

### 1.4 资源管理（新版） (Edge Resource Controller)

**基础路径：** `POST/GET/PUT/DELETE /edge/resource/**`

**Controller 源码：** [EdgeResourceController.java](../../../WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/resource/EdgeResourceController.java)

---

#### 1.4.1 创建边缘资源

- **方法：** `POST /edge/resource/create`
- **权限：** `edge:resource:create`
- **请求体：** `EdgeResourceCreateReqVO`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | String | 是 | 资源名称 |
| resourceKey | String | 是 | 资源唯一键 |
| resourceType | String | 是 | 资源类型（如 ALGORITHM_PACKAGE） |
| version | String | 是 | 版本 |
| sourceKind | String | 是 | 来源类型（如 EXTERNAL_URL） |
| externalRefType | String | 否 | 外部引用类型（如 AI_MODEL） |
| externalRefId | Long | 否 | 外部引用 ID |
| artifactUrl | String | 否 | 文件下载地址 |
| artifactSha256 | String | 否 | SHA256 |
| artifactSizeBytes | Long | 否 | 文件大小（字节） |
| inlinePayloadJson | Map | 否 | 内联配置 |
| compatibilityJson | Map | 否 | 兼容性策略 |
| status | String | 否 | 状态（如 ENABLED） |

- **响应：** `CommonResult<Long>` → 资源 ID

---

#### 1.4.2 更新边缘资源

- **方法：** `PUT /edge/resource/update`
- **权限：** `edge:resource:update`
- **请求体：** `EdgeResourceUpdateReqVO`（继承创建，额外增加 `id`）

---

#### 1.4.3 删除边缘资源

- **方法：** `DELETE /edge/resource/delete`
- **权限：** `edge:resource:delete`
- **查询参数：** `id` (Long, 必填)

---

#### 1.4.4 获取资源详情

- **方法：** `GET /edge/resource/get`
- **权限：** `edge:resource:query`
- **查询参数：** `id` (Long, 必填)
- **响应：** `CommonResult<EdgeResourceRespVO>`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Long | 资源 ID |
| name | String | 资源名称 |
| resourceKey | String | 资源唯一键 |
| resourceType | String | 资源类型 |
| version | String | 版本 |
| sourceKind | String | 来源类型 |
| externalRefType | String | 外部引用类型 |
| externalRefId | Long | 外部引用 ID |
| artifactUrl | String | 文件下载地址 |
| artifactSha256 | String | SHA256 |
| artifactSizeBytes | Long | 文件大小 |
| inlinePayloadJson | Map | 内联配置 |
| compatibilityJson | Map | 兼容性策略 |
| status | String | 状态 |
| createTime | LocalDateTime | 创建时间 |

---

#### 1.4.5 获取资源精简列表

- **方法：** `GET /edge/resource/simple-list`
- **权限：** `edge:resource:query`
- **查询参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| resourceType | String | 按资源类型筛选（可选） |

- **响应：** `CommonResult<List<EdgeResourceSimpleRespVO>>`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Long | 资源 ID |
| name | String | 资源名称 |
| resourceKey | String | 资源唯一键 |
| resourceType | String | 资源类型 |
| version | String | 版本 |
| status | String | 状态 |

---

### 1.5 任务资源（旧版兼容） (Edge Dispatch Resource Controller)

**基础路径：** `POST/GET/PUT/DELETE /edge/resource-legacy/**`

**Controller 源码：** [EdgeDispatchResourceController.java](../../../WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/resource/EdgeDispatchResourceController.java)
**前端 SDK：** [resource.ts](../../../WF_VMesh_Coud_UI/src/api/edge/resource.ts)

**说明：** 此 Controller 是旧版资源管理，路径为 `/edge/resource-legacy`，用于任务资源调度场景。

---

#### 1.5.1 获取资源精简列表

- **方法：** `GET /edge/resource-legacy/simple-list`
- **权限：** `edge:resource:query`
- **查询参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| resourceType | String | 资源类型筛选 |
| nodeId | Long | 节点 ID 筛选 |

- **响应：** `CommonResult<List<EdgeDispatchResourceRespVO>>`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Long | 资源 ID |
| resourceKey | String | 资源键 |
| resourceType | String | 资源类型 |
| name | String | 名称 |
| version | String | 版本 |
| sourceKind | String | 来源类型 |
| artifactUrl | String | 文件地址 |
| artifactSha256 | String | SHA256 |
| artifactSizeBytes | Long | 文件大小 |
| inlinePayloadJson | Object | 内联载荷 |
| compatibilityJson | Object | 兼容性配置 |
| status | String | 状态 |

---

#### 1.5.2 获取资源详情

- **方法：** `GET /edge/resource-legacy/get`
- **权限：** `edge:resource:query`
- **查询参数：** `id` (Long, 必填)
- **响应：** `CommonResult<EdgeDispatchResourceRespVO>`

---

#### 1.5.3 创建资源

- **方法：** `POST /edge/resource-legacy/create`
- **权限：** `edge:resource:create`
- **请求体：** `EdgeDispatchResourceCreateReqVO`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| resourceType | String | 是 | 资源类型 |
| name | String | 是 | 资源名称 |
| version | String | 否 | 版本 |
| sourceKind | String | 否 | 来源类型 |
| externalRefType | String | 否 | 外部引用类型 |
| externalRefId | Long | 否 | 外部引用 ID |
| artifactUrl | String | 否 | 文件地址 |
| artifactSha256 | String | 否 | SHA256 |
| artifactSizeBytes | Long | 否 | 文件大小 |
| inlinePayloadJson | String | 否 | 内联载荷(JSON字符串) |
| compatibilityJson | String | 否 | 兼容性配置(JSON字符串) |
| status | String | 否 | 状态 |

---

#### 1.5.4 更新资源 / 删除资源

- **更新：** `PUT /edge/resource-legacy/update`
- **删除：** `DELETE /edge/resource-legacy/delete` (参数: `id`)

---

### 1.6 任务中心 (Edge Task Controller)

**基础路径：** `POST/GET /edge/task/**`

**Controller 源码：** [EdgeTaskController.java](../../../WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/task/EdgeTaskController.java)
**前端 SDK：** [task.ts](../../../WF_VMesh_Coud_UI/src/api/edge/task.ts)

---

#### 1.6.1 获取任务统计

- **方法：** `GET /edge/task/statistics`
- **权限：** `edge:task:query`
- **响应：** `CommonResult<EdgeTaskStatisticsRespVO>`

| 字段 | 类型 | 说明 |
|------|------|------|
| dispatchCount | Long | 下发任务数 |
| processingCount | Long | 执行中任务数 |
| successRate | Double | 成功率 |
| exceptionCount | Long | 异常数 |

---

#### 1.6.2 创建并下发任务

- **方法：** `POST /edge/task/dispatch`
- **权限：** `edge:task:create`
- **请求体：** `EdgeTaskDispatchReqVO`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| nodeId | Long | 是 | 目标节点 ID |
| taskType | String | 是 | 任务类型 |
| resourceId | Long | 否 | 资源 ID |
| versionText | String | 否 | 版本文本 |
| inlinePayload | String | 否 | 内联载荷 |
| dispatchPolicy | String | 是 | 下发策略（如 IMMEDIATE） |

- **响应：** `CommonResult<String>` → 任务 Key

---

#### 1.6.3 分页获取任务

- **方法：** `GET /edge/task/page`
- **权限：** `edge:task:query`
- **查询参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| pageNo | Integer | 页码 |
| pageSize | Integer | 每页条数 |
| keyword | String | 关键字 |
| taskType | String | 任务类型筛选 |
| status | String | 状态筛选 |
| nodeId | Long | 节点 ID 筛选 |
| beginTime | LocalDateTime | 开始时间 |
| endTime | LocalDateTime | 结束时间 |

- **响应：** `CommonResult<PageResult<EdgeTaskRespVO>>`

| 响应字段 | 类型 | 说明 |
|----------|------|------|
| id | Long | 任务 ID |
| taskKey | String | 任务业务唯一键 |
| nodeId | Long | 节点 ID |
| nodeName | String | 节点名称 |
| taskType | String | 任务类型 |
| resourceName | String | 资源名称 |
| resourceVersion | String | 资源版本 |
| status | String | 任务状态 |
| stage | String | 阶段 |
| progressPct | Integer | 进度百分比 |
| lastMessage | String | 最近消息 |
| errorCode | String | 错误码 |
| errorMessage | String | 错误信息 |
| publishedAt | LocalDateTime | 下发时间 |
| acknowledgedAt | LocalDateTime | 确认时间 |
| startedAt | LocalDateTime | 开始时间 |
| finishedAt | LocalDateTime | 完成时间 |
| createTime | LocalDateTime | 创建时间 |

---

#### 1.6.4 获取任务详情

- **方法：** `GET /edge/task/{taskKey}`
- **权限：** `edge:task:query`
- **路径参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| taskKey | String | 任务 Key |

- **响应：** `CommonResult<EdgeTaskDetailRespVO>`（继承 EdgeTaskRespVO，额外字段）

| 额外字段 | 类型 | 说明 |
|----------|------|------|
| dispatchPolicy | String | 下发策略 |
| commandKey | String | 命令 Key |
| commandTopic | String | 命令 Topic |
| commandPayloadJson | Object | 命令载荷 |
| retryParentTaskKey | String | 重试父任务 Key |
| canceledAt | LocalDateTime | 取消时间 |

---

#### 1.6.5 分页获取任务日志

- **方法：** `GET /edge/task/{taskKey}/logs`
- **权限：** `edge:task:query`
- **路径参数：** `taskKey` (String)

| 查询参数 | 类型 | 说明 |
|----------|------|------|
| pageNo | Integer | 页码 |
| pageSize | Integer | 每页条数 |
| lastOccurredAt | LocalDateTime | 上次日志时间（增量拉取） |

- **响应：** `CommonResult<PageResult<EdgeTaskLogRespVO>>`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Long | 日志 ID |
| taskId | Long | 任务 ID |
| taskKey | String | 任务 Key |
| nodeId | Long | 节点 ID |
| eventType | String | 事件类型 |
| stage | String | 阶段 |
| status | String | 状态 |
| progressPct | Integer | 进度 |
| logLevel | String | 日志级别 |
| logMessage | String | 日志消息 |
| payloadJson | Object | 载荷 |
| occurredAt | LocalDateTime | 发生时间 |

---

#### 1.6.6 取消任务

- **方法：** `POST /edge/task/{taskKey}/cancel`
- **权限：** `edge:task:update`
- **路径参数：** `taskKey` (String)
- **请求体：** `EdgeTaskCancelReqVO`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| reason | String | 是 | 取消原因 |

- **响应：** `CommonResult<Boolean>`

---

#### 1.6.7 重试任务

- **方法：** `POST /edge/task/{taskKey}/retry`
- **权限：** `edge:task:update`
- **路径参数：** `taskKey` (String)
- **响应：** `CommonResult<String>` → 新任务 Key

---

### 1.7 运行时管理 (Edge Runtime Controller)

**Controller 基础路径：** `POST /edge/runtime/**`
**外部访问路径：** `POST /admin-api/edge/runtime/**`

**Controller 源码：** [EdgeRuntimeController.java](../../../WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/runtime/EdgeRuntimeController.java)
**前端 SDK：** [runtime.ts](../../../WF_VMesh_Coud_UI/src/api/edge/runtime.ts)

> **说明：** 运行时接口由 EMQX 通过 HTTP Hook 调用，非前端管理页面直接使用（除了 replay-event）。

---

#### 1.7.1 EMQX 节点认证

- **方法：** `POST /edge/runtime/authenticate`
- **请求体：** `EdgeRuntimeAuthReqVO`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| clientid | String | 是 | MQTT 客户端 ID |
| username | String | 是 | 用户名 |
| password | String | 是 | 密码 |
| peerhost | String | 否 | 对端地址 |
| proto_ver | String | 否 | 协议版本 |

- **响应：** `EdgeRuntimeAuthRespVO`（非标准 CommonResult 包装）

| 字段 | 类型 | 说明 |
|------|------|------|
| result | String | 认证结果, "allow" 或 "deny" |
| is_superuser | Boolean | 是否超级用户 |
| client_attrs | Map | 客户端属性 |
| acl | List | 访问控制列表 |

**ACL 条目（EdgeRuntimeTopicAclRespVO）：**

| 字段 | 类型 | 说明 |
|------|------|------|
| permission | String | 权限（allow/deny） |
| action | String | 动作（subscribe/publish/pubsub） |
| topic | String | 主题 |

---

#### 1.7.2 EMQX 运行时事件入口

- **方法：** `POST /edge/runtime/ingest`
- **请求头：**
  - `X-EMQX-SIGNATURE` (必填): EMQX HTTP Sink 共享密钥签名，必须与后端 `VMESH_EDGE_INGEST_SHARED_SECRET` 完全一致
- **请求体：** `EdgeRuntimeIngestReqVO`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| eventType | String | 是 | 事件类型 |
| eventId | String | 否 | 事件 ID |
| messageId | String | 否 | 消息 ID |
| clientId | String | 是 | MQTT 客户端 ID，必须为 `edge-node:{deviceId}` |
| username | String | 是 | MQTT 用户名，必须等于当前 ACTIVE 凭证的 `deviceId` |
| deviceId | String | 否 | 设备 ID，缺省时兼容使用 `username` |
| hardwareFingerprint | String | 边缘侧事件必填 | 节点硬件指纹；`register` 首次绑定，后续上报必须一致 |
| topic | String | 否 | 主题 |
| occurredAt | Long | 否 | 发生时间戳 |
| reason | String | 否 | 原因 |
| payload | Object | 否 | 载荷 |

- **响应：** `CommonResult<Boolean>`

- **运行时 ingest 错误码口径（联调约定）：**

| 错误码 | 说明 | 触发条件 |
|------|------|------|
| EDGE_NODE_DISABLED | 节点未启用 | `enabledStatus=0` |
| EDGE_RUNTIME_NODE_NOT_ACTIVATED | 节点未激活 | `activationStatus=0`，拒绝 runtime 状态推进 |
| EDGE_RUNTIME_AUTH_DENIED | 凭证上下文不一致 | `clientId/username/deviceId` 与当前 ACTIVE 凭证不一致 |
| EDGE_RUNTIME_DEVICE_BINDING_MISMATCH | 设备绑定不一致 | `hardwareFingerprint` 缺失、已被其他 ACTIVE 凭证绑定或与当前凭证绑定值不一致 |
| EDGE_RUNTIME_INVALID_EVENT | 事件类型非法 | `eventType` 不在允许范围 |
| EDGE_RUNTIME_INVALID_PAYLOAD | 事件载荷非法 | `deviceId/messageId/payload` 关键字段缺失或格式错误 |

---

#### 1.7.3 重放事件占位接口

- **方法：** `POST /edge/runtime/replay-event`
- **查询参数：** `eventId` (String, 必填)
- **响应：** `CommonResult<Boolean>`
- **前端 SDK：** `EdgeRuntimeApi.replayEvent({ eventId })`

---

### 1.8 监控中心 (Edge Monitor Controller)

**Controller 基础路径：** `GET /edge/monitor/**`
**外部访问路径：** `GET /admin-api/edge/monitor/**`

**Controller 源码：** [EdgeMonitorController.java](../../../WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/monitor/EdgeMonitorController.java)
**前端 SDK：** [monitor.ts](../../../WF_VMesh_Coud_UI/src/api/edge/monitor.ts)

---

#### 1.8.1 获取监控概览

- **方法：** `GET /edge/monitor/overview`
- **权限：** `edge:monitor:query`
- **响应：** `CommonResult<EdgeMonitorOverviewRespVO>`

| 字段 | 类型 | 说明 |
|------|------|------|
| registeringCount | Long | 正在注册节点数 |
| heartbeatHealthRate | BigDecimal | 心跳健康度 |
| highLoadCount | Long | 高负载节点数 |
| activeAlertCount | Long | 活跃告警数 |

- **前端 SDK：** `EdgeMonitorApi.getOverview()`

---

#### 1.8.2 分页获取注册链路

- **方法：** `GET /edge/monitor/registration/page`
- **权限：** `edge:monitor:query`
- **查询参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| pageNo | Integer | 页码 |
| pageSize | Integer | 每页条数 |
| registrationStatus | String | 注册状态筛选 |

- **响应：** `CommonResult<PageResult<EdgeMonitorRegistrationRespVO>>`

| 字段 | 类型 | 说明 |
|------|------|------|
| nodeId | Long | 节点编号 |
| nodeName | String | 节点名称 |
| registrationStatus | String | 注册状态 |
| registrationStatusLabel | String | 注册状态标签 |
| currentStep | Integer | 当前步骤 |
| lastRegisterAt | LocalDateTime | 最后注册时间 |
| lastConnectedAt | LocalDateTime | 最后连接时间 |
| latestEventId | String | 最近事件 ID |

---

#### 1.8.3 分页获取心跳节点

- **方法：** `GET /edge/monitor/heartbeat/page`
- **权限：** `edge:monitor:query`
- **查询参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| pageNo | Integer | 页码 |
| pageSize | Integer | 每页条数 |
| keyword | String | 关键字搜索 |
| status | String | 状态筛选 |

- **响应：** `CommonResult<PageResult<EdgeMonitorHeartbeatRespVO>>`

| 字段 | 类型 | 说明 |
|------|------|------|
| nodeId | Long | 节点编号 |
| nodeName | String | 节点名称 |
| status | String | 在线状态 |
| lastHeartbeatAt | LocalDateTime | 最后心跳时间 |
| heartbeatIntervalSec | Integer | 心跳间隔(秒) |
| heartbeatSuccessRate24h | BigDecimal | 24小时心跳成功率 |
| heartbeatSlots | List<Boolean> | 最近心跳槽位（30槽脉冲图） |

---

#### 1.8.4 分页获取连接设备异常状态

- **方法：** `GET /edge/monitor/device-abnormal/page`
- **外部访问：** `GET /admin-api/edge/monitor/device-abnormal/page`
- **权限：** `edge:monitor:query`
- **查询参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| pageNo | Integer | 页码 |
| pageSize | Integer | 每页条数 |
| keyword | String | 节点名称、设备名称、设备编码关键词 |
| nodeId | Long | 边缘节点 ID |
| deviceType | String | 设备类型，如 CAMERA |
| status | String | 异常状态 |

- **响应：** `CommonResult<PageResult<EdgeMonitorAbnormalDeviceRespVO>>`

| 字段 | 类型 | 说明 |
|------|------|------|
| deviceId | Long | 设备 ID |
| deviceKey | String | 设备业务编码 |
| nodeId | Long | 所属边缘节点 ID |
| nodeName | String | 所属边缘节点名称 |
| deviceName | String | 设备名称 |
| deviceType | String | 设备类型 |
| status | String | 异常状态 |
| statusLabel | String | 异常状态中文标签 |
| metricText | String | 异常指标展示文本 |
| abnormalReason | String | 异常说明 |
| lastReportedAt | LocalDateTime | 最近上报时间 |

- **前端 SDK：** `EdgeMonitorApi.getAbnormalDevicePage(params)`

---

#### 1.8.5 获取边缘节点系统状态预警

- **方法：** `GET /edge/monitor/system-status/page`
- **外部访问：** `GET /admin-api/edge/monitor/system-status/page`
- **权限：** `edge:monitor:query`
- **查询参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| pageNo | Integer | 页码；当前返回 List，可不传 |
| pageSize | Integer | 每页条数；当前返回 List，可不传 |
| sortBy | String | 排序字段（cpu / npu / temp / memory / storage） |
| healthLevel | String | 健康等级 |

- **响应：** `CommonResult<List<EdgeMonitorSystemStatusRespVO>>`

| 字段 | 类型 | 说明 |
|------|------|------|
| nodeId | Long | 边缘节点 ID |
| nodeName | String | 边缘节点名称 |
| activeTaskKey | String | 当前承载任务 Key |
| activeTaskName | String | 当前承载任务名称 |
| systemStatus | String | 系统状态摘要 |
| healthLevel | String | 健康等级 |
| cpuUsageRate | BigDecimal | CPU 使用率 |
| npuUsageRate | BigDecimal | NPU/GPU 使用率 |
| memoryUsageRate | BigDecimal | 内存使用率 |
| storageUsageRate | BigDecimal | 存储使用率 |
| temperatureC | BigDecimal | 设备温度 |
| packetLossPct | BigDecimal | 丢包率 |
| recommendation | String | 处置建议 |
| lastMetricAt | LocalDateTime | 最近指标时间 |

- **前端 SDK：** `EdgeMonitorApi.getSystemStatusPage(params)`

---

#### 1.8.6 获取高负载节点

- **方法：** `GET /edge/monitor/high-load/page`
- **权限：** `edge:monitor:query`
- **查询参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| pageNo | Integer | 页码 |
| pageSize | Integer | 每页条数 |
| sortBy | String | 排序字段（cpu / npu / temp） |

- **响应：** `CommonResult<List<EdgeMonitorHighLoadRespVO>>`（注意：返回的是 List，非分页）

| 字段 | 类型 | 说明 |
|------|------|------|
| nodeId | Long | 节点编号 |
| nodeName | String | 节点名称 |
| activeTaskKey | String | 当前任务 Key |
| cpuUsageRate | BigDecimal | CPU 使用率 |
| npuUsageRate | BigDecimal | NPU 使用率 |
| memoryUsageRate | BigDecimal | 内存使用率 |
| temperatureC | BigDecimal | 温度(℃) |
| packetLossPct | BigDecimal | 丢包率(%) |
| healthLevel | String | 健康等级 |

---

#### 1.8.7 分页获取活动告警

- **方法：** `GET /edge/monitor/alert/page`
- **权限：** `edge:monitor:query`
- **查询参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| pageNo | Integer | 页码 |
| pageSize | Integer | 每页条数 |
| status | String | 告警状态筛选 |
| severity | String | 严重级别筛选 |
| alertType | String | 告警类型筛选 |

- **响应：** `CommonResult<PageResult<EdgeMonitorAlertRespVO>>`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Long | 告警 ID |
| alertKey | String | 告警 Key |
| nodeId | Long | 节点编号 |
| nodeName | String | 节点名称 |
| alertType | String | 告警类型 |
| severity | String | 严重级别 |
| status | String | 状态 |
| summary | String | 摘要 |
| triggerValue | String | 触发值 |
| thresholdValue | String | 阈值 |
| firstTriggeredAt | LocalDateTime | 首次触发时间 |
| lastTriggeredAt | LocalDateTime | 最近触发时间 |
| recoveredAt | LocalDateTime | 恢复时间 |

---

#### 1.8.8 获取节点运行详情

- **方法：** `GET /edge/monitor/node/{nodeId}/detail`
- **权限：** `edge:monitor:query`
- **路径参数：** `nodeId` (Long)
- **响应：** `CommonResult<EdgeNodeMonitorDetailRespVO>`

| 字段 | 类型 | 说明 |
|------|------|------|
| nodeId | Long | 节点编号 |
| nodeName | String | 节点名称 |
| deviceId | String | 设备 ID |
| registrationStatus | String | 注册状态 |
| connectionState | String | 连接状态 |
| runtimeStatus | String | 运行状态 |
| activeTaskKey | String | 当前任务 Key |
| lastConnectedAt | LocalDateTime | 最后连接时间 |
| lastDisconnectedAt | LocalDateTime | 最后断开时间 |
| lastHeartbeatAt | LocalDateTime | 最后心跳时间 |
| cpuUsageRate | BigDecimal | CPU 使用率 |
| memoryUsageRate | BigDecimal | 内存使用率 |
| npuUsageRate | BigDecimal | NPU 使用率 |
| storageUsageRate | BigDecimal | 存储使用率 |
| temperatureC | BigDecimal | 温度 |
| edgeRttMs | BigDecimal | 边缘 RTT(ms) |
| cloudProbeRttMs | BigDecimal | 云探测 RTT(ms) |
| packetLossPct | BigDecimal | 丢包率(%) |
| heartbeatSuccessRate24h | BigDecimal | 24h 心跳成功率 |
| healthScore | Integer | 健康评分 |
| healthLevel | String | 健康等级 |
| latestEventId | String | 最近事件 ID |

---

#### 1.8.9 获取节点指标趋势

- **方法：** `GET /edge/monitor/node/{nodeId}/trend`
- **权限：** `edge:monitor:query`
- **路径参数：** `nodeId` (Long)
- **查询参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| metricType | String | 是 | 指标类型 |
| range | String | 是 | 时间范围 |

**metricType 枚举：** cpuUsageRate, memoryUsageRate, npuUsageRate, storageUsageRate, temperatureC, edgeRttMs, packetLossPct, cloudProbeRttMs

**range 枚举：** 1h, 6h, 24h

- **响应：** `CommonResult<List<EdgeMonitorNodeTrendPointRespVO>>`

| 字段 | 类型 | 说明 |
|------|------|------|
| bucketTime | LocalDateTime | 时间桶 |
| value | BigDecimal | 指标值 |

- **前端 SDK：** `EdgeMonitorApi.getNodeTrend(nodeId, { metricType, range })`

---

## 附录

### A. 枚举常量参考

#### 节点状态分层映射

| 字段 | 取值 | 含义 |
|:---:|:---:|:---:|
| activationStatus | 0 / 1 | 当前凭证版本待激活 / 当前凭证版本已激活 |
| registrationStatus | PREPARED / REGISTERED / ACTIVATED | 注册链路阶段 |
| connectionState | UNKNOWN / ONLINE / OFFLINE | MQTT 连接态 |
| runtimeStatus | OFFLINE / ONLINE / RUNNING / WARNING | 运行态 |

#### 设备状态枚举（EdgeDeviceStatusEnum）

| code | status 字符串 | 含义 |
|:---:|:---:|:---:|
| 0 | offline | 离线 |
| 1 | online | 在线 |
| 2 | running | 运行中 |
| 3 | warning | 告警 |

#### 任务相关枚举

- **EdgeTaskStatusEnum：** 任务状态（CREATED, DISPATCHED, ACCEPTED, PROCESSING, SUCCESS, FAILED, CANCELED, TIMEOUT）
- **EdgeTaskTypeEnum：** 任务类型
- **EdgeDispatchPolicyEnum：** 下发策略（IMMEDIATE, WHEN_ONLINE）
- **EdgeAlertSeverityEnum：** 告警严重级别
- **EdgeResourceTypeEnum：** 资源类型
- **EdgeConnectionStateEnum：** 连接状态
- **EdgeRegistrationStatusEnum：** 注册状态
- **EdgeRuntimeStatusEnum：** 运行状态

---

### B. 前端 API SDK 索引

| 模块 | SDK 文件路径 | 导出对象 |
|------|-------------|----------|
| 节点管理 | [node.ts](../../../WF_VMesh_Coud_UI/src/api/edge/node.ts) | EdgeNodeApi |
| 设备台账 | [device.ts](../../../WF_VMesh_Coud_UI/src/api/edge/device.ts) | EdgeDeviceApi |
| 设备分组 | [group.ts](../../../WF_VMesh_Coud_UI/src/api/edge/group.ts) | EdgeGroupApi |
| 任务中心 | [task.ts](../../../WF_VMesh_Coud_UI/src/api/edge/task.ts) | EdgeTaskApi |
| 边缘监控 | [monitor.ts](../../../WF_VMesh_Coud_UI/src/api/edge/monitor.ts) | EdgeMonitorApi |
| 运行时 | [runtime.ts](../../../WF_VMesh_Coud_UI/src/api/edge/runtime.ts) | EdgeRuntimeApi |
| 任务资源 | [resource.ts](../../../WF_VMesh_Coud_UI/src/api/edge/resource.ts) | EdgeResourceApi |

---

### C. 后端 Source 文件索引

| 模块 | 组件 | 路径 |
|------|------|------|
| edge | Node Controller | [EdgeNodeController.java](../../../WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/node/EdgeNodeController.java) |
| edge | Device Controller | [EdgeDeviceController.java](../../../WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/device/EdgeDeviceController.java) |
| edge | Group Controller | [EdgeDeviceGroupController.java](../../../WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/group/EdgeDeviceGroupController.java) |
| edge | Resource Controller | [EdgeResourceController.java](../../../WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/resource/EdgeResourceController.java) |
| edge | Dispatch Resource Controller | [EdgeDispatchResourceController.java](../../../WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/resource/EdgeDispatchResourceController.java) |
| edge | Task Controller | [EdgeTaskController.java](../../../WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/task/EdgeTaskController.java) |
| edge | Runtime Controller | [EdgeRuntimeController.java](../../../WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/runtime/EdgeRuntimeController.java) |
| edge | Monitor Controller | [EdgeMonitorController.java](../../../WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/monitor/EdgeMonitorController.java) |
