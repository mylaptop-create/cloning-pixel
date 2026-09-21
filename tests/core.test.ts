import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { CrawlerService } from '../src/backend/services/crawler.js';
import { DesignExtractorService } from '../src/backend/services/design.js';
import { VisualDiffService } from '../src/backend/services/diff.js';
import { WorkspaceService } from '../src/backend/services/workspace.js';
import { initDatabase } from '../src/backend/db.js';

describe('PixelForge Core Tests', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pixelforge-test-'));
    initDatabase(path.join(tmpDir, 'test.db'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should normalize URLs correctly', () => {
    expect(CrawlerService.normalizeUrl('example.com')).toBe('https://example.com');
    expect(CrawlerService.normalizeUrl('http://example.com/')).toBe('http://example.com');
    expect(CrawlerService.normalizeUrl('https://example.com/path/')).toBe('https://example.com/path');
  });

  it('should create workspace and persist configuration', () => {
    const ws = WorkspaceService.createWorkspace({
      name: 'Test Workspace',
      targetUrl: 'https://example.com',
      location: path.join(tmpDir, 'workspace'),
      llmProvider: 'openai',
      apiBaseUrl: 'https://api.openai.com/v1',
      apiKey: 'sk-test-key',
      model: 'gpt-4o',
    });

    expect(ws.id).toBeDefined();
    expect(fs.existsSync(path.join(ws.location, '.pixelforge', 'config.json'))).toBe(true);

    const fetched = WorkspaceService.getWorkspace(ws.id);
    expect(fetched?.name).toBe('Test Workspace');
  });

  it('should extract design system tokens and generate design.md', () => {
    const wsDir = path.join(tmpDir, 'ws');
    const tokens = DesignExtractorService.extractDesignSystem(
      wsDir,
      {
        computedStyles: {
          page1: { colors: ['#9fe870', '#0e0f0c'], fonts: ['Inter'] },
        },
      },
      false
    );

    expect(tokens.colors).toBeDefined();
    expect(fs.existsSync(path.join(wsDir, 'design', 'design.md'))).toBe(true);
    expect(fs.existsSync(path.join(wsDir, 'design', 'tokens.json'))).toBe(true);
  });

  it('should handle image diff calculation safely', () => {
    const result = VisualDiffService.compareImages(
      path.join(tmpDir, 'non_existent_ref.png'),
      path.join(tmpDir, 'non_existent_clone.png'),
      path.join(tmpDir, 'diff.png')
    );

    expect(result.similarityScore).toBeGreaterThan(0);
    expect(result.mismatchPixels).toBeGreaterThan(0);
  });
});
