---
lifecycle: record
topic: docs_codex
type: 索引
created: 2026-04-30
status: active
---

# docs_codex 项目文档索引

## 使用约定

- 本目录是从 `docs_old` 重整后的当前有效文档集，只保留对当前项目仍有指导意义的活文档和测试数据说明。
- 不迁移旧的 `review-tracking` 时间线、治理评审快照、交接快照和 dated 历史记录。
- 文档结构遵守 `.agents/rules/document-governance.md`：活文档使用 `docs_codex/<类型目录>/<主题短名>/<类型标签>.md`。
- 当前文档以本仓库源码为准，旧文档中的 `WF_VMesh_Coud`、`WF_VMesh_Coud_UI`、`cloud/`、`cloud_ui/` 路径已统一修正为 `moon_cloud_backend/`、`moon_cloud_frontend/`、`moon_cloud_design/`。
- 未执行构建、测试、数据库迁移或接口联调的内容，正文均标注“未验证/未执行测试/未编译验证”。

## 当前有效主题

| 主题 | 当前文档 | 说明 |
|------|----------|------|
| Edge 边缘模块 | [API文档](./api/Edge边缘模块/API文档.md) | 节点、设备、分组、资源、运行时、监控、任务中心接口总览 |
| Algorithm 算法模块 | [API文档](./api/Algorithm算法模块/API文档.md) | 算法、配置、发布接口总览 |
| 边云协同 Edge 全链路 | [设计方案](./design/边云协同Edge全链路/设计方案.md) | Edge 管理、Runtime、监控、任务、资源中心总体方案 |
| Edge 全链路交接记录 | [交接文档](./design/2026-04-22/21-01-00-交接文档-Edge全链路落地任务交接.md) | Edge 全链路方案的附属流水记录 |
| 边缘监控与任务流水 | [设计方案](./design/边缘监控与任务流水/设计方案.md) | 监控页、任务流水页与目标接口口径 |
| 边缘节点状态语义 | [设计方案](./design/边缘节点状态语义/设计方案.md) | enabled、activation、registration、connection、runtime 分层 |
| 前端性能治理 | [设计方案](./design/前端性能治理/设计方案.md) | 前端瘦身与依赖清理边界 |
| EMQX MQTT 接入 | [部署方案](./deployment/EMQX-MQTT接入/部署方案.md) | Topic、鉴权、Rule Engine、配置项与联调边界 |
| Portainer 部署 | [部署方案](./deployment/Portainer部署/部署方案.md) | Jenkins、镜像、Docker Compose、Portainer 发布边界 |
| 协作治理 | [设计方案](./design/协作治理/设计方案.md) | `.agents` 规范、API-First、文档治理、三工程协作边界 |
| Edge MQTT 测试数据 | [测试数据说明](./test-data/edge-node-mqtt/README.md) | MQTT payload 使用顺序与 Cloud ingest 映射 |
| Review 流水记录 | [Review 与优化建议跟踪](./review-tracking/README.md) | review 清单、优化建议、联调发现和回归风险流水记录 |

## 迁移覆盖检查

| docs_old 来源 | docs_codex 去向 | 结论 |
|---------------|-----------------|------|
| `docs_old/README.md` | [README](./README.md) | 已迁移为当前索引 |
| `docs_old/api/2026-04-24/*Edge*`、`docs_old/api/2026-04-28/*边缘监控与任务流水*` | [Edge API](./api/Edge边缘模块/API文档.md)、[边缘监控与任务流水](./design/边缘监控与任务流水/设计方案.md) | 已合并迁移 |
| `docs_old/api/2026-04-24/*Algorithm*` | [Algorithm API](./api/Algorithm算法模块/API文档.md) | 已迁移 |
| `docs_old/design/2026-04-21/*MQTT与监控任务中心总览*`、`docs_old/design/2026-04-22/*Edge全链路生产级设计*` | [Edge 全链路设计](./design/边云协同Edge全链路/设计方案.md) | 已合并迁移 |
| `docs_old/design/2026-04-28/*边缘监控与任务流水*` | [边缘监控与任务流水](./design/边缘监控与任务流水/设计方案.md) | 已迁移 |
| `docs_old/design/2026-04-29/*边缘节点状态语义*` | [边缘节点状态语义](./design/边缘节点状态语义/设计方案.md) | 已迁移 |
| `docs_old/design/2026-04-24/frontend-slimming-plan.md` | [前端性能治理](./design/前端性能治理/设计方案.md) | 已迁移审核后结论，未保留过激删除清单 |
| `docs_old/deployment/2026-04-17/*Portainer*` | [Portainer 部署](./deployment/Portainer部署/部署方案.md) | 已迁移并修正当前仓库路径 |
| `docs_old/deployment/2026-04-28/*EMQX*`、`docs_old/deployment/2026-04-30/*MQTT双向Topic*` | [EMQX MQTT 接入](./deployment/EMQX-MQTT接入/部署方案.md) | 已合并迁移 |
| `docs_old/governance/2026-04-17/*` | [协作治理](./design/协作治理/设计方案.md) | 已迁移稳定治理结论，旧评审快照正文不保留 |
| `docs_old/test-data/edge-node-mqtt/README.md`、`*.json` | [Edge MQTT 测试数据](./test-data/edge-node-mqtt/README.md) 与同目录 11 个 JSON | 已原样迁移测试样例 |
| `docs_old/review-tracking/**` | [Review 流水记录](./review-tracking/README.md) | 已按用户确认作为流水记录迁移 |
| `docs_old/design/2026-04-22/*交接文档*` | [Edge 全链路交接记录](./design/2026-04-22/21-01-00-交接文档-Edge全链路落地任务交接.md) | 已按用户确认作为方案附属流水记录迁移 |
| `docs_old/.DS_Store`、`docs_old/**/.DS_Store` | 不迁移 | 系统文件，不属于文档 |

## 当前项目证据

| 类型 | 证据 |
|------|------|
| 后端模块 | `moon_cloud_backend/pom.xml` 包含 `vmesh-module-edge`、`vmesh-module-algorithm`、`vmesh-module-report`、`vmesh-module-vision` |
| Edge Controller | `moon_cloud_backend/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/**` |
| Algorithm Controller | `moon_cloud_backend/vmesh-module-algorithm/src/main/java/com/wf/vmesh/module/algorithm/controller/admin/**` |
| 前端 Edge API | `moon_cloud_frontend/src/api/edge/*.ts` |
| 前端 Algorithm API | `moon_cloud_frontend/src/api/algorithm/*.ts` |
| 前端页面 | `moon_cloud_frontend/src/views/edge/**`、`moon_cloud_frontend/src/views/algorithm/**` |
| 原型页面 | `moon_cloud_design/src/views/EdgeManagement.vue`、`moon_cloud_design/src/views/EdgeHealthMonitor.vue`、`moon_cloud_design/src/views/EdgeTaskRecord.vue` |
| 文档规范 | `.agents/rules/document-governance.md`、`.agents/skills/document-template/SKILL.md` |
| 契约规范 | `.agents/rules/fullstack-api-first.md`、`.agents/references/interface-status-model.md` |

## 未迁移内容

- `docs_old/review-tracking/**`：属于 review 流水记录，已迁移到 [review-tracking](./review-tracking/README.md)。
- `docs_old/governance/**`：旧治理评审和协作分析正文不迁移；其中稳定结论已重整进 [协作治理](./design/协作治理/设计方案.md)。
- `docs_old/design/**/交接文档-*`：属于方案附属流水记录；当前已迁移 `Edge全链路落地任务交接`。
- `docs_old/design/.DS_Store`、`docs_old/design/**/.DS_Store`：系统文件，不迁移。

## 变更日志

| 日期 | 变更摘要 | 变更来源 |
|------|----------|----------|
| 2026-04-30 | 从 `docs_old` 重整当前有效文档，落位到 `docs_codex` | 用户要求与 `.agents/rules/document-governance.md` |
| 2026-04-30 | 补充测试数据 JSON 原样迁移和迁移覆盖检查 | 用户补充要求 |
| 2026-04-30 | 补充迁移 `review-tracking` 流水记录并修正索引 | 用户补充确认 |
| 2026-04-30 | 补充迁移 Edge 全链路交接文档并关联主方案 | 用户补充确认 |
| 2026-04-30 | 将迁移后流水记录文件名前缀从错误的 `00-00-00` 修正为 `21-01-00` | 用户补充确认 |
| 2026-05-01 | 将协作治理从治理方案修正为设计方案并迁移到 `design/协作治理/设计方案.md` | 用户审查问题 2 |
