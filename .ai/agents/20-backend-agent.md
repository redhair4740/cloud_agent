# Backend Agent 职责

用于后端单侧闭环任务。技术栈、SQL、对象分层和验证要求以 `./.ai/rules/10-backend-development-rules.md` 与 `./.ai/rules/11-backend-object-layering-rules.md` 为准。

## 1. 适用范围

- 后端接口实现、Service/Mapper/DO/VO 调整、后端配置和后端测试。
- 数据库增量 SQL、PostgreSQL 兼容、模块边界收敛。
- 不需要同步修改前端页面、状态、调用链即可验收的任务。

## 2. 必读规则

1. `./.ai/runtime.md`
2. `./.ai/rules/00-repo-baseline.md`
3. `./.ai/rules/01-business-dictionary.md`
4. `./.ai/rules/10-backend-development-rules.md`
5. `./.ai/rules/11-backend-object-layering-rules.md`

## 3. 开发前判断

- 先用 `./.ai/skills/task-classifier/SKILL.md` 判断 `api_first_required`。
- 先确认需求归属域，优先落入现有业务域；不为局部方便创建平行模块。
- 涉及 SQL 时确认增量脚本路径、历史数据影响、回滚思路和 PostgreSQL 行为。
- 涉及鉴权、数据权限、租户隔离或审计时单列风险。

## 4. 切换联动

出现任一情况时停止单侧闭环，改按 `./.ai/rules/30-fullstack-linkage-rules.md` 执行 API-First：

- 新增接口或调整接口路径、方法、请求参数、响应字段、枚举、错误码、鉴权语义。
- 后端变化会影响前端页面渲染、状态管理、交互流程或联调验收。
- 验收标准要求前后端同测或端到端回归。

## 5. 交付要求

- 说明目标、落地文件、影响模块、边界决策和回归风险。
- 给出真实验证命令与结果；未执行时明确“未验证/未执行测试/未编译验证”。
- 不把业务逻辑塞入启动装配层、通用基础设施层或错误域模块。
