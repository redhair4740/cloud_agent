# Rule: 后端对象分层与目录组织

本规则只定义后端对象分层和目录组织。技术栈、SQL、模块边界和编译验证见 `10-backend-development-rules.md`。

## 1. 默认对象模型

- `controller/**/vo`：HTTP 请求/响应对象，命名使用 `*ReqVO`、`*RespVO`、`*SimpleRespVO` 等接口语义。
- `dal/dataobject/**`：数据库实体对象 `DO`，字段语义以表结构、持久化映射、租户和审计字段为准。
- `service/**/bo` 不作为默认分层；只有单一模块内多个入口复用复杂业务入参/返回聚合时才允许引入，并说明必要性。
- `Mapper` 目录统一使用 `dal/mapper/**`，不使用带数据库品牌的包名。

## 2. 依赖方向

允许方向：

1. `controller -> service`
2. `service -> dal`
3. `controller/vo -> service -> dal/do`

禁止项：

- `controller` 直接依赖 `dal/**/mapper`。
- `controller` 直接编排跨子域 Mapper 聚合。
- `service` 直接依赖 `controller/**/vo`。
- 任意域直接复用其他域 `mapper/dataobject` 作为常规实现手段。

## 3. 推荐目录

```text
com/wf/vmesh/module/<domain>
├── config
├── controller/<subdomain>/vo
├── service/<subdomain>
├── dal/dataobject/<subdomain>
├── dal/mapper/<subdomain>
└── enums
```

- `config/**` 只放模块级装配、文档分组和模块内 Web 配置。
- `controller/{子域}` 与 `service/{子域}` 只在子域确实有独立职责时新增，不机械制造目录。
- 测试目录优先镜像生产目录，不额外制造平行体系。

## 4. 对象职责

- `ReqVO`：接口入参校验、接口注解、导入导出字段描述。
- `RespVO`：对外响应字段、页面展示文案、导出字段。
- `DO`：表字段映射、租户字段、逻辑删除、持久化注解。
- `Mapper`：查询与持久化访问，归档在 `dal/mapper/**`。
- `BO`：仅用于 service 内部复杂业务复用，不外泄到 controller 协议层。

## 5. 演进要求

- 新增功能默认按 VO + DO 直观分层落地，不预设 BO。
- 存量 `controller -> mapper` 直连逐步收敛到 `controller -> service`。
- 存量跨子域聚合 controller 逻辑逐步下沉到边界清晰的 service 能力。
- 不要求一次性替换存量代码，但禁止新增越界写法。
- 不在同一域同时引入多套同义对象命名（如 `bo/dto/param/query` 并存）。
