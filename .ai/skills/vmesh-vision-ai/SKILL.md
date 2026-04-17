---
name: vmesh-vision-ai
description: 在 WF_VMesh_Coud 仓库中开发或修改 AI 模块时使用。适用于 vmesh-module-vision 下的 Spring AI provider 接入、模型工厂、tool calling、MCP、向量库、知识库、TinyFlow 工作流、AI 安全放行与 server 装配判断；会先检查 vision 模块 pom、AiAutoConfiguration、AiModelFactoryImpl、SecurityConfiguration、application.yaml 和 server 是否实际启用 AI 模块。
---

# VMesh Vision AI

## 何时使用

- 目标目录在 `vmesh-module-vision`
- 任务涉及 Spring AI、模型接入、provider 扩展、MCP、向量检索、知识库、AI 工作流、tool calling
- 需要判断 AI 能力是否已经被 `vmesh-server` 装配
- 需要保持 AI 域在未来微服务化下仍可独立演进

## 必看文件

1. `vmesh-module-vision/pom.xml`
2. `vmesh-module-vision/.../AiAutoConfiguration.java`
3. `vmesh-module-vision/.../AiModelFactoryImpl.java`
4. `vmesh-module-vision/.../SecurityConfiguration.java`
5. `vmesh-server/src/main/resources/application.yaml`
6. `vmesh-server/pom.xml`
7. `vmesh-server/.../DefaultController.java`

## 工作流

1. 先分类任务属于哪一类：
   - 模型 provider
   - 工具调用
   - MCP
   - 向量库 / 知识库
   - 工作流
   - server 装配
2. 再确认运行边界：
   - 是否依赖 `spring.ai.*`
   - 是否依赖 `vmesh.ai.*`
   - 是否要求匿名放行 MCP 端点
   - 是否要求同步 SQL / 菜单 / 字典 / VO
3. 判断这次改动是否仍然闭合在 AI 域，不把 AI 业务规则散落到 system / infra / server。
4. 若有代码改动，同步补模块单元测试。

## 特殊禁区

- 禁止引入 WebFlux 版 MCP starter；本仓库 AI 模块明确跑在 Spring MVC 上。
- 不要绕过 `AiAutoConfiguration` / `AiModelFactoryImpl` 另起一套 provider 装配。
- 不要把 AI 工作流误实现到 Flowable；AI 工作流主线是 TinyFlow。
- 不要在回复或文档里回显 `application*.yaml` 中的 provider 密钥。

## 实现提示

- 新增 provider 时，优先沿用现有 ChatModel 包装模式和配置类绑定方式。
- 新增工具时，优先复用 `tool/method` 或 `tool/function` 目录结构。
- 新增向量库相关能力时，先判断是工厂层、配置层还是知识库业务层改动。
- 如果 `vmesh-server/pom.xml` 仍未装配 AI 模块，要把结果表述为“代码已落地，但服务未启用”。

## 测试要求

- 默认补 `vmesh-module-vision/src/test/java` 下的标准单元测试
- 优先覆盖模型选择、工具调用、参数分支、异常路径
- 需要配置或资源时，优先复用模块既有测试资源
- 未经确认不执行测试，但不能省略测试代码

## 完成标准

- 说明修改点属于哪类 AI 能力
- 说明这次改动为什么仍属于 AI 域
- 说明是否需要额外启用 server 装配
- 说明是否已验证；没验证就写“未验证”
