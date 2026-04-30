---
alwaysApply: false
description: 当任务涉及设计方案、API 文档、部署方案、交接文档、review 清单、docs 索引或文档归档时使用。
---
# 文档治理规则

## 双轨分类

- 项目文档分为活文档（`lifecycle: living`）和记录文档（`lifecycle: record`）。
- 活文档代表某主题的当前有效知识，按主题维护当前版本；仅适用于 `设计方案`、`API文档`、`部署方案`。
- 记录文档代表某时间点的评审、交接、协作分析、工单、索引或资料说明快照；适用于 `交接文档`、`治理评审`、`协作分析`、`review清单`、`Bug修复工单`、`重构工单`、`索引`、`测试数据说明`。
- 记录文档不得重写历史结论；允许补充状态、验证结果、归档元数据、完成说明和索引修正。

## 命名边界

- 活文档路径格式：`docs/<类型目录>/<主题短名>/<类型标签>.md`。
- 活文档类型目录仅使用：`design/`、`api/`、`deployment/`。
- 活文档类型标签仅使用：`设计方案`、`API文档`、`部署方案`。
- 记录文档路径格式：`docs/<类型目录>/yyyy-MM-dd/hh-mm-ss-类型标签-文档名称.md`。
- `交接文档`、`Bug修复工单`、`重构工单` 默认归入 `docs/design/yyyy-MM-dd/`。
- `治理评审`、`协作分析` 默认归入 `docs/governance/yyyy-MM-dd/`。
- `索引` 文档允许使用对应目录的 `README.md`。
- `测试数据说明` 文档允许保留在 `docs/test-data/**/README.md`。
- `review-tracking/` 保留专用命名：`review清单-hh-mm-ss-文档名称-状态.md`。
- 新建记录文档必须使用实际本地时间生成 `hh-mm-ss`；除非用户明确指定时间，禁止使用 `00-00-00` 占位。

## 元数据

- 新增或迁移文档必须包含 YAML frontmatter。
- 所有文档必须标注：`lifecycle`、`topic`、`type`、`created`、`status`。
- 活文档必须额外标注：`last_updated`、`supersedes`、`related`。
- 记录文档如被活文档取代，必须保留原文件，并标注 `status: archived` 与 `superseded_by`。
- 活文档状态仅允许：`active`、`archived`、`draft`。
- `review清单` 文件名状态仅允许：`已完成`、`未完成`。

## 索引与日志

- `docs/README.md` 必须包含主题索引；主题索引用于查找当前有效文档和关联记录。
- 历史索引用于保留归档证据链，不作为当前有效版本的唯一入口。
- 活文档必须保留“变更日志”章节，格式为：`| 日期 | 变更摘要 | 变更来源 |`。
- `review-tracking/` 状态变化时，必须同步文件名状态后缀和索引链接。
