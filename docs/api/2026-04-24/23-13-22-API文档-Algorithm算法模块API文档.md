# Algorithm 算法模块 API 文档

> 本文档基于 `vmesh-module-algorithm` 后端 Controller + 前端 API SDK 源文件整理生成。
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

1. [算法管理](#11-算法管理-algorithm-controller)
2. [发布管理](#12-发布管理-publish-controller)
3. [算法配置管理](#13-算法配置管理-algorithm-config-controller)

---

### 1.1 算法管理 (Algorithm Controller)

**基础路径：** `POST/GET/PUT/DELETE /algorithm/**`

**Controller 源码：** [AlgorithmController.java](/Users/yo/项目/ai_vision/cloud_agent/cloud/vmesh-module-algorithm/src/main/java/com/wf/vmesh/module/algorithm/controller/admin/AlgorithmController.java)
**前端 SDK：** [algorithm.ts](/Users/yo/项目/ai_vision/cloud_agent/cloud_ui/src/api/algorithm/algorithm.ts)

---

#### 1.1.1 获取算法分页列表

- **方法：** `GET /algorithm/page`
- **查询参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| pageNo | Integer | 页码 |
| pageSize | Integer | 每页条数 |
| keyword | String | 关键字（名称） |
| scenario | String | 场景类型代码 |
| status | String | 状态（active/inactive） |

- **响应：** `CommonResult<PageResult<AlgorithmRespVO>>`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Long | 算法 ID |
| name | String | 算法名称 |
| scenario | String | 场景类型代码 |
| scenarioName | String | 场景类型名称 |
| type | String | 算法类型 |
| modelArchitecture | String | 模型架构 |
| description | String | 算法描述 |
| currentVersion | String | 当前版本号 |
| versionCount | Integer | 版本数量 |
| status | String | 状态 |
| createTime | String | 创建时间 |
| updateTime | String | 更新时间 |
| creatorName | String | 创建人名称 |
| history | List | 版本历史 |

---

#### 1.1.2 获取算法详情

- **方法：** `GET /algorithm/{id}`
- **路径参数：** `id` (Long)
- **响应：** `CommonResult<AlgorithmRespVO>`

---

#### 1.1.3 上传算法模型

- **方法：** `POST /algorithm`
- **请求方式：** `multipart/form-data`
- **请求参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | String | 是 | 算法名称 |
| scenario | String | 是 | 场景类型代码 |
| type | String | 是 | 算法类型 |
| modelArchitecture | String | 否 | 模型架构 |
| version | String | 是 | 版本号 |
| versionDescription | String | 否 | 版本描述 |
| description | String | 否 | 算法描述 |
| relatedModelId | Long | 否 | 关联模型 ID（用于新版本） |
| fileId | Long | 是 | 文件 ID（先调用文件上传接口获得） |

- **响应：** `CommonResult<Long>` → 算法 ID

> **前端上传流程：** 先通过 `getFilePresignedUrl()` 获取预签名上传地址，上传文件后调用 `createFile()` 创建文件记录获得 fileId，再调用此接口。

---

#### 1.1.4 更新算法基本信息

- **方法：** `PUT /algorithm/{id}`
- **路径参数：** `id` (Long)
- **请求体：** `AlgorithmRespVO`
- **响应：** `CommonResult<Boolean>`

---

#### 1.1.5 删除算法

- **方法：** `DELETE /algorithm/{id}`
- **路径参数：** `id` (Long)
- **响应：** `CommonResult<Boolean>`

---

#### 1.1.6 获取算法版本历史

- **方法：** `GET /algorithm/{id}/versions`
- **路径参数：** `id` (Long)
- **响应：** `CommonResult<List<AlgorithmVersionRespVO>>`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Long | 版本 ID |
| version | String | 版本号 |
| fileSize | String | 文件大小 |
| description | String | 版本描述 |
| updateTime | String | 更新时间 |
| updaterName | String | 更新人 |
| isCurrent | Boolean | 是否为当前版本 |

---

#### 1.1.7 获取可发布的模型列表

- **方法：** `GET /algorithm/available-models`
- **响应：** `CommonResult<List<AlgorithmRespVO>>`

---

#### 1.1.8 获取模型下载预签名 URL

- **方法：** `GET /algorithm/download`
- **查询参数：** `versionId` (Long, 必填)
- **响应：** `CommonResult<String>` → 下载 URL

---

### 1.2 发布管理 (Publish Controller)

**基础路径：** `POST/GET/DELETE /algorithm-publish/**`

**Controller 源码：** [PublishController.java](/Users/yo/项目/ai_vision/cloud_agent/cloud/vmesh-module-algorithm/src/main/java/com/wf/vmesh/module/algorithm/controller/admin/PublishController.java)
**前端 SDK：** [publish.ts](/Users/yo/项目/ai_vision/cloud_agent/cloud_ui/src/api/algorithm/publish.ts)

---

#### 1.2.1 获取发布分页列表

- **方法：** `GET /algorithm-publish/page`
- **查询参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| pageNo | Integer | 页码 |
| pageSize | Integer | 每页条数 |
| keyword | String | 关键字搜索 |
| status | String | 状态筛选（pending/success/failed） |

- **响应：** `CommonResult<PageResult<PublishRespVO>>`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Long | 发布 ID |
| publishVersion | String | 发布版本号 |
| modelId | Long | 关联模型 ID |
| modelName | String | 关联模型名称 |
| modelVersion | String | 关联模型版本 |
| configId | Long | 关联配置 ID |
| configName | String | 关联配置名称 |
| configVersion | String | 关联配置版本 |
| releaseNote | String | 发布说明 |
| releaseType | String | 发布类型 |
| status | String | 状态（pending/success/failed） |
| publisherName | String | 发布人 |
| createTime | String | 创建时间 |
| updateTime | String | 更新时间 |
| creatorName | String | 创建人 |

---

#### 1.2.2 获取发布详情

- **方法：** `GET /algorithm-publish/{id}`
- **路径参数：** `id` (Long)
- **响应：** `CommonResult<PublishRespVO>`

---

#### 1.2.3 创建发布

- **方法：** `POST /algorithm-publish`
- **请求体：** `PublishCreateReqVO`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| publishVersion | String | 否 | 发布版本号 |
| modelId | Long | 否 | 关联模型 ID |
| configId | Long | 否 | 关联配置 ID |
| releaseType | String | 否 | 发布类型（默认 stable） |
| remark | String | 否 | 发布说明 |

- **响应：** `CommonResult<Long>` → 发布 ID

---

#### 1.2.4 删除发布

- **方法：** `DELETE /algorithm-publish/{id}`
- **路径参数：** `id` (Long)
- **响应：** `CommonResult<Boolean>`

---

#### 1.2.5 生成发布版本号

- **方法：** `POST /algorithm-publish/generate-version`
- **请求体：**

| 字段 | 类型 | 说明 |
|------|------|------|
| modelId | Long | 模型 ID |
| configId | Long | 配置 ID |
| releaseType | String | 发布类型（默认 stable） |

- **响应：** `CommonResult<Map<String, String>>`
  ```json
  { "publishVersion": "v1.0.0-20240101" }
  ```

---

### 1.3 算法配置管理 (Algorithm Config Controller)

**基础路径：** `POST/GET/PUT/DELETE /algorithm-config/**`

**Controller 源码：** [AlgorithmConfigController.java](/Users/yo/项目/ai_vision/cloud_agent/cloud/vmesh-module-algorithm/src/main/java/com/wf/vmesh/module/algorithm/controller/admin/AlgorithmConfigController.java)
**前端 SDK：** [config.ts](/Users/yo/项目/ai_vision/cloud_agent/cloud_ui/src/api/algorithm/config.ts)

---

#### 1.3.1 获取配置分页列表

- **方法：** `GET /algorithm-config/page`
- **查询参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| pageNo | Integer | 页码 |
| pageSize | Integer | 每页条数 |
| keyword | String | 关键字（配置名称） |
| scenarioType | String | 场景类型代码 |
| status | String | 状态（active/inactive） |

- **响应：** `CommonResult<PageResult<ConfigRespVO>>`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Long | 配置 ID |
| name | String | 配置名称 |
| scenarioType | String | 场景类型代码 |
| scenarioName | String | 场景类型名称 |
| description | String | 配置描述 |
| currentVersion | String | 当前版本号 |
| versionCount | Integer | 版本数量 |
| status | String | 状态 |
| createTime | String | 创建时间 |
| updateTime | String | 更新时间 |
| creatorName | String | 创建人 |
| history | List | 版本历史 |

---

#### 1.3.2 获取配置详情

- **方法：** `GET /algorithm-config/{id}`
- **路径参数：** `id` (Long)
- **响应：** `CommonResult<ConfigRespVO>`

---

#### 1.3.3 创建配置

- **方法：** `POST /algorithm-config`
- **请求体：** `ConfigCreateReqVO`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | String | 否 | 配置名称 |
| scenarioType | String | 否 | 场景类型代码 |
| description | String | 否 | 配置描述 |
| version | String | 否 | 版本号 |
| content | String | 否 | 配置内容（JSON 格式） |
| versionDescription | String | 否 | 版本更新说明 |
| relatedConfigId | Long | 否 | 关联配置 ID |

- **响应：** `CommonResult<Long>` → 配置 ID

---

#### 1.3.4 更新配置（创建新版本）

- **方法：** `PUT /algorithm-config/{id}`
- **路径参数：** `id` (Long)
- **请求体：** `ConfigCreateReqVO`
- **响应：** `CommonResult<Long>` → 新版本配置 ID

---

#### 1.3.5 删除配置

- **方法：** `DELETE /algorithm-config/{id}`
- **路径参数：** `id` (Long)
- **响应：** `CommonResult<Boolean>`

---

#### 1.3.6 获取配置版本历史

- **方法：** `GET /algorithm-config/{id}/versions`
- **路径参数：** `id` (Long)
- **响应：** `CommonResult<List<ConfigVersionRespVO>>`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Long | 版本 ID |
| version | String | 版本号 |
| content | String | 配置内容（JSON） |
| description | String | 版本描述 |
| updateTime | String | 更新时间 |
| updaterName | String | 更新人 |
| isCurrent | Boolean | 是否当前版本 |

---

#### 1.3.7 获取指定版本详情

- **方法：** `GET /algorithm-config/{id}/versions/{versionId}`
- **路径参数：** `id` (Long), `versionId` (Long)
- **响应：** `CommonResult<ConfigVersionRespVO>`

---

#### 1.3.8 获取可发布的配置列表

- **方法：** `GET /algorithm-config/available-configs`
- **响应：** `CommonResult<List<ConfigRespVO>>`

---

#### 1.3.9 验证配置格式

- **方法：** `POST /algorithm-config/validate`
- **请求体：** `{ "content": "{}" }`
- **响应：** `CommonResult<Map<String, Object>>`
  ```json
  { "valid": true }
  ```

---

## 附录

### A. 前端 API SDK 索引

| 模块 | SDK 文件路径 | 导出方式 |
|------|-------------|----------|
| 算法管理 | [algorithm.ts](/Users/yo/项目/ai_vision/cloud_agent/cloud_ui/src/api/algorithm/algorithm.ts) | 独立导出函数 |
| 发布管理 | [publish.ts](/Users/yo/项目/ai_vision/cloud_agent/cloud_ui/src/api/algorithm/publish.ts) | 独立导出函数 |
| 配置管理 | [config.ts](/Users/yo/项目/ai_vision/cloud_agent/cloud_ui/src/api/algorithm/config.ts) | 独立导出函数 |

---

### B. 后端 Source 文件索引

| 组件 | 路径 |
|------|------|
| Algorithm Controller | [AlgorithmController.java](/Users/yo/项目/ai_vision/cloud_agent/cloud/vmesh-module-algorithm/src/main/java/com/wf/vmesh/module/algorithm/controller/admin/AlgorithmController.java) |
| Publish Controller | [PublishController.java](/Users/yo/项目/ai_vision/cloud_agent/cloud/vmesh-module-algorithm/src/main/java/com/wf/vmesh/module/algorithm/controller/admin/PublishController.java) |
| Config Controller | [AlgorithmConfigController.java](/Users/yo/项目/ai_vision/cloud_agent/cloud/vmesh-module-algorithm/src/main/java/com/wf/vmesh/module/algorithm/controller/admin/AlgorithmConfigController.java) |
