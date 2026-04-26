# 跨平台适配器总览

平台入口均采用短导航策略：只指向 `./.ai/runtime.md`，不复制 `rules/` 全文。

| 平台 | 投影入口 | 说明 |
|------|----------|------|
| Codex | `AGENTS.md` | 根目录短入口 |
| Gemini CLI | `GEMINI.md` + `.gemini/settings.json` | `contextFileName` 指向 `GEMINI.md` |
| Claude Code | `CLAUDE.md` | 根目录短入口 |
| Trae-CN | `.trae/rules/project_rules.md` + stub | 避免自动加载详细规则全文 |

维护要求：修改 `runtime.md`、`rules/` 或入口策略时，同步检查对应投影文件；禁止让平台入口成为第二套规则源。
