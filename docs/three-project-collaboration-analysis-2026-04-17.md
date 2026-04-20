# AI_Vision 三项目协作落地分析

## 1. 分析对象

- 原型项目：`/mnt/e/projects/AI/AI_Vision/wf_vmesh_cloud_design`
- 生产前端：`/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud_UI`
- 生产后端：`/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud`

本分析不是只看规范文本，而是结合三个项目当前真实代码结构、页面入口、API、后端 controller/service/sql 的落点来判断：现有规范是否真的适配当前协作模式，以及还缺什么治理规则。

本结论基于静态阅读，未运行测试。

## 2. 三个项目在当前协作中的真实角色

### 2.1 `wf_vmesh_cloud_design` 的真实角色

它是原型源，不是生产前端雏形。

证据：

- 原型项目把大量页面都直接挂在单一壳页面中切换，例如 [App.vue](/mnt/e/projects/AI/AI_Vision/wf_vmesh_cloud_design/src/App.vue#L24) 到 [App.vue](/mnt/e/projects/AI/AI_Vision/wf_vmesh_cloud_design/src/App.vue#L67)、[App.vue](/mnt/e/projects/AI/AI_Vision/wf_vmesh_cloud_design/src/App.vue#L126) 到 [App.vue](/mnt/e/projects/AI/AI_Vision/wf_vmesh_cloud_design/src/App.vue#L136)。
- `SPEC.md` 明确说明原型只用于展示、交互验证，不承载生产实现与真实数据，见 [SPEC.md](/mnt/e/projects/AI/AI_Vision/wf_vmesh_cloud_design/SPEC.md#L56) 到 [SPEC.md](/mnt/e/projects/AI/AI_Vision/wf_vmesh_cloud_design/SPEC.md#L79)。
- 原型边缘管理页面内嵌大量模拟字段与步骤性展示逻辑，例如云端激活凭证、设备统计卡、表格交互等，见 [EdgeManagement.vue](/mnt/e/projects/AI/AI_Vision/wf_vmesh_cloud_design/src/views/EdgeManagement.vue#L4) 到 [EdgeManagement.vue](/mnt/e/projects/AI/AI_Vision/wf_vmesh_cloud_design/src/views/EdgeManagement.vue#L75)、[EdgeManagement.vue](/mnt/e/projects/AI/AI_Vision/wf_vmesh_cloud_design/src/views/EdgeManagement.vue#L241) 到 [EdgeManagement.vue](/mnt/e/projects/AI/AI_Vision/wf_vmesh_cloud_design/src/views/EdgeManagement.vue#L260)。

结论：

- 它提供的是“信息架构 + 交互预期 + 字段候选集”
- 它不是生产 UI 的可直接迁移代码基线

### 2.2 `WF_VMesh_Coud_UI` 的真实角色

它不是“原型升级版”，而是已有大平台前端中的业务承接面。

证据：

- 前端本身是一个大型管理后台，不只服务 AI_Vision，自带 `ai`、`iot`、`mes`、`system`、`infra` 等大量域，见目录扫描结果与 [README.md](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud_UI/README.md#L80)。
- 边缘管理已作为独立生产页面落在 [index.vue](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud_UI/src/views/edge/management/index.vue#L1)，路由入口在 [remaining.ts](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud_UI/src/router/modules/remaining.ts#L798) 到 [remaining.ts](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud_UI/src/router/modules/remaining.ts#L815)。
- 工作站并没有单独为 AI_Vision 新建，而是直接复用 MES 领域页面 [index.vue](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud_UI/src/views/mes/md/workstation/index.vue#L1)。
- AI 相关页面也不是按“算法管理/算法训练/算法超市”原型命名落地，而是现有 `chat / image / knowledge / model / workflow / write` 这套 AI 平台页，见 `src/views/ai/*` 目录。

结论：

- 生产前端的核心问题不是“怎么抄原型”
- 而是“原型需求应该落入现有哪个业务域、哪个页面、哪个 API 命名空间”

### 2.3 `WF_VMesh_Coud` 的真实角色

它是领域模型、权限、接口契约、数据库结构的真源。

证据：

- 聚合工程包含 `vmesh-server`、`vmesh-module-system`、`vmesh-module-infra`、`vmesh-module-edge`、`vmesh-module-report`、`vmesh-module-vision`，见 [pom.xml](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud/pom.xml#L10) 到 [pom.xml](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud/pom.xml#L21)。
- 边缘管理已落在 `vmesh-module-edge`，接口分别是 [EdgeNodeController.java](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/node/EdgeNodeController.java#L52)、[EdgeDeviceController.java](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/device/EdgeDeviceController.java#L45)、[EdgeDeviceGroupController.java](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/group/EdgeDeviceGroupController.java#L43)。
- 数据结构已在 PostgreSQL 初始化脚本里建成，见 [2026-04-16.sql](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud/sql/postgresql/2026-04-16.sql#L1) 到 [2026-04-16.sql](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud/sql/postgresql/2026-04-16.sql#L173)。

结论：

- 三仓协作里，后端不是“配合层”，而是事实标准层
- 如果规范不把“契约真源”和“域归属真源”写死，协作很容易漂移

## 3. 用边缘管理链路看三仓协作是否打通

边缘管理是目前三仓里最完整的一条链路，也是最适合拿来反推规范是否有效的样本。

### 3.1 原型层

- 原型里“边缘管理”是一级菜单，见 [App.vue](/mnt/e/projects/AI/AI_Vision/wf_vmesh_cloud_design/src/App.vue#L24) 到 [App.vue](/mnt/e/projects/AI/AI_Vision/wf_vmesh_cloud_design/src/App.vue#L27)。
- 页面内分为“边缘节点 / 设备台账 / 设备分组”三个页签，见 [EdgeManagement.vue](/mnt/e/projects/AI/AI_Vision/wf_vmesh_cloud_design/src/views/EdgeManagement.vue#L4) 到 [EdgeManagement.vue](/mnt/e/projects/AI/AI_Vision/wf_vmesh_cloud_design/src/views/EdgeManagement.vue#L238)。
- 原型中节点包含区域、车间、产线、MQTT Topic、凭证等字段，见 [EdgeManagement.vue](/mnt/e/projects/AI/AI_Vision/wf_vmesh_cloud_design/src/views/EdgeManagement.vue#L128) 到 [EdgeManagement.vue](/mnt/e/projects/AI/AI_Vision/wf_vmesh_cloud_design/src/views/EdgeManagement.vue#L210)。

### 3.2 前端生产层

- 生产前端保留了同样的三 tab 结构，但页面壳被明显收敛，只负责 tab 切换，见 [index.vue](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud_UI/src/views/edge/management/index.vue#L2) 到 [index.vue](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud_UI/src/views/edge/management/index.vue#L25)。
- 节点页签单独承接查询、统计、增删改、导入、凭证、详情，见 [EdgeNodeTab.vue](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud_UI/src/views/edge/management/tabs/EdgeNodeTab.vue#L13) 到 [EdgeNodeTab.vue](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud_UI/src/views/edge/management/tabs/EdgeNodeTab.vue#L137)。
- API 已拆到 `src/api/edge/node.ts`、`device.ts`、`group.ts`，路径和职责清晰，见 [node.ts](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud_UI/src/api/edge/node.ts#L89)、[device.ts](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud_UI/src/api/edge/device.ts#L66)、[group.ts](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud_UI/src/api/edge/group.ts#L39)。

### 3.3 后端生产层

- 节点 controller 真实接口路径是 `/edge/node/*`，见 [EdgeNodeController.java](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/node/EdgeNodeController.java#L54)。
- 节点导入、凭证刷新、分页、统计都已落在同一 controller/service 链路，见 [EdgeNodeController.java](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/node/EdgeNodeController.java#L97) 到 [EdgeNodeController.java](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/node/EdgeNodeController.java#L174)、[EdgeNodeServiceImpl.java](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/service/node/EdgeNodeServiceImpl.java#L54) 到 [EdgeNodeServiceImpl.java](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/service/node/EdgeNodeServiceImpl.java#L257)。
- 设备和分组接口也按域内实体分拆清楚，且分组和设备的跨聚合回填已通过 service 契约实现，见 [EdgeDeviceController.java](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/device/EdgeDeviceController.java#L177) 到 [EdgeDeviceController.java](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/device/EdgeDeviceController.java#L188)、[EdgeDeviceGroupServiceImpl.java](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/service/group/EdgeDeviceGroupServiceImpl.java#L100) 到 [EdgeDeviceGroupServiceImpl.java](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/service/group/EdgeDeviceGroupServiceImpl.java#L108)。

### 3.4 结论

边缘管理这条链路说明：现有规范对“原型仅参考布局”“前后端契约联动”“域边界不要乱穿”是有效的。

但这条链路也暴露出一个更高层问题：

- 这条链路之所以能落地，不是因为原型本身天然可实现
- 而是因为有人替团队完成了“原型字段裁剪、页面结构重组、API 命名归拢、后端实体映射”

也就是说，当前规范对“实施过程中的判断”有依赖，但没有把这些判断沉淀成顶层规则或模板。

## 4. 三仓之间已经出现的真实协作模式

### 4.1 模式一：原型页面被拆分后落进现有业务域

典型例子就是边缘管理。

- 原型：单页面、大量演示字段、一步步操作感强
- 前端：拆成 tab + dialog + API 层
- 后端：拆成 node/device/group 三组实体和接口

这说明当前团队实际采用的是：

- 原型给业务目标
- 前端按现有生产风格重组
- 后端按现有领域模型落地

这类模式下，规范需要补的是“原型字段映射表”而不是继续强调“不要照抄原型”。

### 4.2 模式二：原型功能被现有平台模块吸收，而不是原样新增

典型例子是工作站。

- 原型菜单里有“工位管理”，见 [App.vue](/mnt/e/projects/AI/AI_Vision/wf_vmesh_cloud_design/src/App.vue#L29) 到 [App.vue](/mnt/e/projects/AI/AI_Vision/wf_vmesh_cloud_design/src/App.vue#L32)。
- 生产前端里真实落点是 MES 域的工作站设置页面 [index.vue](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud_UI/src/views/mes/md/workstation/index.vue#L1)。
- 菜单种子里也对应 `MesMdWorkstation`，见 [ruoyi-vue-pro.sql](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud/sql/mysql/ruoyi-vue-pro.sql#L2735)。

这说明：

- 原型里的“工位管理”并不是一个新的 AI_Vision 独立域
- 它在生产体系里已经有近似承接域，只是业务语义是否完全一致还需要额外确认

所以规范必须新增一条：

- 原型菜单项进入实施前，先判断是“新域、新模块、新页面”，还是“已有平台域的业务扩展”

### 4.3 模式三：原型概念存在，但生产侧没有同名落点

典型例子有：

- `SOP管理`
- `算法管理`
- `算法训练`
- `算法超市`

证据：

- 这些页面都在原型壳中有明确入口，见 [App.vue](/mnt/e/projects/AI/AI_Vision/wf_vmesh_cloud_design/src/App.vue#L34) 到 [App.vue](/mnt/e/projects/AI/AI_Vision/wf_vmesh_cloud_design/src/App.vue#L57)。
- 但在当前生产前端、后端源码中，没有同名落点；`rg` 检索未命中这些同名实现。
- 生产侧现有的是通用 AI 平台页，如 `knowledge / workflow / model / chat / image`，以及视觉/AI 后端模块 `com.wf.vmesh.module.ai` 目录。

这说明：

- 原型菜单不等于实施 backlog
- 现有规范缺一条“原型需求分流规则”

否则团队在协作时会出现三种偏差：

- 有人按原型直接做新页面
- 有人认为应该塞进现有 AI 域
- 有人认为暂时不做，但没有地方记录“为什么不做”

## 5. 现有规范对于三仓协作的适配情况

## 5.1 已经适配的部分

### A. 原型不是实现真源

这点现有规范是对的，而且必须保留。

原因：

- 原型里有大量演示字段和模拟交互，不适合直接成为契约
- 边缘管理链路已经证明生产实现必须做结构化重组

### B. Fullstack 联动是必要约束

这点现有规范也是对的。

原因：

- 前端 API 已经以 `/edge/*` 为真实路径
- 后端 controller/service/sql 已完整承接
- 只靠单端推进会直接造成字段或权限口径偏差

### C. 域边界优先于“页面长得像不像”

这点同样是对的。

原因：

- 工作站最终落在 MES，不是 AI_Vision 新建一套
- 边缘管理最终落在 `vmesh-module-edge`，不是继续沿用 IoT 老模块

## 5.2 还不够的部分

### A. 缺“原型需求分流规则”

这是当前三仓协作里最大的治理空白。

建议新增规则文件或章节，至少定义：

- 原型项是否已有现成平台域承接
- 若已有，落到哪个域
- 若没有，是新域还是先挂起
- 若挂起，记录到哪里

### B. 缺“原型字段映射表”

边缘管理已经说明，原型字段和生产字段不会一一照搬。

建议对每个进入实施的原型功能，至少补一张映射表：

- 原型字段
- 前端展示字段
- 前端 API 字段
- 后端 VO / DO 字段
- 是否被裁剪
- 裁剪原因

### C. 缺“近似承接域”的判定规则

工作站就是典型例子。

建议明确：

- 允许把 AI_Vision 原型功能落入现有 `MES / IoT / Report / AI` 域
- 但必须先写清“为什么这个原型功能不是新域”
- 如果只是名称相似但业务语义不同，不能直接复用

### D. 缺“原型菜单到实施 backlog”的准入机制

当前原型菜单包括：

- 边缘管理
- 工位管理
- SOP 管理
- 算法管理
- 数据标注
- 算法训练
- 算法超市
- 告警中心
- 数据报表

但生产侧现状说明，并不是每一项都已经有一一对应的独立实现位。

建议新增一条治理规则：

- 原型菜单项进入开发前，必须先标记为：
  - 已有实现扩展
  - 现有域新增功能
  - 新域新模块
  - 暂不实施

## 6. 从顶层管理看，最该补的规范

### 6.1 新增《原型到生产实施分流规则》

建议文件：

- `/.ai/rules/06-prototype-to-production-rules.md`

建议内容：

- 原型只提供布局、流程、候选字段
- 进入实施前必须做域归属判断
- 必须标记承接位置：
  - `WF_VMesh_Coud_UI` 哪个页面/路由
  - `WF_VMesh_Coud` 哪个模块/controller/service
  - 若没有后端承接，禁止前端猜契约
- 必须输出“原型项状态”：
  - 已落地
  - 部分落地
  - 有近似承接
  - 暂未落地

### 6.2 新增《原型映射评审模板》

建议模板字段：

- 原型页面名
- 业务目标
- 生产前端承接页
- 生产后端承接模块
- 是否复用现有域
- 被删除字段
- 新增字段
- 契约真源
- 风险
- 未验证项

### 6.3 新增《实施漏斗看板》

建议放在：

- `/docs/prototype-delivery-tracking.md`

把原型菜单项逐项跟踪，而不是只跟踪代码 review。

建议字段：

- 原型项
- 当前状态
- 前端承接
- 后端承接
- 域 owner
- 下一步
- 风险

### 6.4 统一“平台域复用”和“项目域新增”的判定口径

当前真实情况已经证明：

- 工作站应优先看 MES
- 告警中心应优先看 IoT 告警模块，种子已存在，见 [ruoyi-vue-pro.sql](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud/sql/postgresql/ruoyi-vue-pro.sql#L2716)
- 数据报表当前已有通用报表能力或流程报表入口，见 [remaining.ts](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud_UI/src/router/modules/remaining.ts#L296) 到 [remaining.ts](/mnt/e/projects/AI/AI_Vision/WF_VMesh_Coud_UI/src/router/modules/remaining.ts#L305)

这类场景下，不应默认“每个原型菜单都新建 AI_Vision 页面”。

## 7. 最终判断

如果只看规范文本，当前规则体系已经不错。

但一旦把 `wf_vmesh_cloud_design`、`WF_VMesh_Coud_UI`、`WF_VMesh_Coud` 三个项目一起看，就会发现当前最需要补的不是更多“编码规范”，而是三条更上层的治理规则：

1. 原型项如何分流到现有平台域或新域
2. 原型字段如何映射为真实前后端契约
3. 原型菜单如何进入实施 backlog 并持续跟踪

换句话说，当前规范已经能管“怎么做代码”，但还不够管“哪些原型项应该做、落在哪里、为什么这样落、没有做的怎么留痕”。

这才是三项目协作下最关键的团队治理缺口。
