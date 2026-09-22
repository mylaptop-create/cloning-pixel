import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';

let db: any;

export function initDatabase(dbPath?: string): any {
  const finalPath = dbPath || path.join(process.cwd(), '.pixelforge', 'pixelforge.db');
  const dir = path.dirname(finalPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  db = new DatabaseSync(finalPath);

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS workspaces (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      targetUrl TEXT NOT NULL,
      llmProvider TEXT NOT NULL,
      apiBaseUrl TEXT NOT NULL,
      apiKey TEXT NOT NULL,
      model TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      workspaceId TEXT NOT NULL,
      name TEXT NOT NULL,
      targetUrl TEXT NOT NULL,
      enableWiseDesignSystem INTEGER DEFAULT 0,
      crawlConfig TEXT NOT NULL,
      visualConfig TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY(workspaceId) REFERENCES workspaces(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS routes (
      id TEXT PRIMARY KEY,
      projectId TEXT NOT NULL,
      url TEXT NOT NULL,
      path TEXT NOT NULL,
      title TEXT,
      status TEXT NOT NULL,
      depth INTEGER NOT NULL,
      parentPath TEXT,
      metadata TEXT,
      FOREIGN KEY(projectId) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY,
      projectId TEXT NOT NULL,
      url TEXT NOT NULL,
      localPath TEXT NOT NULL,
      type TEXT NOT NULL,
      mimeType TEXT,
      size INTEGER,
      FOREIGN KEY(projectId) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS agent_tasks (
      id TEXT PRIMARY KEY,
      projectId TEXT NOT NULL,
      status TEXT NOT NULL,
      priority INTEGER NOT NULL,
      description TEXT NOT NULL,
      stage TEXT NOT NULL,
      evidence TEXT,
      files TEXT,
      result TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY(projectId) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS diff_results (
      id TEXT PRIMARY KEY,
      projectId TEXT NOT NULL,
      routePath TEXT NOT NULL,
      viewport TEXT NOT NULL,
      iteration INTEGER NOT NULL,
      similarityScore REAL NOT NULL,
      mismatchPixels INTEGER NOT NULL,
      referenceImage TEXT NOT NULL,
      cloneImage TEXT NOT NULL,
      diffImage TEXT NOT NULL,
      overlayImage TEXT NOT NULL,
      classifications TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY(projectId) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS logs (
      id TEXT PRIMARY KEY,
      projectId TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      level TEXT NOT NULL,
      message TEXT NOT NULL,
      details TEXT
    );
  `);

  return db;
}

export function getDb(): any {
  if (!db) {
    return initDatabase();
  }
  return db;
}
