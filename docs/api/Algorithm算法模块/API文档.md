---
lifecycle: living
topic: Algorithm算法模块
type: API文档
created: 2026-04-30
last_updated: 2026-04-30
status: active
supersedes:
  - docs_old/api/2026-04-24/23-13-22-API文档-Algorithm算法模块API文档.md
related: []
---

# Algorithm 算法模块 API 文档

## 1. 文档说明

- 契约来源：`moon_cloud_backend/vmesh-module-algorithm/src/main/java/com/wf/vmesh/module/algorithm/controller/admin/**` 与 `moon_cloud_frontend/src/api/algorithm/**`。
- OpenAPI 来源：未读取实时 `/v3/api-docs`。
- 适用模块：算法管理、算法配置、算法发布。
- 验证口径：本次仅做静态核对，未执行接口联调、未编译验证。
- 统一前缀：管理后台接口默认由网关追加 `/admin-api`。

## 2. 接口清单

### 2.1 算法管理 `/algorithm`

| 接口 | 方法 | 路径 | 状态 | 来源 |
|------|------|------|------|------|
| 分页查询 | GET | `/algorithm/page` | current | `AlgorithmController#getPage`、`src/api/algorithm/algorithm.ts` |
| 算法详情 | GET | `/algorithm/{id}` | current | `AlgorithmController#get` |
| 上传算法 | POST | `/algorithm` | current | `AlgorithmController#create` |
| 更新算法 | PUT | `/algorithm/{id}` | current | `AlgorithmController#update` |
| 删除算法 | DELETE | `/algorithm/{id}` | current | `AlgorithmController#delete` |
| 版本历史 | GET | `/algorithm/{id}/versions` | current | `AlgorithmController#getVersions` |
| 可发布模型 | GET | `/algorithm/available-models` | current | `AlgorithmController#getAvailableModels` |
| 下载模型 | GET | `/algorithm/download?versionId={versionId}` | current | `AlgorithmController#download` |

关键请求：

- 上传算法使用 `AlgorithmUploadReqVO` 与文件中心结果，前端在 `src/api/algorithm/algorithm.ts` 中通过预签名上传获取 `fileId` 后提交算法。
- 分页查询使用 `AlgorithmPageReqVO`，前端参数包含 `pageNo`、`pageSize`、`keyword`、`scenario`、`status` 等。

### 2.2 配置管理 `/algorithm-config`

| 接口 | 方法 | 路径 | 状态 | 来源 |
|------|------|------|------|------|
| 分页查询 | GET | `/algorithm-config/page` | current | `AlgorithmConfigController#getPage`、`src/api/algorithm/config.ts` |
| 配置详情 | GET | `/algorithm-config/{id}` | current | `AlgorithmConfigController#get` |
| 创建配置 | POST | `/algorithm-config` | current | `AlgorithmConfigController#create` |
| 更新配置 | PUT | `/algorithm-config/{id}` | current | `AlgorithmConfigController#update` |
| 删除配置 | DELETE | `/algorithm-config/{id}` | current | `AlgorithmConfigController#delete` |
| 配置版本 | GET | `/algorithm-config/{id}/versions` | current | `AlgorithmConfigController#getVersions` |
| 版本详情 | GET | `/algorithm-config/{id}/versions/{versionId}` | current | `AlgorithmConfigController#getVersion` |
| 可用配置 | GET | `/algorithm-config/available-configs` | current | `AlgorithmConfigController#getAvailableConfigs` |
| 校验配置 | POST | `/algorithm-config/validate` | current | `AlgorithmConfigController#validate` |

### 2.3 发布管理 `/algorithm-publish`

| 接口 | 方法 | 路径 | 状态 | 来源 |
|------|------|------|------|------|
| 分页查询 | GET | `/algorithm-publish/page` | current | `PublishController#getPage`、`src/api/algorithm/publish.ts` |
| 发布详情 | GET | `/algorithm-publish/{id}` | current | `PublishController#get` |
| 创建发布 | POST | `/algorithm-publish` | current | `PublishController#create` |
| 删除发布 | DELETE | `/algorithm-publish/{id}` | current | `PublishController#delete` |
| 生成版本号 | POST | `/algorithm-publish/generate-version` | current | `PublishController#generateVersion` |

## 3. 字段口径

| 字段/枚举 | 类型 | 说明 | 来源 |
|-----------|------|------|------|
| `scenario` | String | 算法场景类型代码 | `AlgorithmPageReqVO`、`AlgorithmRespVO` |
| `status` | String | 算法或发布状态，旧文档中有 `active/inactive`、`pending/success/failed` 口径，需以源码/字典为准 | Controller/VO 静态扫描 |
| `fileId` | Long | 模型文件中心 ID | `AlgorithmUploadReqVO`、前端预签名上传流程 |
| `publishVersion` | String | 发布版本号 | `PublishCreateReqVO`、`PublishRespVO` |

## 4. 数据集接口说明

前端存在 `moon_cloud_frontend/src/api/algorithm/dataset.ts` 与 `src/views/algorithm/dataset/**`，但当前后端静态扫描未在 `vmesh-module-algorithm` 中发现对应 Dataset Controller。该部分不纳入当前已确认 API 文档，后续需要单独做契约确认。

## 5. 验证与未确认项

- 已验证：静态确认 `AlgorithmController`、`AlgorithmConfigController`、`PublishController` 路径与前端 SDK 路径。
- 未验证：未读取实时 OpenAPI，未执行接口联调，未执行后端编译，未执行前端构建。
- 未确认项：字典枚举、权限码、数据集接口是否由其他模块提供。

## 变更日志

| 日期 | 变更摘要 | 变更来源 |
|------|----------|----------|
| 2026-04-30 | 将旧 Algorithm API 文档迁移为当前源码口径活文档 | `docs_old/api/2026-04-24/*Algorithm*`、当前 Controller 与前端 SDK |
