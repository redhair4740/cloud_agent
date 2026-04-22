# Review 与优化建议跟踪清单

## 使用约定

- 适用范围：代码 review 结论、联调发现、优化建议、回归风险修复项。
- 记录方式：每个待处理事项都使用 Markdown 勾选框，未完成用 `[ ]`，完成后改成 `[x]`。
- 更新规则：以后每次新增 review 或优化建议，都在本文件追加新的章节；对应代码完成后，同步更新勾选状态与完成说明。
- 证据要求：每条任务尽量保留真实路径、方法名、字段名或脚本位置，方便复查。
- 验证口径：未执行真实验证时明确写“未验证”，不要把静态判断写成“已完成”。

## 2026-04-17 Edge 模块 review

来源：本轮 edge 模块 review 输出，范围覆盖 `WF_VMesh_Coud` 与 `WF_VMesh_Coud_UI`。

- [x] `P1` 设备分组保存成功提示前先定义 `t`
  - 位置：`WF_VMesh_Coud_UI/src/views/edge/management/dialogs/GroupFormDialog.vue`
  - 问题：保存成功后执行 `message.success(t(...))`，但当前文件没有通过 `useI18n()` 注入 `t`，会抛出 `ReferenceError: t is not defined`。
  - 完成标准：补齐 `t` 注入后，创建设备分组和编辑设备分组都能正常提示成功、关闭弹窗并刷新列表。
  - 完成说明：已补齐 `useI18n()` 的 `t` 注入；未验证（未做真实前端提交流程验证）

- [x] `P1` 删除边缘节点前拦截仍挂载设备的节点
  - 位置：`WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/service/node/EdgeNodeServiceImpl.java`
  - 问题：当前允许删除仍关联设备的节点，会把 `edge_device.edge_node_id` 留成悬空引用，后续设备编辑会因为节点不存在而失败。
  - 完成标准：删除前增加设备归属校验；若节点下仍有设备，明确阻止删除并返回可理解的错误信息。
  - 完成说明：已增加节点删除前的设备数量校验，并新增“边缘节点下存在设备，无法删除”错误码；未验证（未做真实后端删除接口调用）

- [x] `P2` 节点运行指标不要再次乘以 `100`
  - 位置：`WF_VMesh_Coud_UI/src/views/edge/management/dialogs/NodeDetailDialog.vue`
  - 问题：后端返回值已经是百分比，前端再次乘 `100` 后会导致详情页进度条和列表百分比显示失真。
  - 完成标准：前端直接按后端百分比值展示，列表与详情的运行指标口径一致。
  - 完成说明：已同步修正详情弹窗进度条和节点列表百分比格式化逻辑；未验证（未做真实页面数据展示核验）

- [x] `P2` 导入已存在节点时显式传递 `updateSupport`
  - 位置：`WF_VMesh_Coud_UI/src/views/edge/management/dialogs/NodeImportDialog.vue`
  - 问题：导入接口默认 `updateSupport=false`，前端未传该参数时，界面上的“更新已有节点”路径无法生效。
  - 完成标准：导入提交时按界面选择传递 `updateSupport`，已有序列号节点允许走更新分支。
  - 完成说明：已补充“更新已存在节点数据”复选框，并在导入 API 请求里显式传递 `updateSupport`；未验证（未做真实导入接口调用）

- [x] `P2` 让 edge 相关表的唯一约束兼容软删除
  - 位置：`WF_VMesh_Coud/sql/postgresql/2026-04-16.sql`
  - 问题：表走逻辑删除，但数据库唯一约束未带删除标记，导致已删除记录仍阻塞重建。
  - 完成标准：唯一性设计与 `@TableLogic` 一致，删除后的节点、分组、设备允许按预期重新创建。
  - 完成说明：已将相关唯一约束改为仅对 `deleted = 0` 生效的部分唯一索引，并覆盖节点/分组/设备关键唯一字段；未验证（未执行真实 PostgreSQL 建表与迁移）

## 2026-04-20 Edge 模块结构收敛

来源：本轮基于最新 `.ai/rules` 的 edge 模块结构评估与收敛，范围覆盖 `WF_VMesh_Coud/vmesh-module-edge`。

- [x] `P1` 收敛 device/group controller 对 mapper 的直连依赖
  - 位置：`WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/device/EdgeDeviceController.java`、`WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/group/EdgeDeviceGroupController.java`
  - 问题：最新后端规则明确禁止 `controller -> mapper` 直连；原实现由 controller 自行查 `EdgeNodeMapper` 拼节点名称，破坏了 service 边界。
  - 完成标准：controller 只依赖 service，节点名称聚合统一经 `EdgeNodeService` 暴露的稳定契约完成。
  - 完成说明：已新增 `EdgeNodeService#getEdgeNodeNameMap(...)` 并改造 device/group controller 与对应单测；已执行 `mvn -pl vmesh-module-edge -am -DskipTests -Dmaven.repo.local=/tmp/m2repo compile`，`BUILD SUCCESS`；未执行测试

- [x] `P2` 将 edge mapper 包目录统一到 `dal/mapper`
  - 位置：`WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/dal/mapper/**`
  - 问题：最新对象分层规则要求 mapper 目录统一使用 `dal/mapper/**`，旧的 `dal/mysql/**` 命名与规则不一致，也会误导后续按数据库品牌绑定实现。
  - 完成标准：edge 模块源码目录与包声明统一迁移到 `dal/mapper/**`，并同步收敛所有源码/测试导入。
  - 完成说明：已迁移 `device/group/node` 三个 mapper 子包并更新相关导入；已执行 `mvn -pl vmesh-module-edge -am -DskipTests -Dmaven.repo.local=/tmp/m2repo compile`，`BUILD SUCCESS`；未执行测试

## 2026-04-20 Edge MQTT / EMQX 云边集成

来源：本轮 cloud 侧 MQTT/EMQX 生产化方案收敛，范围覆盖 `WF_VMesh_Coud`、`WF_VMesh_Coud_UI` 与根仓跟踪文档。

- [x] `P1` 将 cloud 侧 MQTT 配置模型扩展到可生产部署
  - 位置：`WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/config/EdgeMqttProperties.java`、`WF_VMesh_Coud/vmesh-server/src/main/resources/application.yaml`
  - 问题：原有配置不足以明确 cloud 如何给 edge 导出真实 Broker 信息，也无法完整表达 cloud -> EMQX REST publish 的接入参数。
  - 完成标准：补齐 `broker-host`、端口、TLS、EMQX API 与 webhook 安全相关配置，并在提交配置中避免硬编码环境专属 Broker 地址。
  - 完成说明：已补齐 `brokerHost/brokerTcpPort/brokerTlsPort/brokerTlsEnabled/emqxApiBaseUrl/emqxApiKey/emqxApiSecret/emqxApiTimeoutSeconds`，并将 `application.yaml` 中 `broker-host` 默认值改为空；已执行 `mvn -pl vmesh-module-edge -am -DskipTests test-compile -Dmaven.repo.local=/tmp/m2repo`，`BUILD SUCCESS`；运行测试未执行

- [x] `P1` 打通 cloud 侧“节点凭证导出 + EMQX 命令下发”主链路
  - 位置：`WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/node/EdgeNodeController.java`、`WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/command/EdgeMqttCommandController.java`、`WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/service/command/EdgeMqttCommandServiceImpl.java`
  - 问题：cloud 之前只有鉴权和 runtime 入站，缺少对 edge 导出真实 MQTT 接入信息和对 EMQX 下发命令的闭环能力。
  - 完成标准：凭证接口返回真实 Broker/Topic 信息，cloud 提供 `/edge/mqtt/command/send` 并通过 EMQX `/publish` 完成命令下发。
  - 完成说明：已补齐凭证响应字段、Topic Root 解析和命令下发服务；补写测试源码时修复了 `EdgeMqttCommandServiceImplTest` 缺少 `URI` 导入的问题；已执行 `mvn -pl vmesh-module-edge -am -DskipTests test-compile -Dmaven.repo.local=/tmp/m2repo`，`BUILD SUCCESS`；未运行测试

- [x] `P2` 对齐前端凭证弹窗、下载文件与方案文档口径
  - 位置：`WF_VMesh_Coud_UI/src/views/edge/management/dialogs/NodeCredentialDialog.vue`、`WF_VMesh_Coud_UI/src/views/edge/management/hooks/useNodeCredential.ts`、`WF_VMesh_Coud/docs/edge/edge-mqtt-emqx-design.md`
  - 问题：前端需要消费后端返回的真实 EMQX 信息；同时原弹窗顶部 `MQTT Topic` 与下方 `Topic Root` 存在口径歧义，容易让部署人员误判实际生效主题。
  - 完成标准：前端直接展示后端返回的 Broker/Topic 字段，下载 JSON 与文档一致，并把“节点自定义 Topic Root”与“生效 Topic Root”区分开。
  - 完成说明：已对齐前端展示与下载逻辑，并在方案文档补充生产配置、curl 示例和联调检查项；前端静态检查未执行，未做真实页面联调

- [x] `P1` 修复 Redis Stream 自定义 stream/group 构造器导致的消息反序列化失败
  - 位置：`WF_VMesh_Coud/vmesh-framework/vmesh-spring-boot-starter-mq/src/main/java/com/wf/vmesh/framework/mq/redis/core/stream/AbstractRedisStreamMessageListener.java`、`WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/service/runtime/EdgeRuntimeEventStreamConsumer.java`
  - 问题：`EdgeRuntimeEventStreamConsumer` 通过 `super(streamKey, group)` 指定自定义 Stream 配置时，基类把 `messageType` 置为 `null`，导致 `/admin-api/edge/mqtt/events` 入流后在异步消费阶段抛出 `IllegalArgumentException: Unrecognized Type: [null]`。
  - 完成标准：自定义 `streamKey/group` 的 Stream Listener 仍能保留泛型消息类型，异步消费链可正常反序列化；补一条回归测试覆盖该构造路径。
  - 完成说明：已将基类第二构造器改为同样解析泛型 `messageType`，并新增框架级回归测试与 `test` scope 测试依赖；已执行 `mvn -pl vmesh-module-edge -am -DskipTests test-compile -Dmaven.repo.local=/tmp/m2repo`，`BUILD SUCCESS`；真实重启后消息消费未验证

## 2026-04-21 边缘监控与任务中心设计补充

来源：本轮针对 MQTT 通信协议与前端原型的静态评审（Static Design Review）。

- [x] `P1` 补充 task_progress 事件模型与流水落库设计
  - 位置：`docs/边缘监控与任务中心详细设计.md`
  - 问题：原协议仅定义了边缘端上报 `task_progress` 的 JSON 格式，缺失云端持久化（主子表）和前端页面轮询所需的分页 API 契约，导致后端无法直接开工。
  - 完成标准：在详细设计文档中提供 `edge_task` 和 `edge_task_log` 的结构定义，以及 `/admin-api/edge/task/page` 的 JSON 响应契约。
  - 完成说明：已完成补充设计；未验证（未做真实接口开发）

- [x] `P1` 补充心跳健康度算法与 Redis 数据结构设计
  - 位置：`docs/边缘监控与任务中心详细设计.md`
  - 问题：原方案仅提到了“使用 Redis 24小时心跳位图计算”，缺乏确切的 Key 结构定义和计算健康度得分（0-100）的 Java 算法伪代码。
  - 完成标准：定义 Bitmap Key 格式（例如包含日期和设备ID），并提供基于 `BITCOUNT` 的逻辑伪代码。
  - 完成说明：已完成补充设计；未验证（未做真实缓存计算开发）

- [x] `P2` 补充链路质量指标的存储语义与前台监控 API 设计
  - 位置：`docs/边缘监控与任务中心详细设计.md`
  - 问题：原方案提及收集 `ping_rtt_ms` 和 `packet_loss_pct`，但缺乏明确的降采样存储策略（如 Redis List + MySQL 小时级聚合），以及支撑 `EdgeHealthMonitor.vue` 大屏展示的 API 契约。
  - 完成标准：在详细设计文档中明确存储策略，并定义 `/admin-api/edge/monitor/metrics/latest` 的 JSON 响应结构。
  - 完成说明：已完成补充设计；未验证（未做真实接口开发）

## 2026-04-21 任务下发体验与设计对齐复核

来源：本轮针对 `wf_vmesh_cloud_design` 原型、`WF_VMesh_Coud_UI` 前端任务中心 / 边缘节点页面、`WF_VMesh_Coud` 任务下发后端的静态复核（Static Review）。

- [x] `P1` 将任务下发入口收回到边缘节点列表上下文
  - 位置：`wf_vmesh_cloud_design/src/views/EdgeManagement.vue`、`WF_VMesh_Coud_UI/src/views/edge/management/tabs/EdgeNodeTab.vue`、`WF_VMesh_Coud_UI/src/views/edge/task/index.vue`
  - 问题：原型在节点列表行内直接提供“下发”入口，当前实现把任务创建完全挪到独立任务中心页面，用户需要手动输入节点编号，丢失节点上下文，和设计交互不一致。
  - 完成标准：边缘节点列表支持直接发起任务下发并自动带入节点上下文；独立任务中心保留“流水/详情/日志”主职责，如保留创建入口也必须支持节点选择与名称回显。
  - 完成说明：已在 `EdgeNodeTab.vue` 行内新增“下发任务”，跳转任务中心时自动携带 `action=dispatch&nodeId&nodeName`，任务中心收到上下文后自动弹出下发表单；未验证（未做真实页面联调）

- [x] `P1` 将任务下发表单从底层 MQTT 参数改为业务化表单
  - 位置：`wf_vmesh_cloud_design/src/views/EdgeManagement.vue`、`WF_VMesh_Coud_UI/src/views/edge/task/components/TaskDispatchDialog.vue`、`WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/task/vo/EdgeTaskDispatchReqVO.java`
  - 问题：原型表单围绕“任务类型 / 版本资源 / 配置内容 / 执行策略”组织；当前实现直接暴露 `nodeId/qos/retain/downloadUrl/fileSha256` 等底层 MQTT 下发参数，业务用户理解和填写成本都偏高。
  - 完成标准：前端按任务类型做条件化表单与文案收口，后端至少提供稳定的业务字段适配层（或明确的类型到 `commandKey/payload` 映射），避免页面直接拼底层命令参数。
  - 完成说明：已将前端表单改为 `OTA 固件升级 / 模型算法下发 / 更新边缘配置 / 重启边缘节点` 四类业务表单，后端 `EdgeTaskDispatchReqVO` 与 `EdgeTaskServiceImpl` 同步补齐 `taskType/taskName/executionPolicy/contentSummary/formData` 适配层；未验证（未做真实下发链路联调）

- [x] `P1` 修复任务日志接口返回结构不一致导致抽屉无数据
  - 位置：`WF_VMesh_Coud_UI/src/api/edge/task.ts`、`WF_VMesh_Coud_UI/src/views/edge/task/components/TaskDetailDrawer.vue`、`WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/task/EdgeTaskController.java`
  - 问题：前端把 `/edge/task/{taskKey}/logs` 当成 `TaskLogVO[]` 使用，但后端实际返回 `PageResult<EdgeTaskLogRespVO>`；现状会导致日志抽屉拿不到 `list`，页面无法按预期展示任务执行日志。
  - 完成标准：前后端统一日志接口契约（数组或分页对象二选一），任务详情抽屉能稳定展示日志时间线。
  - 完成说明：已统一按 `PageResult<EdgeTaskLogRespVO>` 返回与消费，前端详情抽屉改为读取 `page.list/page.total` 并补充日志分页；未验证（未做真实接口联调）

- [x] `P1` 对齐任务主数据字段命名并补齐节点展示信息
  - 位置：`WF_VMesh_Coud_UI/src/api/edge/task.ts`、`WF_VMesh_Coud_UI/src/views/edge/task/index.vue`、`WF_VMesh_Coud_UI/src/views/edge/task/components/TaskDetailDrawer.vue`、`WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/task/vo/EdgeTaskRespVO.java`
  - 问题：前端按 `nodeId` 取值，但后端响应字段是 `edgeNodeId`；任务列表和详情里的节点编号会丢失，同时当前列表也缺少节点名称，不符合“目标设备/节点可读”要求。
  - 完成标准：统一字段命名或增加前端适配层，并在任务列表/详情中展示节点名称（至少支持“名称 + 编号”）。
  - 完成说明：后端任务 VO 统一返回 `nodeId + nodeName`，前端任务列表/详情改为展示“节点名称 + 编号”，并兼容历史 `edgeNodeId`；未验证（未做真实接口联调）

- [x] `P1` 修复任务状态筛选枚举与后端状态机不一致
  - 位置：`WF_VMesh_Coud_UI/src/views/edge/task/index.vue`、`WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/enums/task/EdgeTaskStatusEnum.java`、`WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/dal/mapper/task/EdgeTaskMapper.java`
  - 问题：前端筛选项包含 `PENDING`，但后端任务状态机是 `CREATED/DISPATCHED/ACCEPTED/PROCESSING/...`；当前选择 `PENDING` 会落到无效查询，结果页直接空表。
  - 完成标准：前端筛选项与后端状态枚举完全对齐；如要保留“待处理”文案，需在前端做稳定映射而不是直接传不存在的状态值。
  - 完成说明：前端筛选项已改为 `CREATED/DISPATCHED/ACCEPTED/PROCESSING/SUCCESS/FAILED/CANCELED/TIMEOUT`，后端保留 `PENDING -> CREATED` 兼容映射避免历史请求失效；未验证（未做真实筛选接口回归）

- [x] `P1` 保留任务下发失败时的主表与日志审计记录
  - 位置：`WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/service/task/EdgeTaskServiceImpl.java`
  - 问题：代码注释写明“下发失败时也能保留审计主线”，但当前 `dispatchTask` 整体包在同一个事务里，失败后重新抛异常会把刚插入的任务和失败日志一起回滚，任务中心无法看到失败下发记录。
  - 完成标准：失败下发场景仍能持久化主任务与失败日志（例如拆分事务、失败日志独立事务或显式补偿写入），保证任务中心可审计。
  - 完成说明：`dispatchTask` 已拆成分段持久化流程，创建/进入下发/下发成功/下发失败分别独立提交，确保失败场景仍保留主任务与失败日志；未验证（未做真实异常下发演练）

- [x] `P2` 补齐任务中心列表的设计化展示与操作闭环
  - 位置：`wf_vmesh_cloud_design/src/views/EdgeTaskRecord.vue`、`WF_VMesh_Coud_UI/src/views/edge/task/index.vue`、`WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/dal/dataobject/task/EdgeTaskDO.java`
  - 问题：原型列表包含目标设备、任务类型、任务内容、进度、日志、撤回/重试等可操作信息；当前页面主要还是 `nodeId + commandKey + status` 技术视角，业务可读性和后续运维效率都不足。
  - 完成标准：任务中心列表至少补齐“节点名称/任务类型/内容摘要/版本信息/日志入口”这几类核心信息；若 `撤回/重试` 暂不做，也应在 UI 或文档中明确 V1 边界。
  - 完成说明：任务中心列表与详情已补齐“节点名称/任务类型/内容摘要/版本或关键字段/日志入口”，并在页面上明确“去节点列表下发”的 V1 操作边界；未验证（未做真实页面联调）
