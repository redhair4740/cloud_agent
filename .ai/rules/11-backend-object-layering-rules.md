# Rule: 后端对象分层与目录组织（轻量模块化）

本规则用于 `WF_VMesh_Coud` 后端对象管理与目录组织。目标是减少不必要对象层，优先收口真实耦合风险：`controller -> mapper` 直连和跨子域聚合越界。

## 1. 适用范围

- 适用于后端域模块中的对象分层、目录组织、方法入参与返回对象设计。
- 优先约束 `edge` 域；其他域新增同类结构时同步遵循本规则。

## 2. 轻量默认对象模型

模块内默认只保留两类主对象：

- `controller/**/vo`
  - 只承载 HTTP 请求/响应对象。
  - 命名保持 `*ReqVO / *RespVO / *SimpleRespVO` 等接口语义。
- `dal/dataobject/**`
  - 只承载数据库实体对象 `DO`。
  - 字段语义以表结构、持久化映射、租户/审计字段为准。

非默认项：

- `service/**/bo` 不作为默认分层要求。
- 仅在“单一模块内存在多个入口复用同一复杂业务入参/返回聚合”时，才允许引入 `BO`，并在变更说明中写明必要性。
- `Mapper` 目录统一使用 `dal/mapper/**` 这类中性命名，不再使用带数据库品牌的包名。

## 3. 依赖方向与硬边界

允许的依赖方向：

1. `controller -> service`
2. `service -> dal`
3. `controller/vo -> service -> dal/do`

禁止项（本规则核心收口点）：

- `controller` 直接依赖 `dal/**/mapper`
- `controller` 直接编排跨子域 Mapper 聚合
- `service` 直接依赖 `controller/**/vo`
- 任意域直接复用其他域 `mapper/dataobject` 作为常规实现手段

说明：

- controller 需要数据聚合时，统一经 service 契约编排，不在 controller 拼装跨子域查询。
- 跨子域协作统一走稳定 service 能力，避免形成“跨域 mapper 网状依赖”。

## 4. 推荐目录结构（默认无 BO）

`vmesh-module-edge` 推荐按下列结构组织：

```text
com/wf/vmesh/module/edge
├── controller
│   └── admin
│       ├── device
│       │   ├── EdgeDeviceController.java
│       │   └── vo
│       ├── group
│       │   ├── EdgeDeviceGroupController.java
│       │   └── vo
│       └── node
│           ├── EdgeNodeController.java
│           └── vo
├── service
│   ├── device
│   │   ├── EdgeDeviceService.java
│   │   └── EdgeDeviceServiceImpl.java
│   ├── group
│   │   ├── EdgeDeviceGroupService.java
│   │   └── EdgeDeviceGroupServiceImpl.java
│   └── node
│       ├── EdgeNodeService.java
│       └── EdgeNodeServiceImpl.java
├── dal
│   ├── dataobject
│   │   ├── device
│   │   ├── group
│   │   └── node
│   └── mapper
│       ├── device
│       ├── group
│       └── node
└── enums
```

说明：

- 规范推荐结构从现在开始统一写作 `dal/mapper/**`，避免把目录命名和数据库品牌绑定。
- 无论目录命名如何，底层 SQL、方言、驱动、脚本都必须保持 PostgreSQL 兼容。

## 5. 对象职责边界

- `ReqVO`
  - 接口入参校验、接口注解、导入导出字段描述。
- `DO`
  - 表字段映射、租户字段、逻辑删除字段、`@TableName / @KeySequence` 等持久化语义。
- `Mapper`
  - 归档在 `dal/mapper/**`，负责查询与持久化访问。
- `RespVO`
  - 最终对外接口字段形状、页面展示文案、导出字段。

如果引入 `BO`（非默认）时追加约束：

- 只放 service 内部业务复用语义，不外泄到 controller 协议层。
- 不得把 `BO` 当作所有接口的强制中间层。

## 6. 迁移与增量落地要求

- 新增或改造功能时，默认按 VO + DO 直观分层落地，不预设 BO。
- 已存在 `controller -> mapper` 直连的代码，逐步收敛到 `controller -> service`。
- 已存在跨子域聚合的 controller 逻辑，逐步下沉到服务边界清晰的 service 能力。
- 不要求一次性替换历史代码；禁止新增新的越界写法。

## 7. 命名与演进约束

- 不在同一域同时引入多套同义对象命名（`bo/dto/param/query` 并存）。
- 需要扩展对象层前，先在规范补充“为什么必须新增这一层”。
