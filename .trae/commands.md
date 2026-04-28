<!--
由 .ai/scripts/sync-trae-from-ai.mjs 从 .ai/ 生成。
请勿直接修改本文件；先修改 .ai/ 源文件，再重新运行同步脚本。
-->
# AI_Vision 开发命令清单

命令中的目录必须从 `./.trae/project.yml` 动态读取，不假定本地目录名。

## 后端

```bash
# 编译项目
BACKEND_DIR=$(awk -F'"' '/^[[:space:]]+backend:/ {print $2; exit}' .trae/project.yml)
cd "$BACKEND_DIR" && mvn clean compile

# 打包项目（跳过测试）
BACKEND_DIR=$(awk -F'"' '/^[[:space:]]+backend:/ {print $2; exit}' .trae/project.yml)
cd "$BACKEND_DIR" && mvn clean package -DskipTests

# 运行单元测试
BACKEND_DIR=$(awk -F'"' '/^[[:space:]]+backend:/ {print $2; exit}' .trae/project.yml)
cd "$BACKEND_DIR" && mvn test

# 完整构建（含测试）
BACKEND_DIR=$(awk -F'"' '/^[[:space:]]+backend:/ {print $2; exit}' .trae/project.yml)
cd "$BACKEND_DIR" && mvn clean verify

# 启动服务（需先编译）
BACKEND_DIR=$(awk -F'"' '/^[[:space:]]+backend:/ {print $2; exit}' .trae/project.yml)
java -jar "$BACKEND_DIR/vmesh-server/target/vmesh-server.jar"
```

## 前端

```bash
# 安装依赖
FRONTEND_DIR=$(awk -F'"' '/^[[:space:]]+frontend:/ {print $2; exit}' .trae/project.yml)
cd "$FRONTEND_DIR" && pnpm install

# 本地开发服务器
FRONTEND_DIR=$(awk -F'"' '/^[[:space:]]+frontend:/ {print $2; exit}' .trae/project.yml)
cd "$FRONTEND_DIR" && pnpm dev

# 连接后端开发服务器
FRONTEND_DIR=$(awk -F'"' '/^[[:space:]]+frontend:/ {print $2; exit}' .trae/project.yml)
cd "$FRONTEND_DIR" && pnpm dev-server

# TypeScript 类型检查
FRONTEND_DIR=$(awk -F'"' '/^[[:space:]]+frontend:/ {print $2; exit}' .trae/project.yml)
cd "$FRONTEND_DIR" && pnpm ts:check

# ESLint 检查
FRONTEND_DIR=$(awk -F'"' '/^[[:space:]]+frontend:/ {print $2; exit}' .trae/project.yml)
cd "$FRONTEND_DIR" && pnpm lint:eslint

# Prettier 格式化
FRONTEND_DIR=$(awk -F'"' '/^[[:space:]]+frontend:/ {print $2; exit}' .trae/project.yml)
cd "$FRONTEND_DIR" && pnpm lint:format

# StyleLint 检查
FRONTEND_DIR=$(awk -F'"' '/^[[:space:]]+frontend:/ {print $2; exit}' .trae/project.yml)
cd "$FRONTEND_DIR" && pnpm lint:style

# 生产构建
FRONTEND_DIR=$(awk -F'"' '/^[[:space:]]+frontend:/ {print $2; exit}' .trae/project.yml)
cd "$FRONTEND_DIR" && pnpm build:prod
```
