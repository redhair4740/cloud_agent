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
