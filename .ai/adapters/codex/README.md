# Codex 适配说明

## 配置文件格式

Codex 原生入口文件：项目根目录 `AGENTS.md`

Codex 直接读取 `AGENTS.md` 作为协作入口，无需额外投影或转换。

## 投影规则

**无需投影。** `AGENTS.md` 即为 Codex 原生入口，其内容已定义了：

- 读取顺序（`AGENTS.md` → `.ai/agent.md` → `.ai/rules/` → `.ai/agents/` → `.ai/skills/`）
- 输出与证据要求
- 执行边界

Codex 按该读取顺序逐层加载即可获得完整的项目规则体系。

## 同步策略

| 源文件 | 目标 | 同步方式 |
|--------|------|----------|
| `AGENTS.md` | Codex 直接读取 | 无需同步，源即目标 |
| `.ai/agent.md` | Codex 通过 AGENTS.md 引用读取 | 无需同步 |
| `.ai/rules/*.md` | Codex 通过 AGENTS.md 引用读取 | 无需同步 |
| `.ai/agents/*.md` | Codex 通过 AGENTS.md 引用读取 | 无需同步 |
| `.ai/skills/*/SKILL.md` | Codex 通过 AGENTS.md 引用读取 | 无需同步 |

## 结论

Codex 是本项目的**基准平台**，`AGENTS.md` 的结构即为 Codex 原生结构。其他平台的适配均以 Codex 的读取链路为参照进行投影。
