---
name: dynamic-menu-sync
version: "1.0.0"
depends_on:
  - ".ai/rules/00-repo-baseline.md"
  - ".ai/rules/10-backend-development-rules.md"
  - ".ai/rules/20-frontend-development-rules.md"
  - ".ai/rules/30-fullstack-linkage-rules.md"
description: 同步 AI_Vision 前端动态路由与后端数据库菜单。用于新增业务模块菜单、从 remaining.ts 静态业务路由迁移到数据库菜单、排查"数据库无菜单但页面可见"、补 system_menu 增量 SQL、根据后端 @PreAuthorize 补按钮权限、核对 ROLE_ROUTERS 动态菜单链路时。
---

# 动态菜单同步

## 使用边界

本 skill 用于处理前后端菜单、路由、按钮权限的同步问题。默认按联动任务处理，并继承项目 rules，不替代 `.ai/rules`。

默认边界：

- 只处理菜单加载、路由来源、权限点与 SQL 种子数据同步。
- 默认只写 PostgreSQL `system_menu` 增量 SQL，不写 `system_role_menu`。
- 默认不修改历史 SQL，不补 MySQL。
- 默认不运行测试、构建或真实数据库迁移，除非用户明确确认。
- 不把本 skill 扩展成页面开发、接口开发、权限体系重构或角色授权批量变更。

## 固定读取顺序

先读项目入口和规则：

1. `AGENTS.md`
2. `.ai/agent.md`
3. `.ai/rules/00-repo-baseline.md`
4. `.ai/rules/10-backend-development-rules.md`
5. `.ai/rules/20-frontend-development-rules.md`
6. `.ai/rules/30-fullstack-linkage-rules.md`

再按任务读取真实代码：

- 前端静态路由：`<frontend-dir>/src/router/modules/remaining.ts`
- 前端动态菜单：`<frontend-dir>/src/store/modules/user.ts`
- 前端路由生成：`<frontend-dir>/src/store/modules/permission.ts`
- 路由组件匹配：`<frontend-dir>/src/utils/routerHelper.ts`
- 后端登录菜单接口：`<backend-dir>/vmesh-module-system/src/main/java/**/AuthController.java`
- 后端菜单转换：`<backend-dir>/vmesh-module-system/src/main/java/**/AuthConvert.java`
- 菜单表结构：`<backend-dir>/sql/postgresql/ruoyi-vue-pro.sql`
- 目标业务 Controller：按模块搜索 `@PreAuthorize`

## 排查流程

### 1. 判断页面为什么可见

优先确认业务页面是否还在 `remaining.ts` 静态路由中：

```bash
FRONTEND_DIR=$(awk -F'"' '/^[[:space:]]+frontend:/ {print $2; exit}' .ai/project.yml)
rg -n "views/<module>|path: '/<module>'|<ComponentName>" "$FRONTEND_DIR/src/router/modules/remaining.ts"
```

判断口径：

- 命中 `remaining.ts`：页面可见不一定来自数据库菜单，先按静态路由兜底处理。
- 未命中 `remaining.ts`：继续检查 `get-permission-info` 返回菜单和角色授权。

### 2. 确认动态菜单链路

当前前端菜单链路固定为：

```text
/system/auth/get-permission-info
-> userInfo.menus
-> CACHE_KEY.ROLE_ROUTERS
-> permissionStore.generateRoutes()
-> generateRoute(res)
-> router.addRoute(...)
```

排查时至少核对：

- `user.ts` 是否把 `userInfo.menus` 写入 `ROLE_ROUTERS`。
- `permission.ts` 是否从 `ROLE_ROUTERS` 读取并调用 `generateRoute(...)`。
- `routerHelper.ts` 的 `import.meta.glob('../views/**/*.{vue,tsx}')` 是否能匹配数据库中的 `component`。

### 3. 收集后端按钮权限

按目标后端模块搜索真实权限点：

```bash
BACKEND_DIR=$(awk -F'"' '/^[[:space:]]+backend:/ {print $2; exit}' .ai/project.yml)
rg -n "@PreAuthorize|hasPermission\('" "$BACKEND_DIR"/vmesh-module-*/src/main/java
```

SQL 里的按钮权限必须以真实 `@PreAuthorize` 为准，不凭页面按钮文案猜测。

按钮权限归属建议：

- 查询类权限放到对应页面菜单下。
- 创建、更新、删除、导入、导出等按钮权限放到触发该能力的页面菜单下。
- 被弹窗或下拉列表依赖的辅助查询权限也要补齐，否则页面打开后可能 403。

## 实现流程

### 1. 移除业务静态路由兜底

如果目标业务页面应改为数据库菜单加载：

- 从 `remaining.ts` 删除对应业务静态路由。
- 只删除业务入口，不删除登录、首页、错误页、个人中心、详情隐藏页等必要静态路由。
- 如果同一业务页面被挂在其他模块下，也要同步清理错误归属的静态入口。

### 2. 新增 PostgreSQL 增量 SQL

新增脚本路径固定为：

```text
<backend-dir>/<sql-dir>/yyyy-MM-dd/yyyy-MM-dd-HH-mm-ss.sql
```

SQL 规则：

- 只追加新文件，不修改历史 SQL。
- 使用真实表名 `system_menu`。
- 优先写幂等脚本，避免重复执行插入重复菜单。
- 使用 `system_menu_seq` 生成新 ID，并在脚本开头同步 `setval(...)` 到当前最大 ID。
- 菜单 `component` 必须能被 `routerHelper.ts` 的 `import.meta.glob('../views/**/*.{vue,tsx}')` 匹配，例如 `edge/management/index`。
- `component_name` 必须与页面 `defineOptions({ name: '...' })` 或路由名保持一致，避免 keep-alive 异常。
- `type` 使用现有约定：目录 `1`、菜单 `2`、按钮 `3`。
- 默认 `status = 0`、`visible = TRUE`、`keep_alive = TRUE`、`always_show = TRUE`。

### 3. 角色授权默认不做

默认不写 `system_role_menu`，因为这会改变角色可见范围。

只有用户明确提供或确认以下信息时，才追加角色授权 SQL：

- `role_id`
- `tenant_id`
- 授权范围（目录、菜单、按钮是否全部授权）

## 验证清单

默认先做静态核对；以下命令为只读搜索，可直接执行：

```bash
FRONTEND_DIR=$(awk -F'"' '/^[[:space:]]+frontend:/ {print $2; exit}' .ai/project.yml)
BACKEND_DIR=$(awk -F'"' '/^[[:space:]]+backend:/ {print $2; exit}' .ai/project.yml)
SQL_DIR=$(awk -F'"' '/^[[:space:]]+sql:/ {print $2; exit}' .ai/project.yml)
rg -n "views/<module>|path: '/<module>'|<ComponentName>" "$FRONTEND_DIR/src/router/modules/remaining.ts"
rg -n "<菜单名>|<component>|<permission>" "$BACKEND_DIR/$SQL_DIR"/yyyy-MM-dd/*.sql
```

类型检查与最小编译默认允许执行；数据库联调、角色授权变更等高风险验证需确认后再执行：

- 前端类型检查：`FRONTEND_DIR=$(awk -F'"' '/^[[:space:]]+frontend:/ {print $2; exit}' .ai/project.yml); cd "$FRONTEND_DIR" && npm run ts:check`
- 后端最小编译：按受影响模块使用 `mvn compile -pl <module> -am`
- 数据库联调：执行增量 SQL 后，用角色管理授权菜单，重新登录确认未授权不可见、授权后可见。

验收重点：

- 无数据库菜单时，业务页面不会因静态路由兜底出现在菜单中。
- 授权后菜单从 `get-permission-info` 返回并动态生成路由。
- 页面依赖的 API 权限不再因漏按钮权限返回 403。

## 交付口径

输出时至少包含：

- 本步目标
- 使用的 skill 与 skill 目录
- 落地文件
- 影响范围
- 菜单链路证据
- SQL 边界：是否写 `system_menu`、是否写 `system_role_menu`
- 验证结果与未验证项

禁止把以下内容写成"已验证"：

- 只读代码
- 只写 SQL 文件
- 只做 `rg` 静态检查
- 未真实执行数据库脚本
- 未重新登录验证动态菜单
