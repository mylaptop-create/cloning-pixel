import { getDb } from '../db.js';
import { WorkspaceConfig, ProjectConfig } from '../../shared/types.js';
import path from 'path';
import fs from 'fs';

export class WorkspaceService {
  static createWorkspace(data: Omit<WorkspaceConfig, 'id' | 'createdAt' | 'updatedAt'>): WorkspaceConfig {
    const db = getDb();
    const id = `ws_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const workspace: WorkspaceConfig = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };

    // Ensure workspace directory structure exists
    const wsDir = path.resolve(data.location || path.join(process.cwd(), 'workspaces', id));
    workspace.location = wsDir;

    const subdirs = [
      '.pixelforge',
      'source',
      'screenshots',
      'references',
      'extracted',
      'design',
      'analysis',
      'implementation',
      'diffs',
      'logs',
      'artifacts',
      'project',
    ];

    for (const dir of subdirs) {
      fs.mkdirSync(path.join(wsDir, dir), { recursive: true });
    }

    // Save config.json in .pixelforge
    fs.writeFileSync(
      path.join(wsDir, '.pixelforge', 'config.json'),
      JSON.stringify(
        {
          ...workspace,
          apiKey: workspace.apiKey ? '***HIDDEN***' : '',
        },
        null,
        2
      )
    );

    const stmt = db.prepare(`
      INSERT INTO workspaces (id, name, location, targetUrl, llmProvider, apiBaseUrl, apiKey, model, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      workspace.id,
      workspace.name,
      workspace.location,
      workspace.targetUrl,
      workspace.llmProvider,
      workspace.apiBaseUrl,
      workspace.apiKey,
      workspace.model,
      workspace.createdAt,
      workspace.updatedAt
    );

    // Automatically create default project for this workspace
    this.createProject({
      workspaceId: workspace.id,
      name: `${workspace.name} Clone Project`,
      targetUrl: workspace.targetUrl,
      enableWiseDesignSystem: false,
      crawl: {
        sameOriginOnly: true,
        maxPages: 10,
        maxDepth: 3,
        includeQueryRoutes: false,
        includeHashRoutes: false,
      },
      visual: {
        threshold: 0.95,
        maxIterations: 5,
        viewports: [
          { name: 'desktop', width: 1440, height: 900 },
          { name: 'tablet', width: 768, height: 1024 },
          { name: 'mobile', width: 390, height: 844 },
        ],
      },
    });

    return workspace;
  }

  static getWorkspaces(): WorkspaceConfig[] {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM workspaces ORDER BY createdAt DESC').all() as any[];
    return rows.map((r) => ({
      ...r,
    }));
  }

  static getWorkspace(id: string): WorkspaceConfig | null {
    const db = getDb();
    const row = db.prepare('SELECT * FROM workspaces WHERE id = ?').get(id) as any;
    return row || null;
  }

  static createProject(data: Omit<ProjectConfig, 'id' | 'createdAt' | 'updatedAt'>): ProjectConfig {
    const db = getDb();
    const id = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const project: ProjectConfig = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };

    const stmt = db.prepare(`
      INSERT INTO projects (id, workspaceId, name, targetUrl, enableWiseDesignSystem, crawlConfig, visualConfig, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      project.id,
      project.workspaceId,
      project.name,
      project.targetUrl,
      project.enableWiseDesignSystem ? 1 : 0,
      JSON.stringify(project.crawl),
      JSON.stringify(project.visual),
      project.createdAt,
      project.updatedAt
    );

    return project;
  }

  static getProjects(workspaceId?: string): ProjectConfig[] {
    const db = getDb();
    let rows: any[];
    if (workspaceId) {
      rows = db.prepare('SELECT * FROM projects WHERE workspaceId = ? ORDER BY createdAt DESC').all(workspaceId);
    } else {
      rows = db.prepare('SELECT * FROM projects ORDER BY createdAt DESC').all();
    }

    return rows.map((r) => ({
      ...r,
      enableWiseDesignSystem: Boolean(r.enableWiseDesignSystem),
      crawl: JSON.parse(r.crawlConfig),
      visual: JSON.parse(r.visualConfig),
    }));
  }

  static getProject(id: string): ProjectConfig | null {
    const db = getDb();
    const r = db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as any;
    if (!r) return null;
    return {
      ...r,
      enableWiseDesignSystem: Boolean(r.enableWiseDesignSystem),
      crawl: JSON.parse(r.crawlConfig),
      visual: JSON.parse(r.visualConfig),
    };
  }
}
