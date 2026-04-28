#!/usr/bin/env node

import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..', '..');
const aiRoot = path.join(repoRoot, '.ai');
const traeRoot = path.join(repoRoot, '.trae');

const generatedDirs = ['rules', 'agents', 'skills', 'templates'];
const supportFiles = ['project.yml', 'api-status.yml', 'commands.md'];
const markdownHeader = [
  '<!--',
  '由 .ai/scripts/sync-trae-from-ai.mjs 从 .ai/ 生成。',
  '请勿直接修改本文件；先修改 .ai/ 源文件，再重新运行同步脚本。',
  '-->',
  '',
].join('\n');
const yamlHeader = [
  '# 由 .ai/scripts/sync-trae-from-ai.mjs 从 .ai/ 生成。',
  '# 请勿直接修改本文件；先修改 .ai/ 源文件，再重新运行同步脚本。',
  '',
].join('\n');

const entryContent = `${markdownHeader}# project_rules.md - AI_Vision Trae 入口

本目录由 \`.ai/\` 同步生成，Trae 侧请读取这里的自包含镜像，不要回写生成文件。

## 默认读取

1. 先读 \`./.trae/runtime.md\`，完成任务分类与规则加载判断。
2. 按任务类型读取 \`./.trae/rules/*\` 的必要文件。
3. 需要角色边界、skill 或模板时，再读取 \`./.trae/agents/*\`、\`./.trae/skills/*/SKILL.md\`、\`./.trae/templates/*\`。

## 维护方式

- 手工修改只发生在 \`.ai/\`。
- 修改 \`.ai/\` 后运行 \`node .ai/scripts/sync-trae-from-ai.mjs\` 更新本目录。
- 未验证必须明确标注，高风险操作必须先确认。
`;

const traeAgentContent = `${markdownHeader}# .trae 协作规范治理入口

\`.trae/\` 是从 \`.ai/\` 生成的 Trae 自包含镜像。本文件只说明 Trae 侧如何读取生成内容；不要在 \`.trae/\` 内手工维护规则。

## 读取顺序

1. 先读 \`./.trae/runtime.md\`。
2. 按任务类型读取 \`./.trae/rules/*\`。
3. 需要角色边界时读取 \`./.trae/agents/*\`。
4. 需要可复用流程时读取 \`./.trae/skills/*/SKILL.md\`。
5. 生成文档时读取 \`./.trae/templates/*\`。

## 维护方式

- 唯一手工维护源是 \`.ai/\`。
- 修改 \`.ai/\` 后运行 \`node .ai/scripts/sync-trae-from-ai.mjs\`。
- 脚本会重建 \`.trae/rules\`、\`.trae/agents\`、\`.trae/skills\`、\`.trae/templates\`，并更新运行时支撑文件。
`;

function rewriteForTrae(content) {
  return content
    .replaceAll('.ai/', '.trae/')
    .replaceAll('./.ai/', './.trae/')
    .replaceAll('`.ai/', '`.trae/')
    .replaceAll(' .ai/', ' .trae/')
    .replaceAll('（.ai/', '（.trae/')
    .replaceAll('，.ai/', '，.trae/');
}

function headerFor(filePath) {
  const extension = path.extname(filePath);
  if (['.yml', '.yaml'].includes(extension)) {
    return yamlHeader;
  }
  if (['.json'].includes(extension)) {
    return '';
  }
  return markdownHeader;
}

function shouldRewrite(filePath) {
  return ['.md', '.yml', '.yaml', '.json', '.txt'].includes(path.extname(filePath));
}

async function writeGeneratedFile(sourcePath, targetPath) {
  const content = await readFile(sourcePath, 'utf8');
  await mkdir(path.dirname(targetPath), { recursive: true });
  await writeFile(targetPath, headerFor(targetPath) + rewriteForTrae(content), 'utf8');
}

async function copyGeneratedTree(sourceDir, targetDir) {
  await mkdir(targetDir, { recursive: true });
  const entries = await readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      await copyGeneratedTree(sourcePath, targetPath);
      continue;
    }

    if (entry.isFile() && shouldRewrite(sourcePath)) {
      await writeGeneratedFile(sourcePath, targetPath);
      continue;
    }

    if (entry.isFile()) {
      await mkdir(path.dirname(targetPath), { recursive: true });
      await cp(sourcePath, targetPath);
    }
  }
}

async function ensureSourceDir(relativeDir) {
  const sourceDir = path.join(aiRoot, relativeDir);
  const sourceStat = await stat(sourceDir);
  if (!sourceStat.isDirectory()) {
    throw new Error(`source is not a directory: ${sourceDir}`);
  }
  return sourceDir;
}

async function main() {
  await mkdir(traeRoot, { recursive: true });

  for (const dir of generatedDirs) {
    await rm(path.join(traeRoot, dir), { recursive: true, force: true });
  }

  for (const dir of generatedDirs) {
    await copyGeneratedTree(await ensureSourceDir(dir), path.join(traeRoot, dir));
  }

  for (const file of supportFiles) {
    await writeGeneratedFile(path.join(aiRoot, file), path.join(traeRoot, file));
  }

  await writeGeneratedFile(path.join(aiRoot, 'runtime.md'), path.join(traeRoot, 'runtime.md'));
  await writeFile(path.join(traeRoot, 'agent.md'), traeAgentContent, 'utf8');
  await writeFile(path.join(traeRoot, 'rules', 'project_rules.md'), entryContent, 'utf8');

  console.log('Trae mirror synced from .ai to .trae.');
  console.log('Updated: .trae/rules, .trae/agents, .trae/skills, .trae/templates');
  console.log('Updated: .trae/runtime.md, .trae/project.yml, .trae/api-status.yml, .trae/commands.md, .trae/agent.md');
  console.log('Preserved: .trae/specs');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
