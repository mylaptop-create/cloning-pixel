import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { initDatabase, getDb } from './db.js';
import { WorkspaceService } from './services/workspace.js';
import { LLMProviderService } from './services/llm.js';
import { AgentRunnerService } from './services/agent.js';
import { PreviewServerService } from './services/preview.js';
import archiver from 'archiver';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Initialize DB
initDatabase();

// API Routes

// 1. Workspace API
app.get('/api/workspaces', (req, res) => {
  try {
    const workspaces = WorkspaceService.getWorkspaces();
    res.json({ success: true, workspaces });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/workspaces', (req, res) => {
  try {
    const workspace = WorkspaceService.createWorkspace(req.body);
    res.json({ success: true, workspace });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/workspaces/:id', (req, res) => {
  try {
    const workspace = WorkspaceService.getWorkspace(req.params.id);
    if (!workspace) return res.status(404).json({ success: false, error: 'Workspace not found' });
    res.json({ success: true, workspace });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Test Connection API
app.post('/api/llm/test-connection', async (req, res) => {
  try {
    const result = await LLMProviderService.testConnection(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Projects API
app.get('/api/projects', (req, res) => {
  try {
    const { workspaceId } = req.query;
    const projects = WorkspaceService.getProjects(workspaceId as string);
    res.json({ success: true, projects });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/projects/:id', (req, res) => {
  try {
    const project = WorkspaceService.getProject(req.params.id);
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
    res.json({ success: true, project });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Pipeline Execution
app.post('/api/projects/:id/run', async (req, res) => {
  try {
    const project = WorkspaceService.getProject(req.params.id);
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });

    const workspace = WorkspaceService.getWorkspace(project.workspaceId);
    if (!workspace) return res.status(404).json({ success: false, error: 'Workspace not found' });

    // Run pipeline asynchronously
    AgentRunnerService.runPipeline(
      workspace.location,
      project.id,
      project.targetUrl,
      project.enableWiseDesignSystem
    ).catch((err) => console.error('Pipeline execution error:', err));

    res.json({ success: true, message: 'Pipeline started successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Query Routes
app.get('/api/projects/:id/routes', (req, res) => {
  try {
    const db = getDb();
    const routes = db.prepare('SELECT * FROM routes WHERE projectId = ?').all(req.params.id);
    res.json({ success: true, routes });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Query Logs
app.get('/api/projects/:id/logs', (req, res) => {
  try {
    const db = getDb();
    const logs = db.prepare('SELECT * FROM logs WHERE projectId = ? ORDER BY timestamp DESC LIMIT 200').all(req.params.id);
    res.json({ success: true, logs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Query Diff Results
app.get('/api/projects/:id/diffs', (req, res) => {
  try {
    const db = getDb();
    const diffs = db.prepare('SELECT * FROM diff_results WHERE projectId = ? ORDER BY createdAt DESC').all(req.params.id);
    res.json({ success: true, diffs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Query Design System Data
app.get('/api/projects/:id/design', (req, res) => {
  try {
    const project = WorkspaceService.getProject(req.params.id);
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });

    const workspace = WorkspaceService.getWorkspace(project.workspaceId);
    if (!workspace) return res.status(404).json({ success: false, error: 'Workspace not found' });

    const designDir = path.join(workspace.location, 'design');
    const tokensPath = path.join(designDir, 'tokens.json');
    const designMdPath = path.join(designDir, 'design.md');

    const tokens = fs.existsSync(tokensPath) ? JSON.parse(fs.readFileSync(tokensPath, 'utf8')) : null;
    const designMd = fs.existsSync(designMdPath) ? fs.readFileSync(designMdPath, 'utf8') : '';

    res.json({ success: true, tokens, designMd });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. Export ZIP API
app.get('/api/projects/:id/export', (req, res) => {
  try {
    const project = WorkspaceService.getProject(req.params.id);
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });

    const workspace = WorkspaceService.getWorkspace(project.workspaceId);
    if (!workspace) return res.status(404).json({ success: false, error: 'Workspace not found' });

    res.attachment(`${project.name.replace(/[^a-zA-Z0-9]/g, '_')}_export.zip`);
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);

    archive.directory(workspace.location, false);
    archive.finalize();
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve static frontend in production if dist/frontend exists
const frontendBuildPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`PixelForge Backend Server running on http://localhost:${PORT}`);
});
