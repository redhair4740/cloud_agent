---
name: deploy-portainer-release
version: "1.1.0"
depends_on:
  - ".ai/runtime.md"
  - ".ai/commands.md"
description: 为前后端项目梳理 Jenkins 构建、Harbor 推送、Portainer Stack 发布方案，并输出部署文档、检查清单和验证边界。
---

# Portainer 部署发布

## 概览

本 skill 用于部署方案和发布清单，不默认修改业务代码。真实构建入口、目录和模块名读取 `./.ai/project.yml` 与现有仓库文件。

## 工作流

1. 核对入口：后端 `pom.xml`、server 模块、Dockerfile、配置文件；前端 `package.json`、环境文件、请求配置。
2. 判断旧部署资产是否退役：旧 compose、脚本、镜像名、网络和卷是否仍被引用。
3. 优先拆分前后端发布边界：后端镜像、前端镜像、共享网络、环境变量、外部依赖。
4. 明确敏感配置来源：密钥、数据库、Redis、MQTT、对象存储等只通过环境或平台配置注入。
5. 输出 Portainer Stack、Jenkins/Harbor 步骤、首发操作清单和回滚检查清单。
6. 写清验证边界：本地构建、镜像构建、容器启动、健康检查、页面访问、接口联通。

## 建议产物

- 后端部署说明：`<backend-dir>/deploy/`
- 前端部署说明：`<frontend-dir>/deploy/`
- 发布检查清单：可参考 `references/Portainer部署检查清单.md`
- 如需生成项目文档，按 `docs/README.md` 的部署方案命名规则落位。

## 禁止事项

- 不把生产密钥写入仓库。
- 不调用生产 API 或写生产数据，除非用户明确确认。
- 不为部署方便改业务代码或绕过认证、租户、审计边界。
- 未真实构建、推送或启动时，不得写“已验证”。
