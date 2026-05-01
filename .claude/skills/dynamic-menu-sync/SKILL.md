---
name: dynamic-menu-sync
description: 当任务涉及前端动态路由、后端数据库菜单、按钮权限、system_menu 增量 SQL 或页面可见性排查时使用。
---

# 动态菜单同步

## 触发场景

- 新增业务菜单、页面路由或按钮权限。
- 从静态业务路由迁移到数据库动态菜单。
- 排查“数据库没有菜单但页面仍可见”“按钮权限不生效”“刷新后路由丢失”等问题。
- 需要补 `system_menu` 增量 SQL 或核对前后端菜单链路。

## 关键位置

- 前端静态路由：`<frontend-dir>/src/router/modules/remaining.ts`
- 前端用户菜单：`<frontend-dir>/src/store/modules/user.ts`
- 前端权限路由：`<frontend-dir>/src/store/modules/permission.ts`
- 前端路由组件匹配：`<frontend-dir>/src/utils/routerHelper.ts`
- 后端登录菜单接口：`<backend-dir>/vmesh-module-system/src/main/java/**/AuthController.java`
- 后端菜单转换：`<backend-dir>/vmesh-module-system/src/main/java/**/AuthConvert.java`
- 菜单 SQL：`<backend-dir>/<sql-dir>/yyyy-MM-dd/yyyy-MM-dd-HH-mm-ss.sql`

## 排查流程

1. 判断页面为何可见：静态路由、动态菜单、缓存、权限绕过或开发临时入口。
2. 核对动态菜单链路：登录接口、菜单树、组件路径、路由 name、权限标识。
3. 收集按钮权限：后端 `@PreAuthorize`、前端按钮控制、`system_menu` 权限编码。
4. 确认是否需要增量 SQL：只追加新脚本，不改历史 SQL。

## 实现流程

1. 移除不应存在的业务静态路由兜底。
2. 新增或修正 `system_menu` 增量 SQL。
3. 同步前端组件路径与后端菜单 component。
4. 按需补按钮权限；默认不直接写 `system_role_menu` 授权。
5. 验证登录后菜单、刷新后路由、按钮权限和无权限状态。

## 命名与权限约定

- 权限标识按 `<domain>:<resource>:<action>` 组织，`domain` 与 `resource` 使用业务词表推荐英文的小写形式。
- 前端路由、菜单 `component` 与 `name` 不得使用业务词表禁用英文；需要兼容既有路由时，必须说明兼容原因。

## 交付口径

- 说明菜单链路证据、SQL 路径、是否写 `system_menu`、是否写 `system_role_menu`。
- 涉及接口契约时同时做 OpenAPI 与前端调用对照。
- 未真实执行数据库脚本、未重新登录或未验证动态菜单时，必须标注“未验证”。
