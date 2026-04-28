<!--
由 .ai/scripts/sync-trae-from-ai.mjs 从 .ai/ 生成。
请勿直接修改本文件；先修改 .ai/ 源文件，再重新运行同步脚本。
-->
---
name: dynamic-menu-sync
version: "1.1.0"
depends_on:
  - ".trae/runtime.md"
  - ".trae/rules/10-backend-development-rules.md"
  - ".trae/rules/20-frontend-development-rules.md"
  - ".trae/rules/30-fullstack-linkage-rules.md"
description: 同步前端动态路由、后端数据库菜单和按钮权限。用于新增业务菜单、排查页面可见性、补 system_menu 增量 SQL 或核对动态菜单链路。
---

# 动态菜单同步

## 使用边界

本 skill 默认按前后端联动处理。通用红线、SQL、Mock、验证和 API-First 规则回到 `runtime.md` 与 `rules/`。

## 读取顺序

1. `./.trae/runtime.md`
2. `./.trae/rules/10-backend-development-rules.md`
3. `./.trae/rules/20-frontend-development-rules.md`
4. `./.trae/rules/30-fullstack-linkage-rules.md`

## 关键位置

- 前端静态路由：`<frontend-dir>/src/router/modules/remaining.ts`
- 前端用户菜单：`<frontend-dir>/src/store/modules/user.ts`
- 前端权限路由：`<frontend-dir>/src/store/modules/permission.ts`
- 路由组件匹配：`<frontend-dir>/src/utils/routerHelper.ts`
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

## 交付口径

- 说明菜单链路证据、SQL 路径、是否写 `system_menu`、是否写 `system_role_menu`。
- 未真实执行数据库脚本、未重新登录或未验证动态菜单时，必须标注“未验证”。
