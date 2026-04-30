# 业务术语参考表

本文件维护项目业务名词、推荐英文、禁用或慎用英文、典型代码命名和表/权限前缀。命名治理规则见 `.agents/rules/business-dictionary.md`。

## 核心业务实体命名

| 中文名词 | 推荐英文 | 禁用/慎用英文 | 典型代码命名 | 表/权限前缀 |
|----------|----------|---------------|--------------|-------------|
| 租户 | Tenant | Merchant、Customer | `TenantDO`、`tenantId` | `system_tenant`、`tenant:*` |
| 用户 | User | Account（仅登录账号语义可用） | `UserDO`、`userId` | `system_users`、`system:user:*` |
| 角色 | Role | Group | `RoleDO`、`roleId` | `system_role`、`system:role:*` |
| 菜单 | Menu | Navigation | `MenuDO`、`menuId` | `system_menu`、`system:menu:*` |
| 权限 | Permission | Auth（仅鉴权动作可用） | `permission`、`permissionCode` | `system:permission:*` |
| 组织 | Organization | Org（仅缩写场景慎用） | `OrganizationDO`、`organizationId` | `system_org`、`system:org:*` |
| 部门 | Dept | Department（文档可用，代码优先 Dept） | `DeptDO`、`deptId` | `system_dept`、`system:dept:*` |
| 岗位 | Post | Position、Job | `PostDO`、`postId` | `system_post`、`system:post:*` |
| 商户 | Merchant | Tenant、Customer | `MerchantDO`、`merchantId` | `business_merchant`、`merchant:*` |
| 客户 | Customer | Tenant、Merchant | `CustomerDO`、`customerId` | `business_customer`、`customer:*` |
| 设备 | Device | Equipment（仅泛设备文档可用） | `DeviceDO`、`deviceId` | `edge_device`、`edge:device:*` |
| 边缘节点 | EdgeNode | EdgeDevice | `EdgeNodeDO`、`edgeNodeId` | `edge_node`、`edge:node:*` |
| 算法 | Algorithm | Algo（仅局部变量慎用） | `AlgorithmDO`、`algorithmId` | `algorithm_*`、`algorithm:*` |
| 模型 | Model | Module | `ModelDO`、`modelId` | `algorithm_model`、`algorithm:model:*` |
| 视觉任务 | VisionTask | VisualTask、Job | `VisionTaskDO`、`visionTaskId` | `vision_task`、`vision:task:*` |
| 告警 | Alarm | Alert（仅前端展示可用） | `AlarmDO`、`alarmId` | `edge_alarm`、`edge:alarm:*` |
| 报表 | Report | Statement | `ReportDO`、`reportId` | `report_*`、`report:*` |
| 审计日志 | AuditLog | OperationLog（操作日志另有语义时慎用） | `AuditLogDO`、`auditLogId` | `system_audit_log`、`system:audit:*` |
