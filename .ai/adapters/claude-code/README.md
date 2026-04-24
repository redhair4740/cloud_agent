# Claude Code 适配模板

## 配置文件格式

Claude Code 使用以下配置文件：

| 文件 | 位置 | 用途 |
|------|------|------|
| `CLAUDE.md` | 项目根目录 | 项目指令入口，Claude Code 启动时自动读取 |

Claude Code 在项目根目录查找 `CLAUDE.md` 并自动加载其内容作为项目级指令上下文。本项目采用摘要模式：入口文件保留核心红线与任务矩阵，详细规则通过路径引用按需加载。

## 投影规则

### 1. CLAUDE.md 投影

将 `AGENTS.md` + `.ai/agent.md` 的核心约束投影为 `CLAUDE.md`，详细规则通过路径引用按任务类型加载，投影规则如下：

| 源 | 投影目标 | 投影方式 |
|----|----------|----------|
| `AGENTS.md` | `CLAUDE.md` § 读取顺序与核心约束 | 转写为 Claude Code 可理解的指令格式 |
| `.ai/agent.md` § 1-2 | `CLAUDE.md` § 项目概览与目录映射 | 原文投影 |
| `.ai/agent.md` § 3 | `CLAUDE.md` § 目录职责 | 原文投影 |
| `.ai/agent.md` § 4 | `CLAUDE.md` § 读取顺序与优先级 | 转写为 Claude Code 的上下文加载指令 |
| `.ai/agent.md` § 5 | `CLAUDE.md` § Git 使用边界 | 原文投影 |
| `.ai/agent.md` § 6 | `CLAUDE.md` § 规则组合继承 | 原文投影 |
| `.ai/agent.md` § 7-11 | `CLAUDE.md` § 项目模块与输出要求 | 原文投影 |
| `.ai/rules/*.md` | `CLAUDE.md` § 规则摘要与路径引用 | 摘要投影 + 按任务类型路径引用 |
| `.ai/api-status.yml` | `CLAUDE.md` § 规则摘要与路径引用 | 路径引用 |

### 2. 投影模板结构

```markdown
# CLAUDE.md — AI_Vision 项目指令

> 本文件由 .ai/ 体系投影生成，供 Claude Code 使用。
> 源文件：AGENTS.md → .ai/agent.md → .ai/rules/
> 投影时间：{timestamp}

## 读取顺序

1. 先读本文件 `CLAUDE.md`
2. 按本文件引用路径加载角色与技能文档（按需）

## 核心约束

{投影自 AGENTS.md § 2-3}

## 项目概览与目录映射

{投影自 .ai/agent.md § 1-2}

## 目录职责

{投影自 .ai/agent.md § 3}

## 规则组合继承与调度线

{投影自 .ai/agent.md § 6}

## 项目模块与边界说明

{投影自 .ai/agent.md § 7}

## Git 使用边界

{投影自 .ai/agent.md § 5}

## 团队最低输出要求

{投影自 .ai/agent.md § 10}

## 规则摘要与路径引用

{核心红线摘要：业务字典、OpenAPI 真源、api-status 状态、Mock 落点、后端边界、高风险确认、未验证口径}

{任务类型加载矩阵：通用 / 后端 / 前端 / 联动 / Review}

{详细规则路径引用：.ai/rules/*.md + .ai/api-status.yml}
```

## 同步策略

| 策略 | 说明 |
|------|------|
| 同步方向 | `.ai/` → `CLAUDE.md`（单向） |
| 触发时机 | `.ai/agent.md` 或 `.ai/rules/*.md` 变更时重新投影 |
| 手动标记 | 投影文件头部标注投影时间戳，便于判断是否过期 |
| 冲突处理 | 以 `.ai/` 源文件为准，`CLAUDE.md` 为只读派生 |
| 源文件优先 | 禁止直接修改 `CLAUDE.md` 中的投影内容，所有变更必须回到 `.ai/` 体系 |

## 注意事项

- `CLAUDE.md` 使用摘要模式，默认只投影核心红线与任务加载矩阵，详细规则保留路径引用以降低上下文占用。
- `.ai/rules/`、`.ai/agents/` 和 `.ai/skills/` 的内容按需引用，不默认全文内联；`CLAUDE.md` 必须提示按任务类型读取对应路径。
- Claude Code 的 `CLAUDE.md` 与 Gemini CLI 的 `GEMINI.md` 投影结构高度相似；当前测试阶段手工同步，后续补充脚本时两者可共用同一投影逻辑，仅输出文件名不同。
- 禁止回退为全量 rules 内联；若需要更多约束，应优先补充摘要或规则路径，而不是复制全文。
