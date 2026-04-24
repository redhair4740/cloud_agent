# Claude Code 适配模板

## 配置文件格式

Claude Code 使用以下配置文件：

| 文件 | 位置 | 用途 |
|------|------|------|
| `CLAUDE.md` | 项目根目录 | 项目指令入口，Claude Code 启动时自动读取 |

Claude Code 在项目根目录查找 `CLAUDE.md` 并自动加载其内容作为项目级指令上下文。Claude Code 不支持多文件自动级联读取，所有规则需内联或通过路径引用。

## 投影规则

### 1. CLAUDE.md 投影

将 `AGENTS.md` + `.ai/agent.md` + `.ai/rules/` 的内容投影为 `CLAUDE.md`，投影规则如下：

| 源 | 投影目标 | 投影方式 |
|----|----------|----------|
| `AGENTS.md` | `CLAUDE.md` § 读取顺序与核心约束 | 转写为 Claude Code 可理解的指令格式 |
| `.ai/agent.md` § 1-2 | `CLAUDE.md` § 项目概览与目录映射 | 原文投影 |
| `.ai/agent.md` § 3 | `CLAUDE.md` § 目录职责 | 原文投影 |
| `.ai/agent.md` § 4 | `CLAUDE.md` § 读取顺序与优先级 | 转写为 Claude Code 的上下文加载指令 |
| `.ai/agent.md` § 5 | `CLAUDE.md` § Git 使用边界 | 原文投影 |
| `.ai/agent.md` § 6 | `CLAUDE.md` § 规则组合继承 | 原文投影 |
| `.ai/agent.md` § 7-11 | `CLAUDE.md` § 项目模块与输出要求 | 原文投影 |
| `.ai/rules/00-repo-baseline.md` | `CLAUDE.md` § 规则附录: 00-repo-baseline | 内联投影 |
| `.ai/rules/01-business-dictionary.md` | `CLAUDE.md` § 规则附录: 01-business-dictionary | 内联投影 |
| `.ai/rules/10-backend-development-rules.md` | `CLAUDE.md` § 规则附录: 10-backend-development-rules | 内联投影 |
| `.ai/rules/11-backend-object-layering-rules.md` | `CLAUDE.md` § 规则附录: 11-backend-object-layering-rules | 内联投影 |
| `.ai/rules/20-frontend-development-rules.md` | `CLAUDE.md` § 规则附录: 20-frontend-development-rules | 内联投影 |
| `.ai/rules/30-fullstack-linkage-rules.md` | `CLAUDE.md` § 规则附录: 30-fullstack-linkage-rules | 内联投影 |

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

## 规则附录

### 00-repo-baseline

{投影自 .ai/rules/00-repo-baseline.md}

### 01-business-dictionary

{投影自 .ai/rules/01-business-dictionary.md}

### 10-backend-development-rules

{投影自 .ai/rules/10-backend-development-rules.md}

### 11-backend-object-layering-rules

{投影自 .ai/rules/11-backend-object-layering-rules.md}

### 20-frontend-development-rules

{投影自 .ai/rules/20-frontend-development-rules.md}

### 30-fullstack-linkage-rules

{投影自 .ai/rules/30-fullstack-linkage-rules.md}
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

- Claude Code 不支持多文件自动级联读取，因此需要将规则内联投影到 `CLAUDE.md` 中。
- `.ai/agents/` 和 `.ai/skills/` 的内容按需引用，不默认内联投影；可在 `CLAUDE.md` 中以路径引用方式提示 Claude Code 按需读取。
- Claude Code 的 `CLAUDE.md` 与 Gemini CLI 的 `GEMINI.md` 投影结构高度相似；当前测试阶段手工同步，后续补充脚本时两者可共用同一投影逻辑，仅输出文件名不同。
- 若 `CLAUDE.md` 内容过长影响上下文窗口，可考虑仅投影核心约束与规则摘要，详细规则保留路径引用。
