# Gemini CLI 适配模板

## 配置文件格式

Gemini CLI 使用以下配置文件：

| 文件 | 位置 | 用途 |
|------|------|------|
| `GEMINI.md` | 项目根目录 | 项目指令入口，Gemini CLI 启动时自动读取 |
| `.gemini/settings.json` | 项目根目录 | Gemini CLI 项目级配置，可指定 contextFileName |

## 投影规则

### 1. GEMINI.md 投影

将 `.ai/agent.md` + `.ai/rules/` 的内容投影为 `GEMINI.md`，投影规则如下：

| 源 | 投影目标 | 投影方式 |
|----|----------|----------|
| `AGENTS.md` | `GEMINI.md` § 读取顺序 | 转写为 Gemini CLI 的上下文加载指令 |
| `.ai/agent.md` § 1-2 | `GEMINI.md` § 项目概览与目录映射 | 原文投影，路径保持相对路径 |
| `.ai/agent.md` § 3 | `GEMINI.md` § 目录职责 | 原文投影 |
| `.ai/agent.md` § 4 | `GEMINI.md` § 读取顺序与优先级 | 转写为 Gemini CLI 可理解的加载指令 |
| `.ai/agent.md` § 5 | `GEMINI.md` § Git 使用边界 | 原文投影 |
| `.ai/agent.md` § 6 | `GEMINI.md` § 规则组合继承 | 原文投影 |
| `.ai/agent.md` § 7-11 | `GEMINI.md` § 项目模块与输出要求 | 原文投影 |
| `.ai/rules/*.md` + `.ai/api-status.yml` | `GEMINI.md` § 规则摘要与路径引用 | 摘要投影 + 按任务类型路径引用 |

### 2. .gemini/settings.json 投影

```json
{
  "contextFileName": "GEMINI.md"
}
```

若项目需要 Gemini CLI 加载额外上下文文件，可在 `contextFileName` 中指定文件名列表。

### 3. 投影模板结构

```markdown
# GEMINI.md — AI_Vision 项目指令

> 本文件由 .ai/ 体系投影生成，供 Gemini CLI 使用。
> 源文件：AGENTS.md → .ai/agent.md → .ai/rules/
> 投影时间：{timestamp}

## 读取顺序

1. 先读本文件 `GEMINI.md`
2. 按本文件引用路径加载规则与角色文档

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
| 同步方向 | `.ai/` → `GEMINI.md` + `.gemini/settings.json`（单向） |
| 触发时机 | `.ai/agent.md` 或 `.ai/rules/*.md` 变更时重新投影 |
| 手动标记 | 投影文件头部标注投影时间戳，便于判断是否过期 |
| 冲突处理 | 以 `.ai/` 源文件为准，投影文件为只读派生 |
| 源文件优先 | 禁止直接修改 `GEMINI.md` 中的投影内容，所有变更必须回到 `.ai/` 体系 |

## 注意事项

- `GEMINI.md` 使用摘要模式，默认只投影核心红线与任务加载矩阵，详细规则保留路径引用以降低上下文占用。
- `.ai/rules/`、`.ai/agents/` 和 `.ai/skills/` 的内容按需引用，不默认全文内联；`GEMINI.md` 必须提示按任务类型读取对应路径。
- `contextFileName` 默认设为 `GEMINI.md`，确保 Gemini CLI 启动时自动加载。
