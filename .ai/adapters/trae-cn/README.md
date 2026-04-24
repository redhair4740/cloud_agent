# Trae-CN 适配模板

## 配置文件格式

Trae-CN 使用以下配置目录与文件：

| 文件 | 位置 | 用途 |
|------|------|------|
| `.trae/rules/` | 项目根目录 | Trae-CN 项目级规则目录，IDE 自动加载该目录下所有规则文件 |
| `.trae/rules/project_rules.md` | `.trae/rules/` 内 | 项目级主规则文件 |

Trae-CN 在打开项目时会自动读取 `.trae/rules/` 目录下的 Markdown 文件作为项目规则上下文。

## 投影规则

### 1. .trae/rules/ 投影

将 `.ai/rules/` 的内容投影到 `.trae/rules/` 目录，投影规则如下：

| 源文件 | 投影目标 | 投影方式 |
|--------|----------|----------|---------|
| `.ai/rules/00-repo-baseline.md` | `.trae/rules/00-repo-baseline.md` | 原文复制 |
| `.ai/rules/01-business-dictionary.md` | `.trae/rules/01-business-dictionary.md` | 原文复制 |
| `.ai/rules/10-backend-development-rules.md` | `.trae/rules/10-backend-development-rules.md` | 原文复制 |
| `.ai/rules/11-backend-object-layering-rules.md` | `.trae/rules/11-backend-object-layering-rules.md` | 原文复制 |
| `.ai/rules/20-frontend-development-rules.md` | `.trae/rules/20-frontend-development-rules.md` | 原文复制 |
| `.ai/rules/30-fullstack-linkage-rules.md` | `.trae/rules/30-fullstack-linkage-rules.md` | 原文复制 |

### 2. project_rules.md 投影

将 `AGENTS.md` + `.ai/agent.md` 中的项目级约束投影为 `.trae/rules/project_rules.md`：

| 源 | 投影目标 | 投影方式 |
|----|----------|----------|
| `AGENTS.md` § 1 读取顺序、任务矩阵、核心红线 | `project_rules.md` § 上下文加载、规则组合、核心红线 | 转写为 Trae-CN 可理解的规则引用说明 |
| `AGENTS.md` § 2 输出与证据要求 | `project_rules.md` § 输出与证据要求 | 原文投影 |
| `AGENTS.md` § 3 执行边界 | `project_rules.md` § 执行边界 | 原文投影 |
| `.ai/agent.md` § 2 目录映射 | `project_rules.md` § 项目目录映射 | 原文投影 |
| `.ai/agent.md` § 4 读取顺序与优先级 | `project_rules.md` § 规则优先级 | 转写为 Trae-CN 规则优先级声明 |
| `.ai/agent.md` § 5 Git 使用边界 | `project_rules.md` § Git 使用边界 | 原文投影 |
| `.ai/agent.md` § 6 规则组合继承 | `project_rules.md` § 规则组合继承 | 原文投影 |
| `.ai/agent.md` § 7-11 | `project_rules.md` § 项目模块与输出要求 | 原文投影 |

### 3. 投影模板结构（project_rules.md）

```markdown
# project_rules.md — AI_Vision 项目规则

> 本文件由 .ai/ 体系投影生成，供 Trae-CN 使用。
> 源文件：AGENTS.md → .ai/agent.md
> 投影时间：{timestamp}

## 上下文加载

本目录下所有 .md 文件由 Trae-CN 自动加载，无需手动引用。
规则文件编号与源文件保持一致，便于对照。

## 输出与证据要求

{投影自 AGENTS.md § 2}

## 执行边界

{投影自 AGENTS.md § 3}

## 项目目录映射

{投影自 .ai/agent.md § 2}

## 规则优先级

{投影自 .ai/agent.md § 4，转写为 Trae-CN 上下文}

## Git 使用边界

{投影自 .ai/agent.md § 5}

## 规则组合继承与调度线

{投影自 .ai/agent.md § 6}

## 项目模块与边界说明

{投影自 .ai/agent.md § 7}

## 团队最低输出要求

{投影自 .ai/agent.md § 10}
```

## 同步策略

| 策略 | 说明 |
|------|------|
| 同步方向 | `.ai/` → `.trae/rules/`（单向） |
| 触发时机 | `.ai/rules/*.md` 或 `.ai/agent.md` 变更时重新投影 |
| 文件命名 | 规则文件保持与源文件同名同编号，便于追溯 |
| 手动标记 | 投影文件头部标注投影时间戳与源文件路径 |
| 冲突处理 | 以 `.ai/` 源文件为准，`.trae/rules/` 为只读派生 |
| 源文件优先 | 禁止直接修改 `.trae/rules/` 中的投影内容，所有变更必须回到 `.ai/` 体系 |

## 注意事项

- Trae-CN 原生支持 `.trae/rules/` 目录自动加载，因此详细规则文件可直接按原文复制，无需在 `project_rules.md` 内联合并。
- `project_rules.md` 只投影 AGENTS 的摘要、任务矩阵与核心红线；`.ai/agents/` 和 `.ai/skills/` 的内容按需引用路径即可。
- Trae-CN 的规则加载是目录级自动扫描，文件命名不影响加载顺序，但保持编号一致有助于人类可读性。
