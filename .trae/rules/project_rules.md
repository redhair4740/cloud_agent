# project_rules.md — AI_Vision Trae 入口

> 此目录可能被 Trae 自动加载，因此这里只保留短导航，不复制规则全文。

1. 先读 `./.ai/runtime.md`。
2. 按任务类型读取 `./.ai/rules/*` 的必要文件。
3. 需要角色边界、skill 或模板时再按路径读取。

- `.ai/` 是唯一规则源；`.trae/rules/*` 只是 stub。
- 目录名从 `./.ai/project.yml` 动态读取。
- 接口契约以 `/v3/api-docs` 为准，接口状态以 `./.ai/api-status.yml` 为准。
- 未验证必须明确标注，高风险操作必须先确认。
