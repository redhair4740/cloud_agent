---
lifecycle: record
topic: Edge-MQTT-EMQX云边集成
type: review清单
created: 2026-04-20
status: 已完成
related:
  - docs/deployment/EMQX-MQTT接入/部署方案.md
---

# Edge MQTT / EMQX 云边集成

来源：本轮 cloud 侧 MQTT/EMQX 生产化方案收敛，范围覆盖 `WF_VMesh_Coud`、`WF_VMesh_Coud_UI` 与根仓跟踪文档。

- [x] `P1` 将 cloud 侧 MQTT 配置模型扩展到可生产部署
  - 位置：`WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/config/EdgeMqttProperties.java`、`WF_VMesh_Coud/vmesh-server/src/main/resources/application.yaml`
  - 问题：原有配置不足以明确 cloud 如何给 edge 导出真实 Broker 信息，也无法完整表达 cloud -> EMQX REST publish 的接入参数。
  - 完成标准：补齐 `broker-host`、端口、TLS、EMQX API 与 webhook 安全相关配置，并在提交配置中避免硬编码环境专属 Broker 地址。
  - 完成说明：已补齐 `brokerHost/brokerTcpPort/brokerTlsPort/brokerTlsEnabled/emqxApiBaseUrl/emqxApiKey/emqxApiSecret/emqxApiTimeoutSeconds`，并将 `application.yaml` 中 `broker-host` 默认值改为空；已执行 `mvn -pl vmesh-module-edge -am -DskipTests test-compile -Dmaven.repo.local=/tmp/m2repo`，`BUILD SUCCESS`；运行测试未执行

- [x] `P1` 打通 cloud 侧"节点凭证导出 + EMQX 命令下发"主链路
  - 位置：`WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/node/EdgeNodeController.java`、`WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/controller/admin/command/EdgeMqttCommandController.java`、`WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/service/command/EdgeMqttCommandServiceImpl.java`
  - 问题：cloud 之前只有鉴权和 runtime 入站，缺少对 edge 导出真实 MQTT 接入信息和对 EMQX 下发命令的闭环能力。
  - 完成标准：凭证接口返回真实 Broker/Topic 信息，cloud 提供 `/edge/mqtt/command/send` 并通过 EMQX `/publish` 完成命令下发。
  - 完成说明：已补齐凭证响应字段、Topic Root 解析和命令下发服务；补写测试源码时修复了 `EdgeMqttCommandServiceImplTest` 缺少 `URI` 导入的问题；已执行 `mvn -pl vmesh-module-edge -am -DskipTests test-compile -Dmaven.repo.local=/tmp/m2repo`，`BUILD SUCCESS`；未运行测试

- [x] `P2` 对齐前端凭证弹窗、下载文件与方案文档口径
  - 位置：`WF_VMesh_Coud_UI/src/views/edge/management/dialogs/NodeCredentialDialog.vue`、`WF_VMesh_Coud_UI/src/views/edge/management/hooks/useNodeCredential.ts`、`WF_VMesh_Coud/docs/edge/edge-mqtt-emqx-design.md`
  - 问题：前端需要消费后端返回的真实 EMQX 信息；同时原弹窗顶部 `MQTT Topic` 与下方 `Topic Root` 存在口径歧义，容易让部署人员误判实际生效主题。
  - 完成标准：前端直接展示后端返回的 Broker/Topic 字段，下载 JSON 与文档一致，并把"节点自定义 Topic Root"与"生效 Topic Root"区分开。
  - 完成说明：已对齐前端展示与下载逻辑，并在方案文档补充生产配置、curl 示例和联调检查项；前端静态检查未执行，未做真实页面联调

- [x] `P1` 修复 Redis Stream 自定义 stream/group 构造器导致的消息反序列化失败
  - 位置：`WF_VMesh_Coud/vmesh-framework/vmesh-spring-boot-starter-mq/src/main/java/com/wf/vmesh/framework/mq/redis/core/stream/AbstractRedisStreamMessageListener.java`、`WF_VMesh_Coud/vmesh-module-edge/src/main/java/com/wf/vmesh/module/edge/service/runtime/EdgeRuntimeEventStreamConsumer.java`
  - 问题：`EdgeRuntimeEventStreamConsumer` 通过 `super(streamKey, group)` 指定自定义 Stream 配置时，基类把 `messageType` 置为 `null`，导致 `/admin-api/edge/mqtt/events` 入流后在异步消费阶段抛出 `IllegalArgumentException: Unrecognized Type: [null]`。
  - 完成标准：自定义 `streamKey/group` 的 Stream Listener 仍能保留泛型消息类型，异步消费链可正常反序列化；补一条回归测试覆盖该构造路径。
  - 完成说明：已将基类第二构造器改为同样解析泛型 `messageType`，并新增框架级回归测试与 `test` scope 测试依赖；已执行 `mvn -pl vmesh-module-edge -am -DskipTests test-compile -Dmaven.repo.local=/tmp/m2repo`，`BUILD SUCCESS`；真实重启后消息消费未验证
