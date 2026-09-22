#!/usr/bin/env node
import { Command } from 'commander';
import path from 'path';
import fs from 'fs';
import { WorkspaceService } from '../backend/services/workspace.js';
import { CrawlerService } from '../backend/services/crawler.js';
import { DesignExtractorService } from '../backend/services/design.js';
import { CodeGeneratorService } from '../backend/services/generator.js';
import { VisualDiffService } from '../backend/services/diff.js';
import { AgentRunnerService } from '../backend/services/agent.js';
import { initDatabase } from '../backend/db.js';

initDatabase();

const program = new Command();

program
  .name('pixelforge')
  .description('Autonomous Pixel-Perfect Website Reverse-Engineering & Cloning CLI')
  .version('1.0.0');

program
  .command('create')
  .description('Create a new PixelForge workspace')
  .requiredOption('-n, --name <name>', 'Workspace name')
  .requiredOption('-u, --target-url <url>', 'Target URL to clone')
  .option('-m, --model <model>', 'LLM model', 'gpt-4o')
  .action((options) => {
    const ws = WorkspaceService.createWorkspace({
      name: options.name,
      targetUrl: options.targetUrl,
      location: path.join(process.cwd(), 'workspaces', options.name.replace(/[^a-zA-Z0-9]/g, '_')),
      llmProvider: 'openai',
      apiBaseUrl: 'https://api.openai.com/v1',
      apiKey: process.env.OPENAI_API_KEY || '',
      model: options.model,
    });
    console.log(`✓ Workspace created successfully! ID: ${ws.id} at ${ws.location}`);
  });

program
  .command('crawl')
  .description('Crawl target website and extract route graph')
  .requiredOption('-w, --workspace-id <id>', 'Workspace ID')
  .action(async (options) => {
    const ws = WorkspaceService.getWorkspace(options.workspaceId);
    if (!ws) {
      console.error('Workspace not found');
      process.exit(1);
    }
    const projects = WorkspaceService.getProjects(ws.id);
    const proj = projects[0];
    console.log(`Crawling ${ws.targetUrl}...`);
    const result = await CrawlerService.crawlProject(proj.id, ws.targetUrl, ws.location, 5, 2);
    console.log(`✓ Crawl complete! Discovered ${result.routes.length} routes.`);
  });

program
  .command('analyze')
  .description('Extract design system and tokens')
  .requiredOption('-w, --workspace-id <id>', 'Workspace ID')
  .action((options) => {
    const ws = WorkspaceService.getWorkspace(options.workspaceId);
    if (!ws) return;
    const tokens = DesignExtractorService.extractDesignSystem(ws.location, {}, false);
    console.log(`✓ Design system extracted! Extracted ${Object.keys(tokens.colors || {}).length} color tokens.`);
  });

program
  .command('generate')
  .description('Generate React + Vite codebase')
  .requiredOption('-w, --workspace-id <id>', 'Workspace ID')
  .action((options) => {
    const ws = WorkspaceService.getWorkspace(options.workspaceId);
    if (!ws) return;
    const proj = WorkspaceService.getProjects(ws.id)[0];
    const designDir = path.join(ws.location, 'design');
    const tokensPath = path.join(designDir, 'tokens.json');
    const tokens = fs.existsSync(tokensPath) ? JSON.parse(fs.readFileSync(tokensPath, 'utf8')) : ({} as any);

    const projectDir = CodeGeneratorService.generateProjectCode(ws.location, [], tokens);
    console.log(`✓ Codebase generated at ${projectDir}`);
  });

program
  .command('compare')
  .description('Compare reference screenshot with clone render')
  .requiredOption('-w, --workspace-id <id>', 'Workspace ID')
  .action((options) => {
    const ws = WorkspaceService.getWorkspace(options.workspaceId);
    if (!ws) return;
    const proj = WorkspaceService.getProjects(ws.id)[0];
    const res = VisualDiffService.runComparison(proj.id, ws.location, '/', 'desktop', 1);
    console.log(`✓ Visual diff completed! Similarity score: ${(res.similarityScore * 100).toFixed(1)}%`);
  });

program
  .command('run')
  .description('Run full end-to-end autonomous cloning pipeline')
  .requiredOption('-w, --workspace-id <id>', 'Workspace ID')
  .action(async (options) => {
    const ws = WorkspaceService.getWorkspace(options.workspaceId);
    if (!ws) return;
    const proj = WorkspaceService.getProjects(ws.id)[0];
    console.log(`Running autonomous pipeline for ${ws.targetUrl}...`);
    await AgentRunnerService.runPipeline(ws.location, proj.id, ws.targetUrl, proj.enableWiseDesignSystem);
    console.log('✓ Autonomous pipeline finished!');
  });

program.parse(process.argv);
