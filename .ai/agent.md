# .ai 项目协作总入口

本文件是项目团队协作入口，定义项目适用范围、目录职责、读取优先级、模块边界与最低交付要求。

## 1. 项目适用范围

- 适用于当前仓库内的需求分析、设计、开发、联调、文档与交付任务。
- 面向“项目结果”协作，不面向某个单一工具说明。
- 目标是让团队在同一边界下稳定推进：同一规则、同一职责、同一输出口径。

## 2. 项目目录映射

- 后端主工程目录：`./WF_VMesh_Coud`
  - 承载后端接口、领域模型、数据访问、后端配置与后端测试代码。
- 前端主工程目录：`./WF_VMesh_Coud_UI`
  - 承载页面、组件、状态管理、API 调用封装与前端交互逻辑。
- 原型/设计参考目录：`./wf_vmesh_cloud_design`
  - 只用于参考布局、信息层级、交互流程与功能点，不作为代码实现来源。
- 项目协作规范目录：`./.ai`
  - 承载当前项目的 agents / rules / skills 规范体系。
- 项目文档目录：`./docs`
  - 承载评审结论、优化建议、路线图和其他需要持续追踪的 Markdown 工件。

## 3. 目录职责（agents / rules / skills）

- `./.ai/agents/`
  - 定义协作角色、分工方式、任务拆解与汇报模板。
  - 用于明确主责任人与跨角色协作流程。
  - 当前主用文档：
    - `./.ai/agents/20-backend-agent.md`
    - `./.ai/agents/30-frontend-agent.md`
    - `./.ai/agents/10-fullstack-linkage-agent.md`
    - `./.ai/agents/40-review-agent.md`
- `./.ai/rules/`
  - 定义项目硬约束与边界规则，属于必须遵守项。
  - 涵盖模块归属、开发边界、交付标准、测试与验证口径。
  - 联动规则文档：
    - `./.ai/rules/30-fullstack-linkage-rules.md`（前后端联动强制规则）
- `./.ai/skills/`
  - 预留给后续可复用执行方法与操作流程。
  - 当前目录可为空；只有实际存在可用 skill 时才读取。
  - 不得突破 `rules` 的约束。

## 4. 读取顺序与优先级

标准读取顺序：

1. `./.ai/agent.md`（先明确项目协作总入口）
2. `./.ai/rules/*.md`（再明确硬约束与边界）
3. `./.ai/agents/*.md`（再匹配任务协作模式）
4. `./.ai/skills/*/SKILL.md`（若存在可用 skill，再作为最后一步读取）

文档冲突时优先级：

1. `rules`（最高）
2. `agent.md`
3. `agents`
4. `skills`

## 5. Git 使用边界

- 允许使用安全的 git 操作辅助查看与定位，例如状态查看、差异查看、日志查看、文件归属与提交历史查询。
- 禁止使用危险的 git 操作，包括但不限于：覆盖工作区、强制回退、重写历史、强推、批量丢弃改动、未确认的冲突性 checkout/reset/restore/rebase。
- 只要某个 git 操作可能导致用户现有改动、历史记录或当前分支状态不可逆丢失，就视为危险操作，不得执行。

## 6. 规则组合继承与调度线

按任务类型加载规则集合：

1. `backend-agent`
   - 规则继承：`00-repo-baseline.md + 10-backend-development-rules.md`
2. `frontend-agent`
   - 规则继承：`00-repo-baseline.md + 20-frontend-development-rules.md`
3. `fullstack-agent`
   - 规则继承：`00-repo-baseline.md + 10-backend-development-rules.md + 20-frontend-development-rules.md + 30-fullstack-linkage-rules.md`
4. `review-agent`
   - 规则继承：按被评审对象加载对应规则集合
   - 评审后端改动：加载 `backend-agent` 规则集
   - 评审前端改动：加载 `frontend-agent` 规则集
   - 评审 fullstack 改动：加载 `fullstack-agent` 规则集

调度原则：

- 先判定任务对象（backend/frontend/fullstack/review），再绑定规则集合。
- `fullstack-agent` 不能降级为单边规则，必须包含 `30-fullstack-linkage-rules.md` 联动规则。
- `review-agent` 不使用独立规则替代对象规则，而是对对象规则做一致性复核。

## 7. 项目模块与边界说明

- 前后端联动按“接口契约 + 页面行为”共同验收，禁止单边定义为准。
- 原型只用于参考布局与功能点，不作为字段、接口、数据结构的直接实现依据。
- 模块化设计以未来微服务化为目标，先清晰定义域边界，再落地模块职责。
- 跨域协作必须明确输入输出，避免隐式耦合与跨域直接依赖扩散。

## 8. Skill 沉淀建议机制

- 在需求实现、排障、迁移、联调、评审过程中，AI 应自动判断当前任务里是否出现了可复用、可沉淀、可跨任务复用的方法论或操作流程。
- 若满足以下任一特征，应主动提出“建议沉淀为 skill”：
  - 同类任务已重复出现两次及以上
  - 存在稳定的执行步骤、检查清单或判断路径
  - 明显适用于后续多个模块、多个需求或多名协作者复用
  - 继续依赖临时对话说明会增加遗漏、返工或口径漂移风险
- 提建议时至少说明：
  - 为什么适合沉淀为 skill
  - 预期适用场景
  - 建议的 skill 名称与范围
  - 若沉淀后会减少哪些重复解释或重复劳动
- 未获得用户明确同意前，只提出建议，不直接生成 skill 文件或 skill 目录。
- 用户明确同意后，才进入 skill 设计与落地阶段。
- 新生成的项目级 skill 必须保存到 `./.ai/skills/` 目录下，不写到其他位置。

## 9. 任务类型与 Agent 选择

按任务主导目标选择 agent：

1. `backend-agent`
   - 适用：仅后端模块改动（接口实现、服务逻辑、数据访问、后端测试）。
   - 排除：不包含前端页面/状态/调用链同步改造。
2. `frontend-agent`
   - 适用：仅前端模块改动（页面、组件、状态管理、调用封装、交互文案）。
   - 排除：不包含后端契约与业务规则改造。
3. `fullstack-agent`
   - 适用：跨前后端联动改造，需统一接口契约与页面行为验收。
   - 入口：`./.ai/agents/10-fullstack-linkage-agent.md`
4. `review-agent`
   - 适用：评审任务，重点检查风险、回归、缺失测试、协议不一致、模块边界破坏。
   - 入口：`./.ai/agents/40-review-agent.md`
   - 规则：按被评审对象加载对应规则集，不单独替代对象规则。

选择规则：

- 同时涉及前后端协议与交互，优先 `fullstack-agent`。
- 用户明确要求评审/回归检查，优先 `review-agent`。
- 单边改动按职责选择 `backend-agent` 或 `frontend-agent`。
- 若任务同时包含“实现 + 评审”，先实现（backend/frontend/fullstack），再由 `review-agent` 按对象规则集复核。

## 10. 团队最低输出要求

每次任务输出至少包含：

- 本步目标
- 落地文件
- 影响范围
- 关键边界
- 验证结果（已验证 / 未验证）
- 未验证项与原因

## 11. Review 与优化建议归档要求

- 遇到代码 review 结论、联调问题或优化建议时，除对话输出外，还要同步更新 `./docs/review-tracking/review-and-optimization-checklist.md`。
- 文档中的每个待办事项必须使用 Markdown 勾选框记录，默认新增为 `[ ]`。
- 对应代码完成后，需要在同一文档里同步把事项更新为 `[x]`，并补充完成说明；若未做真实验证，必须继续标注“未验证”。
- 若同一次 review 同时覆盖多个仓库或前后端联动问题，统一收敛到同一章节，避免拆散上下文。
