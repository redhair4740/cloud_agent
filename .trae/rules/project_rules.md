# project_rules.md — AI_Vision 项目规则

> 此文件由 .ai/ 投影生成；测试阶段需手工同步，请勿脱离源文件单独修改。
> 源文件：AGENTS.md → .ai/agent.md
> 投影时间：2026-04-24

## 上下文加载

本目录下所有 .md 文件由 Trae-CN 自动加载，无需手动引用。
规则文件编号与源文件保持一致，便于对照。

## 输出与证据要求

1. 默认使用简体中文输出分析、说明、注释与结论。
2. 关键判断尽量附证据：真实文件路径、方法名、配置键、命令与实际行为。
3. 没有真实验证证据时，必须明确标注"未验证"，不得写成已完成或已通过。

## 执行边界

1. 默认允许执行只读命令、静态检查、类型检查、编译与单元测试；后台执行单元测试时建议设置最大超时时间 60s，避免任务卡死。
2. 未获明确确认，不执行高风险操作（删除/批量改写/环境与权限变更/生产数据与密钥相关操作）。
3. 需执行高风险操作时，先说明影响范围与风险，再等待明确确认。
4. 若发现当前任务存在适合沉淀为可复用 skill 的稳定流程或检查清单，先给出 skill 化建议；未获明确同意前，不直接生成 skill 文件。经确认后生成的项目级 skill 统一保存到 `./.ai/skills/`。
5. Git 仅允许安全操作；禁止使用会丢失、覆盖、回滚、强推或批量改写历史/工作区的危险 git 操作。非破坏性的查看类、定位类、状态类 git 操作可以使用。

## 项目目录映射

- 后端主工程目录：由 `.ai/project.yml` 的 `dirs.backend` 指定
  - 承载后端接口、领域模型、数据访问、后端配置与后端测试代码。
- 前端主工程目录：由 `.ai/project.yml` 的 `dirs.frontend` 指定
  - 承载页面、组件、状态管理、API 调用封装与前端交互逻辑。
- 原型/设计参考目录：由 `.ai/project.yml` 的 `dirs.design` 指定
  - 只用于参考布局、信息层级、交互流程与功能点，不作为代码实现来源。
- 项目协作规范目录：`./.ai`
  - 承载当前项目的 agents / rules / skills 规范体系。
- 接口联调状态清单：`./.ai/api-status.yml`
  - 由后端或人工确认后更新；前端与 AI 只消费状态，用于决定 Mock、真实 API 切换与失效 Mock 清理。
- 项目文档目录：`./docs`
  - 承载评审结论、设计方案、交接文档、治理评审、部署方案和其他需要持续追踪的 Markdown 工件。
  - `./docs/design/`：承载技术设计方案及对应的 AI 交接文档，按日期子目录组织。
  - `./docs/governance/`：承载治理评审、协作分析、规范评估文档，按日期子目录组织。
  - `./docs/deployment/`：承载部署方案、运维方案，按日期子目录组织。
  - `./docs/review-tracking/`：承载评审清单与跟踪记录，按日期子目录组织。
  - 文档命名格式：`hh-mm-ss-类型标签-文档名称.md`，时间戳在前保证默认排序按时间排列；`review-tracking/` 目录例外，使用 `review清单-hh-mm-ss-文档名称-状态.md`。
  - 文档索引与使用约定：`./docs/README.md`

## 规则优先级

标准读取顺序：

1. `./.ai/agent.md`（先明确项目协作总入口）
2. `./.ai/rules/*.md`（再明确硬约束与边界；其中 `00-repo-baseline.md` 与 `01-business-dictionary.md` 优先读取）
3. `./.ai/agents/*.md`（再匹配任务协作模式）
4. `./.ai/skills/*/SKILL.md`（若存在可用 skill，再作为最后一步读取）

文档冲突时优先级：

1. `rules`（最高）
2. `agent.md`
3. `agents`
4. `skills`

## Git 使用边界

- 允许使用安全的 git 操作辅助查看与定位，例如状态查看、差异查看、日志查看、文件归属与提交历史查询。
- 禁止使用危险的 git 操作，包括但不限于：覆盖工作区、强制回退、重写历史、强推、批量丢弃改动、未确认的冲突性 checkout/reset/restore/rebase。
- 只要某个 git 操作可能导致用户现有改动、历史记录或当前分支状态不可逆丢失，就视为危险操作，不得执行。

## 规则组合继承与调度线

按任务类型加载规则集合：

1. `backend-agent`
   - 规则继承：`00-repo-baseline.md + 01-business-dictionary.md + 10-backend-development-rules.md + 11-backend-object-layering-rules.md`
   - 涉及新接口或接口变更时，必须先走"API 契约先行"流程（`20-backend-agent.md` 第 9 节）。
2. `frontend-agent`
   - 规则继承：`00-repo-baseline.md + 01-business-dictionary.md + 20-frontend-development-rules.md`
   - 接口调用必须按 OpenAPI 文档（`/v3/api-docs`）对齐，不得自行猜测字段。
3. `review-agent`
   - 规则继承：按被评审对象加载对应规则集合
   - 评审后端改动：加载 `backend-agent` 规则集
   - 评审前端改动：加载 `frontend-agent` 规则集
   - 评审联动改动：加载 `backend-agent` + `frontend-agent` + `01-business-dictionary.md` + `30-fullstack-linkage-rules.md`

跨端联动任务调度原则：

- 按 API-First 流程执行：
  1. Backend Agent 先走"API 契约先行"流程（写 Controller 骨架，生成 `/v3/api-docs`）
  2. 与前端确认契约无误
  3. Backend Agent 完成 Service 实现，Frontend Agent 完成前端实现
  4. 使用 `contract-check` skill 做最终一致性验证
- 联动任务必须遵守 `30-fullstack-linkage-rules.md` 的所有硬约束。

## 项目模块与边界说明

- 前后端联动按"接口契约 + 页面行为"共同验收，禁止单边定义为准。
- 原型只用于参考布局与功能点，不作为字段、接口、数据结构的直接实现依据。
- 模块化设计以未来微服务化为目标，先清晰定义域边界，再落地模块职责。
- 后端对象管理默认走轻量模块化：模块间强调边界，模块内默认保持 `VO + DO` 即可，不默认引入 `BO` 中间层。
- 规范目标目录统一使用 `dal/mapper` 这类中性命名。
- 跨域协作必须明确输入输出，避免隐式耦合与跨域直接依赖扩散。

## 团队最低输出要求

每次任务输出至少包含：

- 本步目标
- 落地文件
- 影响范围
- 关键边界
- 验证结果（已验证 / 未验证）
- 未验证项与原因
