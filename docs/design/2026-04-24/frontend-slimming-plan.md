# WF_VMesh_Coud 前端轻量化瘦身方案

## 1. 目标 (Objective)
当前前端框架（基于 RuoYi/Yudao 体系）包含大量复杂的企业级 ERP 和微服务运维功能。为了契合“轻量级 AI 视觉平台”的定位，降低前端维护成本、减少打包体积并提升页面加载速度，需对冗余功能进行全面裁剪，同时为后端联动减负提供指引。

## 2. 影响范围 (Scope & Impact)
- **前端业务页面 (`src/views`)**: 移除不需要的复杂系统管理、重度运维监控和大屏报表模块。
- **前端依赖 (`package.json`)**: 剔除与工作流、动态表单设计器、富文本、复杂图表相关的重量级第三方依赖。
- **前端接口 (`src/api`)**: 移除上述被删减页面对应的 API 请求定义。
- **后端联动**: 后续需由后端人员同步剔除对应的 Controller/Service 等关联代码，并在数据库（如系统菜单表）中清理冗余的注册记录。

## 3. 实施步骤 (Implementation Steps)

### 阶段一：清理前端视图与接口 (Frontend Views & APIs)
直接删除以下目录及其在 `src/api` 下对应的接口声明文件：
- **报表与大屏 (`src/views/report`)**: `goview`, `jmreport`
- **运维与研发基建 (`src/views/infra`)**:
    - **监控类**：`apiAccessLog`, `apiErrorLog`, `server`, `skywalking`, `redis`, `druid`
    - **工具类**：`codegen`, `build`, `swagger`
    - **配置类**：`dataSourceConfig`, `job`
- **复杂系统管理 (`src/views/system`)**: 
    - **组织架构**：`dept`, `post`
    - **第三方授权**：`oauth2`, `social`
    - **消息触达**：`mail`, `sms`, `notice`, `notify`

*(注：需强制保留的核心模块为 `algorithm`, `edge`, `infra/file`, `infra/fileConfig`, `system/user`, `system/role`, `system/menu`, `system/dict`)*

### 阶段二：剔除沉重依赖 (Frontend Dependencies)
执行依赖卸载命令，移除由于早期代码残留导致的冗余依赖包：
- **工作流/图形相关**: `bpmn-js`, `bpmn-js-token-simulation`, `diagram-js`, `dhtmlx-gantt`
- **表单设计器**: `@form-create/designer`, `@form-create/element-ui`
- **富文本编辑器**: `@wangeditor-next/editor`, `@wangeditor-next/editor-for-vue`, `@wangeditor-next/plugin-mention`
- **图表与文档相关**: `echarts-wordcloud`, `markdown-it`, `markmap-lib`, `markmap-toolbar`, `markmap-view`

### 阶段三：清理路由与组件 (Routing & Components)
- 检查并清理前端路由配置（如 `src/router` 下的静态路由）中对已移除页面的引用。
- 清理 `src/components` 中专属上述冗余模块定制的废弃组件（如工作流设计器相关的组件）。

### 阶段四：后端及数据库同步跟进 (Backend Follow-up)
- **代码清理**: 后端服务 `WF_VMesh_Coud` 中按需剔除对应的模块（如工作流引擎、复杂组织架构模块、三方扫码登录、短信邮件发送模块等）。
- **数据清理**: 清理数据库初始化 SQL 中的无效菜单（Menu）数据，确保后续全新部署时，左侧菜单树干净清爽。

## 4. 验证与测试 (Verification)
1. **编译验证**: 执行 `pnpm build:local` 能够顺利打包，且无模块缺失报错。
2. **运行验证**: 启动开发环境 `pnpm dev`，能够正常渲染应用骨架。
3. **核心功能验证**: 系统的登录鉴权、用户/角色管理、基础文件上传，以及 AI 视觉核心模块（算法、边缘节点）页面访问正常。

---

## 5. GPT 审核结果追加说明

> 本章节为 GPT 基于当前前后端真实代码结构的只读审核结果，独立于原方案编写；原方案内容不在本章节中改写。

### 5.1 总体结论

原方案的“前端轻量化瘦身”方向是合理的，但当前删除清单不能直接执行。需要先补充前后端联动边界、静态路由清理边界、组件依赖清理边界，再进入实施。

核心判断如下：

1. 可以裁剪报表、大屏、代码生成、监控、三方授权、短信邮件等非核心入口。
2. 不建议直接删除 `system/dept`、`system/post` 的基础能力，因为用户管理、角色数据权限、用户选择器仍依赖部门与岗位。
3. 不建议仅删除 `system/notify` 页面和 API，需要同步处理顶部消息铃铛、静态隐藏路由和后端通知接口，否则会产生运行时跳转或接口错误。
4. 不建议先卸载依赖包，应先清理所有源码引用，再卸载依赖并执行构建验证。
5. 后端不应按模块整体删除 `vmesh-module-system`、`vmesh-module-infra`，只能按功能域做精细清理。

### 5.2 需要保留或谨慎处理的模块

以下模块虽然看起来属于“复杂系统管理”，但当前仍被核心链路引用，需要保留或单独设计替代方案。

| 模块 | 审核结论 | 原因 |
| --- | --- | --- |
| `system/dept` | 暂不直接删除 | 用户归属部门、角色数据权限、用户选择器依赖部门数据 |
| `system/post` | 暂不直接删除 | 用户表单与后端用户保存逻辑仍校验岗位数据 |
| `system/notify` | 不能只删页面/API | 顶部消息铃铛和 `MyNotifyMessage` 静态路由仍依赖站内信 |
| `infra/file` | 必须保留 | 文件上传属于系统基础能力，也是原方案已列明的核心保留项 |
| `infra/fileConfig` | 必须保留 | 文件存储配置属于基础设施能力，也是原方案已列明的核心保留项 |
| `system/menu` | 必须保留 | 当前前端动态路由依赖后端菜单数据生成 |
| `system/role` | 必须保留 | 权限、菜单授权和核心后台管理依赖角色体系 |
| `system/user` | 必须保留 | 登录后用户信息、用户管理和权限上下文依赖用户体系 |

### 5.3 建议调整后的删除优先级

#### 第一优先级：低风险前端入口裁剪

优先删除和核心链路耦合较低的页面入口，并同步清理菜单数据：

- `src/views/report/goview`
- `src/views/report/jmreport`
- `src/views/infra/apiAccessLog`
- `src/views/infra/apiErrorLog`
- `src/views/infra/server`
- `src/views/infra/skywalking`
- `src/views/infra/redis`
- `src/views/infra/druid`
- `src/views/infra/swagger`
- `src/views/infra/dataSourceConfig`

#### 第二优先级：需要同步静态路由的入口

以下入口不能只删除视图目录，还要同步处理 `src/router/modules/remaining.ts` 中的隐藏路由：

- `src/views/infra/codegen`
- `src/views/infra/job`
- `src/views/system/notify/my`

#### 第三优先级：需要重构核心引用后再删除

以下模块需要先确认是否保留替代能力，不能直接删除：

- `src/views/system/dept`
- `src/views/system/post`
- `src/views/system/notify`

如果业务最终确认不需要组织架构和站内信能力，需要先补齐替代方案：

1. 用户管理去除部门、岗位字段或改为可空字段。
2. 角色数据权限去除部门树授权或调整为全局权限模型。
3. 顶部消息铃铛入口移除。
4. 后端用户保存、用户查询、个人中心返回结构同步调整。
5. 菜单、角色授权、权限标识和初始化 SQL 同步清理。

### 5.4 依赖卸载前置条件

依赖卸载不能作为第一步执行。建议先按以下顺序清理源码引用：

1. 删除工作流设计器相关组件后，再卸载 `bpmn-js`、`bpmn-js-token-simulation`、`diagram-js`。
2. 删除表单设计器页面、`plugins/formCreate` 和 `utils/formCreate` 的引用后，再卸载 `@form-create/designer`、`@form-create/element-ui`。
3. 删除或替换富文本组件后，再卸载 `@wangeditor-next/editor`、`@wangeditor-next/editor-for-vue`、`@wangeditor-next/plugin-mention`。
4. 删除或替换 Markdown 组件后，再卸载 `markdown-it`。
5. 确认没有图表页面使用词云或思维导图后，再卸载 `echarts-wordcloud`、`markmap-lib`、`markmap-toolbar`、`markmap-view`。

`echarts` 本体不建议纳入本轮卸载，因为首页和通用图表组件仍可能依赖基础图表能力。

### 5.5 后端联动边界建议

后端清理建议按“功能能力”而不是“模块整体”执行：

1. `vmesh-module-system`：保留用户、角色、菜单、字典、部门、岗位等基础权限能力；按需裁剪 oauth2、social、mail、sms、notice、notify。
2. `vmesh-module-infra`：保留文件、文件配置等基础能力；按需裁剪 codegen、job、logger、redis 监控、数据源配置等管理能力。
3. `vmesh-module-report`：当前不属于 `vmesh-server` 运行依赖时，优先清理前端入口和菜单数据，不作为后端运行态阻塞项。
4. `vmesh-module-edge`、`vmesh-module-algorithm`：属于 AI 视觉平台核心域，本轮瘦身不应裁剪。

### 5.6 建议补充的实施顺序

建议将原方案实施顺序细化为：

1. 先冻结保留清单：`algorithm`、`edge`、`infra/file`、`infra/fileConfig`、`system/user`、`system/role`、`system/menu`、`system/dict`，并临时保留 `system/dept`、`system/post`。
2. 清理数据库菜单和角色菜单授权，避免动态路由继续下发已删除页面。
3. 清理静态隐藏路由，重点检查 `remaining.ts`。
4. 删除低风险页面和对应 API SDK 文件。
5. 清理专属组件和全局注册入口。
6. 确认源码无引用后卸载依赖。
7. 再处理后端 Controller、Service、Mapper、初始化 SQL。
8. 最后执行前端构建、运行和核心功能回归验证。

### 5.7 验证补充建议

除原方案中的构建和运行验证外，建议增加以下检查项：

1. 登录后后端返回的菜单中，不再包含已删除页面的 `component` 路径。
2. 浏览器刷新后动态路由不报 `Cannot find module` 或白屏。
3. 用户新增、编辑、分配角色、角色分配菜单、菜单管理仍可用。
4. 文件上传和文件配置页面仍可访问。
5. 算法、边缘管理、边缘监控、边缘任务中心页面仍可访问。
6. 如果删除站内信能力，顶部消息入口不再触发 `/system/notify-message` 请求。

### 5.8 审核结论

本方案可以作为瘦身方向的初稿，但实施前必须补齐上述审核结果。尤其是 `dept`、`post`、`notify`、`formCreate`、`MarkdownView`、静态隐藏路由和后端菜单数据这几处，不处理就直接删除会造成编译失败、运行时白屏或核心管理功能回归。

本审核未执行构建、测试或运行验证，仅基于当前前后端源码和配置做只读审核。
