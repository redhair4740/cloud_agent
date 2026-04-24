# Rule: 业务领域字典（Business Domain Glossary）

> 此文件由 .ai/ 投影生成；测试阶段需手工同步，请勿脱离源文件单独修改。
> 源文件：.ai/rules/01-business-dictionary.md
> 投影时间：2026-04-25

本规则用于统一项目内业务名词、英文命名、表前缀与代码标识。AI 在新增或修改后端、前端、SQL、接口契约、文档时，必须优先按本字典命名；未收录词不得自行随意翻译。

## 1. 使用原则

- 中文业务名词是语义源，英文命名是代码落地形式；同一业务概念只能使用一个推荐英文。
- 新增类名、字段名、接口路径、枚举、表名、菜单权限标识时，先查本字典，再查既有代码与表结构。
- 发现未收录业务词时，先在交付说明中标注“待补充业务词”，不得把临时翻译直接固化为公共命名。
- 禁止为了局部实现方便创造同义英文，例如同一概念同时出现 `Tenant`、`Merchant`、`Customer`。
- 若既有代码命名与本字典冲突，新增代码优先遵循既有兼容边界；涉及重命名或兼容迁移时必须单独说明影响范围。

## 2. 核心业务实体命名

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

## 3. 命名落地规则

- 后端实体默认按 `XxxDO`、`XxxMapper`、`XxxService`、`XxxController` 命名，`Xxx` 必须来自推荐英文。
- 前端类型默认按 `XxxVO`、`XxxRespVO`、`XxxReqVO`、`XxxPageReqVO` 对齐后端契约，不得自行替换业务词。
- 数据库表名优先使用已存在模块前缀；新增表名前缀必须能体现归属域，例如 `system_`、`edge_`、`algorithm_`、`vision_`、`report_`。
- 权限标识按 `<domain>:<resource>:<action>` 组织，`domain` 与 `resource` 应使用字典推荐英文的小写形式。
- 前端路由、菜单 `component` 与 `name` 不得使用禁用英文；需要兼容既有路由时，必须说明兼容原因。

## 4. 未收录词处理

- 若任务中出现本字典未覆盖的核心业务词，AI 必须先查既有代码、SQL、OpenAPI 与产品文档。
- 仍无法确认时，交付说明中列出候选中文词、建议英文、影响文件，等待人工确认。
- 经人工确认后，才允许补充本文件并同步投影文件。
