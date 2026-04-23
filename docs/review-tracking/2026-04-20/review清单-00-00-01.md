# Edge 模块结构收敛

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
