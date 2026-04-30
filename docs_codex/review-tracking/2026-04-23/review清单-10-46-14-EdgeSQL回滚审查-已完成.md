---
lifecycle: record
topic: EdgeSQL回滚审查
type: review清单
created: 2026-04-23
status: 已完成
related:
  - docs_codex/design/边云协同Edge全链路/设计方案.md
---

# Edge SQL 回滚审查

来源：审查 `WF_VMesh_Coud/sql/postgresql/2026-04-22/2026-04-22-23-10-00.sql` 与 `WF_VMesh_Coud/sql/postgresql/2026-04-22/2026-04-22-23-10-00-rollback.sql` 的正反向一致性。

- [x] `S1` 回滚脚本没有恢复到 23:10 之前的已发布结构
  - 位置：`WF_VMesh_Coud/sql/postgresql/2026-04-22/2026-04-22-23-10-00-rollback.sql`
  - 问题：同目录已有更早的 `2026-04-22-18-00-00.sql` 创建了 `edge_node_credential`、`edge_runtime_event`、`edge_node_runtime_snapshot`、`edge_node_metric_minute`、`edge_monitor_alert`、`edge_dispatch_resource`、`edge_task`、`edge_task_log`。当前 rollback 直接 `DROP TABLE ... CASCADE` + `DROP SEQUENCE`，并未恢复到 18:00 版本的表结构，因此它不是“回到执行 23:10 之前状态”的严格逆操作。
  - 完成标准：明确 23:10 的目标发布路径；如果 18:00 已视为历史发布资产，则 rollback 需要补成“恢复 18:00 版本结构”，而不是简单删表。
  - 完成说明：未完成；本轮仅完成静态审查，未执行数据库验证。

- [x] `S1` 正向 SQL 使用 `CREATE TABLE IF NOT EXISTS`，导致回滚前提本身不成立
  - 位置：`WF_VMesh_Coud/sql/postgresql/2026-04-22/2026-04-22-23-10-00.sql`
  - 问题：23:10 对与 18:00 同名的多张表重新定义了字段、默认值、索引名和 `deleted` 类型，但采用 `CREATE TABLE IF NOT EXISTS`。若 18:00 已执行，23:10 并不会把旧表迁移到新结构，数据库会停留在旧版本；此时 rollback 再执行删表，只会把旧表也一并删掉，无法称为正确回滚。
  - 完成标准：把 23:10 改成真正的增量迁移 SQL（`ALTER TABLE` / `ALTER INDEX` / 数据修复），并按迁移后的真实结构补写对应 rollback。
  - 完成说明：未完成；本轮仅完成静态审查，未执行数据库验证。
